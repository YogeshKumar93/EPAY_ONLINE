import { useContext, useEffect, useState } from "react";
import {
  Box,
  Container,
  Avatar,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  InputAdornment,
  Fade,
  Slide,
  Modal,
  Backdrop,
} from "@mui/material";
import { CheckCircle, Close } from "@mui/icons-material";
import { apiCall } from "../../../api/apiClient";
import ApiEndpoints from "../../../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../../../utils/ToastUtil";
import AuthContext from "../../../contexts/AuthContext";
import operatorImages from "../../../assets/operators";
import ResetMpin from "../../common/ResetMpin";
import { useToast } from "../../../utils/ToastContext";
import CommonLoader from "../../common/CommonLoader";
import { convertNumberToWordsIndian } from "../../../utils/NumberUtil";

const Dth = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [step, setStep] = useState(2);
  const { showToast } = useToast();
  const [MpinCallBackVal, setMpinCallBackVal] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const { location, getUuid } = useContext(AuthContext);
  const [resetMpinModalOpen, setResetMpinModalOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  const username = `TRANS${authCtx?.user?.id}`;
  const loadUserProfile = authCtx.loadUserProfile;
  const [uuidRef, setUuidRef] = useState("");
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const [generatingUuid, setGeneratingUuid] = useState(false);

  // Fetch DTH services
  const fetchServices = async () => {
    setLoading(true);
    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.GET_SERVICES,
      {
        sub_type: "dth",
      }
    );
    setLoading(false);
    if (error) return apiErrorToast(error);

    const fetchedServices = response?.data || [];
    setServices(fetchedServices);

    // Set first service as default
    if (fetchedServices.length > 0) {
      setSelectedService(fetchedServices[0]);
    }
  };

  const amountInWords = manualAmount
    ? `${convertNumberToWordsIndian(manualAmount).replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )} Only`
    : "";

  useEffect(() => {
    fetchServices();
  }, []);

  const selectService = (service) => {
    setSelectedService(service);
    setCustomerId("");
    setManualAmount("");
  };

  // Handle opening MPIN modal
  const handleOpenMpinModal = async () => {
    if (!customerId) return apiErrorToast("Please enter Customer ID");
    if (!manualAmount || parseFloat(manualAmount) <= 0)
      return apiErrorToast("Please enter a valid amount");

    setGeneratingUuid(true);

    // Generate UUID before opening modal
    const { error: uuidError, response: uuidNumber } = await getUuid();

    setGeneratingUuid(false);

    if (uuidError || !uuidNumber) {
      showToast(
        uuidError?.message || "Failed to generate transaction ID",
        "error"
      );
      return;
    }

    // Save UUID and open MPIN modal
    setUuidRef(uuidNumber);
    setMpinModalOpen(true);
  };

  const handleRecharge = async () => {
    if (!MpinCallBackVal || MpinCallBackVal.length !== 6)
      return apiErrorToast("Please enter your 6-digit MPIN");
    if (!location?.lat || !location?.long)
      return apiErrorToast("Location not available, please enable GPS.");

    setLoading(true);
    const payload = {
      number: customerId,
      operator: selectedService?.id,
      amount: parseFloat(manualAmount),
      latitude: location?.lat || "",
      longitude: location?.long || "",
      mpin: Number(MpinCallBackVal),
      client_ref: uuidRef,
    };

    const { error } = await apiCall("post", ApiEndpoints.RECHARGE, payload);
    setLoading(false);

    if (error) {
      showToast([error?.message, error?.errors?.response?.data], "error");
      setMpinModalOpen(false); // CLOSE MPIN MODAL ON ERROR
      setLoading(false);
      setMpinCallBackVal("");
      return;
    }
    loadUserProfile();
    okSuccessToast(`Recharge successful for ${customerId}`);
    setStep(4);
    setMpinModalOpen(false); // Close MPIN modal after success
  };

  // Reset MPIN fields when modal closes
  const handleCloseMpinModal = () => {
    setMpinModalOpen(false);
    setMpinCallBackVal("");
  };

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
      <CommonLoader loading={loading} />
      {step === 2 && (
        <Slide direction="right" in mountOnEnter unmountOnExit>
          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Left: DTH Services */}
            <Box sx={{ flex: "0 0 30%" }}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Select DTH Service
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {services.map((service) => (
                    <Box
                      key={service.id}
                      onClick={() => selectService(service)}
                      sx={{
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "6px",
                        cursor: "pointer",
                        position: "relative",
                        mb: 1.2,
                        backgroundColor:
                          selectedService?.id === service.id
                            ? "#ebeef2"
                            : "background.paper",
                        color:
                          selectedService?.id === service.id
                            ? "#6C4BC7"
                            : "text.secondary",
                        border: "1px solid",
                        borderColor:
                          selectedService?.id === service.id
                            ? "#6C4BC7"
                            : "divider",
                        "&:hover": {
                          backgroundColor: "#ebeef2",
                          color: "#6C4BC7",
                          borderColor: "#6C4BC7",
                        },
                        "&::before":
                          selectedService?.id === service.id
                            ? {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: 0,
                                height: "100%",
                                width: "4px",
                                backgroundColor: "#6C4BC7",
                              }
                            : {},
                      }}
                    >
                      <Avatar
                        src={operatorImages[service.code] || ""}
                        sx={{ width: 50, height: 50, mr: 2 }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "DM Sans, sans-serif",
                          fontWeight: 550,
                          fontSize: "15px",
                          color:
                            selectedService?.id === service.id
                              ? "#6C4BC7"
                              : "#6e82a5",
                        }}
                      >
                        {service.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>

            {/* Right: Confirm Recharge */}
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography
                  variant="h5"
                  textAlign="center"
                  fontWeight="bold"
                  mb={2}
                >
                  Confirm Recharge
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#ebeef2",
                  }}
                >
                  <Avatar
                    src={operatorImages[selectedService?.code] || ""}
                    sx={{ width: 50, height: 50 }}
                  />
                  <Typography variant="h6">{selectedService?.name}</Typography>
                </Paper>
                <TextField
                  fullWidth
                  label="Customer ID"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Amount"
                  type="text"
                  value={manualAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*\.?\d*$/.test(val)) {
                      setManualAmount(val);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                    inputProps: { min: 1 },
                  }}
                  sx={{ mb: 0.8 }}
                />
                {manualAmount && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#555",
                      fontWeight: 500,
                    }}
                  >
                    {amountInWords}
                  </Typography>
                )}

                {/* Pay Button - Opens MPIN Modal */}
                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleOpenMpinModal}
                    disabled={generatingUuid || !customerId || !manualAmount}
                    sx={{
                      backgroundColor: "#6C4BC7",
                      borderRadius: 2,
                      fontWeight: "bold",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      px: 4,
                      py: 1.5,
                      width: "100%",
                    }}
                  >
                    {generatingUuid ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      `Pay ₹${manualAmount || 0}`
                    )}
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Slide>
      )}

      {/* MPIN Modal */}
      <Modal
        open={mpinModalOpen}
        onClose={handleCloseMpinModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={mpinModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            {/* Modal Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Enter MPIN
              </Typography>
              <Button
                onClick={handleCloseMpinModal}
                sx={{ minWidth: "auto", p: 0.5 }}
              >
                <Close />
              </Button>
            </Box>

            {/* Transaction Details */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Transaction Details
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Amount:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  ₹{manualAmount}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Customer ID:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {customerId}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Operator:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {selectedService?.name}
                </Typography>
              </Box>
            </Paper>

            {/* MPIN Input */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                variant="body2"
                sx={{ mb: 2, fontWeight: 500, color: "gray" }}
              >
                Enter 6-digit MPIN
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <TextField
                    key={index}
                    type="password"
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: "center",
                        fontSize: 24,
                        width: 35,
                        padding: 8,
                      },
                    }}
                    value={MpinCallBackVal[index] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");

                      let newMpin = MpinCallBackVal.split("");
                      newMpin[index] = val; // can be "" too
                      setMpinCallBackVal(newMpin.join(""));

                      if (val && index < 5) {
                        // move to next input if digit entered
                        const next = document.getElementById(
                          `mpin-modal-${index + 1}`
                        );
                        if (next) next.focus();
                      } else if (!val && index > 0) {
                        // move back if deleted
                        const prev = document.getElementById(
                          `mpin-modal-${index - 1}`
                        );
                        if (prev) prev.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" &&
                        !MpinCallBackVal[index] &&
                        index > 0
                      ) {
                        // move back if empty and backspace pressed
                        const prev = document.getElementById(
                          `mpin-modal-${index - 1}`
                        );
                        if (prev) prev.focus();
                      }
                    }}
                    id={`mpin-modal-${index}`}
                  />
                ))}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box display="flex" gap={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCloseMpinModal}
                sx={{
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleRecharge}
                disabled={MpinCallBackVal.length !== 6}
                sx={{
                  borderRadius: 2,
                  fontWeight: "bold",
                  backgroundColor: "#6C4BC7",
                  "&:hover": {
                    backgroundColor: "#5a3aa9",
                  },
                }}
              >
                Confirm Payment
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Step 4: Success */}
      {step === 4 && (
        <Fade in>
          <Box textAlign="center" maxWidth={500} mx="auto" py={4}>
            <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
            <Typography variant="h4" color="success.main" gutterBottom>
              Recharge Successful!
            </Typography>
            <Typography variant="h6">
              ₹{manualAmount} recharge for {customerId}
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#6C4BC7" }}
              onClick={() => {
                setSelectedService(services[0] || null); // default first service
                setCustomerId("");
                setManualAmount("");
                setMpinCallBackVal("");
                setStep(2);
              }}
            >
              New Recharge
            </Button>
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default Dth;
