import { RenderProfile } from './protected-page-renderer.port';
import { RenderBoundsError } from './rendering.errors';

export type ProfileConfig = Readonly<{
  dpi: number;
  maxWidth: number;
  maxHeight: number;
  format: 'png' | 'webp';
  contentType: 'image/png' | 'image/webp';
}>;

export const PROFILE_CONFIGS: Readonly<Record<RenderProfile, ProfileConfig>> = {
  READER_STANDARD: {
    dpi: 150,
    maxWidth: 1600,
    maxHeight: 2200,
    format: 'webp',
    contentType: 'image/webp'
  },
  READER_HIGH_DPI: {
    dpi: 250,
    maxWidth: 2400,
    maxHeight: 3300,
    format: 'webp',
    contentType: 'image/webp'
  }
};

export function getProfileConfig(profile: RenderProfile): ProfileConfig {
  const config = PROFILE_CONFIGS[profile];
  if (!config) {
    throw new RenderBoundsError(`Unsupported rendering profile: ${String(profile)}`);
  }
  return config;
}
