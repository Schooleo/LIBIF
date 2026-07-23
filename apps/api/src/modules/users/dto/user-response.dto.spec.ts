import {
  UserAdministrationEventDto,
  UserDetailResponseDto,
  UserListItemDto,
  UserListResponseDto,
  UserSessionSummaryDto,
  USERS_RESPONSE_FORBIDDEN_KEYS
} from './user-response.dto';

describe('Users response DTO contracts', () => {
  it('keep the documented allowlist and recursively reject secret-bearing keys', () => {
    const response: UserListResponseDto | UserDetailResponseDto = {
      items: [
        {
          id: 'user-1',
          email: 'reader@example.edu',
          role: 'READER',
          status: 'ACTIVE',
          lastSignInAt: null,
          deactivatedAt: null,
          createdAt: '2026-07-23T00:00:00.000Z',
          updatedAt: '2026-07-23T00:00:00.000Z',
          activeSessionCount: 1
        } satisfies UserListItemDto
      ],
      totalCount: 1,
      page: 1,
      pageSize: 20
    };

    const detail: UserDetailResponseDto = {
      ...response.items[0],
      sessionSummary: {
        activeCount: 1,
        revokedCount: 0,
        expiredCount: 0,
        mostRecentCreatedAt: '2026-07-23T00:00:00.000Z',
        mostRecentLastSeenAt: '2026-07-23T00:00:00.000Z',
        mostRecentExpiresAt: '2026-07-24T00:00:00.000Z',
        mostRecentRevokedAt: null
      } satisfies UserSessionSummaryDto,
      administrationEvents: [
        {
          id: 'evt-1',
          action: 'ROLE_CHANGED',
          previousRole: 'READER',
          nextRole: 'LIBRARIAN',
          reason: 'Promotion',
          actorEmail: 'admin@example.edu',
          createdAt: '2026-07-23T00:00:00.000Z'
        } satisfies UserAdministrationEventDto
      ]
    };

    expect(Object.keys(response).sort()).toEqual(['items', 'page', 'pageSize', 'totalCount']);
    expect(Object.keys(response.items[0]).sort()).toEqual([
      'activeSessionCount',
      'createdAt',
      'deactivatedAt',
      'email',
      'id',
      'lastSignInAt',
      'role',
      'status',
      'updatedAt'
    ]);
    expect(Object.keys(detail).sort()).toEqual([
      'activeSessionCount',
      'administrationEvents',
      'createdAt',
      'deactivatedAt',
      'email',
      'id',
      'lastSignInAt',
      'role',
      'sessionSummary',
      'status',
      'updatedAt'
    ]);

    expect(findForbiddenKeys(response)).toEqual([]);
    expect(findForbiddenKeys(detail)).toEqual([]);
  });
});

function findForbiddenKeys(value: unknown, path = 'root'): string[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => findForbiddenKeys(item, `${path}[${index}]`));
  if (!value || typeof value !== 'object') return [];

  const record = value as Record<string, unknown>;
  return Object.entries(record).flatMap(([key, nestedValue]) => {
    const matches = USERS_RESPONSE_FORBIDDEN_KEYS.includes(key as (typeof USERS_RESPONSE_FORBIDDEN_KEYS)[number]) ? [`${path}.${key}`] : [];
    return matches.concat(findForbiddenKeys(nestedValue, `${path}.${key}`));
  });
}
