import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonMpinModal from "../common/CommonMpinModal";
import AuthContext from "../../contexts/AuthContext";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import { apiCall } from "../../api/apiClient";

const CreditCardBillPayment = ({
  open,
  handleClose,
  data = {},
  refreshData,
}) => {
  const { location } = useContext(AuthContext);

  const [submitting, setSubmitting] = useState(false);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    cnumber: "",
    number: "",
    name: "",
    amount: "",
    latitude: location?.lat || 0,
    longitude: location?.long || 0,
    operator: "326",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" })); // clear error on change
  };

  // Validation function
  const validate = () => {
    const errors = {};

    if (!formValues.cnumber) errors.cnumber = "Customer Number is required";
    if (!formValues.number) errors.number = "Phone Number is required";
    else if (!/^\d{10}$/.test(formValues.number))
      errors.number = "Phone Number must be 10 digits";

    if (!formValues.name) errors.name = "Name is required";

    if (!formValues.amount) errors.amount = "Amount is required";
    else if (Number(formValues.amount) <= 0)
      errors.amount = "Amount must be greater than 0";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleConfirmPayment = async (mpin) => {
    if (!validate()) return; // stop if validation fails

    setSubmitting(true);
    try {
      const payload = { ...formValues, mpin };

      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.CREDIT_CARD_BILL_PAYMENT,
        payload
      );

      if (response) {
        okSuccessToast(response?.data?.message || "Payment successful!");
        refreshData?.();
      } else {
        apiErrorToast(error?.message || "Payment failed!");
      }
    } catch (err) {
      apiErrorToast(err.message || "Payment failed!");
    } finally {
      setSubmitting(false);
      setMpinModalOpen(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          zIndex: 1100,
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
          Credit Card Bill Payment
        </Typography>

        <Box display="flex" flexDirection="column" gap={2} mb={3}>
          <TextField
            label="Customer Number"
            value={formValues.cnumber}
            onChange={(e) => handleChange("cnumber", e.target.value)}
            fullWidth
            error={!!formErrors.cnumber}
            helperText={formErrors.cnumber}
          />
          <TextField
            label="Phone Number"
            value={formValues.number}
            onChange={(e) => handleChange("number", e.target.value)}
            fullWidth
            error={!!formErrors.number}
            helperText={formErrors.number}
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            label="Name"
            value={formValues.name}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            label="Amount"
            type="number"
            value={formValues.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            fullWidth
            error={!!formErrors.amount}
            helperText={formErrors.amount}
          />
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setMpinModalOpen(true)}
            disabled={submitting}
          >
            {submitting ? "Processing..." : "Pay"}
          </Button>
        </Box>
      </Box>

      {/* MPIN confirmation modal */}
      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        title="Enter MPIN to Confirm Payment"
        mPinCallBack={handleConfirmPayment}
      />

      {/* Loader */}
      <Backdrop open={submitting} sx={{ zIndex: 1200, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default CreditCardBillPayment;
