// import React, { useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Button,
//   Box,
//   Typography,
//   useTheme,
//   useMediaQuery
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   CheckCircle as SuccessIcon,
//   Error as ErrorIcon,
//   Warning as WarningIcon,
//   Info as InfoIcon,
//   Help as HelpIcon
// } from '@mui/icons-material';

// const CommonModal = ({
//   open = false,
//   onClose,
//   title = "Modal Title",
//   children,
//   footerButtons = [
//     { text: "Cancel", variant: "outlined", onClick: () => {} },
//     { text: "Confirm", variant: "contained", onClick: () => {} }
//   ],
//   size = "medium", // small, medium, large
//   iconType = "info", // info, success, warning, error, help
//   showCloseButton = true,
//   closeOnBackdropClick = true,
//   maxWidth,
//   dividers = false
// }) => {
//   const theme = useTheme();
//   const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

//   // Handle escape key press
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.keyCode === 27 && open) {
//         onClose();
//       }
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [open, onClose]);

//   // Icon configuration
//   const getIcon = () => {
//     const iconConfig = {
//       info: { icon: <InfoIcon />, color: theme.palette.info.main },
//       success: { icon: <SuccessIcon />, color: theme.palette.success.main },
//       warning: { icon: <WarningIcon />, color: theme.palette.warning.main },
//       error: { icon: <ErrorIcon />, color: theme.palette.error.main },
//       help: { icon: <HelpIcon />, color: theme.palette.primary.main },
//     };

//     const { icon, color } = iconConfig[iconType] || iconConfig.info;
//     return React.cloneElement(icon, { sx: { color, fontSize: 24 } });
//   };

//   // Determine maxWidth value
//   const getMaxWidth = () => {
//     if (maxWidth) return maxWidth;

//     const sizeMap = {
//       small: 'sm',
//       medium: 'md',
//       large: 'lg'
//     };

//     return sizeMap[size] || 'md';
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={closeOnBackdropClick ? onClose : null}
//       fullScreen={fullScreen}
//       maxWidth={getMaxWidth()}
//       fullWidth
//       aria-labelledby="modal-title"
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
//         }
//       }}
//     >
//       {/* Header */}
//       <DialogTitle sx={{
//         m: 0,
//         p: 3,
//         display: 'flex',
//         alignItems: 'center',
//         borderBottom: dividers ? 1 : 0,
//         borderColor: 'divider',
//         bgcolor: '#014C50',
//         color:'white'
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center',justifyContent:'center', flexGrow: 1, }}>
//           <Box sx={{ mr: 1.5, display: 'flex' }}>
//             {getIcon()}
//           </Box>
//           <Typography variant="h5" component="h2" id="modal-title">
//             {title}
//           </Typography>
//         </Box>

//         {showCloseButton && (
//           <IconButton
//             aria-label="close"
//             onClick={onClose}
//             sx={{
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         )}
//       </DialogTitle>

//       {/* Content */}
//       <DialogContent dividers={dividers} sx={{ p: 3 }}>
//         {children}
//       </DialogContent>

//       {/* Footer */}
//       {footerButtons && footerButtons.length > 0 && (
//         <DialogActions sx={{
//           p: 2,
//           gap: 1,
//           borderTop: dividers ? 1 : 0,
//           borderColor: 'divider',
//           bgcolor: '#014C50',
//           color:'white'
//         }}>
//           {footerButtons.map((button, index) => (
//             <Button
//               key={index}
//               onClick={button.onClick}
//               variant={button.variant || "outlined"}
//               color={button.color || "primary"}
//               startIcon={button.startIcon}
//               endIcon={button.endIcon}
//               disabled={button.disabled}
//               sx={{ borderRadius: 2 }}
//             >
//               {button.text}
//             </Button>
//           ))}
//         </DialogActions>
//       )}
//     </Dialog>
//   );
// };

// export default CommonModal;

// CommonModal.js

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  TextField,
  Autocomplete,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Help as HelpIcon,
} from "@mui/icons-material";
import { ReTextField } from "./ReTextField";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { apiCall } from "../../api/apiClient";

