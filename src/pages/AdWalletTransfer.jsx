import React, { useContext, useEffect, useState } from "react";
import {
  IconButton,
  TextField,
  CircularProgress,
  Card,
  Typography,
  Grid,
  Button,
  Box,
} from "@mui/material";
import { AccountBalanceWallet } from "@mui/icons-material";
import CommonModal from "../components/common/CommonModal";
import CommonMpinModal from "../components/common/CommonMpinModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import debounce from "lodash.debounce";
{
  /* Wallet Icon */
}
import { CurrencyRupee } from "@mui/icons-material";
import CommonLoader from "../components/common/CommonLoader";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";

const AdWalletTransfer = ({ row, open, onClose }) => {
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const authCtx = useContext(AuthContext);

  const loadUserProfile = authCtx.loadUserProfile;

  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  // Fetch receiver details from mobile number
  const fetchReceiver = async () => {
    setLoading(true);
    setError("");
    try {
      const { response } = await apiCall(
        "post",
        ApiEndpoints.WALLET_GET_RECEIVER,
        {
          user_id: `P2PAE${row.id}`,
        }
      );

      if (response && response.data) {
        setReceiver(response.data);
      } else {
        setError("Receiver not found");
      }
    } catch (err) {
      setError("Something went wrong while fetching receiver");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      fetchReceiver();
    }
  }, []);

  const handleSendClick = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setError("");
    setMpinModalOpen(true);
  };

  const handleCreateTransfer = async (mpin) => {
    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        reciever_id: receiver.id,
        amount: parseFloat(amount),
        remark,
        mpin,
        operator: 17,
      };

      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.WALLET_CREATE,
        payload
      );

      if (response) {
        showToast(response?.message || "Transfer successful", "success");
        setSuccess(response?.message || "Transfer successful");
        setAmount("");
        setRemark("");
        loadUserProfile();
        onClose();
      } else {
        showToast(error.message || error.errors, "error");
        setError(error?.message || "Transfer failed");
      }
    } catch (err) {
      setError("Something went wrong during transfer");
    } finally {
      setCreating(false);
      setMpinModalOpen(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid",
          borderColor: "primary.main", // border color
        }}
      >
        <IconButton
          onClick={fetchReceiver}
          size="small"
          sx={{ p: 0, color: "primary.main" }} // icon color matches border
        >
          <CurrencyRupee fontSize="small" />
        </IconButton>
      </Box>

      {/* {loading && <CircularProgress size={24} />} */}
      <CommonModal
        open={open}
        onClose={onClose}
        title="Wallet Transfer"
        footerButtons={[]}
      >
        {loading ? (
          <CommonLoader loading={loading} />
        ) : receiver ? (
          <>
            {/* Receiver Details */}
            <Card
              elevation={4}
              sx={{
                mb: 1,
                borderRadius: 3,
                p: 2,
                background: "linear-gradient(to right, #e3f2fd, #ffffff)",
              }}
            >
              <Grid
                container
                spacing={2}
                sx={{ justifyContent: "space-between" }}
              >
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    fontWeight={600}
                  >
                    Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {receiver.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    fontWeight={600}
                  >
                    Establishment
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {receiver.establishment}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    fontWeight={600}
                  >
                    Role
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {receiver.role}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    fontWeight={600}
                  >
                    Mobile
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {receiver.mobile}
                  </Typography>
                </Grid>
              </Grid>
            </Card>

            {/* Amount & Remark */}
            <TextField
              label="Enter Amount"
              variant="outlined"
              fullWidth
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9.]/g, ""))
              }
              margin="normal"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, mb: 2 }}
            />
            <TextField
              label="Remark (Optional)"
              variant="outlined"
              fullWidth
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              margin="normal"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 }, mb: 2 }}
            />

            {/* Error / Success */}
            {error && (
              <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography
                color="success.main"
                sx={{ mb: 2, textAlign: "center" }}
              >
                {success}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              sx={{
                py: 1.8,
                fontSize: "1rem",
                borderRadius: 3,
                textTransform: "none",
                background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
                },
              }}
              onClick={handleSendClick}
              disabled={creating || !amount || parseFloat(amount) <= 0}
            >
              {creating ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Send Amount"
              )}
            </Button>
          </>
        ) : (
          <Typography textAlign="center" sx={{ mt: 2 }}>
            Receiver not found
          </Typography>
        )}
      </CommonModal>

      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        title="Enter MPIN to Confirm Transfer"
        mPinCallBack={handleCreateTransfer}
      />
    </Box>
  );
};

export default AdWalletTransfer;
