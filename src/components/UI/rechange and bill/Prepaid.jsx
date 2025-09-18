import { useContext, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  TextField,
  MenuItem,
  Button,
  Avatar,
  Paper,
  Container,
  InputAdornment,
  Divider,
  Chip,
  Fade,
  Slide,
} from "@mui/material";
import {
  LocalAtm,
  PhoneIphone,
  Payments,
  SimCard,
  CheckCircle,
  ArrowBack,
} from "@mui/icons-material";
import { apiCall } from "../../../api/apiClient";
import ApiEndpoints from "../../../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../../../utils/ToastUtil";
import AuthContext from "../../../contexts/AuthContext";
import operatorImages from "../../../assets/operators";

const Prepaid = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [step, setStep] = useState(1); // 1: operator, 2: plans, 3: confirm, 4: success

  const { location } = useContext(AuthContext);

  // Fetch available operators
  const fetchServices = async () => {
    setLoading(true);
    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.GET_SERVICES,
      { sub_type: "prepaid" }
    );
    setLoading(false);

    if (error) return apiErrorToast(error);

    setServices(response?.data || []);
  };

  // Fetch plans for selected operator
  const fetchPlans = async (service) => {
    const operator = service.name.split(" ")[0];
    setPlansLoading(true);
    setSelectedService(service);
    setPlans([]);
    setStep(2);

    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.GET_PLANS_BY_OPERATOR,
      { operator }
    );
    setPlansLoading(false);

    if (error) return apiErrorToast(error);

    setPlans(response?.data || []);
  };

  // Handle recharge action
  const handleRecharge = async () => {
    if (!selectedPlan || !mobileNumber)
      return apiErrorToast("Please select a plan and enter mobile number");

    const payload = {
      mobile_number: mobileNumber,
      operator: selectedPlan.id,
      amount: selectedPlan.price,
      latitude: location?.lat || "",
      longitude: location?.long || "",
    };

    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.RECHARGE,
      payload
    );
    if (error) return apiErrorToast(error?.message);

    okSuccessToast(`Recharge successful for ${mobileNumber}`);
    setStep(4); // Success step

    setTimeout(() => {
      setSelectedService(null);
      setPlans([]);
      setSelectedPlan(null);
      setMobileNumber("");
      setManualAmount("");
      setStep(1);
    }, 3000);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading Operators...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", px: 2, py: 2 }}>
      {/* Step Indicator */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            maxWidth: 500,
            width: "100%",
          }}
        >
          {[1, 2, 3].map((s, i) => (
            <Box
              key={s}
              sx={{ display: "flex", alignItems: "center", flex: 1 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: step >= s ? "primary.main" : "grey.300",
                  color: step >= s ? "white" : "grey.500",
                  fontWeight: "bold",
                  zIndex: 2,
                  position: "relative",
                }}
              >
                {s}
              </Box>
              {i < 2 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 3,
                    backgroundColor: step > s ? "primary.main" : "grey.300",
                    ml: -1,
                    mr: -1,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Step 1: Operator Selection */}
      {step === 1 && (
        <Slide direction="right" in mountOnEnter unmountOnExit>
          <Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}
            >
              Choose Your Operator
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {services.map((service) => (
                <Grid item xs={6} sm={4} md={3} key={service.id}>
                  <Box
                    onClick={() => fetchPlans(service)}
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  >
                    <Avatar
                      src={operatorImages[service.code]}
                      alt={service.name}
                      sx={{
                        width: 80,
                        height: 80,
                        mx: "auto",
                        mb: 1,
                        border:
                          selectedService?.id === service.id
                            ? "3px solid #1976d2"
                            : "3px solid transparent",
                        boxShadow:
                          selectedService?.id === service.id
                            ? 4
                            : "0px 2px 4px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color:
                          selectedService?.id === service.id
                            ? "#1976d2"
                            : "#2c3e50",
                        mt: 1,
                      }}
                    >
                      {service.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Slide>
      )}

      {/* Step 2: Plan Selection */}
      {step === 2 && (
        <Slide direction="left" in mountOnEnter unmountOnExit>
          <Box>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => setStep(1)}
              sx={{ mb: 2 }}
            >
              Back to Operators
            </Button>
            <Grid container spacing={3}>
              {/* Operators Panel */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    height: "100%",
                    position: { md: "sticky" },
                    top: { md: 80 },
                    maxHeight: { md: "80vh" },
                    overflowY: "auto",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    Select Operator
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {services.map((service) => (
                      <Box
                        key={service.id}
                        onClick={() => fetchPlans(service)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          p: 1.5,
                          borderRadius: 2,
                          border:
                            selectedService?.id === service.id
                              ? "2px solid"
                              : "1px solid",
                          borderColor:
                            selectedService?.id === service.id
                              ? "primary.main"
                              : "divider",
                          backgroundColor:
                            selectedService?.id === service.id
                              ? "primary.light"
                              : "background.paper",
                          transition: "all 0.3s",
                          "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        <Avatar
                          src={operatorImages[service.code]}
                          alt={service.name}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <Typography variant="body1" fontWeight={600}>
                          {service.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Plans Panel */}
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={operatorImages[selectedService?.code]}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedService?.name} Prepaid Plans
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Choose from available plans or enter custom amount
                    </Typography>
                  </Box>
                </Paper>

                {plansLoading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="300px"
                  >
                    <CircularProgress size={40} />
                  </Box>
                ) : (
                  <>
                    {/* Plans Grid */}
                    <Grid container spacing={2}>
                      {plans.map((plan) => (
                        <Grid item xs={12} sm={6} md={4} key={plan.id}>
                          <Card
                            onClick={() => {
                              setSelectedPlan(plan);
                              setStep(3);
                            }}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              cursor: "pointer",
                              minHeight: 100,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              border:
                                selectedPlan?.id === plan.id
                                  ? "2px solid"
                                  : "1px solid",
                              borderColor:
                                selectedPlan?.id === plan.id
                                  ? "primary.main"
                                  : "divider",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 4,
                                borderColor: "primary.main",
                              },
                            }}
                          >
                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  mb: 1,
                                }}
                              >
                                <Typography variant="h5" fontWeight="700">
                                  ₹{plan.price}
                                </Typography>
                                {selectedPlan?.id === plan.id && (
                                  <CheckCircle fontSize="small" />
                                )}
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  mb: 1,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {plan.name}
                              </Typography>
                            </Box>
                            {plan.validity && (
                              <Chip
                                label={`Validity: ${plan.validity}`}
                                size="small"
                                sx={{ alignSelf: "flex-start" }}
                              />
                            )}
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Custom Amount */}
                    <Divider sx={{ my: 4 }}>
                      <Chip label="OR" />
                    </Divider>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        border: "1px dashed",
                        borderColor: "divider",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Enter Custom Amount
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        <TextField
                          label="Amount"
                          type="number"
                          value={manualAmount}
                          onChange={(e) => setManualAmount(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                          }}
                          sx={{ width: 160 }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (!manualAmount)
                              return apiErrorToast("Please enter an amount");
                            setSelectedPlan({
                              id: "custom",
                              name: "Custom Amount",
                              price: manualAmount,
                            });
                            setStep(3);
                          }}
                          disabled={!manualAmount}
                        >
                          Continue
                        </Button>
                      </Box>
                    </Paper>

                    {plans.length === 0 && (
                      <Paper sx={{ p: 4, mt: 3, textAlign: "center" }}>
                        <Payments
                          sx={{ fontSize: 50, mb: 1 }}
                          color="disabled"
                        />
                        <Typography variant="h6">No plans available</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sorry, no plans found for {selectedService?.name}.
                        </Typography>
                      </Paper>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        </Slide>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && selectedPlan && (
        <Fade in>
          <Box sx={{ maxWidth: 500, mx: "auto" }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ mb: 3, textAlign: "center" }}
            >
              Confirm Recharge
            </Typography>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  src={operatorImages[selectedService?.code]}
                  sx={{ width: 50, height: 50, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">{selectedService?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prepaid Mobile
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Plan Details
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">{selectedPlan.name}</Typography>
                  <Typography variant="h6" color="primary.main">
                    ₹{selectedPlan.price}
                  </Typography>
                </Box>
                {selectedPlan.validity && (
                  <Typography variant="body2" color="text.secondary">
                    Validity: {selectedPlan.validity}
                  </Typography>
                )}
              </Box>

              <TextField
                fullWidth
                label="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                type="tel"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIphone />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setStep(2)}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleRecharge}
                  sx={{ py: 1.5, borderRadius: 2 }}
                  startIcon={<LocalAtm />}
                >
                  Pay ₹{selectedPlan.price}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <Fade in>
          <Box sx={{ textAlign: "center", maxWidth: 500, mx: "auto", py: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom color="success.main">
              Recharge Successful!
            </Typography>
            <Typography variant="h6" gutterBottom>
              ₹{selectedPlan?.price} recharge for {mobileNumber}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your mobile number has been recharged successfully. The amount
              will be credited shortly.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 4 }}
              onClick={() => {
                setSelectedService(null);
                setPlans([]);
                setSelectedPlan(null);
                setMobileNumber("");
                setManualAmount("");
                setStep(1);
              }}
              startIcon={<SimCard />}
            >
              New Recharge
            </Button>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default Prepaid;
