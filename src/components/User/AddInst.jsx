import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import { okSuccessToast } from "../../utils/ToastUtil";
import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";

const AddInst = ({ open, onClose, userId, onFetchRef }) => {
  const { showToast } = useToast();
  const [instId, setInstId] = useState("");
  const [loading, setLoading] = useState(false);
    const authCtx = useContext(AuthContext);
    const user = authCtx?.user;
    const username = `P2PAE${user?.id}`;

  const handleSubmit = async () => {
    if (!instId) {
      showToast("Please enter InstId", "error");
      return;
    }

    const payload = {
      user_id: userId,   // ✅ backend key
      instId: instId,    // ✅ backend key
    };

    setLoading(true);
    const { response, error } = await apiCall(
      "POST",
      ApiEndpoints.ADD_INST_ID,
      payload
    );
    setLoading(false);

    if (response) {
      showToast(response?.message ||"InstId Added Successfully","success" );
      setInstId("");
      onFetchRef?.();
      onClose();
    } else {
      showToast(error?.message || "Failed to add InstId", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Add InstId to {userId}
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="User ID"
          value={userId}
          fullWidth
          size="small"
          InputProps={{ readOnly: true }} // ✅ prevent editing
        />

        <TextField
          label="InstId"
          value={instId}
          onChange={(e) => setInstId(e.target.value)}
          fullWidth
          size="small"
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!instId || loading}
        >
          {loading ? "Saving..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInst;
