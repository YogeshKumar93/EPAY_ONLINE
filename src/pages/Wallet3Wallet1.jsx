import { useMemo, useContext, useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import CommonTable from "../components/common/CommonTable";

import AuthContext from "../contexts/AuthContext";
import {
  dateToTime,
  dateToTime1,
  ddmmyy,
  ddmmyyWithTime,
} from "../utils/DateUtils";
import CommonStatus from "../components/common/CommonStatus";
import CommonLoader from "../components/common/CommonLoader";
import LaptopIcon from "@mui/icons-material/Laptop";
import { useNavigate } from "react-router-dom";
import W2wTransfer from "./w2wTransfer";
import { android2, linux2, macintosh2, windows2 } from "../iconsImports";
import { okhttp } from "../utils/iconsImports";

import { useToast } from "../utils/ToastContext";
import CommonMpinModal from "../components/common/CommonMpinModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
const Wallet3ToWallet1 = ({ filters = [] }) => {
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
    <Box sx={{ p: 3, maxWidth: 400, margin: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Wallet3ToWallet1 Transfer
      </Typography>

      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {error && <Typography sx={{ color: "red", mb: 1 }}>{error}</Typography>}

      {success && (
        <Typography sx={{ color: "green", mb: 1 }}>{success}</Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={handleSendClick}
        disabled={creating}
        sx={{
          backgroundColor: "#6C4BC7",
        }}
      >
        {creating ? "Processing..." : "Transfer"}
      </Button>

      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        title="Enter MPIN"
        mPinCallBack={handleCreateTransfer} // MPIN entered -> create transfer
      />
    </Box>
  );
};

export default Wallet3ToWallet1;
