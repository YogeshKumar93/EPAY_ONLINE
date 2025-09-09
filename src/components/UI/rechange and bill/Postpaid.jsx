import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { apiCall } from "../../../api/apiClient";
import ApiEndpoints from "../../../api/ApiEndpoints";
import { apiErrorToast } from "../../../utils/ToastUtil";

const Postpaid = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.GET_SERVICES,
      { sub_type: "postpaid" }
    );
    setLoading(false);

    if (error) {
      apiErrorToast(error);
      return;
    }

    setServices(response?.data || []);
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
              mt:5,
              boxShadow: 3,
              "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                align="center"
                sx={{ fontWeight: 600 }}
              >
                {service.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Postpaid;
