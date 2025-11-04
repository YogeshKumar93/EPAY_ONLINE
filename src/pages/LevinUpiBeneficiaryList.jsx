import { useContext, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Button,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Avatar,
  Stack,
  Tooltip,
  TextField,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useToast } from "../utils/ToastContext";
import AuthContext from "../contexts/AuthContext";
import LevinUpiBeneficiaryDetails from "./LevinUpiBeneficiaryDetails";
import { upi, upi2 } from "../iconsImports";
import UpiVerificationModal from "./UpiVerificationModal";

const LevinUpiBeneficiaryList = ({ sender, onSuccess, onLevinSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showToast } = useToast();
  const { location } = useContext(AuthContext);

  const [openModal, setOpenModal] = useState(false);
  const [openList, setOpenList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [mpinDigits, setMpinDigits] = useState(Array(6).fill(""));
  const [tupResponse, setTupResponse] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [verifyingBeneficiary, setVerifyingBeneficiary] = useState(null);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  // schema for add form
  // const { schema, formData, handleChange, errors, setErrors, loading } =
  //   useSchemaForm(ApiEndpoints.GET_UPI_SCHEMA, openModal, {
  //     sender_id: sender?.id,
  //   });
  const [formData, setFormData] = useState({
    beneficiary_name: "",
    prefix: "",
    suffix: "ybl",
  });
  const [errors, setErrors] = useState({});

  // ✅ Hardcoded suffix options
  const suffixOptions = [
    "ybl",
    "paytm",
    "ibl",
    "axl",
    "okicici",
    "okaxis",
    "okhdfcbank",
    "kotak",
    "oksbi",
    "phpnepay",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Step 1: Verify + Add new beneficiary
  const handleAddAndVerifyBeneficiary = () => {
    setErrors({});

    // Combine prefix and suffix to form the complete UPI ID/account
    const finalSuffix =
      formData.suffix === "other" ? formData.custom_suffix : formData.suffix;
    const combinedBenAcc = `${formData.prefix}@${finalSuffix}`;
    const payload = {
      ...formData,
      suffix: finalSuffix, // ✅ ensure suffix key always holds the final suffix

      sender_id: sender?.id,
      mobile_number: sender?.mobile_number,
      rem_mobile: sender?.mobileNumber,
      ben_name: formData.beneficiary_name,
      ben_acc: combinedBenAcc, // ✅ Use combined prefix@suffix
      operator: 21, // ✅ for Levin route
      latitude: location?.lat || "",
      longitude: location?.long || "",
      pf: "WEB",
    };
    setPendingPayload(payload);
    setVerifyOpen(true);
  };
  const resetForm = () => {
    setFormData({
      beneficiary_name: "",
      prefix: "",
      suffix: "ybl",
      custom_suffix: "",
    });
    setErrors({});
  };

  const handleVerify = async () => {
    if (mpinDigits.some((d) => !d)) {
      apiErrorToast("Please enter all 6 digits of MPIN");
      return;
    }

    const mpin = mpinDigits.join("");
    try {
      setSubmitting(true);
      const verifyPayload = { ...pendingPayload, mpin };
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.DMT1_VERIFY_BENEFICIARY,
        verifyPayload
      );

      if (!response) {
        showToast(error?.message || "Failed to verify beneficiary", "error");
        setSubmitting(false);
        setVerifyOpen(false);
        setMpinDigits(Array(6).fill(""));
        return;
      }

      if (
        response?.data?.statuscode === "TUP" ||
        response?.message?.includes("Transaction Under Process")
      ) {
        // TUP - verification pending
        setTupResponse(response);
        setVerifyOpen(false);
        setSubmitting(false);
        setMpinDigits(Array(6).fill(""));
        return;
      }

      // ✅ Verification successful — Add beneficiary
      const verifiedName =
        response?.message || response?.data?.name || formData.beneficiary_name;
      const finalSuffix =
        formData.suffix === "other" ? formData.custom_suffix : formData.suffix;
      const combinedBenAcc = `${formData.prefix}@${finalSuffix}`;

      const addPayload = {
        ...formData,
        suffix: finalSuffix, // ✅ send actual suffix
        sender_id: sender?.id,
        ben_acc: combinedBenAcc, // ✅ Use combined prefix@suffix
        type: "LEVINUPI",
        beneficiary_name: verifiedName,
        account_number: combinedBenAcc, // ✅ Add account_number
        mobile_number: sender?.mobile_number,
        is_verified: 1,
      };

      const { response: addRes, error: addErr } = await apiCall(
        "post",
        ApiEndpoints.CREATE_BENEFICIARY,
        addPayload
      );

      if (addRes) {
        showToast(
          addRes?.message || "Beneficiary verified & added successfully",
          "success"
        );
        setVerifyOpen(false);
        setOpenModal(false);
        setMpinDigits(Array(6).fill(""));
        onSuccess?.(sender.mobile_number);
      } else {
        apiErrorToast(addErr?.message || "Failed to add beneficiary");
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyUpi = async () => {
    if (mpinDigits.some((d) => !d)) {
      apiErrorToast("Please enter all 6 digits of MPIN");
      return;
    }

    const mpin = mpinDigits.join("");
    try {
      setSubmitting(true);
      const verifyPayload = { ...pendingPayload, mpin, type: "UPI" };
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.DMT1_VERIFY_BENEFICIARY,
        verifyPayload
      );

      if (!response) {
        showToast(error?.message || "Failed to verify beneficiary", "error");
        setSubmitting(false);
        setMpinDigits(Array(6).fill(""));
        setVerifyingBeneficiary(null); // ✅ Close modal on failure
        return;
      }

      // ✅ Success case
      showToast(
        response?.message || "Beneficiary verified successfully",
        "success"
      );

      // ✅ Close modal & reset fields
      setVerifyingBeneficiary(null);
      setMpinDigits(Array(6).fill(""));

      // ✅ Trigger success callback
      onSuccess?.(sender.mobile_number);
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTUPConfirmation = async () => {
    try {
      setSubmitting(true);
      const finalSuffix =
        formData.suffix === "other" ? formData.custom_suffix : formData.suffix;
      const combinedBenAcc = `${formData.prefix}@${finalSuffix}`;

      const addPayload = {
        ...formData,
        suffix: finalSuffix, // ✅ explicitly include correct suffix

        sender_id: sender?.id,
        type: "LEVINUPI",
        beneficiary_name: formData.beneficiary_name,
        ben_acc: combinedBenAcc, // ✅ include ben_acc for backend mapping

        account_number: combinedBenAcc, // ✅ Store combined value
        // ifsc_code: "UPIINR", // ✅ Add IFSC code for UPI
        // bank_name: "UPI", // ✅ Add bank name for UPI
        mobile_number: sender?.mobile_number,
        tup_reference: tupResponse?.data?.txnReferenceId,
        is_verified: 0,
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.CREATE_BENEFICIARY,
        addPayload
      );

      if (response) {
        okSuccessToast(
          response?.message ||
            "Beneficiary added successfully (Verification Pending)"
        );
        setTupResponse(null);
        setOpenModal(false);
        onSuccess?.(sender.mobile_number);
      } else {
        apiErrorToast(error?.message || "Failed to add beneficiary");
      }
    } catch (err) {
      apiErrorToast(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTUPClose = () => {
    setTupResponse(null);
    setMpinDigits(Array(6).fill(""));
  };

  // Delete beneficiary
  const handleDeleteBeneficiary = async (id) => {
    try {
      const res = await apiCall("post", ApiEndpoints.DELETE_BENEFICIARY, {
        sender_id: sender.id,
        id,
      });
      if (res) {
        okSuccessToast(res?.message || "Beneficiary deleted successfully");
        onSuccess?.(sender.mobile_number);
      } else {
        apiErrorToast(res?.message || "Failed to delete beneficiary");
      }
    } catch (err) {
      apiErrorToast(err);
    }
  };

  const filteredBeneficiaries = useMemo(() => {
    if (!searchText) return sender?.beneficiary || [];
    return sender?.beneficiary?.filter((b) =>
      b.beneficiary_name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, sender?.beneficiary]);

  const handleMpinChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newDigits = [...mpinDigits];
      newDigits[index] = value;
      setMpinDigits(newDigits);
      if (value && index < 5)
        document.getElementById(`mpin-${index + 1}`).focus();
    }
  };

  return (
    <Card sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ py: 1, px: 2, background: "#6C4BC7" }}
      >
        <Typography variant="subtitle2" color="#fff" fontWeight="600">
          Beneficiary List
          {/* ({sender?.beneficiary?.length || 0}) */}
          {sender && <>({sender?.beneficiary?.length || 0})</>}
        </Typography>
        {sender && (
          <Button
            size="small"
            variant="contained"
            startIcon={<PersonAddIcon sx={{ fontSize: 14 }} />}
            onClick={() => setOpenModal(true)}
            sx={{
              color: "#000",
              backgroundColor: "#fff",
              textTransform: "none",
              fontSize: "0.7rem",
            }}
          >
            Add Beneficiary
          </Button>
        )}
      </Box>

      {/* List */}
      <Collapse in={openList}>
        <CardContent sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search beneficiary by name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ mb: 2 }}
          />

          <List dense sx={{ maxHeight: 300, overflowY: "auto" }}>
            {filteredBeneficiaries.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No beneficiaries found
              </Typography>
            ) : (
              filteredBeneficiaries.map((b) => (
                <ListItem
                  key={b.id}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      {b.is_verified === 1 ? (
                        <Box display="flex" alignItems="center" gap={0.3}>
                          <CheckCircleIcon
                            sx={{ fontSize: 16, color: "success.main" }}
                          />
                          <Typography
                            variant="caption"
                            color="success.main"
                            fontWeight="500"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            Verified
                          </Typography>
                        </Box>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          color="warning"
                          sx={{ textTransform: "none", fontSize: "0.7rem" }}
                          onClick={() => {
                            setPendingPayload({
                              sender_id: sender?.id,
                              ben_name: b.beneficiary_name,
                              ben_acc: b.account_number,
                              mobile_number: sender?.mobile_number,
                              operator: 21,
                              latitude: location?.lat || "",
                              longitude: location?.long || "",
                              pf: "WEB",
                            });
                            setVerifyingBeneficiary(b); // ✅ opens the new modal
                          }}
                        >
                          Verify
                        </Button>
                        // <Box display="flex" alignItems="center" gap={0.3}>
                        //   {/* <CheckCircleIcon
                        //     sx={{ fontSize: 16, color: "success.main" }}
                        //   /> */}
                        //   <Typography
                        //     variant="caption"
                        //     color="red"
                        //     fontWeight="500"
                        //     sx={{ fontSize: "0.75rem" }}
                        //   >
                        //     Not Verified
                        //   </Typography>
                        // </Box>
                      )}

                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          textTransform: "none",
                          fontSize: "0.7rem",
                          backgroundColor: "#5c3ac8",
                        }}
                        onClick={() => {
                          setSelectedBeneficiary(b);
                          setOpenPayModal(true);
                        }}
                      >
                        Send
                      </Button>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteBeneficiary(b.id)}
                      >
                        <Tooltip title="Delete Beneficiary">
                          <DeleteIcon fontSize="small" />
                        </Tooltip>
                      </IconButton>
                    </Stack>
                  }
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      component="img"
                      src={upi2}
                      alt="upi 2"
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        p: 0.5,
                      }}
                    />

                    <Box>
                      <Typography fontWeight="500">
                        {b.beneficiary_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        VPA: {b.account_number}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))
            )}
          </List>
        </CardContent>
      </Collapse>
      {/* Add Beneficiary Modal */}
      {openModal && (
        <Dialog
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            resetForm();
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              textAlign: "center",
              backgroundColor: "#f7f7f9",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            Add New Beneficiary
          </DialogTitle>

          <DialogContent dividers sx={{ p: 3 }}>
            {/* Beneficiary Name */}
            <TextField
              label="Beneficiary Name"
              name="beneficiary_name"
              fullWidth
              size="small"
              value={formData.beneficiary_name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            {/* Prefix + Suffix */}
            <Grid
              container
              spacing={2}
              sx={{
                mt: 0,
                "& .MuiGrid-item": {
                  display: "flex",
                  flexDirection: "column",
                },
                "& .MuiTextField-root": {
                  flex: 1,
                  width: "100%",
                },
              }}
            >
              {" "}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Prefix"
                  name="prefix"
                  fullWidth
                  size="small"
                  value={formData.prefix}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {formData.suffix === "other" ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      label="Custom Suffix"
                      name="custom_suffix"
                      fullWidth
                      size="small"
                      placeholder="Enter custom suffix"
                      value={formData.custom_suffix || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          custom_suffix: e.target.value,
                        }))
                      }
                      InputProps={{
                        startAdornment: (
                          <Typography sx={{ mr: 1, color: "text.secondary" }}>
                            @
                          </Typography>
                        ),
                      }}
                    />

                    {/* 🔗 Replace button with subtle link */}
                    <Typography
                      variant="body2"
                      sx={{
                        cursor: "pointer",
                        color: "#5c3ac8",
                        textDecoration: "underline",
                        whiteSpace: "nowrap",
                        "&:hover": { opacity: 0.8 },
                      }}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          suffix: "ybl",
                          custom_suffix: "",
                        }))
                      }
                    >
                      Choose from list
                    </Typography>
                  </Box>
                ) : (
                  <TextField
                    select
                    label="Suffix"
                    name="suffix"
                    fullWidth
                    size="small"
                    value={formData.suffix}
                    onChange={(e) => {
                      const { value } = e.target;
                      setFormData((prev) => ({
                        ...prev,
                        suffix: value,
                        custom_suffix:
                          value === "other" ? "" : prev.custom_suffix,
                      }));
                    }}
                  >
                    {suffixOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        @{option}
                      </MenuItem>
                    ))}
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                )}
              </Grid>
            </Grid>

            {/* ✅ Full UPI ID Preview */}
            {formData.prefix && (
              <Box
                sx={{
                  mt: 3,
                  p: 1.2,
                  borderRadius: 1,
                  textAlign: "center",
                  backgroundColor: "#f2f4f8",
                  border: "1px dashed #ccc",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#333",
                    letterSpacing: "0.5px",
                  }}
                >
                  Full UPI ID:{" "}
                  <span style={{ color: "#5c3ac8" }}>
                    {formData.prefix}@
                    {formData.suffix === "other"
                      ? formData.custom_suffix || "____"
                      : formData.suffix}
                  </span>
                </Typography>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2, justifyContent: "center" }}>
            <Button
              onClick={() => {
                setOpenModal(false);
                resetForm();
              }}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTUPConfirmation}
              variant="contained"
              sx={{ backgroundColor: "#5c3ac8" }}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Add"}
            </Button>
            <Button
              onClick={handleAddAndVerifyBeneficiary}
              variant="contained"
              sx={{ backgroundColor: "#5c3ac8" }}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Verify & Add"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* MPIN Verification Modal */}
      {verifyOpen && (
        <CommonModal
          open={verifyOpen}
          onClose={() => setVerifyOpen(false)}
          title="Enter 6-digit MPIN"
          iconType="info"
          size="small"
          dividers
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: () => setVerifyOpen(false),
            },
            {
              text: submitting ? "Verifying..." : "Verify",
              variant: "contained",
              color: "primary",
              onClick: handleVerify,
            },
          ]}
        >
          <Grid container spacing={1} justifyContent="center" sx={{ mt: 1 }}>
            {mpinDigits.map((digit, idx) => (
              <Grid item key={idx}>
                <TextField
                  id={`mpin-${idx}`}
                  value={digit}
                  type="password"
                  onChange={(e) => handleMpinChange(idx, e.target.value)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "1.2rem" },
                  }}
                  sx={{ width: 45 }}
                />
              </Grid>
            ))}
          </Grid>
        </CommonModal>
      )}
      {/* ✅ New Verify MPIN Modal for existing beneficiary verification */}
      {verifyingBeneficiary && (
        <UpiVerificationModal
          open={!!verifyingBeneficiary}
          onClose={() => {
            setVerifyingBeneficiary(null);
            setMpinDigits(Array(6).fill(""));
          }}
          mpinDigits={mpinDigits}
          setMpinDigits={setMpinDigits}
          submitting={submitting}
          onVerify={handleVerifyUpi}
        />
      )}

      {/* TUP Confirmation Modal */}
      {tupResponse && (
        <CommonModal
          open={!!tupResponse}
          onClose={handleTUPClose}
          title="Verification in Progress"
          iconType="info"
          size="small"
          dividers
          footerButtons={[
            { text: "Cancel", variant: "outlined", onClick: handleTUPClose },
            {
              text: submitting ? "Adding..." : "Add Beneficiary Anyway",
              variant: "contained",
              color: "primary",
              onClick: handleTUPConfirmation,
            },
          ]}
        >
          <Typography variant="body2" sx={{ mb: 2 }}>
            Verification is under process. You can add the beneficiary now, but
            it will be marked as unverified until verification completes.
          </Typography>
          <Typography variant="caption">
            Transaction Reference: {tupResponse?.data?.txnReferenceId || "N/A"}
          </Typography>
        </CommonModal>
      )}

      {/* Send Money Modal */}
      {openPayModal && (
        <LevinUpiBeneficiaryDetails
          open={openPayModal}
          onClose={() => setOpenPayModal(false)}
          beneficiary={selectedBeneficiary}
          sender={sender}
          onLevinSuccess={onLevinSuccess}
        />
      )}
    </Card>
  );
};

export default LevinUpiBeneficiaryList;
