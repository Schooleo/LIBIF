'use client';

import { useEffect, useRef, useState } from 'react';
import { Avatar } from '../ui';
import { signOut } from '../../lib/api-browser';

type AvatarMenuProps =
  | { authenticated: true; name: string; email: string; role: string }
  | { authenticated: false };

export function AvatarMenu(props: AvatarMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      window.location.href = '/sign-in';
    }
  };

  const label = props.authenticated ? props.name : 'Guest';

  return (
    <div className="avatar-menu" ref={menuRef}>
      <button
        type="button"
        className="avatar-menu__trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar name={label} />
        {props.authenticated && (
          <span className="avatar-menu__name">
            <strong>{props.name}</strong>
            <small>{props.email}</small>
          </span>
        )}
        <span className="avatar-menu__chevron" aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="avatar-menu__dropdown" role="menu">
          {props.authenticated ? (
            <>
              <div className="avatar-menu__header">
                <strong>{props.name}</strong>
                <small>{props.email}</small>
                <small className="avatar-menu__role">{props.role}</small>
              </div>
              <hr className="avatar-menu__divider" />
              <button
                type="button"
                role="menuitem"
                className="avatar-menu__item avatar-menu__item--destructive"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <div className="avatar-menu__header">
                <strong>Guest</strong>
                <small>You are not signed in</small>
              </div>
              <hr className="avatar-menu__divider" />
              <a href="/sign-in" role="menuitem" className="avatar-menu__item">Sign in</a>
              <a href="/register" role="menuitem" className="avatar-menu__item">Create account</a>
              <a href="/forgot-password" role="menuitem" className="avatar-menu__item">Forgot password</a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
