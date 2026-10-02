/**
 * Standard request payload for DataGrid (table) queries.
 * Sent from the frontend to request paginated, sorted, or filtered data.
 */
export interface DataGridRequest {
  /** The current page number being requested (1-indexed). */
  page: number;
  /** The number of items to return per page. */
  pageSize: number;
  /** Optional field name to sort the data by. */
  sortField?: string;
  /** Optional sort direction. */
  sortOrder?: 'ASC' | 'DESC';
  /** Optional free-text search query to filter rows. */
  searchQuery?: string;
}

/**
 * Standard response payload for DataGrid (table) queries.
 * Provides the data chunk alongside necessary pagination metadata.
 *
 * @template T The type of the entity returned in the data array.
 */
export interface DataGridResponse<T> {
  /** The actual chunk of data for the requested page. */
  data: T[];
  /** Total number of items matching the query (ignoring pagination). */
  total: number;
  /** The current page returned. */
  page: number;
  /** The number of items per page. */
  pageSize: number;
  /** Total number of pages available based on the current page size. */
  totalPages: number;
}

/**
 * Engine for processing in-memory arrays and formatting them into standard DataGrid responses.
 * Typically used for mock data, small datasets, or processing cached payloads.
 */
export class FerroxDataGridEngine {
  /**
   * Paginates, sorts, and filters an array of items based on a `DataGridRequest`.
   * Note: For massive datasets, this logic should be pushed down to the Database layer (e.g. via TypeORM or raw SQL)
   * instead of running in-memory.
   *
   * @template T The entity type.
   * @param {T[]} items The full un-paginated array of items.
   * @param {DataGridRequest} request The pagination, sorting, and filtering parameters.
   * @returns {DataGridResponse<T>} The processed, standard datagrid response.
   */
  public static paginate<T>(items: T[], request: DataGridRequest): DataGridResponse<T> {
    const page = Math.max(1, request.page || 1);
    const pageSize = Math.max(1, request.pageSize || 10);

    let filtered = [...items];

    if (request.searchQuery) {
      const q = request.searchQuery.toLowerCase();
      filtered = filtered.filter((item) => JSON.stringify(item).toLowerCase().includes(q));
    }

    if (request.sortField) {
      const field = request.sortField;
      const order = request.sortOrder === 'DESC' ? -1 : 1;
      filtered.sort((a: any, b: any) => {
        if (a[field] < b[field]) return -1 * order;
        if (a[field] > b[field]) return 1 * order;
        return 0;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
}

/**
 * Utility for scaffolding standard RESTful CRUD routes dynamically based on a repository pattern.
 * Generates route definitions that can be easily attached to Fastify or NestJS controllers.
 */
export class FerroxCrudGenerator {
  /**
   * Generates standard GET (all), GET (by ID), POST (create), and DELETE (by ID) routes.
   *
   * @template T The entity type managed by the repository.
   * @param {string} entityName The singular name of the entity (e.g. 'User'). Will be lowercased and pluralized in the route path.
   * @param repository An object implementing basic CRUD repository functions.
   * @returns An array of route definition objects containing the HTTP method, path, and async handler.
   */
  public static createCrudRoutes<T extends { id: string | number }>(
    entityName: string,
    repository: {
      find: () => Promise<T[]> | T[];
      findById: (id: any) => Promise<T | null> | T | null;
      create: (item: Partial<T>) => Promise<T> | T;
      delete: (id: any) => Promise<boolean> | boolean;
    }
  ) {
    const basePath = `/api/v1/${entityName.toLowerCase()}s`;
    return [
      {
        method: 'GET' as const,
        path: basePath,
        handler: async () => await repository.find(),
      },
      {
        method: 'GET' as const,
        path: `${basePath}/:id`,
        handler: async (req: any) => {
          const item = await repository.findById(req.params.id);
          if (!item) throw new Error(`${entityName} not found`);
          return item;
        },
      },
      {
        method: 'POST' as const,
        path: basePath,
        handler: async (req: any) => await repository.create(req.body),
      },
      {
        method: 'DELETE' as const,
        path: `${basePath}/:id`,
        handler: async (req: any) => {
          const success = await repository.delete(req.params.id);
          return { success };
        },
      },
    ];
  }
}
