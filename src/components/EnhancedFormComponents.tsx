import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { brandColors } from "../theme";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  RequiredFieldIndicator,
  FieldHintText,
  ValidationError,
  HelpTooltip,
  formatCurrency,
  formatPercentage,
  formatPhoneNumber,
} from "./UXComponents";

// Styled components for enhanced form elements
const EnhancedTextField = styled(TextField)(
  ({ theme, error, success }: any) => ({
    "& .MuiOutlinedInput-root": {
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: error
          ? theme.palette.error.main
          : theme.palette.primary.main,
      },
      "&.Mui-focused": {
        borderColor: error
          ? theme.palette.error.main
          : theme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: error ? theme.palette.error.main : theme.palette.primary.main,
      },
    },
    ...(success && {
      "& .MuiOutlinedInput-root": {
        borderColor: theme.palette.success.main,
        "&:hover": {
          borderColor: theme.palette.success.main,
        },
      },
    }),
  }),
);

const EnhancedSelect = styled(Select)(({ theme, error, success }: any) => ({
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
  },
  "&.Mui-focused": {
    borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
  },
  ...(success && {
    borderColor: theme.palette.success.main,
    "&:hover": {
      borderColor: theme.palette.success.main,
    },
  }),
}));

const ValidationStatus = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
}));

// Enhanced TextField with validation and auto-formatting
export const EnhancedTextFieldWithValidation: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
  tooltip?: string;
  error?: string;
  success?: boolean;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  format?: "currency" | "percentage" | "phone" | "none";
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  onBlur?: () => void;
  onFocus?: () => void;
}> = ({
  label,
  value,
  onChange,
  required = false,
  hint,
  tooltip,
  error,
  success = false,
  type = "text",
  format = "none",
  placeholder,
  disabled = false,
  multiline = false,
  rows = 1,
  maxLength,
  onBlur,
  onFocus,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (newValue: string) => {
    let formattedValue = newValue;

    switch (format) {
      case "currency":
        formattedValue = formatCurrency(newValue);
        break;
      case "percentage":
        formattedValue = formatPercentage(newValue);
        break;
      case "phone":
        formattedValue = formatPhoneNumber(newValue);
        break;
      default:
        formattedValue = newValue;
    }

    onChange(formattedValue);
  };

  const handleClear = () => {
    onChange("");
  };

  const getInputType = () => {
    if (type === "password") {
      return showPassword ? "text" : "password";
    }
    return type;
  };

  const getEndAdornment = () => {
    if (type === "password") {
      return (
        <InputAdornment position="end">
          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </InputAdornment>
      );
    }

    if (value && !disabled) {
      return (
        <InputAdornment position="end">
          <IconButton onClick={handleClear} edge="end" size="small">
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      );
    }

    return null;
  };

  const getStartAdornment = () => {
    if (format === "currency") {
      return (
        <InputAdornment position="start">
          <Typography variant="body2" color="text.secondary">
            $
          </Typography>
        </InputAdornment>
      );
    }

    if (format === "percentage") {
      return (
        <InputAdornment position="start">
          <Typography variant="body2" color="text.secondary">
            %
          </Typography>
        </InputAdornment>
      );
    }

    return null;
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography variant="body2" component="label">
          {label}
          {required && <RequiredFieldIndicator />}
        </Typography>
        {tooltip && <HelpTooltip title={tooltip} />}
      </Box>

      <TextField
        fullWidth
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        type={getInputType()}
        placeholder={placeholder}
        disabled={disabled}
        multiline={multiline}
        rows={rows}
        inputProps={{
          maxLength,
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        error={!!error}
        InputProps={{
          startAdornment: getStartAdornment(),
          endAdornment: getEndAdornment(),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: disabled ? brandColors.neutral.light : brandColors.backgrounds.primary,
          },
        }}
      />

      {hint && <FieldHintText hint={hint} />}

      {error && <ValidationError error={error} />}

      {success && !error && (
        <ValidationStatus>
          <CheckCircleIcon color="success" fontSize="small" />
          <Typography variant="caption" color="success.main">
            Valid input
          </Typography>
        </ValidationStatus>
      )}

      {maxLength && (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="right"
        >
          {value.length}/{maxLength}
        </Typography>
      )}
    </Box>
  );
};

// Enhanced Select with validation
export const EnhancedSelectWithValidation: React.FC<{
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  required?: boolean;
  hint?: string;
  tooltip?: string;
  error?: string;
  success?: boolean;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  hint,
  tooltip,
  error,
  success = false,
  placeholder,
  disabled = false,
  multiple = false,
  onBlur,
  onFocus,
}) => {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography variant="body2" component="label">
          {label}
          {required && <RequiredFieldIndicator />}
        </Typography>
        {tooltip && <HelpTooltip title={tooltip} />}
      </Box>

      <FormControl fullWidth error={!!error} disabled={disabled}>
        <InputLabel>{placeholder || label}</InputLabel>
        <EnhancedSelect
          value={value}
          onChange={(e) => onChange(e.target.value as string | number)}
          label={placeholder || label}
          multiple={multiple}
          onBlur={onBlur}
          onFocus={onFocus}
          error={!!error}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </EnhancedSelect>

        {hint && <FormHelperText>{hint}</FormHelperText>}
        {error && <FormHelperText error>{error}</FormHelperText>}

        {success && !error && (
          <ValidationStatus>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography variant="caption" color="success.main">
              Valid selection
            </Typography>
          </ValidationStatus>
        )}
      </FormControl>
    </Box>
  );
};

