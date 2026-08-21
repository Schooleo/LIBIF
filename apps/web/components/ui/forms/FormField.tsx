import { useId, type ReactNode } from 'react';

type FieldRenderProps = { id: string; 'aria-invalid'?: true; 'aria-describedby'?: string };

type FormFieldProps = {
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: (props: FieldRenderProps) => ReactNode;
};

export function FormField({ label, required = false, description, error, children }: FormFieldProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={id}>{label} {required ? <span className="ui-field__required" aria-hidden="true">*</span> : null}</label>
      {description ? <p className="ui-field__description" id={descriptionId}>{description}</p> : null}
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {error ? <p className="ui-field__error" id={errorId} role="alert">{error}</p> : null}
    </div>
  );
}
