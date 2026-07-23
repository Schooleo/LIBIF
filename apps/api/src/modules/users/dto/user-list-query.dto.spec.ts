import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserListQueryDto } from './user-list-query.dto';

describe('UserListQueryDto', () => {
  it('accepts bounded defaults and trims search text', async () => {
    const dto = plainToInstance(UserListQueryDto, { q: '  Admin@Example.EDU  ', page: '2', pageSize: '50' });

    await expect(validate(dto)).resolves.toEqual([]);
    expect(dto.q).toBe('admin@example.edu');
    expect(dto.page).toBe(2);
    expect(dto.pageSize).toBe(50);
  });

  it('rejects invalid role, status, and page size', async () => {
    const dto = plainToInstance(UserListQueryDto, { role: 'OWNER', status: 'DISABLED', pageSize: '101' });
    const errors = await validate(dto);
    expect(errors.map(({ property }) => property).sort()).toEqual(['pageSize', 'role', 'status']);
  });
});
