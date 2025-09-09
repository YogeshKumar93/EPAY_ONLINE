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
} from "@mui/material";
import { apiCall } from "../../../api/apiClient";
import ApiEndpoints from "../../../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../../../utils/ToastUtil";
import AuthContext from "../../../contexts/AuthContext";

const Prepaid = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const { location } = useContext(AuthContext);

  const fetchServices = async () => {
    setLoading(true);
    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.GET_SERVICES,
      { sub_type: "prepaid" }
    );
    setLoading(false);

    if (error) {
      apiErrorToast(error);
      return;
    }

    setServices(response?.data || []);
  };

  const fetchPlans = async (service) => {
    const operator = service.name.split(" ")[0]; // first word
    setPlansLoading(true);
    setSelectedService(service); // mark selected service
    setPlans([]); // reset plans

    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_PLANS_BY_OPERATOR,
        { operator }
      );
      setPlansLoading(false);

      if (error) {
        apiErrorToast(error);
        return;
      }

      // okSuccessToast(`Fetched plans for ${operator}`);
      setPlans(response?.data || []);
    } catch (err) {
      setPlansLoading(false);
      apiErrorToast(err);
    }
  };

const handleRecharge = async () => {
  if (!selectedPlan || !mobileNumber) {
    apiErrorToast("Please select a plan and enter mobile number");
    return;
  }

  try {
    const payload = {
      mobile_number: mobileNumber,
      operator: selectedPlan.id,
      amount: selectedPlan.price,
        latitude: location?.lat || "",   // ✅ add latitude
        longitude: location?.long || "", // ✅ add longitude
    };

    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.RECHARGE, // replace with your recharge endpoint
      payload
    );

    if (error) {
      apiErrorToast(error);
      return;
    }

    okSuccessToast(`Recharge successful for ${mobileNumber}`);
    console.log("Recharge response:", response);

    // Optionally, reset fields after successful recharge
    setSelectedService(null);
    setPlans([]);
    setSelectedPlan("");
    setMobileNumber("");
  } catch (err) {
    apiErrorToast(err);
  }
};


  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {services.map((service) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
          <Card
            sx={{
              borderRadius: 2,
              mt: 5,
              boxShadow: 3,
              "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onClick={() => fetchPlans(service)}
          >
            <CardContent>
              <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
                {service.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {plansLoading && (
        <Box display="flex" justifyContent="center" width="100%" mt={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      {selectedService && !plansLoading && plans.length > 0 && (
        <Grid item xs={12}>
          <Box mt={3} display="flex" flexDirection="column" gap={2} maxWidth={400}>
            <Typography variant="subtitle1">
              Selected Service: {selectedService.name}
            </Typography>
            <TextField
              select
              label="Select Plan"
      value={selectedPlan ? selectedPlan.id : ""}
 onChange={(e) => {
  const plan = plans.find((p) => p.id === e.target.value);
   setSelectedPlan(plan);
 }}
            >
               {plans.map((plan) => (
   <MenuItem key={plan.id} value={plan.id}>
     {plan.name} - ₹{plan.price}
   </MenuItem>
 ))}
            </TextField>
            <TextField
              label="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              type="tel"
            />
            <Button variant="contained" color="primary" onClick={handleRecharge}>
              Recharge
            </Button>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default Prepaid;
