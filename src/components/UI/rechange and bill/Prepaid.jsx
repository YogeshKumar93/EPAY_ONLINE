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
  Paper
} from "@mui/material";
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

    const fetchedServices = response?.data || [];
    setServices(fetchedServices);
  };

  const fetchPlans = async (service) => {
    const operator = service.name.split(" ")[0];
    setPlansLoading(true);
    setSelectedService(service);
    setPlans([]);
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
        latitude: location?.lat || "",
        longitude: location?.long || "",
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.RECHARGE,
        payload
      );

      if (error) {
        apiErrorToast(error);
        return;
      }

      okSuccessToast(`Recharge successful for ${mobileNumber}`);

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
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
    

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                p: 2,
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 8,
                  transform: "translateY(-6px)",
                },
                textAlign: "center",
              }}
              onClick={() => fetchPlans(service)}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Avatar
                  src={operatorImages[service.code]}
                  alt={service.name}
                  sx={{
                    width: 70,
                    height: 70,
                    border: "3px solid #1976d2",
                    background: "linear-gradient(135deg, #42a5f5, #1e88e5)",
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#333" }}
              >
                {service.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {plansLoading && (
        <Box display="flex" justifyContent="center" width="100%" mt={4}>
          <CircularProgress size={28} />
        </Box>
      )}

      {selectedService && !plansLoading && plans.length > 0 && (
        <Paper
          elevation={6}
          sx={{
            mt: 5,
            p: { xs: 2, sm: 3 },
            maxWidth: 500,
            mx: "auto",
            borderRadius: 3,
            background: "#f5f5f5",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
          >
            Selected Service: {selectedService.name}
          </Typography>

          <TextField
            select
            fullWidth
            label="Select Plan"
            value={selectedPlan ? selectedPlan.id : ""}
            onChange={(e) => {
              const plan = plans.find((p) => p.id === e.target.value);
              setSelectedPlan(plan);
            }}
            sx={{ mb: 2 }}
          >
            {plans.map((plan) => (
              <MenuItem key={plan.id} value={plan.id}>
                {plan.name} - ₹{plan.price}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            type="tel"
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5, fontWeight: 600 }}
            onClick={handleRecharge}
          >
            Recharge
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Prepaid;
