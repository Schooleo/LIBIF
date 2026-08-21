import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ReaderAccessRiskLevel } from '../../../generated/prisma/client';
import { ReaderAccessReportQueryDto } from './reader-access-report.dto';

describe('ReaderAccessReportQueryDto', () => {
  it('accepts bounded paging, UTC dates, and an enumerated risk filter', async () => {
    const query = plainToInstance(ReaderAccessReportQueryDto, {
      from: '2026-07-23T00:00:00.000Z',
      to: '2026-07-24T00:00:00.000Z',
      risk: ReaderAccessRiskLevel.HIGH,
      page: '2',
      pageSize: '100'
    });

    await expect(validate(query)).resolves.toEqual([]);
    expect(query).toMatchObject({ page: 2, pageSize: 100, risk: ReaderAccessRiskLevel.HIGH });
  });

  it('rejects unbounded page sizes and unknown risk values', async () => {
    const query = plainToInstance(ReaderAccessReportQueryDto, {
      risk: 'CRITICAL',
      pageSize: 1000
    });

    const errors = await validate(query);
    expect(errors.map(({ property }) => property).sort()).toEqual(['pageSize', 'risk']);
  });
});
