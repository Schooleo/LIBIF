import type { ReactNode } from 'react';
import { Button } from '../actions/Button';
import { Drawer } from '../overlays/overlays';

export function FilterBar({ children, onReset }: { children: ReactNode; onReset?: () => void }) {
  return <div className="ui-cluster" role="search">{children}{onReset ? <Button variant="ghost" onClick={onReset}>Reset filters</Button> : null}</div>;
}

export function FilterDrawer({ open = true, title, children, onClose }: { open?: boolean; title: string; children: ReactNode; onClose?: () => void }) {
  return <Drawer open={open} title={title} onClose={onClose}>{children}</Drawer>;
}
