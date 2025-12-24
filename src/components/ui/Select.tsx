import React from "react";
import "./Select.css";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  options?: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  helperText,
  fullWidth,
  options,
  children,
  className,
  ...rest
}) => {
  return (
    <div className={`select ${fullWidth ? "select--full" : ""}`}>
      {label && <label className="select__label">{label}</label>}
      <div className="select__control">
        <select className={`select__native ${className ?? ""}`} {...rest}>
          {options
            ? options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))
            : children}
        </select>
        <span className="select__icon">▾</span>
      </div>
      {helperText && <small className="select__helper">{helperText}</small>}
    </div>
  );
};
