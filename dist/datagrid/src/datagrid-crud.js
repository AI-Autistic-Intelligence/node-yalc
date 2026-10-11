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
    static paginate(items, request) {
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
            filtered.sort((a, b) => {
                if (a[field] < b[field])
                    return -1 * order;
                if (a[field] > b[field])
                    return 1 * order;
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
    static createCrudRoutes(entityName, repository) {
        const basePath = `/api/v1/${entityName.toLowerCase()}s`;
        return [
            {
                method: 'GET',
                path: basePath,
                handler: async () => await repository.find(),
            },
            {
                method: 'GET',
                path: `${basePath}/:id`,
                handler: async (req) => {
                    const item = await repository.findById(req.params.id);
                    if (!item)
                        throw new Error(`${entityName} not found`);
                    return item;
                },
            },
            {
                method: 'POST',
                path: basePath,
                handler: async (req) => await repository.create(req.body),
            },
            {
                method: 'DELETE',
                path: `${basePath}/:id`,
                handler: async (req) => {
                    const success = await repository.delete(req.params.id);
                    return { success };
                },
            },
        ];
    }
}
//# sourceMappingURL=datagrid-crud.js.map