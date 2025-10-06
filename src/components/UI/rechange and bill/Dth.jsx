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
import { apiCall } from "../../../api/apiClient";
import ApiEndpoints from "../../../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../../../utils/ToastUtil";
import AuthContext from "../../../contexts/AuthContext";
import operatorImages from "../../../assets/operators";
import ResetMpin from "../../common/ResetMpin";
import { useToast } from "../../../utils/ToastContext";
import CommonLoader from "../../common/CommonLoader";

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
  const { location } = useContext(AuthContext);
  const [resetMpinModalOpen, setResetMpinModalOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  const username = `TRANS${authCtx?.user?.id}`;
  const loadUserProfile = authCtx.loadUserProfile;
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

  useEffect(() => {
    fetchServices();
  }, []);

  const selectService = (service) => {
    setSelectedService(service);
    setCustomerId("");
    setManualAmount("");
  };

  const handleRecharge = async () => {
    if (!customerId) return apiErrorToast("Please enter Customer ID");
    if (!mobileNumber || mobileNumber.length !== 10)
      return apiErrorToast("Please enter valid 10-digit Mobile Number");
    if (!manualAmount || parseFloat(manualAmount) <= 0)
      return apiErrorToast("Please enter a valid amount");
    if (!MpinCallBackVal || MpinCallBackVal.length !== 6)
      return apiErrorToast("Please enter your 6-digit MPIN");
    if (!location?.lat || !location?.long)
      return apiErrorToast("Location not available, please enable GPS.");
    setLoading(true);
    const payload = {
      customer_id: customerId,
      mobile_number: mobileNumber,
      operator: selectedService?.id,
      amount: parseFloat(manualAmount),
      latitude: location?.lat,
      longitude: location?.long,
      mpin: Number(MpinCallBackVal),
    };

    const { error } = await apiCall("post", ApiEndpoints.RECHARGE, payload);
    setLoading(false);

    if (error) return showToast(error?.message, "error");
    loadUserProfile();
    okSuccessToast(`Recharge successful for ${customerId}`);
    setStep(4);
  };

  // if (loading) {
  //   return (
  //     <Box
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //       minHeight="60vh"
  //     >
  //       <Box textAlign="center">
  //         <CircularProgress size={60} thickness={4} />
  //         <Typography variant="h6" sx={{ mt: 2 }}>
  //           Loading DTH Services...
  //         </Typography>
  //       </Box>
  //     </Box>
  //   );
  // }

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
                  label="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setMobileNumber(val);
                  }}
                  inputProps={{ maxLength: 10 }}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">📱</InputAdornment>
                    ),
                  }}
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
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                    inputProps: { min: 1 },
                  }}
                  sx={{ mb: 3 }}
                />
                {mobileNumber.length === 10 && (
                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    {/* Instruction text */}
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, fontWeight: 500, color: "gray" }}
                    >
                      Enter 6-digit MPIN
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        mb: 1.5,
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
                            newMpin[index] = val; // allow "" too
                            setMpinCallBackVal(newMpin.join(""));

                            if (val && index < 5) {
                              // move to next if digit entered
                              const next = document.getElementById(
                                `mpin-${index + 1}`
                              );
                              if (next) next.focus();
                            } else if (!val && index > 0) {
                              // move back if deleted
                              const prev = document.getElementById(
                                `mpin-${index - 1}`
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
                                `mpin-${index - 1}`
                              );
                              if (prev) prev.focus();
                            }
                          }}
                          id={`mpin-${index}`}
                        />
                      ))}
                    </Box>
                    {/* <Box
                      sx={{ display: "flex", justifyContent: "center", ml: 32 }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ fontSize: "11px" }}
                        onClick={() => setResetMpinModalOpen(true)}
                      >
                        Reset MPIN
                      </Button>
                    </Box>
                    {resetMpinModalOpen && (
                      <ResetMpin
                        open={resetMpinModalOpen}
                        onClose={() => setResetMpinModalOpen(false)}
                        username={username}
                      />
                    )} */}
                  </Box>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: "#6C4BC7" }}
                  onClick={handleRecharge}
                >
                  Pay ₹{manualAmount || 0}
                </Button>
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
              sx={{ backgroundColor: "#6C4BC7" }}
              onClick={() => {
                setSelectedService(services[0] || null); // default first service
                setCustomerId("");
                setManualAmount("");
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
