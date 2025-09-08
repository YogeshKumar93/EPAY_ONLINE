import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import SenderDetails from "./SenderDetails";
import SenderRegisterModal from "./SenderRegisterModal";
import VerifySenderModal from "./VerifySenderModal";

const SuperTransfer = () => {
  const [mobile, setMobile] = useState("");
  const [sender, setSender] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [otpRef, setOtpRef] = useState(null);
const [otpData, setOtpData] = useState(null);

// ✅ Fetch sender by mobile number
const handleFetchSender = async (number = mobile) => {  // default to current mobile
  if (!number || number.length !== 10) return;

  try {
    const response = await apiCall("post", ApiEndpoints.GET_SENDER, {
      mobile_number: number,
    });

    const data = response?.data || response?.response?.data;

    if (response?.status) {
      okSuccessToast(response.message || "Sender fetched successfully");
    }

    if (data && data?.is_active === 1) {
      setSender(data);
      setOpenRegisterModal(false);
    } else {
      setSender(null);
      setOpenRegisterModal(true);
    }
  } catch (error) {
    apiErrorToast(error);
    console.error("Error fetching sender:", error);
  }
};


  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setMobile(value);
      if (value.length === 10) {
        handleFetchSender(value);
      }
    }
  };

  // ✅ callback from SenderRegisterModal
const handleSenderRegistered = ({ mobile_number, otp_ref, sender_id }) => {
  console.log("Sender Registered Callback:", { mobile_number, otp_ref, sender_id });
  setOtpData({ mobile_number, otp_ref, sender_id });
  setOpenVerifyModal(true);
};

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Super Transfer
      </Typography>

      {!sender ? (
        <TextField
          label="Mobile Number"
          variant="outlined"
          fullWidth
          value={mobile}
          onChange={handleChange}
          inputProps={{ maxLength: 10 }}
        />
      ) : (
       <SenderDetails 
  sender={sender}  
  onSuccess={() => {
    handleFetchSender(); // Just call without parameters
  }} 
/>
      )}

      {/* Register Modal */}
      {openRegisterModal && (
        <SenderRegisterModal
          open={openRegisterModal}
          onClose={() => setOpenRegisterModal(false)}
          mobile={mobile}
          onRegistered={handleSenderRegistered}
        />
      )}

  {/* Verify Modal */}
{openVerifyModal && otpData && (
  <VerifySenderModal
    open={openVerifyModal}
    onClose={() => setOpenVerifyModal(false)}
    mobile={otpData.mobile_number}
    otpRef={otpData.otp_ref}
    otpData={otpData}   // ✅ now otpData will have sender_id and otp_ref
  />
)}

    </Box>
  );
};

export default SuperTransfer;
