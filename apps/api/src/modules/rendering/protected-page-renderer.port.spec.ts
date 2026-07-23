import { PROTECTED_PAGE_RENDERER, RENDER_PROFILES } from './protected-page-renderer.port';

describe('ProtectedPageRenderer contract', () => {
  it('publishes a stable injection token and bounded render profiles', () => {
    expect(PROTECTED_PAGE_RENDERER.description).toBe('PROTECTED_PAGE_RENDERER');
    expect(RENDER_PROFILES).toEqual(['READER_STANDARD', 'READER_HIGH_DPI']);
  });
});
