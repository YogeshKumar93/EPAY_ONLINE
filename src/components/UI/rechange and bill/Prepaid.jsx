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
  const [step, setStep] = useState(2); // start directly at plans step

  const { location } = useContext(AuthContext);

  // Fetch services and auto-select first operator
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_SERVICES,
        { sub_type: "prepaid" }
      );
      setLoading(false);

      if (error) return apiErrorToast(error);

      const operators = response?.data || [];
      setServices(operators);

      if (operators.length > 0) {
        const firstOperator = operators[0];
        setSelectedService(firstOperator);
        fetchPlans(firstOperator);
      }
    };

    fetchInitial();
  }, []);

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
    if (!location?.lat || !location?.long) {
      return apiErrorToast("Location not available, please enable GPS.");
    }

    const payload = {
      mobile_number: mobileNumber,
      operator: selectedService?.id,
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
      setStep(2); // back to plans with first operator reset
    }, 3000);
  };

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
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Step 2 - Operators & Plans */}
      {step === 2 && (
        <Slide direction="right" in mountOnEnter unmountOnExit>
          <Box>
            <Box sx={{ display: "flex", gap: 3 }}>
              {/* Left side - Operators */}
              <Box sx={{ flex: "0 0 30%" }}>
                <Paper sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
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
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          borderRadius: 2,
                          cursor: "pointer",
                          border:
                            selectedService?.id === service.id
                              ? "2px solid #9D72F0"
                              : "1px solid #e0e0e0",
                          backgroundColor:
                            selectedService?.id === service.id
                              ? "#f3f0ff"
                              : "background.paper",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "#f0ebff",
                          },
                        }}
                      >
                        <Avatar
                          src={operatorImages[service.code]}
                          sx={{
                            mr: 2,
                            border:
                              selectedService?.id === service.id
                                ? "2px solid #9D72F0"
                                : "none",
                          }}
                        />
                        <Typography
                          sx={{
                            color:
                              selectedService?.id === service.id
                                ? "#6c4bc7"
                                : "#333",
                            fontWeight:
                              selectedService?.id === service.id
                                ? "600"
                                : "500",
                          }}
                        >
                          {service.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>

              {/* Right side - Plans */}
              <Box sx={{ flex: 1 }}>
                {selectedService ? (
                  <Box>
                    {/* Operator header */}
                    <Paper
                      sx={{
                        p: 2,
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        src={operatorImages[selectedService?.code]}
                        sx={{ width: 50, height: 50, mr: 2 }}
                      />
                      <Box sx={{ height: 22 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {selectedService?.name} Prepaid Plans
                        </Typography>
                        {/* <Typography variant="body2" color="text.secondary">
                          Choose from available plans or enter custom amount
                        </Typography> */}
                      </Box>
                    </Paper>

                    {/* Plans grid */}
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
                              border:
                                selectedPlan?.id === plan.id
                                  ? "2px solid"
                                  : "1px solid",
                              borderColor:
                                selectedPlan?.id === plan.id
                                  ? "#9D72F0"
                                  : "divider",
                            }}
                          >
                            <Typography variant="h5" fontWeight="700">
                              ₹{plan.price}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {plan.name}
                            </Typography>
                            {plan.validity && (
                              <Chip
                                label={`Validity: ${plan.validity}`}
                                size="small"
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
                      sx={{
                        p: 3,
                        textAlign: "center",
                        border: "1px dashed",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
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
                          sx={{
                            borderRadius: 2,
                            fontWeight: "bold",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            background: "#fff",
                            color: "#6c4bc7",
                            // boxShadow: "0 4px 12px rgba(79,70,229,0.25)",
                            "&:hover": {
                              background: " #2563eb)",
                            },
                          }}
                          onClick={() => {
                            if (!manualAmount)
                              return apiErrorToast("Please enter amount");
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
                  </Box>
                ) : (
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: "center",
                      color: "text.secondary",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6">
                      Please select an operator from the left
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Box>
          </Box>
        </Slide>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <Fade in>
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Left box - operators */}
            <Box sx={{ flex: "0 0 30%" }}>
              <Paper sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Select Operator
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {services.map((service) => (
                    <Box
                      key={service.id}
                      onClick={() => fetchPlans(service)}
                      sx={{
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 2,
                        cursor: "pointer",
                        border:
                          selectedService?.id === service.id
                            ? "2px solid #9D72F0"
                            : "1px solid #e0e0e0",
                        backgroundColor:
                          selectedService?.id === service.id
                            ? "#f3f0ff"
                            : "background.paper",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#f0ebff",
                        },
                      }}
                    >
                      <Avatar
                        src={operatorImages[service.code]}
                        sx={{
                          mr: 2,
                          border:
                            selectedService?.id === service.id
                              ? "2px solid #9D72F0"
                              : "none",
                        }}
                      />
                      <Typography
                        sx={{
                          color:
                            selectedService?.id === service.id
                              ? "#6c4bc7"
                              : "#333",
                          fontWeight:
                            selectedService?.id === service.id ? "600" : "500",
                        }}
                      >
                        {service.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>

            {/* Right box - confirm recharge */}
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  textAlign="center"
                  mb={1}
                >
                  Confirm Recharge
                </Typography>
                {/* Operator info */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{ p: 2, borderRadius: "8px", background: "#fff" }}
                >
                  <Avatar
                    src={operatorImages[selectedService?.code]}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">
                      {selectedService?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prepaid Mobile
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Plan details */}
                <Box mb={3}>
                  <Typography variant="body2" color="text.secondary">
                    Plan Details
                  </Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">{selectedPlan?.name}</Typography>
                    <Typography variant="h6" color="#9D72F0">
                      ₹{selectedPlan?.price}
                    </Typography>
                  </Box>
                  {selectedPlan?.validity && (
                    <Typography variant="body2" color="text.secondary">
                      Validity: {selectedPlan.validity}
                    </Typography>
                  )}
                </Box>

                {/* Mobile input */}
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => {
                    // Only allow digits 0-9
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setMobileNumber(val);
                  }}
                  inputProps={{ maxLength: 10 }} // optional: max 10 digits
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphone />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Buttons */}
                <Box display="flex" gap={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      fontWeight: "bold",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      background: "#fff",
                      color: "#6c4bc7",
                      // boxShadow: "0 4px 12px rgba(79,70,229,0.25)",
                      "&:hover": {
                        background: " #2563eb)",
                      },
                    }}
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleRecharge}
                    sx={{
                      borderRadius: 2,
                      fontWeight: "bold",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      background: "#fff",
                      color: "#6c4bc7",
                      // boxShadow: "0 4px 12px rgba(79,70,229,0.25)",
                      "&:hover": {
                        background: " #2563eb)",
                      },
                    }}
                  >
                    Pay ₹{selectedPlan?.price}
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Fade>
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
              ₹{selectedPlan?.price} recharge for {mobileNumber}
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Your mobile number has been recharged successfully. Amount will be
              credited shortly.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedService(null);
                setPlans([]);
                setSelectedPlan(null);
                setMobileNumber("");
                setManualAmount("");
                setStep(2); // back to plans
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

export default Prepaid;
