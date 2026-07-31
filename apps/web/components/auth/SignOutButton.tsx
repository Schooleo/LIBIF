'use client';

import { useState } from 'react';
import { signOut } from '../../lib/api-browser';
import { Button } from '../ui';

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } finally {
      window.location.href = '/sign-in';
    }
  };
  return <Button type="button" variant="ghost" loading={loading} onClick={handleSignOut}>Sign out</Button>;
}
