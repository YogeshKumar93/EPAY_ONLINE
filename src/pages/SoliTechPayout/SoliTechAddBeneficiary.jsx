import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonModal from "../../components/common/CommonModal";
import { useToast } from "../../utils/ToastContext";
import { CheckCircle } from "@mui/icons-material";
const SoliTechAddBeneficiary = ({
  open,
  onClose,
  onSuccess,
  sender,
  onVerifyAndAdd,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    bene_name: "",
    bene_account: "",
    bank_name: "",
    bank_code: "",
    ifsc_code: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [banks, setBanks] = useState([]);
  const [bankSearch, setBankSearch] = useState("");
  const [bankOpen, setBankOpen] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [loadingIfsc, setLoadingIfsc] = useState(false); // New state for IFSC loading
  const [verifyingDetails, setVerifyingDetails] = useState(false);
  const [uuid, setUuid] = useState("");

  // Form validation
  const isFormValid = useMemo(() => {
    return (
      formData.bene_name?.trim() &&
      formData.bene_account?.trim() &&
      formData.bank_name?.trim() &&
      formData.bank_code?.trim() &&
      formData.ifsc_code?.trim()
    );
  }, [formData]);

  // useEffect(() => {
  //   if (open) {
  //     const fetchUuid = async () => {
  //       try {
  //         const { response, error } = await apiCall(
  //           "GET",
  //           ApiEndpoints.GET_UUID
  //         );
  //         if (response) {
  //           setUuid(response.uuid);
  //         } else {
  //           showToast(error?.message || "Failed to get UUID", "error");
  //           onClose();
  //         }
  //       } catch (err) {
  //         showToast("Error getting UUID", "error");
  //       }
  //     };

  //     if (open) {
  //       fetchUuid();
  //     } else {
  //       setUuid(""); // reset on close
  //     }
  //   }
  // }, [open]);

  // Fetch banks when modal opens
  useEffect(() => {
    const fetchBanks = async () => {
      setLoadingBanks(true);
      try {
        const { response, error } = await apiCall(
          "POST",
          ApiEndpoints.SOLITECH_GET_BANKS
        );

        if (response?.data) {
          const cleanedBanks = response.data.map((bank) => ({
            ...bank,
            BankCode: bank.BankCode?.trim(),
            BankName: bank.BankName?.trim(),
          }));
          setBanks(cleanedBanks);
        } else {
          showToast(error?.message || "Failed to load banks", "error");
        }
      } catch (err) {
        showToast("Failed to load banks list", "error");
      } finally {
        setLoadingBanks(false);
      }
    };

    if (open) {
      fetchBanks();
    }
  }, [open]);

  // Filter banks based on search
  const filteredBanks = useMemo(() => {
    if (!bankSearch) return banks;
    return banks.filter(
      (bank) =>
        bank.BankName?.toLowerCase().includes(bankSearch.toLowerCase()) ||
        bank.BankCode?.toLowerCase().includes(bankSearch.toLowerCase())
    );
  }, [banks, bankSearch]);

  const fetchIfscCodes = async (bankCode) => {
    if (!bankCode) return;

    setLoadingIfsc(true);
    setFormData((prev) => ({ ...prev, ifsc_code: "" })); // Reset IFSC when bank changes

    try {
      const payload = {
        bank_code: bankCode,
      };

      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.SOLITECH_BANK_IFSC,
        payload
      );

      if (response?.status === true && response?.data) {
        // Auto-fill the IFSC code from response.data
        setFormData((prev) => ({ ...prev, ifsc_code: response.data }));
        // showToast("IFSC code auto-filled", "success");
      } else {
        showToast(error?.message || "Failed to load IFSC code", "error");
      }
    } catch (err) {
      showToast("Failed to load IFSC code", "error");
    } finally {
      setLoadingIfsc(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle bank selection
  const handleBankSelect = (bank) => {
    if (bank) {
      setFormData((prev) => ({
        ...prev,
        bank_name: bank.BankName,
        bank_code: bank.BankCode,
        ifsc_code: "", // Reset IFSC when bank changes
      }));

      // Fetch IFSC code for the selected bank
      fetchIfscCodes(bank.BankCode);
    } else {
      // Clear bank selection if null
      setFormData((prev) => ({
        ...prev,
        bank_name: "",
        bank_code: "",
        ifsc_code: "",
      }));
    }
    setBankOpen(false);
    setBankSearch("");
  };

  const handleVerifyAndAddBeneficiary = async () => {
    if (!isFormValid) {
      showToast("Please fill all required fields", "error");
      return;
    }

    // Prepare the beneficiary data with the IFSC from API response
    const beneficiaryData = {
      beneficiary_name: formData.bene_name,
      account_number: formData.bene_account,
      bank_name: formData.bank_name,
      ifsc_code: formData.ifsc_code, // This will be the IFSC from API response (e.g., "KKBK0005033")
      bank_code: formData.bank_code,
      uuid, // 👈 include this
      is_verified: 1,
    };

    // Call the parent component's verify and add handler
    if (onVerifyAndAdd) {
      onVerifyAndAdd(beneficiaryData);
      // Don't close the modal here - let the parent handle it after MPIN verification
    } else {
      // Fallback: add directly if no verify handler
      await handleAddBeneficiaryDirect();
    }
  };

  // Fallback function to add beneficiary directly (if verification is not required)
  const handleAddBeneficiaryDirect = async () => {
    setSubmitting(true);
    try {
      const payload = {
        mobile_number: sender?.mobile_number,
        bene_name: formData.bene_name,
        bene_account: formData.bene_account,
        bank_name: formData.bank_name,
        bank_code: formData.bank_code,
        ifsc_code: formData.ifsc_code, // Include IFSC in payload (e.g., "KKBK0005033")
        is_verified: 0,
      };

      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.SOLITECH_ADD_BENEFICIARY,
        payload
      );

      if (response) {
        showToast(
          response?.message || "Beneficiary added successfully!",
          "success"
        );
        onSuccess?.(sender.mobile_number); // Refresh beneficiary list
        onClose();
        // Reset form
        setFormData({
          bene_name: "",
          bene_account: "",
          bank_name: "",
          bank_code: "",
          ifsc_code: "",
        });
        setBankSearch("");
      } else {
        showToast(error?.message || "Failed to add beneficiary", "error");
        setErrors(error?.errors || {});
      }
    } catch (err) {
      showToast("An error occurred while adding beneficiary", "error");
      setErrors(err?.response?.data?.errors || {});
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        bene_name: "",
        bene_account: "",
        bank_name: "",
        bank_code: "",
        ifsc_code: "",
      });
      setErrors({});
      setBankSearch("");
    }
  }, [open]);

  // Get current selected bank for Autocomplete value
  const getSelectedBank = () => {
    if (!formData.bank_code) return null;
    return banks.find((bank) => bank.BankCode === formData.bank_code) || null;
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Add New Beneficiary"
      iconType="info"
      size="small"
      dividers
      loading={submitting}
      footerButtons={[
        // {
        //   text: "Cancel",
        //   variant: "outlined",
        //   onClick: onClose,
        //   disabled: submitting,
        //   sx: { borderRadius: 1 },
        // },
        {
          text: submitting ? "Adding..." : "Verify & Add Beneficiary",
          variant: "contained",
          color: "primary",
          onClick: handleVerifyAndAddBeneficiary,
          disabled: submitting || !isFormValid,
          sx: { borderRadius: 1 },
        },
        {
          text: submitting ? "Adding..." : "Add Beneficiary",
          variant: "contained",
          color: "primary",
          onClick: handleAddBeneficiaryDirect,
          disabled: submitting || !isFormValid,
          sx: { borderRadius: 1 },
        },
      ]}
    >
      <Box sx={{ maxHeight: isMobile ? "70vh" : "auto", overflowY: "auto" }}>
        {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Fill in the beneficiary details. You will need to verify with MPIN
          before adding.
        </Typography> */}

        {/* Bank Selection - Autocomplete Dropdown */}
        <Autocomplete
          open={bankOpen}
          onOpen={() => setBankOpen(true)}
          onClose={() => setBankOpen(false)}
          options={filteredBanks}
          getOptionLabel={(option) => `${option.BankName}`}
          loading={loadingBanks}
          inputValue={bankSearch}
          onInputChange={(event, newValue) => setBankSearch(newValue)}
          value={getSelectedBank()}
          onChange={(event, newValue) => {
            handleBankSelect(newValue);
          }}
          isOptionEqualToValue={(option, value) =>
            option.BankCode === value?.BankCode
          }
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              margin="normal"
              label="Select Bank"
              placeholder="Search bank by name or code"
              error={!!errors.bank_name || !!errors.bank_code}
              helperText={errors.bank_name || errors.bank_code}
              required
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingBanks ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.BankCode}>
              <Box>
                <Typography variant="body2" fontWeight="500">
                  {option.BankName}
                </Typography>
                {/* <Typography variant="caption" color="text.secondary">
                  Code: {option.BankCode}
                </Typography> */}
              </Box>
            </li>
          )}
          noOptionsText={loadingBanks ? "Loading banks..." : "No banks found"}
        />

        {/* IFSC Code Field - Auto-filled from API */}
        {formData.bank_code && (
          <TextField
            fullWidth
            margin="normal"
            name="ifsc_code"
            label="IFSC Code"
            placeholder={
              loadingIfsc ? "Loading IFSC code..." : "IFSC code will auto-fill"
            }
            value={loadingIfsc ? "Loading..." : formData.ifsc_code}
            onChange={handleChange}
            error={!!errors.ifsc_code}
            helperText={
              errors.ifsc_code
              // ||
              // (loadingIfsc
              //   ? "Fetching IFSC code from bank..."
              //   : "IFSC code auto-filled from bank selection")
            }
            required
            disabled={loadingIfsc}
            InputProps={{
              endAdornment: loadingIfsc ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null,
            }}
            inputProps={{
              maxLength: 11,
              readOnly: true, // Make it read-only since it's auto-filled
            }}
          />
        )}
        {/* Account Number */}
        <TextField
          fullWidth
          margin="normal"
          name="bene_account"
          label="Account Number"
          placeholder="Enter account number"
          value={formData.bene_account}
          onChange={handleChange}
          error={!!errors.bene_account}
          helperText={errors.bene_account}
          required
          inputProps={{
            maxLength: 18,
            pattern: "[0-9]*",
          }}
        />
        {/* Beneficiary Name */}
        <TextField
          fullWidth
          margin="normal"
          name="bene_name"
          label="Beneficiary Name"
          placeholder="Enter beneficiary full name"
          value={formData.bene_name}
          onChange={handleChange}
          error={!!errors.bene_name}
          helperText={errors.bene_name}
          required
          inputProps={{
            maxLength: 50,
          }}
        />

        {/* Pincode */}
        {/* <TextField
          fullWidth
          margin="normal"
          name="bene_pincode"
          label="Pincode"
          placeholder="Enter beneficiary pincode"
          value={formData.bene_pincode}
          onChange={handleChange}
          error={!!errors.bene_pincode}
          helperText={
            errors.bene_pincode || "Enter the beneficiary's area pincode"
          }
          required
          inputProps={{
            maxLength: 6,
            pattern: "[0-9]*",
          }}
        /> */}
      </Box>
    </CommonModal>
  );
};
export default SoliTechAddBeneficiary;
