import { FerroxDataGridEngine, FerroxCrudGenerator } from '../datagrid-crud';

describe('FerroxDataGridEngine', () => {
  it('should paginate and filter correctly', () => {
    const data = [{ id: 1, name: 'Apple' }, { id: 2, name: 'Banana' }, { id: 3, name: 'Cherry' }, { id: 4, name: 'Apple' }];
    
    // Test filter
    const res = FerroxDataGridEngine.paginate(data, { page: 1, pageSize: 10, searchQuery: 'ban' });
    expect(res.data).toEqual([{ id: 2, name: 'Banana' }]);
    expect(res.total).toBe(1);

    // Test sort asc
    const resSort = FerroxDataGridEngine.paginate(data, { page: 1, pageSize: 10, sortField: 'name', sortOrder: 'ASC' });
    expect(resSort.data[0].name).toBe('Apple');
    expect(resSort.data[1].name).toBe('Apple');
    
    // Test sort desc
    const resSortDesc = FerroxDataGridEngine.paginate(data, { page: 1, pageSize: 10, sortField: 'name', sortOrder: 'DESC' });
    expect(resSortDesc.data[0].name).toBe('Cherry');
  });
});

describe('FerroxCrudGenerator', () => {
  it('should create CRUD routes', async () => {
    const mockRepo = {
      find: jest.fn().mockResolvedValue([{ id: 1 }]),
      findById: jest.fn().mockResolvedValue({ id: 1 }),
      create: jest.fn().mockResolvedValue({ id: 2 }),
      delete: jest.fn().mockResolvedValue(true)
    };
    
    const routes = FerroxCrudGenerator.createCrudRoutes('User', mockRepo);
    expect(routes.length).toBe(4);
    
    // GET all
    expect(await routes[0].handler({} as any)).toEqual([{ id: 1 }]);
    
    // GET one
    expect(await routes[1].handler({ params: { id: 1 } } as any)).toEqual({ id: 1 });
    mockRepo.findById.mockResolvedValueOnce(null);
    await expect(routes[1].handler({ params: { id: 99 } } as any)).rejects.toThrow('User not found');
    
    // POST
    expect(await routes[2].handler({ body: {} } as any)).toEqual({ id: 2 });
    
    // DELETE
    expect(await routes[3].handler({ params: { id: 1 } } as any)).toEqual({ success: true });
  });
});
