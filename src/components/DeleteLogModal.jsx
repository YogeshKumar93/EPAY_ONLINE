import { Box, Typography } from "@mui/material";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";

const DeleteLogModal = ({ open, onClose, logId, onSuccess }) => {
  const handleDelete = async () => {
    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.DELETE_LOG,
      { id: logId } // ✅ send id in payload
    );

    if (!error && response?.status) {
      onSuccess?.();
      onClose();
    } else {
      alert("Delete failed: " + (error?.message || response?.message));
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Delete Log"
      iconType="warning"
      footerButtons={[
        { text: "Cancel", variant: "outlined", onClick: onClose },
        { text: "Delete", variant: "contained", color: "error", onClick: handleDelete },
      ]}
    >
      <Box>
        <Typography>
          Are you sure you want to delete this log?
        </Typography>
      </Box>
    </CommonModal>
  );
};

export default DeleteLogModal;
