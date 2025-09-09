import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Alert,
  Divider,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { okSuccessToast, apiErrorToast } from "../utils/ToastUtil";
import { useSchemaForm } from "../hooks/useSchemaForm";

const BeneficiaryList = ({ sender, onSuccess, onSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openList, setOpenList] = useState(true); // collapse state

  // load schema
  const { schema, formData, handleChange, errors, setErrors, loading } =
    useSchemaForm(ApiEndpoints.ADD_BENEFICIARY_SCHEMA, openModal, {
      sender_id: sender.id,
    });

  const handleAddBeneficiary = async () => {
    setSubmitting(true);
    setErrors({});
    try {
      const payload = { ...formData, sender_id: sender.id };
      const res = await apiCall("post", ApiEndpoints.CREATE_BENEFICIARY, payload);

      if (res) {
        okSuccessToast(res?.message || "Beneficiary added successfully");
        setOpenModal(false);
        onSuccess?.(sender.mobile_number);
      } else {
        apiErrorToast(res?.message || "Failed to add beneficiary");
      }
    } catch (err) {
      apiErrorToast(err);
      setErrors(err?.response?.data?.errors || {});
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBeneficiary = async (beneficiaryId) => {
    try {
      const res = await apiCall("post", ApiEndpoints.DELETE_BENEFICIARY, {
        sender_id: sender.id,
        id: beneficiaryId,
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

  return (
    <Card sx={{ borderRadius: 2 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 1 }}
      >
        <Box display="flex" alignItems="center" gap={1} flexGrow={1}>
          {/* Title */}
          <Typography variant="subtitle2" fontWeight="bold">
            Beneficiaries
          </Typography>

          {/* Add Button */}
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenModal(true)}
            startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
            sx={{ minWidth: "auto", px: 1, py: 0.5, fontSize: "0.75rem" }}
          >
            Add
          </Button>
        </Box>

        {/* Collapse Icon for mobile */}
        {isMobile && (
          <IconButton
            onClick={() => setOpenList((prev) => !prev)}
            size="small"
            sx={{
              transform: openList ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </Box>

      <Collapse in={openList}>
        <Divider sx={{ mb: 1 }} />
        <CardContent sx={{ p: 2 }}>
          {sender.beneficiary?.length > 0 ? (
            <List dense sx={{ py: 0, maxHeight: 300, overflowY: "auto" }}>
              {sender.beneficiary.map((b) => (
                <ListItem
                  key={b.id}
                  button
                  onClick={() => onSelect?.(b)}
                  sx={{
                    py: 0.5,
                    px: 1,
                    mb: 0.5,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBeneficiary(b.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <AccountBalanceIcon
                          sx={{ mr: 0.5, color: "primary.main", fontSize: 16 }}
                        />
                        <Typography
                          component="div"
                          variant="body2"
                          fontWeight="medium"
                          noWrap
                          sx={{ maxWidth: 120, display: "flex", alignItems: "center" }}
                        >
                          {b.beneficiary_name}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                          noWrap
                        >
                          A/C: {b.account_number}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {b.bank_name} • {b.ifsc_code}
                        </Typography>
                      </Box>
                    }
                    sx={{ my: 0 }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info" sx={{ borderRadius: 1, py: 0.5 }}>
              <Typography variant="caption">No beneficiaries found</Typography>
            </Alert>
          )}
        </CardContent>
      </Collapse>

      {/* Add Beneficiary Modal */}
      {openModal && (
        <CommonModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="Add Beneficiary"
          iconType="info"
          size="small"
          dividers
          fieldConfig={schema}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          loading={loading || submitting}
          footerButtons={[
            {
              text: "Cancel",
              variant: "outlined",
              onClick: () => setOpenModal(false),
              disabled: submitting,
            },
            {
              text: submitting ? "Saving..." : "Save",
              variant: "contained",
              color: "primary",
              onClick: handleAddBeneficiary,
              disabled: submitting,
            },
          ]}
        />
      )}
    </Card>
  );
};

export default BeneficiaryList;
