import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  Alert,
  Snackbar,
  Tooltip,
  IconButton,
  Chip,
  FormHelperText,
  InputAdornment,
  // Icons are imported from @mui/icons-material below
} from "@mui/material";
import {
  Help as HelpIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { brandColors } from "../theme";

// Styled components for enhanced visual feedback
const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  borderRadius: theme.shape.borderRadius,
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(2),
}));

const SectionStatus = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const RequiredField = styled("span")(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: theme.spacing(0.5),
}));

const FieldHint = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
  marginTop: theme.spacing(0.5),
  fontStyle: "italic",
}));

// Loading States
export const LoadingSpinner: React.FC<{ size?: number; message?: string }> = ({
  size = 40,
  message = "Loading...",
}) => (
  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
    <CircularProgress size={size} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

export const LoadingOverlayComponent: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  message?: string;
}> = ({ loading, children, message }) => (
  <Box position="relative">
    {children}
    {loading && (
      <LoadingOverlay>
        <LoadingSpinner message={message} />
      </LoadingOverlay>
    )}
  </Box>
);

export const LinearProgressWithLabel: React.FC<{
  value: number;
  label?: string;
  showPercentage?: boolean;
}> = ({ value, label, showPercentage = true }) => (
  <ProgressContainer>
    {label && (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {showPercentage && (
          <Typography variant="body2" color="text.primary" fontWeight="medium">
            {Math.round(value)}%
          </Typography>
        )}
      </Box>
    )}
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{ height: 8, borderRadius: 4 }}
    />
  </ProgressContainer>
);

// Success/Error Messages
export const SuccessMessage: React.FC<{
  message: string;
  onClose?: () => void;
  autoHideDuration?: number;
}> = ({ message, onClose, autoHideDuration = 6000 }) => (
  <Snackbar
    open={true}
    autoHideDuration={autoHideDuration}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Alert
      onClose={onClose}
      severity="success"
      sx={{ width: "100%" }}
      icon={<CheckCircleIcon />}
    >
      {message}
    </Alert>
  </Snackbar>
);

export const ErrorMessage: React.FC<{
  message: string;
  onClose?: () => void;
  autoHideDuration?: number;
}> = ({ message, onClose, autoHideDuration = 6000 }) => (
  <Snackbar
    open={true}
    autoHideDuration={autoHideDuration}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Alert
      onClose={onClose}
      severity="error"
      sx={{ width: "100%" }}
      icon={<ErrorIcon />}
    >
      {message}
    </Alert>
  </Snackbar>
);

export const InfoMessage: React.FC<{
  message: string;
  onClose?: () => void;
  autoHideDuration?: number;
}> = ({ message, onClose, autoHideDuration = 6000 }) => (
  <Snackbar
    open={true}
    autoHideDuration={autoHideDuration}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Alert
      onClose={onClose}
      severity="info"
      sx={{ width: "100%" }}
      icon={<InfoIcon />}
    >
      {message}
    </Alert>
  </Snackbar>
);

// Hover Tooltips
export const HelpTooltip: React.FC<{
  title: string;
  children?: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
}> = ({ title, children, placement = "top" }) => (
  <Tooltip
    title={title}
    placement={placement}
    arrow
    enterDelay={500}
    leaveDelay={200}
  >
    <Box component="span" display="inline-flex" alignItems="center">
      {children || <HelpIcon fontSize="small" color="action" />}
    </Box>
  </Tooltip>
);

// Input Validation & Help
export const RequiredFieldIndicator: React.FC = () => (
  <RequiredField>*</RequiredField>
);

export const FieldHintText: React.FC<{ hint: string }> = ({ hint }) => (
  <FieldHint>{hint}</FieldHint>
);

export const ValidationError: React.FC<{ error: string }> = ({ error }) => (
  <FormHelperText
    error
    sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}
  >
    <ErrorIcon fontSize="small" />
    {error}
  </FormHelperText>
);

// Section Completion Status
export const SectionStatusIndicator: React.FC<{
  completed: boolean;
  label: string;
  onClick?: () => void;
}> = ({ completed, label, onClick }) => (
  <SectionStatus
    onClick={onClick}
    sx={{ cursor: onClick ? "pointer" : "default" }}
  >
    {completed ? (
      <CheckCircleIcon color="success" fontSize="small" />
    ) : (
      <ErrorIcon color="disabled" fontSize="small" />
    )}
    <Typography
      variant="body2"
      color={completed ? "success.main" : "text.disabled"}
      sx={{ textDecoration: onClick ? "underline" : "none" }}
    >
      {label}
    </Typography>
  </SectionStatus>
);

