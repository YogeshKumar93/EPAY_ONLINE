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

// ✅ Fixed Common Form Field with API integration
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
  console.log("The field in common form field is", field);
  useEffect(() => {
    if (!apiOptions) return;

    const fetchOptions = async () => {
      try {
        setOptionsLoading(true);
        console.log(`Fetching options for ${name} from ${apiOptions.endpoint}`);

        const res = await apiCall(
          apiOptions.method || "post",
          apiOptions.endpoint
        );
        console.log(`API response for ${name}:`, res);

        const rawData = res?.response?.data || res?.data || []; // Changed from res?.data?.data
        console.log(`Raw data for ${name}:`, rawData);

        const mapped = apiOptions.mapOptions
          ? apiOptions.mapOptions(rawData)
          : rawData;
        console.log(`Mapped options for ${name}:`, mapped);

        setDynamicOptions(mapped);
      } catch (err) {
        console.error(`Error fetching options for ${name}:`, err);
        setDynamicOptions([]);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, [apiOptions, name]);

  const finalOptions = dynamicOptions.length > 0 ? dynamicOptions : options;

  // Helper to show error state
  const getErrorProps = () => ({
    error: !!errors[name],
    helperText: errors[name],
  });

  // Switch between field types
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
                // ✅ send formatted date instead of timestamp
                value: newValue ? dayjs(newValue).format("YYYY-MM-DD") : "",
              },
            })
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
            finalOptions.find(
              (opt) =>
                opt?.value === formData[name] ||
                opt?.id === formData[name] ||
                opt?.bank_id === formData[name] ||
                opt?.code === formData[name] || // ✅ added to handle route field
                opt?.name === formData[name]
            ) || null
          }
          onChange={(e, newValue) => {
            let value = "";
            if (newValue) {
              // ✅ Special handling for route
              if (name === "route" && newValue.code) {
                value = newValue.code;
              } else {
                value =
                  newValue.value ??
                  newValue.id ??
                  newValue.bank_id ??
                  newValue.code ??
                  newValue.name ??
                  newValue ??
                  "";
              }
            }

            handleChange({
              target: { name, value },
            });
          }}
          loading={optionsLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              fullWidth
              {...getErrorProps()}
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
        >
          {optionsLoading ? (
            <MenuItem disabled>Loading options...</MenuItem>
          ) : finalOptions && finalOptions.length > 0 ? (
            finalOptions.map((opt, i) => {
              // ✅ Normalize both object & string options
              if (typeof opt === "string") {
                return (
                  <MenuItem key={i} value={opt}>
                    {opt}
                  </MenuItem>
                );
              }
              // if object with id/bank_name
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
    case "file":
    case "image":
      const fileValue = formData[name];
      const [preview, setPreview] = useState(
        typeof fileValue === "string" ? fileValue : null
      );

      const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Generate preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Convert file to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          handleChange({
            target: {
              name,
              value: reader.result, // Base64 string
            },
          });
        };
        reader.readAsDataURL(file);
      };

      useEffect(() => {
        // Clean up object URL
        return () => {
          if (preview && fileValue instanceof File) {
            URL.revokeObjectURL(preview);
          }
        };
      }, [preview, fileValue]);

      return (
        <Box>
          <Button
            variant="contained"
            component="label"
            disabled={loading}
            sx={{ mb: 1 }}
          >
            Upload {label || "File"}
            <input
              type="file"
              name={name}
              accept="image/*"
              hidden
              onChange={handleFileChange}
              {...props}
            />
          </Button>

          {preview && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Selected File:
              </Typography>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </Box>
          )}

          {errors[name] && (
            <Typography variant="caption" color="error">
              {errors[name]}
            </Typography>
          )}
        </Box>
      );

    default:
      return (
        <ReTextField
          fullWidth
          label={label}
          name={name}
          type={type || "text"}
          value={formData[name] || ""}
          onChange={handleChange}
          disabled={field.disabled || loading}
          {...getErrorProps()}
          {...props}
        />
      );
  }
};

// ✅ CommonModal Component
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
  customContent = null, // 👈 NEW PROP
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Escape key support
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27 && open) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Icons
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

  const getMaxWidth = () => {
    if (maxWidth) return maxWidth;
    const sizeMap = { small: "sm", medium: "md", large: "lg" };
    return sizeMap[size] || "md";
  };
  // console.log("The field config in common modal is", fieldConfig);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth={getMaxWidth()}
      fullWidth
      aria-labelledby="modal-title"
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 4 },
          boxShadow: { xs: "none", sm: "0 10px 40px rgba(0,0,0,0.1)" },
          bgcolor: "#FFFFFF",
          fontFamily: '"DM Sans", sans-serif !important',
          maxHeight: "90vh",
          overflow: "hidden",
          "& *": {
            fontFamily: '"DM Sans", sans-serif !important',
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: 0, // remove padding here to not interfere with line
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        {/* Purple line at the top */}
        <Box
          sx={{
            height: "4px", // thickness of the line
            width: "100%", // full width
            bgcolor: "#261452ff", // purple color
          }}
        />

        {/* Original header content */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            borderBottom: dividers ? 1 : 0,
            borderColor: "divider",
            backgroundColor: "#e0d8e6ff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Box sx={{ mr: 1.5, display: "flex", color: "#492077" }}>
              {getIcon()}
            </Box>
            <Typography
              variant="h5"
              component="h2"
              id="modal-title"
              sx={{
                color: "#492077",
                fontWeight: 550,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              {title}
            </Typography>
          </Box>
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[900],
                
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      {/* Content */}
      {/* Content */}
      <DialogContent
        dividers={dividers}
        sx={{
          p: 4,
          backgroundColor: "#ffffff",
          overflowY: "auto",
          maxHeight: "calc(90vh - 140px)",
        }}
      >
        {fieldConfig.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, // ✅ 2 fields per row on sm+, 1 per row on xs
              gap: 3, // spacing between fields
              alignItems: "start",
              mt: 1.4,
            }}
          >
            {fieldConfig.map((field, i) => (
              <Box
                key={i}
                sx={{
                  gridColumn: field.fullWidth ? "1 / -1" : "auto", // fullWidth fields span both columns
                  minWidth: 0,
                }}
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
        {customContent && <Box sx={{ mt: 0 }}>{customContent}</Box>}
      </DialogContent>

      {/* Footer */}
      {footerButtons && footerButtons.length > 0 && (
        <DialogActions
          sx={{
            p: { xs: 2, sm: 3 },
            gap: 1,
            borderTop: dividers ? 1 : 0,
            borderColor: "divider",
            bgcolor: "#f8fafc",
            color: "#344357",
            fontFamily: '"DM Sans", sans-serif',
            flexDirection: { xs: "column", sm: "row" },
            "& > *": {
              width: { xs: "100%", sm: "auto" },
              mx: { xs: 0, sm: 0.5 },
            },
          }}
        >
          {footerButtons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              variant={button.variant || "outlined"}
              color={button.color || "primary"}
              startIcon={button.startIcon}
              endIcon={button.endIcon}
              disabled={button.disabled}
              sx={{
                fontFamily: '"DM Sans", sans-serif !important',
                backgroundColor:
                  typeof button.text === "string" &&
                  button.text.toLowerCase() === "cancel"
                    ? "#8094ae !important"
                    : "#492077",

                color: "#fff",
                textTransform: "none",
              }}
            >
              {button.text}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CommonModal;
