import React, { useEffect, useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const CreateBankStatement = ({ onFetchRef, bankId, balance }) => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    bank_id: "",
    balance: 0,
    date: "",
    mop: "",
    remark:"",
    // handle_by: "",
    particulars: "",
    credit: 0,
    debit: 0,
  });

  // Default values reset
  const getDefaultFormData = () => ({
    bank_id: bankId || "",
    balance: balance || 0,
    date: new Date().toISOString().split("T")[0],
    mop: "UPI",
    remark:"",
    particulars: "",
    credit: 0,
    debit: 0,
  });

  useEffect(() => {
    if (bankId) setFormData(getDefaultFormData());
  }, [bankId, balance]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

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

  // Reset to 0 on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;

    if ((name === "credit" || name === "debit") && value === "") {
      setFormData((prev) => ({ ...prev, [name]: 0 }));
    }
  };

  // -------------------------
  // VALIDATION LOGIC
  // -------------------------
  const isFormValid = () => {
    const { mop, particulars, remark, date, credit, debit } = formData;

    // Required Fields
    const requiredFilled =
      mop.trim() !== "" &&

      particulars.trim() !== "" &&
      date.trim() !== "" ;

    // Credit/Debit old logic
    const creditDebitValid =
      (Number(credit) > 0 && Number(debit) === 0) ||
      (Number(debit) > 0 && Number(credit) === 0);

    return requiredFilled && creditDebitValid;
  };

  // -------------------------
  // Submit
  // -------------------------
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
      setFormData(getDefaultFormData());
    } else {
      showToast(error?.message || "Failed to create Statement", "error");
    }

    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
     alignItems: "flex-start",

        flexWrap: "wrap",
      }}
    >

      {/* PARTICULARS */}
      <TextField
        label="Particulars"
        name="particulars"
        size="small"
        value={formData.particulars}
        onChange={handleChange}
        sx={{ width: 250 }}
      />

      {/* CREDIT */}
      <TextField
        label="Credit"
        name="credit"
        type="number"
        size="small"
        value={formData.credit}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={Number(formData.debit) > 0}
        sx={{ width: 200 }}
      />

      {/* DEBIT */}
      <TextField
        label="Debit"
        name="debit"
        type="number"
        size="small"
        value={formData.debit}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={Number(formData.credit) > 0}
        sx={{ width: 200 }}
      />



      {/* DATE */}
      <TextField
        label="Date"
        name="date"
        type="date"
        size="small"
        value={formData.date}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  document.getElementsByName("date")[0].showPicker?.();
                }}
              >
                <CalendarTodayIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ width: 200 }}
      />

      {/* MOP */}
      <TextField
        select
        label="MOP"
        name="mop"
        value={formData.mop}
        onChange={handleChange}
        size="small"
        sx={{ width: 200 }}
      >
        <MenuItem value="RTGS">RTGS</MenuItem>
        <MenuItem value="NEFT">NEFT</MenuItem>
        <MenuItem value="IMPS">IMPS</MenuItem>
        <MenuItem value="UPI">UPI</MenuItem>
        <MenuItem value="FT">FT</MenuItem>
        <MenuItem value="Cash Deposit Branch">Cash Deposit Branch</MenuItem>
        <MenuItem value="Cash Deposit CDM">Cash Deposit CDM</MenuItem>
        <MenuItem value="Cash At Office">Cash At Office</MenuItem>
        <MenuItem value="CREDIT">CREDIT</MenuItem>
      </TextField>

  {/* REMARKS */}
      <TextField
        label="Remarks"
        name="remark"
        size="small"
        value={formData.remark}
        onChange={handleChange}
         sx={{ width: 250 }}
      />

      {/* ADD BUTTON */}
      <Button
        onClick={handleSubmit}
        disabled={!isFormValid() || submitting}
        variant="contained"
        size="medium"
        sx={{
  background: "#492077",          // <-- your grey background
 
  textTransform: "none",
  fontWeight: 600,
  paddingX: 1,
  paddingY: 1,
  borderRadius: "10px",
  "&:hover": {
   background: "linear-gradient(135deg, #5A048F 0%, #7B2BB5 100%)",        // <-- keep grey even on hover OR change if you want
  },
}}

      >
        + Add
      </Button>
    </Box>
  );
};

export default CreateBankStatement;
