import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  CircularProgress,
  Card,
  Typography,
  Grid,
  Button,
  Box,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import debounce from "lodash.debounce";
import { useToast } from "../utils/ToastContext";
import CommonModal from "../components/common/CommonModal";
import CommonMpinModal from "../components/common/CommonMpinModal";
import AuthContext from "../contexts/AuthContext";

const W2wTransfer = ({ handleFetchRef, type }) => {
  const [mobile, setMobile] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const [w1Balance, setW1Balance] = useState(0);
  const [mobileError, setMobileError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [remarkError, setRemarkError] = useState("");
const navigate = useNavigate();

  const { showToast } = useToast();
  const authCtx = useContext(AuthContext);
  const { loadUserProfile } = authCtx;

  // 🟢 Fetch user profile and get W1 balance
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await loadUserProfile();
        if (user) {
          setW1Balance(parseFloat(user.w1 / 100 || 0));
        }
      } catch (err) {
        console.error("Failed to load user profile for W1:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const fetchReceiver = async (mobileNumber) => {
    if (!mobileNumber) {
      setReceiver(null);
      return;
    }

    setLoading(true);
    setMobileError("");

    const { response, error } = await apiCall(
      "post",
      ApiEndpoints.WALLET_GET_RECEIVER,
      { user_id: mobileNumber }
    );

    if (response) {
      setReceiver(response?.data);
      setModalOpen(true);
    } else {
      setReceiver(null);

      const errMsg =
        error?.message ||
        (Array.isArray(error?.errors) && error.errors.length > 0
          ? error.errors.join(", ")
          : null) ||
        "Receiver not found";

      showToast(errMsg, "error");
      setMobileError(errMsg);
    }

    setLoading(false);
  };

  const debouncedFetch = debounce(fetchReceiver, 1000);

  useEffect(() => {
    if (mobile) {
      debouncedFetch(mobile);
    } else {
      setReceiver(null);
      setError("");
    }
    return () => debouncedFetch.cancel();
  }, [mobile]);

  const handleCreateTransfer = async (mpin) => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter valid amount");
      return;
    }

    // 🚫 Prevent transfer if amount > W1 balance
    if (parseFloat(amount) > w1Balance) {
      const msg = `Insufficient balance. Your W1 balance is ₹${w1Balance}.`;
      showToast(msg, "error");
      setError(msg);
      return;
    }

    setCreating(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        reciever_id: receiver.id,
        amount: parseFloat(amount),
        remark,
        operator: 17,
        mpin,
      };

      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.WALLET_CREATE,
        payload
      );

      if (response) {
        showToast(response?.message || "Transfer successful", "success");
        handleFetchRef?.();

        setAmount("");
        setRemark("");
        setReceiver(null);
        setMobile("");
        setModalOpen(false);
        await loadUserProfile(); // ✅ refresh user data
        navigate("/customer/dashboard"); 
      } else {
        showToast(error.message || error.errors, "error");
        setError(error?.message || "Transfer failed");
      }
    } catch (err) {
      setError("Something went wrong while creating transfer");
    } finally {
      setCreating(false);
    }
  };

  const handleSendClick = () => {
    // also precheck before MPIN modal opens
    if (!amount || parseFloat(amount) <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }
    if (parseFloat(amount) > w1Balance) {
      showToast(
        `Insufficient balance. Your W1 balance is ₹${w1Balance}.`,
        "error"
      );
      return;
    }
    setMpinModalOpen(true);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Box sx={{ width: "100%" }}>
        {/* {type !== "w2w" && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "#1976d2",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Wallet to Wallet Transfer
          </Typography>
        )} */}

        {/* ✅ Display W1 Balance */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, mb: 2, color: "green", textAlign: "center" }}
        >
          Available Main Balance: ₹{w1Balance.toFixed(2)}
        </Typography>

        <TextField
          label="Enter Receiver's Login Id"
          variant="outlined"
          fullWidth
          value={mobile}
          onChange={(e) => {
            let val = e.target.value;
            setMobile(val);
            setMobileError(""); // clear error on typing
          }}
          margin="normal"
          inputProps={{ maxLength: 10 }}
          sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          error={Boolean(mobileError)}
          helperText={mobileError}
        />

        {loading && (
          <Grid container justifyContent="center" sx={{ my: 2 }}>
            <CircularProgress />
          </Grid>
        )}

        {/* {error && (
          <Typography color="error" sx={{ mt: 1, mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )} */}
        {success && (
          <Typography
            color="success.main"
            sx={{ mt: 1, mb: 2, textAlign: "center" }}
          >
            {success}
          </Typography>
        )}

        <CommonModal
          title="W1 TO W1 Transfer"
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          footerButtons={[]}
        >
          {receiver && (
            <>
              <Typography
                variant="h6"
                sx={{ color: "#1976d2", fontWeight: 700, textAlign: "center" }}
              >
                Receiver Details
              </Typography>

              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  p: 2,
                  background: "linear-gradient(to right, #e3f2fd, #ffffff)",
                }}
              >
                <Grid container spacing={2} justifyContent="space-between">
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {receiver.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Establishment
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {receiver.establishment}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Role
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {receiver.role}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Mobile
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {receiver.mobile}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>

              <TextField
                label="Enter Amount"
                variant="outlined"
                fullWidth
                value={amount}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, "");
                  setAmount(val);

                  if (!val) {
                    setAmountError("Please enter an amount");
                  } else if (parseFloat(val) > w1Balance) {
                    setAmountError(
                      `You cannot transfer more than ₹${w1Balance}.`
                    );
                  } else {
                    setAmountError("");
                  }
                }}
                margin="normal"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, mb: 1 }}
                error={Boolean(amountError)}
                helperText={amountError}
              />

              <TextField
                label="Remark"
                variant="outlined"
                fullWidth
                value={remark}
                onChange={(e) => {
                  setRemark(e.target.value);
                  setRemarkError("");
                }}
                margin="normal"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, mb: 2 }}
                error={Boolean(remarkError)}
                helperText={remarkError}
              />

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  py: 1.8,
                  fontSize: "1rem",
                  borderRadius: 3,
                  textTransform: "none",
                }}
                onClick={handleSendClick}
                disabled={creating}
              >
                {creating ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Send Amount"
                )}
              </Button>
            </>
          )}
        </CommonModal>

        <CommonMpinModal
          open={mpinModalOpen}
          setOpen={setMpinModalOpen}
          title="Enter MPIN"
          mPinCallBack={handleCreateTransfer}
        />
      </Box>
    </Box>
  );
};

export default W2wTransfer;
