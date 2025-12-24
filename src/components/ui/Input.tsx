import React from "react";
import "./Input.css";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div
        className={`input-container ${
          hasError ? "input-container--error" : ""
        }`}
      >
        {leftIcon && (
          <span className="input-icon input-icon--left">{leftIcon}</span>
        )}
        <input
          id={inputId}
          className={`input ${leftIcon ? "input--with-left-icon" : ""} ${
            rightIcon ? "input--with-right-icon" : ""
          }`}
          {...props}
        />
        {rightIcon && (
          <span className="input-icon input-icon--right">{rightIcon}</span>
        )}
      </div>
      {error && <p className="input-error">{error}</p>}
      {!error && helperText && <p className="input-helper">{helperText}</p>}
    </div>
  );
};
