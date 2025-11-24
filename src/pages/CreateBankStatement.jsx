import React, { useEffect, useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { useToast } from "../utils/ToastContext";
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import ReButton from "../components/common/ReButton";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
const CreateBankStatement = ({ onFetchRef, bankId, balance }) => {
  const { schema, errors, loading } = useSchemaForm(
    ApiEndpoints.GET_BANK_STATEMENT_SCHEMA,
    true
  );

  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  // Function to generate default form data
  const getDefaultFormData = () => ({
    bank_id: bankId,
    balance: balance || 0,
    date: new Date().toISOString().split("T")[0],
    credit: 0,
    debit: 0,
    mop: "",
    handle_by: "",
    particulars: "",
  });

  // Initialize form when bankId or balance changes
  useEffect(() => {
    if (bankId) {
      setFormData(getDefaultFormData());
    }
  }, [bankId, balance]);

  // Handle form changes with mutually exclusive credit/debit
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "select_transaction") {
      const transactionField = schema.find(
        (f) => f.name === "select_transaction"
      );
      const selected = transactionField?.options?.find(
        (opt) => String(opt.id) === String(value)
      );

      const isStatic = value === "credit_option" || value === "value_option";

      let newFormData = {
        account_id: accountId,
        select_transaction: isStatic
          ? value === "credit_option"
            ? "Credit"
            : "Value"
          : `${selected.created_at} / ${selected.particulars} / ${
              parseFloat(selected.credit) > 0 ? selected.credit : selected.debit
            }`,
        bank_id: isStatic
          ? value === "credit_option"
            ? "Credit"
            : "Value"
          : selected?.bank_id,
        _bank_name_display: isStatic
          ? value === "credit_option"
            ? "Credit"
            : "Value"
          : selected?.bank_name || "",
        credit: isStatic ? 0 : selected?.credit,
        debit: isStatic ? 0 : selected?.debit,
        balance: isStatic
          ? balance
          : parseFloat(balance) +
            (parseFloat(selected.credit) > 0
              ? parseFloat(selected.credit)
              : -parseFloat(selected.debit)),
        remarks: selected?.remark || "",
        particulars: selected?.particulars || "",
        id: selected?.id || null,
      };

      setFormData(newFormData);

      // Disable fields only for normal transactions
      setDisabledFields(
        isStatic
          ? []
          : schema.map((f) => f.name).filter((n) => n !== "select_transaction")
      );

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Clear 0 on focus
  const handleFocus = (e) => {
    const { name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name] === 0 ? "" : prev[name],
    }));
  };

  // Restore 0 on blur if empty
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if ((name === "credit" || name === "debit") && value === "") {
      setFormData((prev) => ({ ...prev, [name]: 0 }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setSubmitting(true);
    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.CREATE_BANK_STATEMENT,
      formData
    );

    if (response) {
      showToast(response?.message || "Statement Created", "success");
      onFetchRef?.();
      setFormData(getDefaultFormData()); // reset form after submission
    } else {
      showToast(error?.message || "Failed to create Statement", "error");
    }
    setSubmitting(false);
  };

  // Only show required fields from schema
 const requiredFields = [
  "mop",
  "credit",
  "debit",
  "handle_by",
  "date",
  "particulars", // debit is NOT required
];

const isFormValid = requiredFields.every((field) => {
  const value = formData[field];
  return value !== "" && value !== undefined && value !== null;
});

  const visibleFields = schema.filter((f) => requiredFields.includes(f.name));

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        flexWrap: "nowrap",
      }}
    >
      {visibleFields.map((field) => (
        <TextField
          key={field.name}
          select={field.type === "dropdown"}
          label={field.label || field.name}
          name={field.name}
          value={formData[field.name] ?? ""}
          onChange={handleChange}
          size="small"
          error={Boolean(errors[field.name])}
          helperText={errors[field.name]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          InputProps={{
            endAdornment:
              field.type === "date" ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      document.getElementsByName(field.name)[0].showPicker?.();
                    }}
                  >
                    <CalendarTodayIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
          }}
          disabled={
            field.name === "balance" ||
            (field.name === "credit" && Number(formData.debit) > 0) ||
            (field.name === "debit" && Number(formData.credit) > 0)
          }
          type={
            field.type === "date"
              ? "date"
              : field.type === "number"
              ? "number"
              : "text"
          }
          sx={{ width: field.name === "particulars" ? 350 : 200 }} // ✅ wider for particulars
        >
          {field.type === "dropdown" &&
            field.options?.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
        </TextField>
      ))}

      {/* <ReButton label="Add" onClick={handleSubmit} loading={submitting} /> */}
<Button
  onClick={handleSubmit}
  disabled={!isFormValid || submitting}
  variant="contained"
  size="medium"
  sx={{
    background: !isFormValid
      ? "grey"
      : "linear-gradient(135deg, #490277 0%, #6A1B9A 100%)",
    color: "#FFFFFF",
    textTransform: "none",
    fontWeight: 600,
    letterSpacing: "0.3px",
    paddingX: 1,
    paddingY: 1,
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(73, 2, 119, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": !isFormValid
      ? {}
      : {
          background: "linear-gradient(135deg, #5A048F 0%, #7B2BB5 100%)",
          boxShadow: "0px 6px 16px rgba(73, 2, 119, 0.45)",
          transform: "translateY(-2px)",
        },
    "&:active": !isFormValid
      ? {}
      : {
          transform: "scale(0.98)",
          boxShadow: "0px 2px 6px rgba(73, 2, 119, 0.2)",
        },
  }}
>
  + Add
</Button>


    </Box>
  );
};

export default CreateBankStatement;
