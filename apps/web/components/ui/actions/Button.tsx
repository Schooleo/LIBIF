import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../../lib/classnames';
import type { ButtonVariant, ComponentSize } from '../types';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ComponentSize | 'icon';
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({ variant = 'primary', size = 'md', loading = false, icon, children, className, disabled, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classNames('ui-button', `ui-button--${variant}`, size !== 'md' && `ui-button--${size}`, className)}
    >
      {loading ? <span className="ui-button__spinner" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
}
