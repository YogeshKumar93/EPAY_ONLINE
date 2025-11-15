import React, { useState, useEffect } from "react";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonModal from "../common/CommonModal";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import { PATTERNS, isValid } from "../../utils/validators";
import { useToast } from "../../utils/ToastContext";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { okSuccessToast } from "../../utils/ToastUtil";

const CreateUser = ({ open, onClose, onFetchRef }) => {
  const { showToast } = useToast();
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [schemaFields, setSchemaFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [loadingSchema, setLoadingSchema] = useState(false);

  // Get logged in user role from your authentication context or localStorage
  const loggedInUserRole = "di"; // Replace this with actual logged in user role

  console.log("The schema fields is ", schemaFields);

  // Define all roles
  const allRolesList = [
    "sadm",
    "adm",
    "zsm",
    "asm",
    "md",
    "di",
    "ret",
    "dd",
    "api",
  ];

  const getFilteredRoles = () => {
    if (loggedInUserRole === "di") {
      return ["ret"]; // Distributor can create Retailer and Direct Dealer
    } else if (loggedInUserRole === "md") {
      return ["di"]; // Master Distributor can ONLY create Distributor
    } else {
      return allRolesList; // Show all roles for other users (sadm, adm, etc.)
    }
  };

  const rolesList = getFilteredRoles();

  const roleFullNameMap = {
    sadm: "Super Admin",
    adm: "Admin",
    zsm: "Zonal Sales Manager",
    asm: "Area Sales Manager",
    md: "Master Distributor",
    di: "Distributor",
    ret: "Retailer",
    dd: "Direct Dealer",
    api: "API User",
  };

  useEffect(() => {
    setSchemaFields([]);
    setFormData({});

    if (role) {
      fetchSchema();
    }
  }, [role]);

  const fetchSchema = async () => {
    try {
      setLoadingSchema(true);
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.GET_SIGNUP_SCHEMA,
        {}
      );
      if (response) {
        setSchemaFields(response.data.fields || []);
        const initialData = {};
        (response.data.fields || []).forEach((f) => {
          initialData[f.name] = f.default || "";
        });
        setFormData(initialData);
      } else {
        showToast(error?.message || "Failed to fetch schema", "error");
      }
    } catch (err) {
      console.error("Error fetching schema:", err);
      showToast("Something went wrong while fetching schema", "error");
    } finally {
      setLoadingSchema(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildUserBusinessPayload = (flatObj) => {
    const user = {};
    const business = {};
    const business_address = {};

    Object.entries(flatObj).forEach(([key, value]) => {
      if (key.startsWith("user.")) {
        user[key.split(".")[1]] = value;
      } else if (key.startsWith("business.")) {
        business[key.split(".")[1]] = value;
      } else if (key.startsWith("business_address.")) {
        business_address[key.split(".")[1]] = value;
      }
    });

    return { user, business, business_address };
  };

  const handleSubmit = async () => {
    if (!role) {
      showToast("Please select a role", "error");
      return;
    }

    // Convert flat formData → user + business + business_address
    const { user, business, business_address } =
      buildUserBusinessPayload(formData);

    const payload = { role, user, business, business_address };

    console.log("Payload sending to API:", payload); // debug

    setSubmitting(true);
    try {
      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_USER,
        payload
      );
      if (response) {
        okSuccessToast(response?.message || "User created successfully");
        onFetchRef?.();
        onClose();
      } else {
        showToast(error?.message || "Failed to create user", "error");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      showToast("Something went wrong while creating user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          Create New User
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
      >
        {/* Role Selection */}
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            {rolesList.map((r) => (
              <MenuItem key={r} value={r}>
                {roleFullNameMap[r] || r.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Schema Fields */}
        {loadingSchema && <CircularProgress sx={{ alignSelf: "center" }} />}
        {!loadingSchema &&
          schemaFields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              type={field.type || "text"}
            />
          ))}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Button onClick={onClose} disabled={submitting} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUser;
