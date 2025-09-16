import { useState } from "react";
import { Box, TextField, Divider, Typography } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import RemitterDetails from "./RemitterDetails";
import Beneficiaries from "./Beneficiaries";
import SelectedBeneficiary from "./SelectedBeneficiary";
import { useToast } from "../utils/ToastContext";
import RemitterRegister from "./RemitterRegister";

const Dmt = () => {
  const [mobile, setMobile] = useState("");
  const [account, setAccount] = useState("");
  const [sender, setSender] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const { showToast } = useToast();

  const handleFetchSender = async (number = mobile) => {
    if (!number || number.length !== 10) return;

    const { error, response } = await apiCall("post", ApiEndpoints.DMT1, {
      mobile_number: number,
      account_number: account || undefined,
    });

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

  const handleDeleteBeneficiary = (id) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    if (selectedBeneficiary?.id === id) setSelectedBeneficiary(null);
  };

  return (
    <Box>
      {/* Mobile Number */}
      <TextField
        label="Mobile Number"
        variant="outlined"
        fullWidth
        value={mobile}
        onChange={handleMobileChange}
        inputProps={{ maxLength: 10 }}
        sx={{ mb: 0 }}
      />

      {/* OR Divider */}
      <Divider sx={{ my: 1 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      {/* Account Number */}
      <TextField
        label="Account Number"
        variant="outlined"
        fullWidth
        value={account}
        onChange={(e) => setAccount(e.target.value.replace(/\D/g, ""))}
        inputProps={{ maxLength: 18 }}
        sx={{ mb: 1 }}
      />

      {openRegisterModal && (
        <RemitterRegister
          open={openRegisterModal}
          onClose={() => setOpenRegisterModal(false)}
          mobile={mobile}
          onSuccess={setSender}
        />
      )}

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={0.5}>
        {/* Left column */}
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

        {/* Right column */}
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
    </Box>
  );
};

export default Dmt;
