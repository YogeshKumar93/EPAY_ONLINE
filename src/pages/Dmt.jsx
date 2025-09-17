import { useEffect, useState } from "react";
import { 
  Box, 
  TextField, 
  Divider, 
  Typography, 
  CircularProgress 
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";
import RemitterDetails from "./RemitterDetails";
import Beneficiaries from "./Beneficiaries";
import SelectedBeneficiary from "./SelectedBeneficiary";
import { useToast } from "../utils/ToastContext";
import RemitterRegister from "./RemitterRegister";
import CommonLoader from "../components/common/CommonLoader";
 

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

  return (
    <Box>
      {/* Mobile & Account Inputs */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="center"
        gap={1}
        mb={1}
      >
        {/* Mobile Number */}
        <Box sx={{ flex: 1, position: "relative" }}>
          <TextField
            label="Mobile Number"
            variant="outlined"
            value={mobile}
            onChange={handleMobileChange}
            inputProps={{ maxLength: 10 }}
            fullWidth
            disabled={loading}
          />
          {loading && (
            <CommonLoader loading={loading}  
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                right: 16,
                transform: "translateY(-50%)",
              }}
            />
          )}
        </Box>

        {/* OR Divider for small screens */}
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

        {/* Account Number */}
        <TextField
          label="Account Number"
          variant="outlined"
          value={account}
          onChange={(e) => setAccount(e.target.value.replace(/\D/g, ""))}
          inputProps={{ maxLength: 18 }}
          sx={{ flex: 1 }}
          fullWidth
          disabled={loading}
        />
      </Box>

      {/* OR Divider for medium+ screens */}
      <Divider sx={{ my: 1, display: { xs: "none", sm: "block" } }} />

      {/* Remitter Register Modal */}
      {openRegisterModal && (
        <RemitterRegister
          open={openRegisterModal}
          onClose={() => setOpenRegisterModal(false)}
          mobile={mobile}
          onSuccess={setSender}
        />
      )}

      {/* Main Content: Left & Right Columns */}
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
