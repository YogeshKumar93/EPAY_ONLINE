import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import debounce from "lodash.debounce";
import { useToast } from "../utils/ToastContext";
import CommonModal from "../components/common/CommonModal";
import CommonMpinModal from "../components/common/CommonMpinModal";

const W2wTransfer = ({ handleFetchRef, type }) => {
  const [mobile, setMobile] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);

  const fetchReceiver = async (mobileNumber) => {
    if (!mobileNumber) {
      setReceiver(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { response } = await apiCall(
        "post",
        ApiEndpoints.WALLET_GET_RECEIVER,
        { mobile_number: mobileNumber }
      );

      if (response) {
        setReceiver(response?.data);
        setModalOpen(true);
      } else {
        setReceiver(null);
        setError("Receiver not found");
      }
    } catch (err) {
      setReceiver(null);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchReceiver, 500);

  useEffect(() => {
    if (mobile.length === 10) {
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

    setCreating(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        reciever_id: receiver.id,
        amount: parseFloat(amount),
        remark,
        mpin, // send MPIN here
      };

      const { response } = await apiCall(
        "post",
        ApiEndpoints.WALLET_CREATE,
        payload
      );

      if (response) {
        showToast(response?.message || "Transfer successful", "success");
        handleFetchRef();
        setAmount("");
        setRemark("");
        setReceiver(null);
        setMobile("");
        setModalOpen(false);
      } else {
        setError(response?.data?.message || "Transfer failed");
      }
    } catch (err) {
      setError("Something went wrong while creating transfer");
    } finally {
      setCreating(false);
    }
  };

  // when Send Amount is clicked, open MPIN modal
  const handleSendClick = () => {
    setMpinModalOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        // mt: -4,
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Box elevation={6} sx={{ borderRadius: 3 }}>
          {type !== "w2w" && (
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
          )}

          {/* Mobile Input */}
          <TextField
            label="Enter Receiver's Number"
            variant="outlined"
            fullWidth
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/, ""))}
            margin="normal"
            inputProps={{ maxLength: 10 }}
            sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          {/* Loader */}
          {loading && (
            <Grid container justifyContent="center" sx={{ my: 2 }}>
              <CircularProgress />
            </Grid>
          )}

          {/* Error / Success Messages */}
          {error && (
            <Typography
              color="error"
              sx={{ mt: 1, mb: 2, textAlign: "center" }}
            >
              {error}
            </Typography>
          )}
          {success && (
            <Typography
              color="success.main"
              sx={{ mt: 1, mb: 2, textAlign: "center" }}
            >
              {success}
            </Typography>
          )}

          {/* Receiver Modal */}
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
                  sx={{
                    color: "#1976d2",
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  Receiver Details
                </Typography>

                <Card
                  elevation={4}
                  sx={{
                    // mb: 3,
                    borderRadius: 3,
                    p: 2,
                    background: "linear-gradient(to right, #e3f2fd, #ffffff)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    // justifyContent:"space-between"
                  }}
                >
                  <Grid container spacing={2} justifyContent="space-between">
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

                {/* Amount + Remark */}
                <TextField
                  label="Enter Amount"
                  variant="outlined"
                  fullWidth
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  margin="normal"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    mb: 1,
                  }}
                />

                <TextField
                  label="Remark"
                  variant="outlined"
                  fullWidth
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  margin="normal"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    mb: 2,
                  }}
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
                    background:
                      "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
                    },
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

          {/* MPIN Modal */}
          <CommonMpinModal
            open={mpinModalOpen}
            setOpen={setMpinModalOpen}
            title="Enter MPIN"
            mPinCallBack={handleCreateTransfer} // MPIN entered -> create transfer
          />
        </Box>
      </Box>
    </Box>
  );
};

export default W2wTransfer;
