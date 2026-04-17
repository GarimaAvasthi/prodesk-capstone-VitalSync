"use client";

import React from "react";

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
  autoComplete?: string;
}

export default function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  autoComplete,
}: FormInputProps) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="text-[var(--danger)] ml-1">*</span>}
      </label>
      <div className="input-wrapper">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          suppressHydrationWarning={true}
          className={`
            app-input
            ${icon ? "pl-11" : ""}
            ${
              error
                ? "border-[var(--danger)]/60 focus:border-[var(--danger)] focus:ring-[var(--danger)]/20"
                : "focus:border-[var(--brand)] focus:ring-[var(--brand)]/20"
            }
          `}
        />
      </div>
      {error && (
        <p className="form-error flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="flex-shrink-0"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
