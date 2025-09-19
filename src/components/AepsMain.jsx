import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Grid,
  Tabs,
  Tab,
  Stack,
  TextField,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import AEPS2FAModal from "./AEPS/AEPS2FAModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";
import Aeps2FaCommon from "./User/Aeps2FaCmmon";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
const AepsMainComponent = () => {
  const [aadhaar, setAadhaar] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [aeps2FAOpen, setAeps2FAOpen] = useState(false);
  const [fingerprintData, setFingerprintData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setLoadingBanks(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.AEPS_BANKS
      ); // your bank list API
      if (response) {
        setBanks(response.data);
      } else {
        showToast("Failed to load banks", "error");
      }
    } catch (err) {
      showToast("Something went wrong while fetching banks", "error");
    } finally {
      setLoadingBanks(false);
    }
  };

  const [formData, setFormData] = useState({
    mobile: "",
    amount: 0,
    bank: "",
    bank_iin: "",
    activeTab: 0,
  });

  const { location } = useContext(AuthContext) || {};
  const { showToast } = useToast() || { showToast: (msg) => alert(msg) };

  const handleTabChange = (e, val) => {
    setActiveTab(val);
    setFormData((prev) => ({ ...prev, activeTab: val }));
  };

  const handleFingerSuccess = (scanData) => {
    setAeps2FAOpen(false);
    // if (!formData.aadhaar || !formData.bank) {
    //   showToast("Fill Aadhaar & Bank first", "error");
    //   return;
    // }
    handleAPICall(scanData);
  };

  const handleAPICall = async (scanData) => {
    setLoading(true);
    const payload = {
      AadhaarNumber: aadhaar,
      BankName: formData.bank,
      bank_iin: formData.bank_iin,
      number: formData.mobile,
      pidData: scanData.pidData || scanData.pid,
      pidDataType: scanData.pidDataType || scanData.type,
      ci: scanData.ci || scanData.cI,
      dc: scanData.dc || scanData.dC,
      dpId: scanData.dpId || scanData.dpID,
      fCount: scanData.fCount,
      hmac: scanData.hmac || scanData.hMac,
      mc: scanData.mc || scanData.mC,
      errInfo: scanData.errInfo,
      mi: scanData.mi || scanData.mI,
      nmPoints: scanData.nmPoints,
      qScore: scanData.qScore,
      rdsId: scanData.rdsId,
      rdsVer: scanData.rdsVer,
      sessionKey: scanData.sessionKey,
      srno: scanData.srno,
      operator: activeTab === 0 ? 50 : 49,
      latitude: location?.lat || 0,
      longitude: location?.long || 0,
      amount: formData.amount,
      pf: "web",
      type:
        activeTab === 0
          ? "CASH_WITHDRAWAL"
          : activeTab === 1
          ? "BALANCE_ENQUIRY"
          : "MINI_STATEMENT",
    };

    let endpoint =
      activeTab === 0
        ? ApiEndpoints.AEPS_CASHWITHDRAWAL
        : activeTab === 1
        ? ApiEndpoints.AEPS_BALANCE_ENQUIRY
        : ApiEndpoints.AEPS_MINI_STATEMENT;

    try {
      const { error, response } = await apiCall("post", endpoint, payload);
      if (error) showToast(error?.message, "error");
      else {
        const resp = response?.data;
        showToast(
          resp?.message || "Success",
          resp?.status ? "success" : "error"
        );
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          minHeight: "48px",
          mb: 2,
          "& .MuiTabs-indicator": {
            height: "3px",
            borderRadius: "3px 3px 0 0",
            background: "linear-gradient(135deg, #9d72f0, #7b4dff)",
          },
          "& .MuiTab-root": {
            minHeight: "48px",
            padding: "8px 12px",
            fontSize: "0.85rem",
            fontWeight: "600",
            textTransform: "none",
            color: "text.secondary",
            transition: "all 0.2s ease",
            "&.Mui-selected": {
              color: "#7b4dff",
              fontWeight: "700",
            },
          },
        }}
      >
        <Tab
          label="Cash Withdrawal"
          icon={<AccountBalanceWalletIcon sx={{ fontSize: "18px", mb: 0 }} />}
          iconPosition="start"
        />
        <Tab
          label="Balance Enquiry"
          icon={<AccountBalanceIcon sx={{ fontSize: "18px", mb: 0 }} />}
          iconPosition="start"
        />
        <Tab
          label="Mini Statement"
          icon={<ReceiptIcon sx={{ fontSize: "18px", mb: 0 }} />}
          iconPosition="start"
        />
      </Tabs>
      <Aeps2FaCommon
        open={aeps2FAOpen}
        onClose={() => setAeps2FAOpen(false)}
        title="AEPS"
        formData={formData}
        setFormData={setFormData}
        onFingerSuccess={handleFingerSuccess}
        banks={banks}
        aadhaar={aadhaar}
        fingerData={setFingerprintData}
        setAadhaar={setAadhaar}
      />
    </>
  );
};
export default AepsMainComponent;
