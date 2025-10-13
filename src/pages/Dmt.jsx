import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Divider,
  Typography,
  CircularProgress,
    IconButton,
    InputAdornment,
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
import OutletDmt1 from "./OutletDnt1";
import AuthContext from "../contexts/AuthContext";
import Loader from "../components/common/Loader";
import CommonLoader from "../components/common/CommonLoader";
import MobileNumberList from "./MobileNumberList";
import SearchIcon from "@mui/icons-material/Search";

const Dmt = () => {
  const [mobile, setMobile] = useState("");
  const [account, setAccount] = useState("");
  const [sender, setSender] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [referenceKey, setReferenceKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [aeps2faOpen, setAeps2faOpen] = useState(false);
  const { showToast } = useToast();
  const { user } = useContext(AuthContext);
  const [openDmt1Modal, setOpenDmt1Modal] = useState(false);
    const [accountNumber, setAccountNumber] = useState("");
   const [mobileListOpen, setMobileListOpen] = useState(false);
    const [mobileList, setMobileList] = useState([]);

  const instId = user?.instId;

  // Fetch sender details
  const handleFetchSender = async (number = mobile) => {
    if (!number) return;

    setLoading(true);
    const { error, response } = await apiCall("post", ApiEndpoints.DMT1, {
      mobile_number: number,
      account_number: account || undefined,
    });
    setLoading(false);

    if (response) {
      const data = response?.data || response?.response?.data;
      const message = response?.message || "";

      if (message === "Remitter Found") {
        setSender(data);
        setBeneficiaries(data?.beneficiaries || []);
        setShowRegister(false);
        setOpenRegisterModal(false); // Close register modal if open
        showToast(message, "success");
      } else if (message === "Remitter Not Found") {
        setSender(null);
        setOpenRegisterModal(true);
        setReferenceKey(response?.data?.referenceKey);
        setBeneficiaries([]);
        setShowRegister(true);
        setSelectedBeneficiary(null); // Clear selected beneficiary
      }
    } else if (error) {
      showToast(error?.message || "Something went wrong", "error");
      setSender(null);
      setBeneficiaries([]);
      setShowRegister(true);
      setSelectedBeneficiary(null);
    }
  };

   const handleFetchSenderByAccount = async (accNumber) => {
      if (!accNumber || accNumber.length < 9) return;
      setLoading(true);
  
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_SENDER_BY_ACC,
        {
          account_number: accNumber,
        }
      );
  
      setLoading(false);
  
      if (response) {
        const data = response?.data || response?.response?.data;
        if (Array.isArray(data) && data.length > 0) {
          setMobileList(data);
          setMobileListOpen(true); // 👈 open modal
        } else {
          showToast("No mobile numbers found for this account", "warning");
        }
      } else if (error) {
        showToast(
          error?.message || "Failed to fetch sender by account number",
          "error"
        );
      }
    };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setMobile(value);

      if (value.length === 10) {
        handleFetchSender(value);
      } else {
        // Clear all state if less than 10 digits
        setSender(null);
        setBeneficiaries([]);
        setSelectedBeneficiary(null);
        setOpenRegisterModal(false);
        setReferenceKey("");
        setAeps2faOpen(false); // Reset 2FA state
      }
    }
  };

  const handleDeleteBeneficiary = (id) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    if (selectedBeneficiary?.id === id) setSelectedBeneficiary(null);
  };

  // Reset everything when modal closes
  const handleRegisterModalClose = () => {
    setOpenRegisterModal(false);
    setAeps2faOpen(false);
  };

  // Handle successful registration
  const handleRegistrationSuccess = (senderData) => {
    setSender(senderData);
    setBeneficiaries(senderData?.beneficiaries || []);
    setOpenRegisterModal(false);
    setAeps2faOpen(false);
    showToast("Registration successful", "success");
  };

  return (
    <Box>
      <CommonLoader loading={loading} />
      {!instId ? (
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
            }}
          />
        </Box>
      ) : (
        <>
          {/* Mobile and Account Input Fields */}
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
              value={accountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // allow only digits
                setAccountNumber(value);
              }}
              inputProps={{ maxLength: 18 }}
              sx={{ flex: 1 }}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      onClick={() => handleFetchSenderByAccount(accountNumber)}
                      disabled={!accountNumber || accountNumber.length < 9}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {openRegisterModal && (
            <RemitterRegister
              open={openRegisterModal}
              onClose={handleRegisterModalClose}
              referenceKey={referenceKey}
              mobile={mobile}
              onSuccess={handleRegistrationSuccess}
              aeps2faOpen={aeps2faOpen}
              setAeps2faOpen={setAeps2faOpen}
            />
          )}
            {mobileListOpen && (
                  <MobileNumberList
                    open={mobileListOpen}
                    onClose={() => setMobileListOpen(false)}
                    numbers={mobileList}
                    onSelect={(selectedMobile) => {
                      setMobile(selectedMobile);
                      handleFetchSender(selectedMobile);
                    }}
                  />
                )}

          {/* MAIN FIX: Hide everything when 2FA is open */}
          {!aeps2faOpen && !openRegisterModal && (
            <>
              {selectedBeneficiary ? (
                <Box>
                  <SelectedBeneficiary
                    beneficiary={selectedBeneficiary}
                    senderId={sender?.id}
                    sender={sender}
                    senderMobile={sender?.mobileNumber}
                    referenceKey={sender?.referenceKey}
                    amount={selectedBeneficiary.enteredAmount}
                    onBack={() => setSelectedBeneficiary(null)}
                  />
                </Box>
              ) : (
                // Only show when no 2FA and no register modal
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box width="100%">
                    <RemitterDetails sender={sender} />
                  </Box>

                  <Box width="100%">
                    <Beneficiaries
                      sender={sender}
                      onSuccess={handleFetchSender}
                      beneficiaries={beneficiaries}
                      onSelect={setSelectedBeneficiary}
                      onDelete={handleDeleteBeneficiary}
                    />
                  </Box>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};
export default Dmt;
