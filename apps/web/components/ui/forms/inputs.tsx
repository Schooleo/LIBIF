import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../../lib/classnames';

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={classNames('ui-input', props.className)} />;
}

export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} type="password" className={classNames('ui-input', props.className)} />;
}

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} type="search" className={classNames('ui-input', props.className)} />;
}

export function DateInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} type="date" className={classNames('ui-input', props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={classNames('ui-textarea', props.className)} />;
}

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return <select {...props} className={classNames('ui-select', props.className)}>{children}</select>;
}
