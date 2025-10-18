import { useContext, useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { useToast } from "../../utils/ToastContext";
import CommonMpinModal from "../common/CommonMpinModal";

const W2W1Transfer = ({ filters = [] }) => {
  const { loadUserProfile } = useContext(AuthContext);
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [creating, setCreating] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [w2Balance, setW2Balance] = useState(0);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);

  const fetchUsersRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await loadUserProfile();
        if (user) {
          setW2Balance(parseFloat(user.w2 / 100 || 0));
        }
      } catch (err) {
        console.error("Failed to fetch W2 balance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSendClick = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setAmountError("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount) > w2Balance) {
      setAmountError(`Insufficient balance. W2 balance: ₹${w2Balance}`);
      return;
    }
    setAmountError("");
    setMpinModalOpen(true);
  };

  const handleCreateTransfer = async (mpin) => {
    if (!amount || parseFloat(amount) <= 0) {
      setAmountError("Enter a valid amount");
      return;
    }

    if (parseFloat(amount) > w2Balance) {
      setAmountError(`Insufficient balance. W2 balance: ₹${w2Balance}`);
      return;
    }

    setCreating(true);
    setAmountError("");

    const payload = {
      amount: parseFloat(amount),
      remark,
      operator: 79,
      mpin,
    };

    const { response, error } = await apiCall(
      "post",
      ApiEndpoints.WALLET2_WALLET1,
      payload
    );

    if (response) {
      showToast(response?.message || "Transfer successful", "success");
      await loadUserProfile();
      fetchUsersRef.current?.();
      setAmount("");
      setRemark("");
    } else {
      showToast(error?.message || "Transfer failed", "error");
    }

    setCreating(false);
    setMpinModalOpen(false);
  };

  // 🟢 Disable transfer button until amount is valid
  const isAmountValid =
    amount &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= w2Balance &&
    !amountError;

  return (
    <Box sx={{ width: "100%", borderRadius: 2 }}>
      <Typography
        variant="subtitle1"
        sx={{ mb: 2, fontWeight: 600, color: "green", textAlign: "center" }}
      >
        Available AEPS Balance : ₹{w2Balance.toFixed(2)}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <TextField
          label="Amount"
          type="text"
          value={amount}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, "");
            setAmount(val);

            if (val === "") {
              setAmountError("");
              return;
            }

            const num = parseFloat(val);
            if (isNaN(num) || num <= 0) {
              setAmountError("Please enter a valid amount");
            } else if (num > w2Balance) {
              setAmountError(`You cannot transfer more than ₹${w2Balance}.`);
            } else {
              setAmountError("");
            }
          }}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#fff",
            },
          }}
          placeholder="Enter amount"
          error={Boolean(amountError)}
          helperText={amountError}
        />

        <Button
          variant="contained"
          onClick={handleSendClick}
          disabled={!isAmountValid || creating}
          sx={{
            backgroundColor: "#6C4BC7",
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

      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        title="Enter MPIN"
        mPinCallBack={handleCreateTransfer}
      />
    </Box>
  );
};

export default W2W1Transfer;
