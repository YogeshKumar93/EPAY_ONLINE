import { useContext, useEffect, useState } from "react";
import {
  Grid,
  Card,
  Typography,
  CircularProgress,
  Box,
  TextField,
  Button,
  Avatar,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
  const [amount, setAmount] = useState("");
  const { location } = useContext(AuthContext);

  const fetchServices = async () => {
    setLoading(true);
    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.GET_SERVICES,
      { sub_type: "dth" }
    );
    setLoading(false);

    if (error) {
      apiErrorToast(error);
      return;
    }

    setServices(response?.data || []);
  };

  const handleRecharge = async () => {
    if (!selectedService || !customerId || !amount) {
      apiErrorToast("Please select a service, enter Customer ID and amount");
      return;
    }

    try {
      const payload = {
        customer_id: customerId,
        operator: selectedService.id,
        amount,
        latitude: location?.lat || "",
        longitude: location?.long || "",
      };

      const { error } = await apiCall("post", ApiEndpoints.RECHARGE, payload);

      if (error) {
        apiErrorToast(error);
        return;
      }

      okSuccessToast(`Recharge successful for ${customerId}`);

      // reset fields
      setSelectedService(null);
      setCustomerId("");
      setAmount("");
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
      {/* Service Cards Grid */}
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
              onClick={() => setSelectedService(service)}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2, bgcolor: "#f5f5f5", borderRadius: 6, p: 1 }}>
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
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                {service.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for Selected Service */}
      <Dialog
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <Box sx={{ position: "relative", p: 3, borderRadius: 4, boxShadow: 3,    border: "2px solid",      // 👈 border thickness
    borderColor: "primary.main",}}>
            <IconButton
              onClick={() => setSelectedService(null)}
              sx={{ position: "absolute", top: -2, right: -8, color: "blue" }}
            >
              <CloseIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
            >
              Selected Service: {selectedService?.name}
            </Typography>

            <TextField
              fullWidth
              label="Customer ID / Number"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dth;
