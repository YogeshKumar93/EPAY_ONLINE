import { useContext, useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress, 
  IconButton, 
  TextField, 
  Button 
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";

const BbpsBillerDetails = ({ billerId, onBack }) => {
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [billerDetails, setBillerDetails] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [fetchingBill, setFetchingBill] = useState(false);
  const [billData, setBillData] = useState(null);

  const authCtx = useContext(AuthContext);
  const ip = authCtx?.ip; // get user IP from context

  // Fetch biller details
  const fetchBillerDetails = async () => {
    setDetailsLoading(true);
    try {
      const { error, response } = await apiCall("post", ApiEndpoints.BBPS_GET_BILLERS_DETAILS, {
        biller_id: billerId,
      });

      if (response) {
        const details = response?.data?.records?.[0] || response?.data || null;
        setBillerDetails(details);

        // Initialize input values for parameters
        const params = details?.parameters || [];
        const initialValues = {};
        params.forEach(p => {
          initialValues[p.name] = "";
        });
        setInputValues(initialValues);
      } else if (error) {
        apiErrorToast(error?.message || "Failed to fetch biller details");
      }
    } catch (err) {
      apiErrorToast(err.message || "Failed to fetch biller details");
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (billerId) fetchBillerDetails();
  }, [billerId]);

  const handleChange = (name, value) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  // Fetch Bill API call
  const handleFetchBill = async () => {
    setFetchingBill(true);
    try {
      const payload = {
        biller_id: billerId,
        ...inputValues,
        ip: ip || "0.0.0.0", // Use context IP or fallback
      };

      const { error, response } = await apiCall("post", ApiEndpoints.BBPS_FETCH_BILL, payload);

      if (response) {
        setBillData(response);
        alert(`Bill fetched successfully! Amount: ${response.amount || "-"}`);
      } else if (error) {
        apiErrorToast(error?.message || "Failed to fetch bill");
      }
    } catch (err) {
      apiErrorToast(err.message || "Failed to fetch bill");
    } finally {
      setFetchingBill(false);
    }
  };

  if (detailsLoading) return <CircularProgress />;

  if (!billerDetails) return <Typography mt={2}>No details found.</Typography>

  const { parameters } = billerDetails;

  return (
    <Box>
      <IconButton onClick={onBack}>
        <ArrowBackIcon />
      </IconButton>

      <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, maxWidth: 400, mx: "auto", mt: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            {billerDetails?.billerInfo?.name || "Biller"}
          </Typography>

          {parameters?.map((param, idx) => (
            <TextField
              key={idx}
              fullWidth
              label={param.desc}
              variant="outlined"
              margin="dense"
              value={inputValues[param.name] || ""}
              onChange={(e) => handleChange(param.name, e.target.value)}
              inputProps={{
                minLength: param.minLength,
                maxLength: param.maxLength,
                pattern: param.regex,
                required: param.mandatory === 1
              }}
            />
          ))}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleFetchBill}
            disabled={fetchingBill}
          >
            {fetchingBill ? "Fetching Bill..." : "Fetch Bill"}
          </Button>

          {billData && (
            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Bill Details:
              </Typography>
              <Typography>Amount: {billData.amount || "-"}</Typography>
              <Typography>Due Date: {billData.due_date || "-"}</Typography>
              <Typography>Customer: {billData.customer_name || "-"}</Typography>
              <Typography>Bill Number: {billData.bill_number || "-"}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BbpsBillerDetails;
