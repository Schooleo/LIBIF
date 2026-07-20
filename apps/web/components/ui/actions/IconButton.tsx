import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from './Button';

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string;
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
};

export function IconButton({ label, icon, variant = 'ghost', ...props }: IconButtonProps) {
  return <Button {...props} aria-label={label} title={label} variant={variant} size="icon" icon={icon} />;
}
