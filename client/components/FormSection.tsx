import React from "react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormSection({
  title,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <div
      className={`rounded-lg bg-motorsoline-light-gray p-5 lg:p-6 ${className}`}
    >
      <h2 className="text-motorsoline-text text-xl font-semibold mb-6 leading-tight">
        {title}
      </h2>
      {children}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  suffix?: string;
  isSelect?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  options?: { value: string | number; label: string }[];
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export function FormField({
  label,
  placeholder,
  type = "text",
  suffix,
  isSelect = false,
  value,
  onChange,
  className = "",
  options = [],
  disabled = false,
  min,
  max,
  step,
}: FormFieldProps) {
  const ChevronDownIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transform rotate-90"
    >
      <path
        d="M8 10L12 14L16 10"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-motorsoline-text text-lg font-medium">
        {label}
      </label>
      <div className="relative">
        {isSelect ? (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
              className={`w-full h-14 px-5 rounded-lg border border-motorsoline-form-border bg-white text-lg text-motorsoline-placeholder appearance-none focus:outline-none focus:ring-2 focus:ring-motorsoline-primary focus:border-transparent ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
            >
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDownIcon />
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              type={type}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              className={`w-full h-14 px-5 rounded-lg border border-motorsoline-form-border bg-white text-lg text-black placeholder:text-motorsoline-placeholder focus:outline-none focus:ring-2 focus:ring-motorsoline-primary focus:border-transparent ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
            />
            {value && suffix && (
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-lg text-motorsoline-text font-normal pointer-events-none">
                {value}{suffix}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  className?: string;
}

export function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
  rows = 6,
  className = "",
}: TextAreaFieldProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-motorsoline-text text-xl font-semibold">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-5 rounded-lg border-2 bg-white text-lg text-black placeholder:text-motorsoline-placeholder resize-none focus:outline-none focus:ring-2 focus:ring-motorsoline-primary focus:border-transparent"
      />
    </div>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function CheckboxField({
  label,
  checked = false,
  onChange,
  className = "",
}: CheckboxFieldProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="w-6 h-6 rounded border border-motorsoline-form-border bg-white focus:outline-none focus:ring-2 focus:ring-motorsoline-primary"
        />
      </div>
      <label className="text-motorsoline-text text-lg">{label}</label>
    </div>
  );
}
