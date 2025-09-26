import { useMemo, useContext, useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import CommonMpinModal from "../common/CommonMpinModal";
const W3W1Transfer = ({ filters = [] }) => {
  const authCtx = useContext(AuthContext);

  const loadUserProfile = authCtx.loadUserProfile;

  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [mobile, setMobile] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { showToast } = useToast();
  const fetchUsersRef = useRef(null);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const handleSendClick = () => {
    setMpinModalOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateTransfer = async (mpin) => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter valid amount");
      return;
    }

    setCreating(true);
    setError("");
    setSuccess("");

    const payload = {
      amount: parseFloat(amount),
      remark,
      operator: 78,
      mpin,
    };

    const { response, error } = await apiCall(
      "post",
      ApiEndpoints.WALLET3_WALLET1,
      payload
    );

    if (response) {
      showToast(response?.message || "Transfer successful", "success");
      loadUserProfile();
      fetchUsersRef.current?.();
      setAmount("");

      setReceiver(null);
      setMobile("");
    } else {
      setError(error.message || "Transfer failed");
      setCreating(false);
    }
  };

  return (
    <Box
      sx={{
      width:"100%",
        // bgcolor: "#f9f9f9",
        borderRadius: 2,
      }}
    >
      {/* <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 600, textAlign: "center" }}
      >
        Wallet3ToWallet1 Transfer
      </Typography> */}


      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#fff",
            },
          }}
          placeholder="Enter amount"
        />
        <Button
          variant="contained"
          onClick={handleSendClick}
          disabled={!amount || creating}
          sx={{
            backgroundColor: "#2275b7",
            color: "#fff",
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#1b5fa7",
            },
          }}
        >
          {creating ? "Processing..." : "Transfer"}
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Typography
          sx={{ color: "red", mb: 1, textAlign: "center", fontWeight: 500 }}
        >
          {error}
        </Typography>
      )}

      {/* Success Message */}
      {success && (
        <Typography
          sx={{ color: "green", mb: 1, textAlign: "center", fontWeight: 500 }}
        >
          {success}
        </Typography>
      )}

      {/* MPIN Modal */}
      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        title="Enter MPIN"
        mPinCallBack={handleCreateTransfer}
      />
    </Box>
  );
};

export default W3W1Transfer;
