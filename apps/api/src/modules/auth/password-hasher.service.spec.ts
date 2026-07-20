import { PasswordHasher } from './password-hasher.service';

describe('PasswordHasher', () => {
  const originalN = process.env.LIBIF_SCRYPT_N;
  const originalR = process.env.LIBIF_SCRYPT_R;
  const originalP = process.env.LIBIF_SCRYPT_P;

  beforeEach(() => {
    process.env.LIBIF_SCRYPT_N = '1024';
    process.env.LIBIF_SCRYPT_R = '8';
    process.env.LIBIF_SCRYPT_P = '1';
  });

  afterAll(() => {
    process.env.LIBIF_SCRYPT_N = originalN;
    process.env.LIBIF_SCRYPT_R = originalR;
    process.env.LIBIF_SCRYPT_P = originalP;
  });

  it('hashes and verifies passwords without storing plaintext', async () => {
    const hasher = new PasswordHasher();
    const hash = await hasher.hash('correct horse battery staple');
    expect(hash).toMatch(/^scrypt\$/);
    expect(hash).not.toContain('correct horse battery staple');
    await expect(hasher.verify('correct horse battery staple', hash)).resolves.toBe(true);
    await expect(hasher.verify('wrong password', hash)).resolves.toBe(false);
  });

  it('rejects legacy or malformed hashes', async () => {
    await expect(new PasswordHasher().verify('password', 'dev-only')).resolves.toBe(false);
  });
});
