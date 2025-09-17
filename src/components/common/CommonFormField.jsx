import React, { useState, useEffect } from "react";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { ReTextField } from "./ReTextField";
import { apiCall } from "../../api/apiClient";

const CommonFormField = ({ field, formData, handleChange, errors, loading }) => {
  const { name, label, type, options = [], apiOptions, props = {} } = field;
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  useEffect(() => {
    if (!apiOptions) return;

    const fetchOptions = async () => {
      try {
        setOptionsLoading(true);
        const res = await apiCall(apiOptions.method || "post", apiOptions.endpoint);
        const rawData = res?.response?.data || res?.data || [];
        const mapped = apiOptions.mapOptions ? apiOptions.mapOptions(rawData) : rawData;
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

  const finalOptions = dynamicOptions.length ? dynamicOptions : options;

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
            handleChange({ target: { name, value: newValue ? dayjs(newValue).format("YYYY-MM-DD") : "" } })
          }
          slotProps={{ textField: { fullWidth: true, ...getErrorProps() } }}
          disabled={loading}
          {...props}
        />
      );
// CommonFormField.js

case "file":
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Button
        variant="outlined"
        component="label"
        disabled={loading}
        sx={{ alignSelf: "flex-start" }}
      >
        {formData[name] ? "Change File" : `Upload ${label || "File"}`}
        <input
          type="file"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onloadend = () => {
              handleChange({
                target: {
                  name,
                  value: reader.result, // ✅ Base64 encoded string with MIME prefix
                },
              });
            };
            reader.readAsDataURL(file); // ✅ Convert to base64
          }}
        />
      </Button>

      {/* ✅ Show image preview if it's an image */}
      {formData[name] && formData[name].startsWith("data:image") && (
        <Box
          component="img"
          src={formData[name]}
          alt="Preview"
          sx={{
            maxWidth: 120,
            maxHeight: 120,
            mt: 1,
            borderRadius: 2,
            border: "1px solid #ddd",
          }}
        />
      )}

      {/* ✅ Show file name if it's not an image */}
      {formData[name] && !formData[name].startsWith("data:image") && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          File uploaded
        </Typography>
      )}

      {errors[name] && (
        <Typography color="error" variant="caption">
          {errors[name]}
        </Typography>
      )}
    </Box>
  );

    case "timepicker":
      return (
        <TimePicker
          label={label}
          value={formData[name] ? dayjs(formData[name]) : null}
          onChange={(newValue) => handleChange({ target: { name, value: newValue?.toISOString() } })}
          slotProps={{ textField: { fullWidth: true, ...getErrorProps() } }}
          disabled={loading}
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
          {...getErrorProps()}
        >
          {optionsLoading ? (
            <MenuItem disabled>Loading options...</MenuItem>
          ) : finalOptions.length ? (
            finalOptions.map((opt, i) => {
              if (typeof opt === "string") return <MenuItem key={i} value={opt}>{opt}</MenuItem>;
              const value = opt.value ?? opt.id ?? opt.bank_id ?? i;
              const labelText = opt.label ?? opt.bank_name ?? opt.name ?? String(value);
              return <MenuItem key={value} value={value}>{labelText}</MenuItem>;
            })
          ) : (
            <MenuItem disabled>No options available</MenuItem>
          )}
        </ReTextField>
      );

    case "colorpicker":
    case "color":
    case "color_code":
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <input
            type="color"
            name={name}
            value={formData[name] || "#000000"}
            onChange={handleChange}
            disabled={loading}
            style={{ width: 50, height: 40, borderRadius: 6, cursor: "pointer", padding: 0 }}
            {...props}
          />
          <ReTextField
            label={label || "Color Code"}
            name={name}
            value={formData[name] || "#000000"}
            onChange={handleChange}
            disabled={loading}
            fullWidth
            {...getErrorProps()}
          />
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

export default CommonFormField;
