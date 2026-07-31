import type { InputHTMLAttributes, ReactNode } from 'react';

export function Checkbox({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  return <label className="ui-checkbox"><input {...props} type="checkbox" /> <span>{label}</span></label>;
}

export function RadioGroup({ legend, name, options, value, onChange }: { legend: string; name: string; options: { label: string; value: string }[]; value?: string; onChange: (value: string) => void }) {
  return (
    <fieldset className="ui-stack">
      <legend className="ui-field__label">{legend}</legend>
      {options.map((option) => <label key={option.value} className="ui-radio"><input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} /> {option.label}</label>)}
    </fieldset>
  );
}

export function Switch({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  return <label className="ui-switch"><input {...props} type="checkbox" role="switch" /> <span>{label}</span></label>;
}
