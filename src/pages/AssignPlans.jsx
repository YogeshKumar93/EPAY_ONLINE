import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";

import CommonModal from "../components/common/CommonModal";
import CommonLoader from "../components/common/CommonLoader";

export const AssignPlans = ({ open, onClose, row, onSuccess }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch plans when modal opens
  useEffect(() => {
    if (open) {
      fetchPlans();
    }
  }, [open]);

  const fetchPlans = async () => {
    setLoading(true);
    setError("");
    try {
      const { response } = await apiCall("POST", ApiEndpoints.GET_PLANS);
      if (response && response.data) {
        setPlans(response.data);
      } else {
        setError("No plans found");
      }
    } catch (err) {
      setError("Error fetching plans");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPlan = async () => {
    if (!selectedPlan) {
      setError("Please select a plan");
      return;
    }
    setAssigning(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        plan_id: selectedPlan,
        user_id: row.id,
      };
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.ASSIGN_PLAN,
        payload
      );
      if (response) {
        setSuccess(response.message || "Plan assigned successfully");
        if (onSuccess) onSuccess(); // callback to refresh parent
        setSelectedPlan("");
        setTimeout(() => onClose(), 1000);
      } else {
        setError(error?.message || "Assignment failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Assign Plan"
      footerButtons={[]}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CommonLoader loading={loading} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">{success}</Typography>}

          <TextField
            select
            label="Select Plan"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            fullWidth
          >
            {plans.map((plan) => (
              <MenuItem key={plan.id} value={plan.id}>
                {plan.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            onClick={handleAssignPlan}
            disabled={assigning}
            sx={{ py: 1.5 }}
          >
            {assigning ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Assign Plan"
            )}
          </Button>
        </Box>
      )}
    </CommonModal>
  );
};
