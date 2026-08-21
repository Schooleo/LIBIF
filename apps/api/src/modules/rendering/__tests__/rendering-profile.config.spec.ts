import { getProfileConfig, PROFILE_CONFIGS } from '../rendering-profile.config';
import { RenderBoundsError } from '../rendering.errors';
import { RenderProfile } from '../protected-page-renderer.port';

describe('rendering-profile.config', () => {
  it('defines valid profile bounds for all profiles', () => {
    expect(PROFILE_CONFIGS.READER_STANDARD.dpi).toBe(150);
    expect(PROFILE_CONFIGS.READER_HIGH_DPI.dpi).toBe(250);

    expect(PROFILE_CONFIGS.READER_STANDARD.dpi).toBeLessThan(PROFILE_CONFIGS.READER_HIGH_DPI.dpi);
    expect(PROFILE_CONFIGS.READER_STANDARD.maxWidth).toBeLessThan(PROFILE_CONFIGS.READER_HIGH_DPI.maxWidth);
    expect(PROFILE_CONFIGS.READER_STANDARD.maxHeight).toBeLessThan(PROFILE_CONFIGS.READER_HIGH_DPI.maxHeight);
  });

  it('retrieves config by valid profile', () => {
    const config = getProfileConfig('READER_STANDARD');
    expect(config.contentType).toBe('image/webp');
  });

  it('throws RenderBoundsError for invalid profile', () => {
    expect(() => getProfileConfig('INVALID_PROFILE' as RenderProfile)).toThrow(RenderBoundsError);
  });
});
