import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateGeneralSettingsDto } from './settings.dto';

describe('UpdateGeneralSettingsDto', () => {
  it('accepts only bounded product-owned settings', async () => {
    const dto = plainToInstance(UpdateGeneralSettingsDto, {
      libraryName: 'LIBIF University Library',
      supportEmail: 'library@example.edu',
      defaultLocale: 'vi',
      readerNotice: 'Authorized educational access only.'
    });

    await expect(validate(dto)).resolves.toEqual([]);
  });

  it('trims inputs and normalizes blank nullable fields', async () => {
    const dto = plainToInstance(UpdateGeneralSettingsDto, {
      libraryName: '  LIBIF University Library  ',
      supportEmail: '   ',
      defaultLocale: '  vi  ',
      readerNotice: '   '
    });

    await expect(validate(dto)).resolves.toEqual([]);
    expect(dto).toEqual({
      libraryName: 'LIBIF University Library',
      supportEmail: null,
      defaultLocale: 'vi',
      readerNotice: null
    });
  });

  it('rejects invalid product values', async () => {
    const dto = plainToInstance(UpdateGeneralSettingsDto, {
      libraryName: '   ',
      supportEmail: 'not-an-email',
      defaultLocale: 'not_a_locale'
    });

    const errors = await validate(dto);
    expect(errors.map(({ property }) => property).sort()).toEqual([
      'defaultLocale',
      'libraryName',
      'supportEmail'
    ]);
  });
});