// ✅ CommonFormField
const CommonFormField = ({
  field,
  formData,
  handleChange,
  errors,
  loading,
}) => {
  const { name, label, type, options = [], apiOptions, props = {} } = field;
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  useEffect(() => {
    if (!apiOptions) return;

    const fetchOptions = async () => {
      try {
        setOptionsLoading(true);
        const res = await apiCall(
          apiOptions.method || "post",
          apiOptions.endpoint
        );
        const rawData = res?.response?.data || res?.data || [];
        const mapped = apiOptions.mapOptions
          ? apiOptions.mapOptions(rawData)
          : rawData;
        setDynamicOptions(mapped);
      } catch {
        setDynamicOptions([]);
      } finally {
        setOptionsLoading(false);
      }
    };
    fetchOptions();
  }, [apiOptions, name]);

  const finalOptions = dynamicOptions.length > 0 ? dynamicOptions : options;

  const getErrorProps = () => ({
    error: !!errors[name],
    helperText: errors[name],
  });

  switch (type) {
    case "datepicker":
      return (
        <DatePicker
          label={label}
          value={formData[name] ? dayjs(formData[name]) : null}
          onChange={(newValue) =>
            handleChange({
              target: {
                name,
                value: newValue ? dayjs(newValue).format("YYYY-MM-DD") : "",
              },
            })
          }
          slotProps={{
            textField: {
              fullWidth: true,
              ...getErrorProps(),
              sx: { fontFamily: '"DM Sans", sans-serif !important' },
            },
          }}
          disabled={loading}
          {...props}
        />
      );

    case "autocomplete":
      return (
        <Autocomplete
          options={finalOptions}
          getOptionLabel={(opt) => {
            if (!opt) return "";
            if (typeof opt === "string") return opt;
            return (
              opt.label ?? opt.name ?? opt.bank_name ?? String(opt.value ?? "")
            );
          }}
          value={
            finalOptions.find((opt) =>
              [opt?.value, opt?.id, opt?.bank_id].includes(formData[name])
            ) || null
          }
          onChange={(e, newValue) =>
            handleChange({
              target: {
                name,
                value: newValue?.value ?? newValue?.id ?? newValue ?? "",
              },
            })
          }
          loading={optionsLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              fullWidth
              {...getErrorProps()}
              sx={{ fontFamily: '"DM Sans", sans-serif !important' }}
            />
          )}
          disabled={loading || optionsLoading}
          {...props}
        />
      );

    case "select":
    case "dropdown":
      return (
        <ReTextField
          select
          fullWidth
          label={label}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          disabled={loading || optionsLoading}
          error={!!errors[name]}
          helperText={errors[name]}
          sx={{ fontFamily: '"DM Sans", sans-serif !important' }}
        >
          {optionsLoading ? (
            <MenuItem disabled>Loading options...</MenuItem>
          ) : finalOptions.length > 0 ? (
            finalOptions.map((opt, i) => {
              const value = opt.value ?? opt.id ?? opt.bank_id ?? i;
              const label =
                opt.label ?? opt.bank_name ?? opt.name ?? String(value);
              return (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem disabled>No options available</MenuItem>
          )}
        </ReTextField>
      );

<<<<<<< HEAD
    case "timepicker":
      return (
        <TimePicker
          label={label}
          value={formData[name] ? dayjs(formData[name]) : null}
          onChange={(newValue) =>
            handleChange({ target: { name, value: newValue?.toISOString() } })
          }
          slotProps={{
            textField: {
              fullWidth: true,
              ...getErrorProps(),
            },
          }}
          disabled={loading}
          {...props}
        />
      );

    case "colorpicker":
    case "color":
    case "color_code":
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Color Picker */}
          <input
            type="color"
            name={name}
            value={formData[name] || "#000000"}
            onChange={(e) => handleChange(e)}
            disabled={loading}
            style={{
              width: "50px",
              height: "40px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
              padding: 0,
            }}
            {...props}
          />

          {/* Manual Hex Input */}
          <ReTextField
            label={label || "Color Code"}
            name={name}
            value={formData[name] || "#000000"}
            onChange={handleChange}
            disabled={loading}
            placeholder="#000000"
            sx={{ flex: 1 }}
            {...getErrorProps()}
          />
        </Box>
      );
    // Other field types remain the same
=======
>>>>>>> a704846 (minor chagen)
    default:
      return (
        <ReTextField
          fullWidth
          label={label}
          name={name}
          type={type || "text"}
          value={formData[name] || ""}
          onChange={handleChange}
          disabled={loading}
          {...getErrorProps()}
          {...props}
          sx={{ fontFamily: '"DM Sans", sans-serif !important' }}
        />
      );
  }
};

// ✅ CommonModal
const CommonModal = ({
  open = false,
  onClose,
  title = "Modal Title",
  children,
  footerButtons = [
    { text: "Cancel", variant: "outlined", onClick: () => {} },
    { text: "Confirm", variant: "contained", onClick: () => {} },
  ],
  size = "medium",
  iconType = "info",
  showCloseButton = true,
  closeOnBackdropClick = true,
  maxWidth,
  dividers = true,
  fieldConfig = [],
  formData = {},
  handleChange = () => {},
  errors = {},
  loading = false,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const getIcon = () => {
    const iconConfig = {
      info: { icon: <InfoIcon />, color: theme.palette.info.main },
      success: { icon: <SuccessIcon />, color: theme.palette.success.main },
      warning: { icon: <WarningIcon />, color: theme.palette.warning.main },
      error: { icon: <ErrorIcon />, color: theme.palette.error.main },
      help: { icon: <HelpIcon />, color: theme.palette.primary.main },
    };
    const { icon, color } = iconConfig[iconType] || iconConfig.info;
    return React.cloneElement(icon, { sx: { color, fontSize: 24 } });
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 2 },
          fontFamily: '"DM Sans", sans-serif !important',
          "& *": { fontFamily: '"DM Sans", sans-serif !important' },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          p: 3,
          backgroundColor: "#f8fafc",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          {" "}
          <Box sx={{ mr: 1.5, display: "flex", color: "#4f46e5" }}>
            {" "}
            {getIcon()}{" "}
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              color: "#364a63",
            }}
          >
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              {" "}
              <CloseIcon />{" "}
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent
        dividers={dividers}
        sx={{ p: 4, maxHeight: "70vh", overflowY: "auto" }}
      >
        {fieldConfig.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            {fieldConfig.map((field, i) => (
              <Box
                key={i}
                sx={{ gridColumn: field.fullWidth ? "1 / -1" : "auto" }}
              >
                <CommonFormField
                  field={field}
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                  loading={loading}
                />
              </Box>
            ))}
          </Box>
        ) : (
          children
        )}
      </DialogContent>

      <DialogActions
        sx={{ p: 3, gap: 1, flexDirection: { xs: "column", sm: "row" } }}
      >
        {footerButtons.map((button, i) => (
          <Button
            key={i}
            onClick={button.onClick}
            variant={button.variant}
            sx={{
              fontFamily: '"DM Sans", sans-serif !important',
              backgroundColor:
                button.text.toLowerCase() === "cancel"
                  ? "#8094ae !important"
                  : "#854fff",
              color: "#fff",
              textTransform: "none",
            }}
          >
            {button.text}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default CommonModal;
