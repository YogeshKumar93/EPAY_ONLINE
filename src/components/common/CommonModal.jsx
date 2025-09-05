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







import React, { useEffect } from "react";
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
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Help as HelpIcon,
} from "@mui/icons-material";
import { ReTextField } from "./ReTextField"; // ✅ custom wrapper (TextField base)
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

// ✅ Extended Common Form Field
const CommonFormField = ({ field, formData, handleChange, errors, loading }) => {
  const { name, label, type, options = [], props = {} } = field;

  // Helper to show error state
  const getErrorProps = () => ({
    error: !!errors[name],
    helperText: errors[name],
  });

  // Switch between field types
  switch (type) {
    case "select":
      return (
        <ReTextField
          select
          fullWidth
          label={label}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          disabled={loading}
          {...getErrorProps()}
          {...props}
        >
          {options.map((option, i) => (
            <MenuItem key={i} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </ReTextField>
      );

   case "datepicker":
  return (
    <DatePicker
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

    case "email":
      return (
        <ReTextField
          fullWidth
          type="email"
          label={label}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          disabled={loading}
          {...getErrorProps()}
          {...props}
        />
      );

    case "phone":
      return (
        <ReTextField
          fullWidth
          type="tel"
          label={label}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          disabled={loading}
          inputProps={{ pattern: "[0-9]{10}", maxLength: 10 }}
          {...getErrorProps()}
          {...props}
        />
      );

    case "password":
      return (
        <ReTextField
          fullWidth
          type="password"
          label={label}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          disabled={loading}
          {...getErrorProps()}
          {...props}
        />
      );

    case "checkbox":
      return (
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              checked={!!formData[name]}
              onChange={(e) =>
                handleChange({
                  target: { name, value: e.target.checked },
                })
              }
              disabled={loading}
              {...props}
            />
          }
          label={label}
        />
      );

    case "radio":
      return (
        <Box>
          <FormLabel>{label}</FormLabel>
          <RadioGroup
            name={name}
            value={formData[name] || ""}
            onChange={handleChange}
          >
            {options.map((option, i) => (
              <FormControlLabel
                key={i}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {errors[name] && (
            <Typography color="error" variant="caption">
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
          disabled={loading}
          {...getErrorProps()}
          {...props}
        />
      );
  }
};

// ✅ CommonModal (same as before, only fieldConfig extended)
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
  dividers = false,
  fieldConfig = [],
  formData = {},
  handleChange = () => {},
  errors = {},
  loading = false,
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

  return (
    <Dialog
      open={open}
      onClose={closeOnBackdropClick ? onClose : null}
      fullScreen={fullScreen}
      maxWidth={getMaxWidth()}
      fullWidth
      aria-labelledby="modal-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          display: "flex",
          alignItems: "center",
          borderBottom: dividers ? 1 : 0,
          borderColor: "divider",
          bgcolor: "#014C50",
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <Box sx={{ mr: 1.5, display: "flex" }}>{getIcon()}</Box>
          <Typography variant="h5" component="h2" id="modal-title">
            {title}
          </Typography>
        </Box>
        {showCloseButton && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      {/* Content */}
     <DialogContent dividers={dividers} sx={{ p: 3 }}>
  {fieldConfig.length > 0 ? (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {fieldConfig.map((field, i) => (
        <Box key={i} sx={{ flex: "1 1 calc(50% - 16px)" }}>
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


      {/* Footer */}
      {footerButtons && footerButtons.length > 0 && (
        <DialogActions
          sx={{
            p: 2,
            gap: 1,
            borderTop: dividers ? 1 : 0,
            borderColor: "divider",
            bgcolor: "#014C50",
            color: "white",
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
              sx={{ borderRadius: 2 }}
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

