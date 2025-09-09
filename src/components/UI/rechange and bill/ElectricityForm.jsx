import React, { useContext, useEffect, useState, useMemo, useCallback, memo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Alert,
  IconButton,
  Divider,
  Tooltip,
  FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AuthContext from "../../../contexts/AuthContext";
import ApiEndpoints from "../../../api/ApiEndpoints";
import CommenCardBill from "../../common/CommenCardBill";
import Loader from "../../common/Loader";
import { apiCall } from "../../../api/apiClient";
import { apiErrorToast, okSuccessToast } from "../../../utils/ToastUtil";

// Memoized operator card component to prevent unnecessary re-renders
const OperatorCard = memo(({ operator, selected, onClick }) => {
  let imageSrc;
  try {
    imageSrc = require(`../../../assets/operators/${operator.code}.png`);
  } catch (error) {
    imageSrc = null;
  }
  
  return (
    <Grid item xs={12} sm={6} md={4} key={operator.id}>
      <CommenCardBill
        title={operator.name}
        img={imageSrc}
        onClick={() => onClick(operator)}
        selected={selected}
        sx={{
          cursor: "pointer",
          transition: "all 0.3s",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: 3,
          },
          height: "100%",
        }}
      />
    </Grid>
  );
});

// Validation schema - moved outside component to prevent recreation on every render
const createSchema = (hasParam2) => {
  return yup.object().shape({
    param1: yup
      .string()
      .required("Consumer number is required")
      .matches(/^[a-zA-Z0-9]+$/, "Invalid consumer number format"),
    param2: hasParam2 ? yup.string().required("This field is required") : yup.string(),
    amount: yup
      .number()
      .typeError("Amount must be a number")
      .positive("Amount must be positive")
      .required("Amount is required")
      .test(
        "is-decimal",
        "Amount should have maximum 2 decimal places",
        (value) => {
          if (value) {
            return /^\d+(\.\d{1,2})?$/.test(value.toString());
          }
          return true;
        }
      ),
  });
};

