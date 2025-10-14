import { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Divider,
  Typography,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import RemitterDetails from "./RemitterDetails";
import Beneficiaries from "./Beneficiaries";
import SelectedBeneficiary from "./SelectedBeneficiary";
import { useToast } from "../utils/ToastContext";
import RemitterRegister from "./RemitterRegister";
import AuthContext from "../contexts/AuthContext";
import Dmt2SelectedBene from "./Dmt2SelectedBene";
import Dmt2Beneficiaries from "./Dmt2Beneficiaries";
import CommonLoader from "../components/common/CommonLoader";
import Loader from "../components/common/Loader";
import MobileNumberList from "./MobileNumberList";
import SearchIcon from "@mui/icons-material/Search";
import Dmt2RemitterRegister from "./Dmt2RemitterRegister";
import OtpModal from "./OtpModal";

const Dmt2 = () => {
  const [mobile, setMobile] = useState("");
  const [sender, setSender] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const { showToast } = useToast();
  const { location } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [mobileList, setMobileList] = useState([]);
  const [aeps2faOpen, setAeps2faOpen] = useState(false);
  const [otpRemitterRef, setOtpRemitterRef] = useState(null); // new state

  const handleFetchSender = async (number = mobile) => {
    if (!number || number.length !== 10) return;

    setLoading(true); // start loader
    const { error, response } = await apiCall("post", ApiEndpoints.DMT2, {
      mobile_number: number,
      latitude: location?.lat || "",
      longitude: location?.long || "",
    });
    setLoading(false); // stop loader

    if (response) {
      const data = response?.data || response?.response?.data;
      const message = response?.message || "";

      if (response?.message === "Remitter Found") {
        // success always gives sender
        setSender(data);
        setBeneficiaries(data?.beneficiaries || []);
        setShowRegister(false);
        showToast(message, "success");
      } else if (message === "Please do remitter e-kyc.") {
        setSender(null);
        setOpenRegisterModal(true);
        setBeneficiaries([]);
        setShowRegister(true);
      } else {
        apiErrorToast(message || "Unexpected response");
      }
    } else if (error?.message === "Kindly Register the remitter.") {
      setSender(null);
      setBeneficiaries([]);
      setShowRegister(true);
      console.log("eroorsss", error?.errors);

      setOtpRemitterRef({
        mobile: number,
        stateresp: error?.errors?.stateresp, // if available
        ekyc_id: error?.errors?.ekyc_id, // if available
      });
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
        setAeps2faOpen(false); // Reset 2FA state
      }
    }
  };
  const handleAccountChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setAccountNumber(value);
  };

  const handleDeleteBeneficiary = (id) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    if (selectedBeneficiary?.id === id) setSelectedBeneficiary(null);
  };

  return (
    <CommonLoader loading={loading}>
      <Box>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={1}
          mb={1}
          alignItems="center"
        >
          <TextField
            label="Mobile Number"
            variant="outlined"
            value={mobile}
            onChange={handleMobileChange}
            inputProps={{ maxLength: 10 }}
            fullWidth
            autoComplete="tel"
          />

          <Divider
            sx={{
              display: { xs: "flex", sm: "none" },
              width: "30%",
              my: 1,
              "&::before, &::after": { borderColor: "divider" },
              textAlign: "center",
            }}
          >
            OR
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

      {loading && (
        <CommonLoader
          loading={loading}
          size={24}
          sx={{
            position: "absolute",
            top: "50%",
            right: 16,
            transform: "translateY(-50%)",
          }}
        />
      )}

      {openRegisterModal && (
        <Dmt2RemitterRegister
          open={openRegisterModal}
          onClose={() => setOpenRegisterModal(false)}
          mobile={mobile}
          onSuccess={setSender}
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
      {otpRemitterRef && (
        <OtpModal
          open={!!otpRemitterRef}
          remitterRef={otpRemitterRef}
          onClose={(success) => {
            if (success) setSender({ mobile: otpRemitterRef.mobile });
            setOtpRemitterRef(null);
          }}
        />
      )}

      {/* 🔹 Full-width stacked layout */}
      <Box display="flex" flexDirection="column" gap={1}>
        {/* Remitter full width */}
        <Box width="100%">
          <RemitterDetails sender={sender} />
        </Box>

        {/* Selected beneficiary (still below Remitter, full width) */}
        {/* {selectedBeneficiary && (
          <Box width="100%">
            <Dmt2SelectedBene
              beneficiary={selectedBeneficiary}
              senderId={sender.id}
              sender={sender}
              senderMobile={sender.mobile}
              referenceKey={sender.referenceKey}
            />
          </Box>
        )} */}

        {/* Beneficiaries list full width */}
        <Box width="100%">
          <Dmt2Beneficiaries
            sender={sender}
            onSuccess={handleFetchSender}
            beneficiaries={beneficiaries}
            onSelect={setSelectedBeneficiary}
            onDelete={handleDeleteBeneficiary}
          />
        </Box>
      </Box>
    </CommonLoader>
  );
};

export default Dmt2;
