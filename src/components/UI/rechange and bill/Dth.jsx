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
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import OTPInput from "react-otp-input"; // ✅ Import OTPInput
import { apiCall } from "../../../api/apiClient";
import ApiEndpoints from "../../../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../../../utils/ToastUtil";
import AuthContext from "../../../contexts/AuthContext";
import operatorImages from "../../../assets/operators";

const Dth = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [step, setStep] = useState(2);
  const [MpinCallBackVal, setMpinCallBackVal] = useState("");

  const { location } = useContext(AuthContext);

  // Fetch DTH services
  const fetchServices = async () => {
    setLoading(true);
    const { error, response } = await apiCall("post", ApiEndpoints.GET_SERVICES, {
      sub_type: "dth",
    });
    setLoading(false);
    if (error) return apiErrorToast(error);

    const fetchedServices = response?.data || [];
    setServices(fetchedServices);

    if (fetchedServices.length > 0) {
      setSelectedService(fetchedServices[0]);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const selectService = (service) => {
    setSelectedService(service);
    setCustomerId("");
    setManualAmount("");
    setMpinCallBackVal("");
  };

  const handleRecharge = async () => {
    if (!customerId) return apiErrorToast("Please enter Customer ID");
    if (!manualAmount || parseFloat(manualAmount) <= 0)
      return apiErrorToast("Please enter a valid amount");
    if (MpinCallBackVal.length < 6)
      return apiErrorToast("Please enter a valid 6-digit MPIN");
    if (!location?.lat || !location?.long)
      return apiErrorToast("Location not available, please enable GPS.");

    const payload = {
      customer_id: customerId,
      operator: selectedService?.id,
      amount: parseFloat(manualAmount),
      mpin: MpinCallBackVal, // send MPIN in payload
      latitude: location?.lat,
      longitude: location?.long,
    };

    const { error } = await apiCall("post", ApiEndpoints.RECHARGE, payload);
    if (error) return apiErrorToast(error.message);

    okSuccessToast(`Recharge successful for ${customerId}`);
    setStep(4);

    setTimeout(() => {
      setSelectedService(services[0] || null);
      setCustomerId("");
      setManualAmount("");
      setMpinCallBackVal("");
      setStep(2);
    }, 3000);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading DTH Services...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Check if MPIN is fully entered
  const isMpinComplete = MpinCallBackVal.length === 6;

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
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
                          selectedService?.id === service.id ? "#ebeef2" : "background.paper",
                        color: selectedService?.id === service.id ? "#2275b7" : "text.secondary",
                        border: "1px solid",
                        borderColor:
                          selectedService?.id === service.id ? "#2275b7" : "divider",
                        "&:hover": {
                          backgroundColor: "#ebeef2",
                          color: "#2275b7",
                          borderColor: "#2275b7",
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
                                backgroundColor: "#2275b7",
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
                          color: selectedService?.id === service.id ? "#2275b7" : "#6e82a5",
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
                <Typography variant="h5" textAlign="center" fontWeight="bold" mb={2}>
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
                  type="number"
                  value={manualAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*\.?\d*$/.test(val)) setManualAmount(val);
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    inputProps: { min: 1 },
                  }}
                  sx={{ mb: 2 }}
                />

                {/* MPIN boxes: show only if amount is filled */}
                {manualAmount && (
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <OTPInput
                      value={MpinCallBackVal}
                      onChange={setMpinCallBackVal}
                      numInputs={6} // 6 digits for MPIN
                      inputType="password"
                      renderInput={(props) => <input {...props} />}
                      inputStyle={{
                        width: 40,
                        height: 40,
                        margin: "0 5px",
                        fontSize: 20,
                        border: "1px solid #D0D5DD",
                        borderRadius: 6,
                        textAlign: "center",
                      }}
                    />
                  </Box>
                )}

                {/* Pay button */}
                {manualAmount && (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ backgroundColor: "#2275b7" }}
                    onClick={handleRecharge}
                    disabled={!isMpinComplete}
                  >
                    Pay ₹{manualAmount || 0}
                  </Button>
                )}
              </Paper>
            </Box>
          </Box>
        </Slide>
      )}

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
              sx={{ backgroundColor: "#2275b7" }}
              onClick={() => {
                setSelectedService(services[0] || null);
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
