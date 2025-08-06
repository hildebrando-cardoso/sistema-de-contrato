import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}

export const ValidationField = ({ 
  label, 
  htmlFor, 
  error, 
  children, 
  required = false,
  className 
}: ValidationFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label} {required && "*"}
      </Label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

interface InputWithValidationProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  className?: string;
  readOnly?: boolean;
  min?: string;
  maxLength?: number;
  "aria-describedby"?: string;
}

export const InputWithValidation = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  error,
  className,
  readOnly = false,
  min,
  maxLength,
  "aria-describedby": ariaDescribedby,
}: InputWithValidationProps) => {
  return (
    <ValidationField label={label} htmlFor={id} error={error} required={required}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "border-medical-primary/20 focus:border-medical-primary",
          error && "border-red-500",
          className
        )}
        required={required}
        readOnly={readOnly}
        min={min}
        maxLength={maxLength}
        aria-describedby={ariaDescribedby || (error ? `${id}-error` : undefined)}
      />
    </ValidationField>
  );
};

interface SelectWithValidationProps {
  label: string;
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export const SelectWithValidation = ({
  label,
  id,
  value,
  onValueChange,
  placeholder,
  required = false,
  error,
  children,
  className,
}: SelectWithValidationProps) => {
  return (
    <ValidationField label={label} htmlFor={id} error={error} required={required}>
      <select
        id={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "border-medical-primary/20 focus:border-medical-primary",
          error && "border-red-500",
          className
        )}
        required={required}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    </ValidationField>
  );
};

interface TextareaWithValidationProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  rows?: number;
}

export const TextareaWithValidation = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className,
  rows = 3,
}: TextareaWithValidationProps) => {
  return (
    <ValidationField label={label} htmlFor={id} error={error} required={required}>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "border-medical-primary/20 focus:border-medical-primary",
          error && "border-red-500",
          className
        )}
        required={required}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </ValidationField>
  );
}; 