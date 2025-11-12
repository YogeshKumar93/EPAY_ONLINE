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
import CommonLoader from "../../common/CommonLoader";
import { useToast } from "../../../utils/ToastContext";
import ResetMpin from "../../common/ResetMpin";
import { Logo } from "../../../iconsImports";
import { convertNumberToWordsIndian } from "../../../utils/NumberUtil";

// import { useToast } from "../utils/ToastContext";

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
  const [MpinCallBackVal, setMpinCallBackVal] = useState("");
  const { location } = useContext(AuthContext);
  const { showToast } = useToast();
  const [resetMpinModalOpen, setResetMpinModalOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  const username = `P2PAE${authCtx?.user?.id}`;
  const loadUserProfile = authCtx.loadUserProfile;
  const [rechargeResponse, setRechargeResponse] = useState(null);
  const [w1Limit, setW1Limit] = useState(null); // store max allowed amount

  const amountInWords = manualAmount
    ? `${convertNumberToWordsIndian(manualAmount).replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )} Only`
    : "";

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
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await authCtx.loadUserProfile();
        if (user?.w1) setW1Limit(user.w1 / 100); // convert paisa → rupee
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    };

    fetchUserProfile();
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
    setMpinCallBackVal("");
    if (error) return apiErrorToast(error?.message);

    setPlans(response?.data || []);
  };

  // Handle recharge action
  const handleRecharge = async () => {
    setLoading(true);
    if (!selectedPlan || !mobileNumber)
      return apiErrorToast("Please select a plan and enter mobile number");
    if (mobileNumber.length !== 10)
      return apiErrorToast("Please enter valid 10-digit mobile number");
    if (!MpinCallBackVal) return apiErrorToast("Please enter your MPIN");
    if (!location?.lat || !location?.long) {
      return apiErrorToast("Location not available, please enable GPS.");
    }
    setLoading(true);

    const payload = {
      number: mobileNumber,
      operator: selectedService?.id,
      amount: selectedPlan.price,
      latitude: location?.lat || "",
      longitude: location?.long || "",
      mpin: Number(MpinCallBackVal),
    };

    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.RECHARGE,
      payload
    );
    setLoading(false);
    if (error)
      return showToast(
        [error?.message, error?.errors?.response?.data],
        "error"
      );
    setRechargeResponse(response); // ← store the response
    loadUserProfile();
    okSuccessToast(response?.message);
    setStep(4); // Success step
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Step 2 - Operators & Plans */}
      <CommonLoader loading={loading} />
      {step === 2 && (
        <Slide direction="right" in mountOnEnter unmountOnExit>
          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Left side - Operators */}
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
                            ? "2px solid #6C4BC7"
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
                              ? "2px solid #6C4BC7"
                              : "none",
                        }}
                      />
                      <Typography
                        sx={{
                          color:
                            selectedService?.id === service.id
                              ? "#6C4BC7"
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

            {/* Right side - Plans */}
            <Box sx={{ flex: 1 }}>
              {selectedService ? (
                <Box>
                  {/* Operator header */}
                  <Paper
                    sx={{ p: 2, mb: 2, display: "flex", alignItems: "center" }}
                  >
                    <Avatar
                      src={operatorImages[selectedService?.code]}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    />
                    <Box sx={{ height: 22 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {selectedService?.name}
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Custom Amount (moved above plans) */}
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: "center",
                      border: "1px dashed",
                      borderColor: "divider",
                      mb: 4, // spacing below
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Enter Custom Amount
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column", // stack vertically
                        alignItems: "center",
                        gap: 2, // space between input and button
                      }}
                    >
                      {/* Amount input + words */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          label="Amount"
                          type="text"
                          value={manualAmount}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) {
                              if (w1Limit && Number(val) > w1Limit) {
                                showToast(
                                  `Amount cannot exceed ₹${w1Limit}`,
                                  "error"
                                );
                                return;
                              }
                              setManualAmount(val);
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                          }}
                          sx={{ width: 160 }}
                        />

                        {manualAmount && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#555",
                              fontSize: "12px",
                              fontWeight: 500,
                              width: 180,
                              textAlign: "center",
                            }}
                          >
                            {amountInWords}
                          </Typography>
                        )}
                      </Box>

                      {/* Continue button */}
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (!manualAmount)
                            return apiErrorToast("Please enter amount");
                          if (w1Limit && Number(manualAmount) > w1Limit)
                            return apiErrorToast(
                              `Amount cannot exceed ₹${w1Limit}`
                            );
                          setSelectedPlan({
                            id: "custom",
                            name: "Custom Amount",
                            price: manualAmount,
                          });
                          setStep(3);
                        }}
                        disabled={!manualAmount}
                        sx={{ width: 160 }}
                      >
                        Continue
                      </Button>
                    </Box>
                  </Paper>

                  {/* Plans grid */}
                  <Grid container spacing={1} justifyContent="center">
                    {plans.map((plan) => (
                      <Grid
                        item
                        key={plan.id}
                        xs={3}
                        sm={3}
                        md={3}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Card
                          onClick={() => {
                            setSelectedPlan(plan);
                            setStep(3);
                          }}
                          sx={{
                            p: 1, // smaller padding
                            borderRadius: 2,
                            cursor: "pointer",
                            width: "120px", // fill the grid item
                            // maxWidth: 200, // optional max width
                            border:
                              selectedPlan?.id === plan.id
                                ? "2px solid"
                                : "1px solid",
                            borderColor:
                              selectedPlan?.id === plan.id
                                ? "#6C4BC7"
                                : "divider",
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="h6" fontWeight="700">
                            ₹{plan.price}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, fontSize: "0.85rem" }}
                          >
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
                            ? "2px solid #6C4BC7"
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
                              ? "2px solid #6C4BC7"
                              : "none",
                        }}
                      />
                      <Typography
                        sx={{
                          color:
                            selectedService?.id === service.id
                              ? "#6C4BC7"
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
                    <Typography variant="h6" color="#6C4BC7">
                      ₹{selectedPlan?.price}
                    </Typography>
                  </Box>
                  {selectedPlan?.validity && (
                    <Typography variant="body2" color="text.secondary">
                      Validity: {selectedPlan.validity}
                    </Typography>
                  )}
                </Box>

                {/* Mobile Number */}
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setMobileNumber(val);
                  }}
                  inputProps={{ maxLength: 10 }}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphone />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* MPIN Field */}
                {mobileNumber.length === 10 && (
                  <Box sx={{ textAlign: "center", mb: 2 }}>
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
                            newMpin[index] = val; // can be "" too
                            setMpinCallBackVal(newMpin.join(""));

                            if (val && index < 5) {
                              // move to next input if digit entered
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

                {/* Buttons - always visible, disabled until mobile is 10 digits and MPIN is complete */}
                <Box display="flex" gap={2}>
                  {/* <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      fontWeight: "bold",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      background: "#fff",
                      color: "#6C4BC7",
                      "&:hover": {
                        background: "#1e3c72",
                        color: "#fff",
                      },
                    }}
                    onClick={() => setStep(2)}
                    disabled={
                      !(
                        mobileNumber.length === 10 &&
                        MpinCallBackVal.length === 6
                      )
                    }
                  >
                    Back
                  </Button> */}
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleRecharge}
                    sx={{
                      borderRadius: 2,
                      fontWeight: "bold",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      background: "#fff",
                      color: "#6C4BC7",
                      "&:hover": {
                        background: "#1e3c72",
                        color: "#fff",
                      },
                    }}
                    disabled={
                      !(
                        mobileNumber.length === 10 &&
                        MpinCallBackVal.length === 6
                      )
                    }
                  >
                    Pay ₹{selectedPlan?.price}
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Fade>
      )}

      {step === 4 && (
        <Fade in>
          <Box textAlign="center" maxWidth={600} mx="auto" py={4}>
            {/* <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} /> */}

            {/* Heading for Receipt */}
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              sx={{ mt: 0, mb: 1 }}
            >
              Recharge Receipt
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 2 }}
            >
              Date:{new Date().toLocaleDateString("en-GB")}{" "}
              {/* formats as DD/MM/YYYY */}
            </Typography>
            {/* Table-style receipt */}
            <Paper sx={{ p: 2, mt: 1, textAlign: "left" }}>
              <table
                id="receiptTable"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "8px",
                        textAlign: "left",
                        width: "40%",
                      }}
                    >
                      Mobile Number
                    </th>
                    <td
                      style={{ borderBottom: "1px solid #ccc", padding: "8px" }}
                    >
                      {mobileNumber}
                    </td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      Operator
                    </th>
                    <td
                      style={{ borderBottom: "1px solid #ccc", padding: "8px" }}
                    >
                      {selectedService?.name || "---"}
                    </td>
                  </tr>

                  <tr>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      Amount
                    </th>
                    <td
                      style={{ borderBottom: "1px solid #ccc", padding: "8px" }}
                    >
                      ₹{rechargeResponse?.data?.transferAmount || "0"}
                    </td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      Operator Code
                    </th>
                    <td
                      style={{ borderBottom: "1px solid #ccc", padding: "8px" }}
                    >
                      {rechargeResponse?.data?.operatorCode || "---"}
                    </td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      Status
                    </th>
                    <td
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "8px",
                        color: "green",
                      }}
                    >
                      {rechargeResponse?.message || "Success"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Paper>

            {/* Buttons */}
            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedService(null);
                  setPlans([]);
                  setSelectedPlan(null);
                  setMobileNumber("");
                  setManualAmount("");
                  setMpinCallBackVal("");
                  setStep(2); // back to plans
                }}
              >
                New Recharge
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  const printWin = window.open("", "_blank");
                  printWin.document.write(`
      <html>
        <head>
          <title>Recharge Receipt</title>
          <style>
            @page { size: landscape; margin: 20mm; }
            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: center; }
            th { background-color: #f0f0f0; }
            h2 { margin: 10px 0; }
            img.logo { max-width: 150px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h2>Recharge Receipt</h2>
  <p>Date:${new Date().toLocaleDateString("en-GB")}</p> <!-- Current date -->

          <!-- Horizontal table layout -->
          <table>
            <tr>
              <th>Mobile Number</th>
              <th>Operator</th>
              <th>Amount</th>
              <th>Operator Code</th>
              <th>Status</th>
            </tr>
            <tr>
              <td>${mobileNumber}</td>
              <td>${selectedService?.name || "---"}</td>
              <td>₹${rechargeResponse?.data?.transferAmount || "0"}</td>
              <td>${rechargeResponse?.data?.operatorCode || "---"}</td>
              <td style="color: green;">${
                rechargeResponse?.message || "Success"
              }</td>
            </tr>
          </table>
        </body>
      </html>
    `);
                  printWin.document.close();
                  printWin.focus();
                  printWin.print();
                }}
              >
                Print Receipt
              </Button>
            </Box>
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default Prepaid;
// sx={{ backgroundColor: "#6C4BC7" }}