// Enhanced Number Input with validation
export const EnhancedNumberInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
  hint?: string;
  tooltip?: string;
  error?: string;
  success?: boolean;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  format?: "currency" | "percentage" | "number";
  onBlur?: () => void;
  onFocus?: () => void;
}> = ({
  label,
  value,
  onChange,
  required = false,
  hint,
  tooltip,
  error,
  success = false,
  placeholder,
  disabled = false,
  min,
  max,
  step = 1,
  format = "number",
  onBlur,
  onFocus,
}) => {
  const [stringValue, setStringValue] = useState(value.toString());

  useEffect(() => {
    setStringValue(value.toString());
  }, [value]);

  const handleChange = (newValue: string) => {
    setStringValue(newValue);

    const numValue = parseFloat(newValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const getStartAdornment = () => {
    if (format === "currency") {
      return (
        <InputAdornment position="start">
          <Typography variant="body2" color="text.secondary">
            $
          </Typography>
        </InputAdornment>
      );
    }

    if (format === "percentage") {
      return (
        <InputAdornment position="start">
          <Typography variant="body2" color="text.secondary">
            %
          </Typography>
        </InputAdornment>
      );
    }

    return null;
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography variant="body2" component="label">
          {label}
          {required && <RequiredFieldIndicator />}
        </Typography>
        {tooltip && <HelpTooltip title={tooltip} />}
      </Box>

      <TextField
        fullWidth
        type="number"
        value={stringValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        error={!!error}
        inputProps={{
          min,
          max,
          step,
        }}
        onBlur={onBlur}
        onFocus={onFocus}
        InputProps={{
          startAdornment: getStartAdornment(),
        }}
      />

      {hint && <FieldHintText hint={hint} />}

      {error && <ValidationError error={error} />}

      {success && !error && (
        <ValidationStatus>
          <CheckCircleIcon color="success" fontSize="small" />
          <Typography variant="caption" color="success.main">
            Valid input
          </Typography>
        </ValidationStatus>
      )}

      {(min !== undefined || max !== undefined) && (
        <Typography variant="caption" color="text.secondary">
          {min !== undefined && `Min: ${min}`}
          {min !== undefined && max !== undefined && " | "}
          {max !== undefined && `Max: ${max}`}
        </Typography>
      )}
    </Box>
  );
};

// Form Section Component
export const FormSection: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  completed?: boolean;
  required?: boolean;
  onToggle?: () => void;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}> = ({
  title,
  subtitle,
  children,
  completed = false,
  required = false,
  onToggle,
  collapsible = false,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    if (collapsible) {
      setExpanded(!expanded);
    }
    onToggle?.();
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: completed ? "success.main" : "divider",
        borderRadius: 2,
        p: 3,
        mb: 3,
        backgroundColor: completed ? "success.light" : "background.paper",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: completed ? "success.main" : "primary.main",
          boxShadow: 1,
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        sx={{ cursor: collapsible ? "pointer" : "default" }}
        onClick={handleToggle}
      >
        <Box>
          <Typography variant="h6" component="h3" color="text.primary">
            {title}
            {required && <RequiredFieldIndicator />}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {collapsible && (
          <Box display="flex" alignItems="center" gap={1}>
            {completed && (
              <Chip
                label="Completed"
                color="success"
                size="small"
                icon={<CheckCircleIcon />}
              />
            )}
            <Typography variant="h6" color="text.secondary">
              {expanded ? "−" : "+"}
            </Typography>
          </Box>
        )}
      </Box>

      {(!collapsible || expanded) && children}
    </Box>
  );
};

// Form Validation Hook
export const useFormValidation = (initialValues: Record<string, any>) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const setError = (field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const setTouchedField = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateField = (field: string, value: any, rules: any) => {
    if (rules.required && !value) {
      return `${field} is required`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${field} must be at least rules.minLength characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${field} must be no more than rules.maxLength characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.patternMessage || `${field} format is invalid`;
    }

    if (rules.min && value < rules.min) {
      return `${field} must be at least ${rules.min}`;
    }

    if (rules.max && value > rules.max) {
      return `${field} must be no more than ${rules.max}`;
    }

    return "";
  };

  const validateForm = (validationRules: Record<string, any>) => {
    const newErrors: Record<string, string> = {};

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, values[field], validationRules[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setError,
    setTouchedField,
    validateField,
    validateForm,
    setIsSubmitting,
    resetForm,
  };
};
