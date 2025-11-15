import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";
import CommonMpinModal from "../components/common/CommonMpinModal";

const PartPaymentNew = ({
  billerId = "TATAPWR00DEL01",
  onBack,
  billerImage,
}) => {
  const { showToast } = useToast();
  const { ip, location, user, getUuid } = useContext(AuthContext);

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [billerDetails, setBillerDetails] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [fetchingBill, setFetchingBill] = useState(false);
  const [billData, setBillData] = useState(null);
  const [amount, setAmount] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const [enteredMpin, setEnteredMpin] = useState("");
  const [paymentSlip, setPaymentSlip] = useState(null);

  // ✅ Fetch Biller Details on Mount
  useEffect(() => {
    if (billerId) fetchBillerDetails();
  }, [billerId]);

  const fetchBillerDetails = async () => {
    setDetailsLoading(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.BBPS_GET_BILLERS_DETAILS,
        { biller_id: billerId }
      );

      if (response?.data?.data) {
        const details = response.data.data;
        setBillerDetails(details);

        const params = details.parameters || [];
        const initialValues = {};
        params.forEach((p) => (initialValues[p.name] = ""));
        setInputValues(initialValues);

        console.log("✅ Biller Details Fetched:", details);
      } else {
        showToast(error?.message || "Failed to fetch biller details", "error");
      }
    } catch (err) {
      console.error("❌ Error fetching biller details:", err);
      showToast(err.message || "Failed to fetch biller details", "error");
    } finally {
      setDetailsLoading(false);
    }
  };

  // ✅ Input Change
  const handleInputChange = (name, value) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
    if (billData) setBillData(null);
  };

  // ✅ Fetch Bill on Submit
  const handleSubmit = async () => {
    setFetchingBill(true);
    try {
      const { error: uuidError, response: uuidNumber } = await getUuid();

      if (uuidError || !uuidNumber) {
        showToast(
          uuidError?.message || "Failed to generate transaction ID",
          "error"
        );
        return;
      }
      const payload = {
        biller_id: billerId,
        ...inputValues,
        ip: ip || "0.0.0.0",
        latitude: location?.lat,
        longitude: location?.long,
        client_ref: uuidNumber,
      };

      console.log("📤 Fetch Bill Payload:", payload);

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.BBPS_FETCH_BILL,
        payload
      );

      if (response?.data) {
        const billInfo = response.data;
        setBillData(billInfo);
        setAmount(billInfo?.BillAmount || "");
        showToast("Bill fetched successfully!", "success");
      } else {
        showToast(error?.message || "Failed to fetch bill", "error");
      }
    } catch (err) {
      console.error("❌ Error fetching bill:", err);
      showToast(err.message || "Failed to fetch bill", "error");
    } finally {
      setFetchingBill(false);
    }
  };

  // ✅ Open MPIN Modal before Payment
  const handlePayBill = () => {
    if (!billData) return showToast("No bill data found!", "error");
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0)
      return showToast("Enter a valid amount!", "error");
    setMpinModalOpen(true);
  };

  // ✅ Final API call after MPIN entry
  const handleConfirmPayment = async (mpin) => {
    setMpinModalOpen(false);
    setEnteredMpin(mpin);
    setProcessingPayment(true);

    try {
      const { error: uuidError, response: uuidNumber } = await getUuid();

      if (uuidError || !uuidNumber) {
        showToast(
          uuidError?.message || "Failed to generate transaction ID",
          "error"
        );
        return;
      }
      const firstParamKey = Object.keys(inputValues)[0];
      const param1 = inputValues[firstParamKey] || "";

      const payload = {
        billerId: billerId,
        biller_name: billerDetails?.billerName || "TPDDL",
        bill_number: billData?.BillNumber,
        customer_name: billData?.CustomerName,
        amount: amount,
        param1, // ✅ added param1
        mpin, // ✅ from modal
        cat: 88,
        user_id: user?.id || "",
        ip: ip || "0.0.0.0",
        latitude: location?.lat,
        enquiryReferenceId: billData?.enquiryReferenceId || "",
        longitude: location?.long,
        client_ref: uuidNumber,
      };

      console.log("💰 Final Part Payment Payload:", payload);

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.PART_PAYMENT,
        payload
      );

      if (response) {
        const txnData = response.data.response;
        setBillData(null);
        setAmount("");
        setPaymentSlip(txnData); // ✅ store for rendering below
        showToast("Payment successful!", "success");
        console.log("🧾 Payment Slip Data:", txnData);
      } else {
        showToast(error?.message || "Payment failed", "error");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      showToast(err.message || "Payment failed", "error");
    } finally {
      setProcessingPayment(false);
    }
  };

  // ✅ Loader While Fetching
  if (detailsLoading)
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress size={40} />
        <Typography mt={2} variant="body1" color="text.secondary">
          Loading biller details...
        </Typography>
      </Box>
    );

  if (!billerDetails)
    return (
      <Typography mt={4} textAlign="center" color="text.secondary">
        No biller details loaded yet.
      </Typography>
    );

  return (
    <Box maxWidth="1200px" mx="auto" px={{ xs: 1.5, sm: 3 }} py={{ xs: 2 }}>
      {/* Back Button */}
      <Box display="flex" alignItems="center" mb={1} gap={2}>
        <IconButton
          onClick={onBack}
          sx={{ bgcolor: "#f3f4f6", "&:hover": { bgcolor: "#e5e7eb" } }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 16px rgba(178,176,176,0.08)",
          background: "linear-gradient(135deg, #fefefe 0%, #f4f8f8 100%)",
          border: "1px solid #e2e8f0",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ p: 2, borderRadius: "8px", background: "#f2efff" }}
          >
            {billerImage && (
              <Box
                component="img"
                src={billerImage}
                alt={billerDetails?.billerName || "Biller"}
                sx={{
                  width: 55,
                  height: 55,
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            )}
            <Typography
              variant="h5"
              fontWeight="bold"
              color="#000"
              sx={{ fontSize: { xs: "1.1rem", sm: "1.3rem" } }}
            >
              {billerDetails?.billerName || "Biller Details"}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Input Fields */}
          <Box display="flex" flexDirection="column" gap={2}>
            {billerDetails?.parameters?.map((param, index) => {
              const isFirstParam = index === 0; // ✅ First parameter special handling
              return (
                <TextField
                  key={index}
                  label={
                    isFirstParam
                      ? "CA Number"
                      : param.display_name || param.name
                  }
                  placeholder={isFirstParam ? "Enter CA Number" : param.name}
                  required={param.isMandatory === "Y"}
                  value={inputValues[param.name] || ""}
                  onChange={(e) =>
                    handleInputChange(param.name, e.target.value)
                  }
                  fullWidth
                />
              );
            })}
            ``
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 4,
              borderRadius: 2,
              py: 1.3,
              fontWeight: "bold",
              background: "#fff",
              color: "#6C4BC7",
              boxShadow: "0 4px 12px rgba(79,70,229,0.25)",
              "&:hover": { background: "#6C4BC7", color: "#fff" },
            }}
            onClick={handleSubmit}
            disabled={fetchingBill}
          >
            {fetchingBill ? "Fetching Bill..." : "Fetch Bill"}
          </Button>

          {/* Bill Data Section */}
          {billData && (
            <Box mt={4}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Bill Details
              </Typography>
              <Typography>
                Customer Name: {billData?.CustomerName || "-"}
              </Typography>
              <Typography>
                Bill Number: {billData?.BillNumber || "-"}
              </Typography>
              <Typography>Bill Date: {billData?.BillDate || "-"}</Typography>
              <Typography>
                Bill Due Date: {billData?.BillDueDate || "-"}
              </Typography>

              {/* Editable Amount Field */}
              <TextField
                label="Amount to Pay"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                fullWidth
                sx={{ mt: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  py: 1.3,
                  fontWeight: "bold",
                  background: "#6C4BC7",
                  color: "#fff",
                  "&:hover": { background: "#5b3db0" },
                }}
                onClick={handlePayBill}
                disabled={processingPayment}
              >
                {processingPayment ? "Processing..." : "Pay Bill"}
              </Button>
            </Box>
          )}
          {paymentSlip && (
            <Box
              mt={4}
              p={3}
              borderRadius={3}
              sx={{
                background: "linear-gradient(145deg, #f9fafb, #ffffff)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="#4a4a4a" mb={2}>
                Payment Slip
              </Typography>

              <Typography>
                <strong>Message:</strong> {paymentSlip?.message || "-"}
              </Typography>
              <Typography>
                <strong>Customer Name:</strong>{" "}
                {paymentSlip?.data?.beneficiaryName || "-"}
              </Typography>
              <Typography>
                <strong>Mobile Number:</strong>{" "}
                {paymentSlip?.data?.mobileNumber || "-"}
              </Typography>
              <Typography>
                <strong>Account No:</strong>{" "}
                {inputValues?.[Object.keys(inputValues)[0]] || "-"}
              </Typography>

              <Typography>
                <strong>Client ID:</strong>{" "}
                {paymentSlip?.data?.client_id || "-"}
              </Typography>
              <Typography>
                <strong>Amount:</strong> ₹
                {paymentSlip?.data?.transferAmount || "-"}
              </Typography>

              <Button
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  py: 1,
                  background: "#6C4BC7",
                  color: "#fff",
                  "&:hover": { background: "#5b3db0" },
                }}
                onClick={() => setPaymentSlip(null)}
              >
                Done
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* ✅ MPIN Modal */}
      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        mPinCallBack={handleConfirmPayment}
        title="Enter MPIN to Confirm Payment"
      />
    </Box>
  );
};

export default PartPaymentNew;
