import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import CommonModal from "../common/CommonModal";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiCall } from "../../api/apiClient";
import { useToast } from "../../utils/ToastContext";

const ConfirmSuccessTxnModal = ({ open, onClose, txnId, onSuccess }) => {
  const [operatorId, setOperatorId] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleConfirm = async () => {
    if (!txnId || !operatorId) return;

    setLoading(true);
    try {
      const payload = { txn_id: txnId, operator_id: operatorId };
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.REFUND_SUCCESS_TXN,
        payload
      );

      if (response?.status) {
        showToast(response.message || "Transaction marked as success!", "success");
        setOperatorId("");
        onClose();
        onSuccess?.(); // optional callback to refresh table or do parent actions
      } else {
        showToast(error?.message || "Failed to mark transaction as success", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong!", "error");
    }
    setLoading(false);
  };

  const handleClose = () => {
    setOperatorId("");
    onClose();
  };

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Confirm Transaction Success"
      footerButtons={[
        { text: "Cancel", variant: "outlined", color: "error", onClick: handleClose },
        { text: "Confirm", variant: "contained", color: "success", onClick: handleConfirm, disabled: !operatorId || loading },
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column",justifyContent:"center" ,alignItems:"center", gap: 2 }}>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Are you sure you want to mark this transaction as <b>SUCCESS</b>?
          <br /><br />
          <b>Txn ID:</b> {txnId}
        </Typography>
        <TextField
          label="Operator ID"
          value={operatorId}
          onChange={(e) => setOperatorId(e.target.value)}
          variant="outlined"
           sx={{ width: "60%",}}

          required
          autoFocus
        />
      </Box>
    </CommonModal>
  );
};

export default ConfirmSuccessTxnModal;
