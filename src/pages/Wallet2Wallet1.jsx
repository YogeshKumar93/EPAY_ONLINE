import { useMemo, useContext, useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
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
import { apiCall } from "../api/apiClient";
import { useToast } from "../utils/ToastContext";
import CommonMpinModal from "../components/common/CommonMpinModal";
const Wallet2Wallet1 = ({ filters = [] }) => {
  const authCtx = useContext(AuthContext);

  const loadUserProfile = authCtx.loadUserProfile;

  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
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
    // if (!receiver?.id) {
    //   setError("Select a valid receiver");
    //   return;
    // }

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        // reciever_id: receiver.id,
        amount: parseFloat(amount),
        operator: 56,
        mpin,
      };

      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.WALLET2_WALLET1,
        payload
      );

      if (response) {
        showToast(response?.message || "Transfer successful", "success");
        loadUserProfile();
        fetchUsersRef.current?.();
        setAmount("");
      } else {
        setError(error?.data?.message || "Transfer failed");
      }
    } catch (err) {
      setError("Something went wrong while creating transfer");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 400, margin: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Wallet2Wallet1 Transfer
      </Typography>

      {/* <TextField
        label="Enter Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      /> */}

      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => {
          const value = e.target.value;
          // Sirf numbers aur max 10 digits
          if (/^\d{0,10}$/.test(value)) {
            setAmount(value);
          }
        }}
        // onChange={(e) => setAmount(e.target.value)}
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
          backgroundColor: "#2275b7",
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

export default Wallet2Wallet1;
