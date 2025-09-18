import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useContext } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";
import RemitterDetails from "./RemitterDetails";
import Beneficiaries from "./Beneficiaries";
import SelectedBeneficiary from "./SelectedBeneficiary";
import { useToast } from "../utils/ToastContext";
import RemitterRegister from "./RemitterRegister";
import CommonLoader from "../components/common/CommonLoader";

import OutletDmt1 from "./OutletDnt1";
import AuthContext from "../contexts/AuthContext";

const Dmt = () => {
  const [mobile, setMobile] = useState("");
  const [account, setAccount] = useState("");
  const [sender, setSender] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { authUser } = useContext(AuthContext); // Get auth user data
  const [openDmt1Modal, setOpenDmt1Modal] = useState(false);

  const instId = authUser?.instId; // Check if instId exists

  // Fetch sender details
  const handleFetchSender = async (number = mobile) => {
    if (!number || number.length !== 10) return;

    setLoading(true); // start loader

    const { error, response } = await apiCall("post", ApiEndpoints.DMT1, {
      mobile_number: number,
      account_number: account || undefined,
    });

    setLoading(false); // stop loader

    if (response) {
      const data = response?.data || response?.response?.data;
      const message = response?.message || "";

      if (message === "Remitter Found") {
        setSender(data);
        setBeneficiaries(data?.beneficiaries || []);
        setShowRegister(false);
        showToast(message, "success");
      } else if (message === "Remitter Not Found") {
        setSender(null);
        setOpenRegisterModal(true);
        setBeneficiaries([]);
        setShowRegister(true);
      } else {
        apiErrorToast(message || "Unexpected response");
      }
    } else if (error) {
      apiErrorToast(error?.message || "Something went wrong");
      setSender(null);
      setBeneficiaries([]);
      setShowRegister(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle mobile input change
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setMobile(value);
      if (value.length === 10) handleFetchSender(value);
      else {
        setSender(null);
        setBeneficiaries([]);
        setShowRegister(false);
        setSelectedBeneficiary(null);
      }
    }
  };

  // Delete a beneficiary
  const handleDeleteBeneficiary = (id) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    if (selectedBeneficiary?.id === id) setSelectedBeneficiary(null);
  };

  <OutletDmt1
    open={openDmt1Modal}
    handleClose={() => setOpenDmt1Modal(false)}
    onSuccess={() => {
      setOpenDmt1Modal(false);
      window.location.reload(); // optional, depending on your logic
    }}
  />;

  return (
    <Box>
      {instId ? (
        <Box
          textAlign="center"
          mt={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <Typography variant="h6" color="text.secondary">
            You need to complete Outlet Registration to use DMT1.
          </Typography>
          <button
            onClick={() => setOpenDmt1Modal(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Register Outlet
          </button>

          <OutletDmt1
            open={openDmt1Modal}
            handleClose={() => setOpenDmt1Modal(false)}
            onSuccess={() => {
              setOpenDmt1Modal(false);
              window.location.reload(); // Or refresh instId via context if dynamic
            }}
          />
        </Box>
      ) : (
        <>
          {/* ✅ Full DMT UI goes here when instId is present */}

          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems="center"
            gap={1}
            mb={1}
          >
            <TextField
              label="Mobile Number"
              variant="outlined"
              value={mobile}
              onChange={handleMobileChange}
              inputProps={{ maxLength: 10 }}
              sx={{ flex: 1 }}
              fullWidth
            />

            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                justifyContent: "center",
                width: "100%",
                my: 0.5,
              }}
            >
              <Divider sx={{ width: "30%", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>
            </Box>

            <TextField
              label="Account Number"
              variant="outlined"
              value={account}
              onChange={(e) => setAccount(e.target.value.replace(/\D/g, ""))}
              inputProps={{ maxLength: 18 }}
              sx={{ flex: 1 }}
              fullWidth
            />
          </Box>

          {/* <Divider sx={{ my: 1, display: { xs: "none", sm: "block" } }} /> */}

          {openRegisterModal && (
            <RemitterRegister
              open={openRegisterModal}
              onClose={() => setOpenRegisterModal(false)}
              mobile={mobile}
              onSuccess={setSender}
            />
          )}

          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={0.5}
          >
            <Box flex="0 0 30%" display="flex" flexDirection="column">
              <RemitterDetails sender={sender} />

              {selectedBeneficiary && (
                <SelectedBeneficiary
                  beneficiary={selectedBeneficiary}
                  senderId={sender.id}
                  sender={sender}
                  senderMobile={sender.mobileNumber}
                  referenceKey={sender.referenceKey}
                />
              )}
            </Box>

            <Box flex="0 0 70%">
              <Beneficiaries
                sender={sender}
                onSuccess={handleFetchSender}
                beneficiaries={beneficiaries}
                onSelect={setSelectedBeneficiary}
                onDelete={handleDeleteBeneficiary}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dmt;
