import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";
import AEPS2FAModal from "../components/AEPS/AEPS2FAModal";
import AuthContext from "../contexts/AuthContext";
import OtpModal from "./OtpModal";

const Dmt2RemitterRegister = ({
  open,
  onClose,
  mobile,
  onSuccess,
  referenceKey,
  setAeps2faOpen,
  aeps2faOpen,
}) => {
  const { showToast } = useToast();
  const authCtx = useContext(AuthContext);
  const loc = authCtx?.location;

  const [formData, setFormData] = useState({
    mobile_number: mobile || "",
    aadhaar_number: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [remitterRef, setRemitterRef] = useState(null);

  useEffect(() => {
    if (mobile) {
      setFormData((prev) => ({ ...prev, mobile_number: mobile }));
      setErrors({});
    }
  }, [mobile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAadhaar = () => {
    if (!formData.aadhaar_number || formData.aadhaar_number.length !== 12) {
      setErrors({ aadhaar_number: "Please enter valid 12-digit Aadhaar" });
      return;
    }
    setErrors({});
    setAeps2faOpen(true);
  };

  const handleAPICall = async (scanData) => {
    setSubmitting(true);
    const payload = {
      aadhaar_number: formData.aadhaar_number,
      mobile_number: formData.mobile_number,
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
      latitude: loc?.lat || 0,
      longitude: loc?.long || 0,
      amount: formData.amount,
      pf: "web",
      reference_key: referenceKey,
      operator: 15,
    };

    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.DMT2_REGISTER_REMITTER,
        payload
      );

      if (response?.data?.data) {
        showToast(
          response?.data?.message || "Registration successful",
          "success"
        );
        setRemitterRef(response.data.data); // Save for OTP verification
        setAeps2faOpen(false);
      } else {
        showToast(
          error?.message || response?.data?.message || "KYC failed",
          "error"
        );
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* AEPS 2FA Modal */}
      {aeps2faOpen && remitterRef && (
        <AEPS2FAModal
          open={aeps2faOpen}
          onClose={() => {
            setAeps2faOpen(false);
            onClose();
          }}
          aadhaar={formData.aadhaar_number}
          setAadhaar={() => {}}
          formData={formData}
          onFingerSuccess={handleAPICall}
          fingerData={() => {}}
          setFormData={setFormData}
          type="registerRemitter"
          title="Remitter KYC"
        />
      )}

      {/* OTP Verification Modal */}
      {remitterRef && !aeps2faOpen && (
        <OtpModal
          open={!!remitterRef}
          onClose={(success) => {
            if (success) onSuccess(remitterRef);
            setRemitterRef(null);
            onClose();
          }}
          remitterRef={remitterRef}
        />
      )}

      {/* Aadhaar Form Dialog */}
      {!aeps2faOpen && !remitterRef && (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
          <DialogTitle>Register Remitter</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                label="Mobile Number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                fullWidth
                disabled
              />
              <TextField
                label="Aadhaar Number"
                name="aadhaar_number"
                value={formData.aadhaar_number}
                onChange={handleChange}
                fullWidth
                error={!!errors.aadhaar_number}
                helperText={errors.aadhaar_number}
                inputProps={{ maxLength: 12 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={submitting} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAadhaar}
              disabled={submitting || !formData.aadhaar_number}
              variant="contained"
              sx={{
                backgroundColor: "#2275b7",
                "&:hover": { backgroundColor: "#1b5e94" },
              }}
            >
              {submitting ? "Processing..." : "Submit Aadhaar"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default Dmt2RemitterRegister;