const ElectricityForm = ({ type = "ELECTRICITY", resetView, name, image, dataCategories }) => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchRequest, setFetchRequest] = useState(false);
  const [billPayRequest, setBillPayRequest] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mpin, setMpin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [billDetails, setBillDetails] = useState(null);
  const [changeFetchToPay, setChangeFetchToPay] = useState(false);
  const [paramsValue, setParamsValue] = useState({});
  const [fetchMandatory, setFetchMandatory] = useState("");
  const [directPay, setDirectPay] = useState(false);
  const authCtx = useContext(AuthContext);
  const { refreshUser } = authCtx;
  const [ip, setIp] = useState("");

  // Get IP address
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };
    
    fetchIp();
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Memoized filtered operators based on search term
  const filteredOperators = useMemo(() => {
    if (!searchTerm.trim()) return operators;
    
    return operators.filter((operator) =>
      operator.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, operators]);

  // Memoized validation schema based on selected operator
  const schema = useMemo(() => 
    createSchema(selectedOperator?.params?.param2), 
    [selectedOperator]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      param1: "",
      param2: "",
      amount: "",
    },
  });

  // Fetch Operators from API - memoized with useCallback
  const fetchOperators = useCallback(async (operatorType) => {
    setLoading(true);
    try {
      const response = await apiCall(
        "POST", 
        `${ApiEndpoints.GET_SERVICES}?sub_type=${operatorType || type}`
      );
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      const operatorsData = response.response.data || [];
      
      const formattedOperators = operatorsData.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        billerId: item.bbpsId,
        img: item.img || "/default-operator.png",
        params: {
          param1: item.param1 || "Consumer Number",
          param2: item.param2 || "",
        },
      }));

      setOperators(formattedOperators);
      
      // Reset selected operator when operators change
      setSelectedOperator(null);
      reset({
        param1: "",
        param2: "",
        amount: "",
      });
    } catch (err) {
     apiErrorToast(err)
    } finally {
      setLoading(false);
    }
  }, [type, reset]);

  // Fetch operators when component mounts or type changes
  useEffect(() => {
    fetchOperators(type);
  }, [type, fetchOperators]);

  const handleOperatorClick = useCallback((operator) => {
    setSelectedOperator(operator);
    setBillDetails(null);
    setChangeFetchToPay(false);
    setDirectPay(false);
    setFetchMandatory("");
    reset({
      param1: "",
      param2: "",
      amount: "",
    });
    
    // Get biller details to check if mobile number field is needed
    getBillersDetails(operator.billerId);
  }, [reset]);

  // Get biller details function
  const getBillersDetails = useCallback(async (billerId) => {
    try {
      const response = await apiCall("POST", ApiEndpoints.BBPS_GET_BILLERS_DETAILS, {
        billerId: billerId
      });
      
      if (response.error) {
        console.error("Failed to get biller details:", response.error);
        return;
      }
      
      const data = response.response.data;
      setFetchMandatory(data.fetchRequirement);
      
      // Add mobile number field for electricity type if not already present
      if (type === "ELECTRICITY" && data.parameters && data.parameters[1]?.desc !== "Mobile Number") {
        setSelectedOperator(prev => ({
          ...prev,
          params: {
            ...prev.params,
            param2: "Mobile Number"
          }
        }));
      }
      
      if (data.fetchRequirement === "NOT_SUPPORTED") {
        setDirectPay(true);
      }
    } catch (err) {
      console.error("Error fetching biller details:", err);
    }
  }, [type]);

  // Handle amount input to prevent auto-fill and allow only valid numbers
  const handleAmountChange = useCallback((e, onChange) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onChange(value);
    }
  }, []);

  // Fetch bill function
  const fetchBill = useCallback(async () => {
    if (!selectedOperator) {
      setError("Please select an operator");
      return;
    }

    const formValues = watch();
    if (!formValues.param1) {
      setError("Consumer number is required");
      return;
    }

    setFetchRequest(true);
    try {
      const data = {
        billerId: selectedOperator.billerId,
        latitude: authCtx.location?.lat || 0,
        longitude: authCtx.location?.long || 0,
        amount: 0,
        ip: ip,
      };

      // Add parameters based on form values
      data.param1 = formValues.param1;
      if (formValues.param2) {
        data.param2 = formValues.param2;
      }

      const response = await apiCall("POST", ApiEndpoints.BBPS_FETCH_BILL, data);
      
      if (response.error) {
        setError(response.error);
        setDirectPay(true);
        return;
      }
      
      if (response.response.data) {
        setBillDetails(response.response.data.data);
        setValue("amount", response.response.data.data.dueAmount || "");
        okSuccessToast("Bill fetched successfully");
        
        if (response.response.message && 
            response.response.message.toLowerCase().includes("bill fetch service is down")) {
          setChangeFetchToPay(true);
          setDirectPay(true);
        }
      } else {
        setError("Failed to fetch bill details");
        setDirectPay(true);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch bill");
      setDirectPay(true);
    } finally {
      setFetchRequest(false);
    }
  }, [selectedOperator, watch, setValue, authCtx.location, ip]);

  // Handle form submission - memoized with useCallback
  const onSubmit = useCallback(async (data) => {
    if (!mpin || mpin.length !== 6) {
      setError("Please enter a valid 6-digit MPIN");
      return;
    }

    if (!selectedOperator) {
      setError("Please select an operator");
      return;
    }

    setBillPayRequest(true);
    try {
      const payload = {
        operator: selectedOperator.name,
        op_code: selectedOperator.code,
        biller_name: selectedOperator.name,
        type: type.toUpperCase(),
        number: data.param1,
        param1: data.param2 || "",
        amount: data.amount,
        platform: "WEB",
        mpin: mpin,
        latitude: authCtx.location?.lat || 0,
        longitude: authCtx.location?.long || 0,
        enquiryReferenceId: billDetails ? billDetails.enquiryReferenceId : "15486sfdgyf"
      };

      const response = await apiCall("POST", ApiEndpoints.BBPS_PAY_BILL, payload);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      reset();
      setMpin("");
      setBillDetails(null);
      setSuccess("Payment successful!");
      refreshUser();
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setBillPayRequest(false);
    }
  }, [mpin, selectedOperator, refreshUser, reset, type, authCtx.location, billDetails]);

  // No providers message component
  const NoProvidersMessage = useMemo(() => (
    <Grid item xs={12}>
      <Typography textAlign="center" color="text.secondary">
        No providers found
      </Typography>
    </Grid>
  ), []);

  // Select provider prompt component
  const SelectProviderPrompt = useMemo(() => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h6" color="text.secondary" mb={2}>
        Select a provider from the left panel
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Choose your service provider to proceed with the payment
      </Typography>
    </Box>
  ), []);

  let operatorImageSrc;
  try {
    operatorImageSrc = require(`../../../assets/operators/${selectedOperator?.code}.png`);
  } catch (error) {
    operatorImageSrc = null;
  }

  return (
    <Box p={2}>
      <Loader loading={loading || fetchRequest || billPayRequest} />
      
      {/* Error and Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Header with back button */}
      {resetView && (
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton onClick={() => resetView(false)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          {image && (
            <img
              src={image}
              alt="Biller"
              style={{ width: 40, height: 40, marginRight: 10, borderRadius: "50%" }}
            />
          )}
          <Typography variant="h6">
            {name}
          </Typography>
        </Box>
      )}
      
    <Grid  display={"flex"} >
        {/* Left Side: Operator Cards */}
        <Grid item xs={12} md={4} >
          <Paper elevation={3} sx={{ borderRadius: 2, height: "100%", p: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Select Provider
            </Typography>
            
            {/* Search Bar */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                autoComplete: "off",
              }}
              sx={{ 
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                },
                "& .MuiInputLabel-root": {
                  color: "#757575",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cccccc",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#999999",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3f51b5",
                },
              }}
            />
            
            {/* <Box sx={{  pr: 1 }}> */}
              <Grid  spacing={2} >
                {filteredOperators.length > 0 ? (
                  filteredOperators.map((operator) => (
                    <OperatorCard
                      key={operator.id}
                      operator={operator}
                      selected={selectedOperator?.id === operator.id}
                      onClick={handleOperatorClick}
                    />
                  ))
                ) : (
                  NoProvidersMessage
                )}
              </Grid>
            {/* </Box> */}
          </Paper>
          
      
             </Grid>
             <Grid item xs={12} md={8} >
            <Paper  sx={{ borderRadius: 2, height: "100%", }}>
            {selectedOperator ? (
              <Grid>
                <Box display="flex" alignItems="center" mb={3}>
                  {operatorImageSrc && (
                    <img
                      src={operatorImageSrc}
                      alt="Operator"
                      style={{ width: 40, height: 40, marginRight: 10, borderRadius: "50%" }}
                    />
                  )}
                  <Tooltip title={selectedOperator.name} arrow>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedOperator.name.split(" ").length > 3
                        ? `${selectedOperator.name.split(" ").slice(0, 3).join(" ")}...`
                        : selectedOperator.name}
                    </Typography>
                  </Tooltip>
                </Box>
                
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{
                    maxWidth: "500px",
                    margin: "0 auto",
                    p: 4,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Grid  spacing={3}>
                    {/* Consumer Number Input */}
                    <Grid item xs={12}>
                      <Controller
                        name="param1"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={selectedOperator.params.param1}
                            variant="outlined"
                            size="medium"
                            InputLabelProps={{ shrink: !!field.value }}
                            error={!!errors.param1}
                            helperText={errors.param1?.message}
                            inputProps={{
                              autoComplete: "off",
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#fff",
                                "&:hover fieldset": {
                                  borderColor: "#3f51b5",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#3f51b5",
                                },
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Mobile Number Input - only shown for electricity type */}
                    {type === "ELECTRICITY" && selectedOperator.params.param2 === "Mobile Number" && (
                      <Grid item xs={12}>
                        <Controller
                          name="param2"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Mobile Number"
                              variant="outlined"
                              size="medium"
                              InputLabelProps={{ shrink: !!field.value }}
                              error={!!errors.param2}
                              helperText={errors.param2?.message}
                              inputProps={{
                                autoComplete: "off",
                                maxLength: 10,
                                pattern: "[0-9]*",
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#fff",
                                  "&:hover fieldset": {
                                    borderColor: "#3f51b5",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#3f51b5",
                                  },
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                    )}

                    {/* Amount Input - shown after bill fetch or for direct pay */}
                    {(directPay || billDetails) && (
                      <Grid item xs={12}>
                        <Controller
                          name="amount"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Amount"
                              variant="outlined"
                              size="medium"
                              InputLabelProps={{ shrink: !!field.value }}
                              error={!!errors.amount}
                              helperText={errors.amount?.message}
                              onChange={(e) => handleAmountChange(e, field.onChange)}
                              value={field.value}
                              inputProps={{
                                step: "0.01",
                                min: "0",
                                autoComplete: "off",
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#fff",
                                  "&:hover fieldset": {
                                    borderColor: "#3f51b5",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#3f51b5",
                                  },
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                    )}

                    {/* Fetch Bill Button - only show if not in direct pay mode */}
                    {!directPay && (
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={fetchBill}
                          fullWidth
                          sx={{ 
                            py: 1.5,
                            backgroundColor: "#3f51b5",
                            "&:hover": {
                              backgroundColor: "#303f9f",
                            },
                          }}
                          disabled={!watch("param1") || fetchRequest}
                        >
                          {fetchRequest ? "Fetching..." : "Fetch Bill"}
                        </Button>
                      </Grid>
                    )}

                    {/* Bill Details */}
                    {billDetails && (
                      <Grid item xs={12}>
                        <Paper elevation={1} sx={{ p: 2, backgroundColor: "#e8f5e9" }}>
                          <Typography variant="h6" gutterBottom>
                            Bill Details
                          </Typography>
                          <Typography>
                            Due Amount: ₹{billDetails.BillAmount || watch("amount")}
                          </Typography>
                          <Typography>
                            Due Date: {billDetails.BillDueDate || "N/A"}
                          </Typography>
                          <Typography>
                            Consumer Name: {billDetails.BillNumber || "N/A"}
                          </Typography>
                          {/* Add more bill details as needed */}
                        </Paper>
                      </Grid>
                    )}
                    
                    {/* MPIN Input - shown only when amount is entered */}
                    {(directPay || billDetails) && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          Enter your MPIN to confirm the payment
                        </Typography>
                        <TextField
                          fullWidth
                          type="password"
                          label="MPIN"
                          variant="outlined"
                          value={mpin}
                          onChange={(e) => setMpin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          inputProps={{
                            maxLength: 6,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          error={mpin.length > 0 && mpin.length !== 6}
                          helperText={mpin.length > 0 && mpin.length !== 6 ? "MPIN must be 6 digits" : ""}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#fff",
                              "&:hover fieldset": {
                                borderColor: "#3f51b5",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#3f51b5",
                              },
                            },
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>

                  {/* Submit Button - shown only when amount and MPIN are ready */}
                  {(directPay || billDetails) && (
                    <Box mt={4} display="flex" justifyContent="center">
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        size="large"
                        fullWidth
                        sx={{ 
                          py: 1.5,
                          backgroundColor: "#3f51b5",
                          "&:hover": {
                            backgroundColor: "#303f9f",
                          },
                        }}
                        disabled={!mpin || mpin.length !== 6 || billPayRequest}
                      >
                        {billPayRequest ? "Processing..." : `Pay Bill`}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
            ) : (
              SelectProviderPrompt
            )}
          </Paper>
        </Grid>

        {/* Right Side: Form Inputs */}
       
      </Grid>
    </Box>
  );
};

export default memo(ElectricityForm);