// Progress Indicators
export const CompletionProgress: React.FC<{
  completed: number;
  total: number;
  label?: string;
}> = ({ completed, total, label }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Box>
      {label && (
        <Typography variant="body2" color="text.secondary" mb={1}>
          {label}
        </Typography>
      )}
      <LinearProgressWithLabel value={percentage} showPercentage={true} />
      <Typography variant="caption" color="text.secondary">
        {completed} of {total} sections completed
      </Typography>
    </Box>
  );
};

// Status Chips
export const StatusChip: React.FC<{
  status: "success" | "error" | "warning" | "info" | "default";
  label: string;
  size?: "small" | "medium";
}> = ({ status, label, size = "small" }) => {
  const getColor = () => {
    switch (status) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Chip
      label={label}
      size={size}
      color={getColor()}
      variant="outlined"
      sx={{ fontWeight: "medium" }}
    />
  );
};

// Auto-formatting utilities
export const formatCurrency = (value: string): string => {
  const numericValue = value.replace(/[^0-9.]/g, "");
  if (!numericValue) return "";

  const number = parseFloat(numericValue);
  if (isNaN(number)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
};

export const formatPercentage = (value: string): string => {
  const numericValue = value.replace(/[^0-9.]/g, "");
  if (!numericValue) return "";

  const number = parseFloat(numericValue);
  if (isNaN(number)) return "";

  return `${number.toFixed(2)}%`;
};

export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return value;
};

// Breadcrumb component
export const Breadcrumbs: React.FC<{
  items: Array<{ label: string; onClick?: () => void; active?: boolean }>;
}> = ({ items }) => (
  <Box display="flex" alignItems="center" gap={1} mb={2} flexWrap="wrap">
    {items.map((item, index) => (
      <Box key={index} display="flex" alignItems="center">
        <Typography
          variant="body2"
          color={item.active ? "primary.main" : "text.secondary"}
          sx={{
            cursor: item.onClick ? "pointer" : "default",
            textDecoration: item.onClick ? "underline" : "none",
            fontWeight: item.active ? "medium" : "normal",
          }}
          onClick={item.onClick}
        >
          {item.label}
        </Typography>
        {index < items.length - 1 && (
          <Typography variant="body2" color="text.disabled" mx={1}>
            /
          </Typography>
        )}
      </Box>
    ))}
  </Box>
);

// Quick Jump Menu
export const QuickJumpMenu: React.FC<{
  sections: Array<{ id: string; label: string; completed?: boolean }>;
  onJumpTo: (id: string) => void;
}> = ({ sections, onJumpTo }) => (
  <Box>
    <Typography variant="subtitle2" color="text.secondary" mb={1}>
      Quick Navigation
    </Typography>
    <Box display="flex" flexWrap="wrap" gap={1}>
      {sections.map((section) => (
        <Chip
          key={section.id}
          label={section.label}
          size="small"
          variant="outlined"
          color={section.completed ? "success" : "default"}
          onClick={() => onJumpTo(section.id)}
          sx={{ cursor: "pointer" }}
        />
      ))}
    </Box>
  </Box>
);

// Save Progress Indicator
export const SaveProgressIndicator: React.FC<{
  saved: boolean;
  lastSaved?: Date;
  onSave?: () => void;
}> = ({ saved, lastSaved, onSave }) => (
  <Box display="flex" alignItems="center" gap={1}>
    <StatusChip
      status={saved ? "success" : "warning"}
      label={saved ? "Saved" : "Unsaved Changes"}
    />
    {lastSaved && (
      <Typography variant="caption" color="text.secondary">
        Last saved: {lastSaved.toLocaleTimeString()}
      </Typography>
    )}
    {!saved && onSave && (
      <Typography
        variant="caption"
        color="primary.main"
        sx={{ cursor: "pointer", textDecoration: "underline" }}
        onClick={onSave}
      >
        Save now
      </Typography>
    )}
  </Box>
);
