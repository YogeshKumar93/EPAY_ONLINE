import { useMemo, useContext, useState } from "react";
import {
  Box,
  Button,
  Tooltip,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import CreateTemplateModal from "../components/CreateTemplateModal";
import UpdateTemplateModal from "../components/UpdateTemplateModal";
import { apiCall } from "../api/apiClient";

const Templates = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // delete modal states
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async () => {
    if (!deletingId) return;

    const { error, response } = await apiCall(
      "POST", // or "DELETE" depending on your backend
      ApiEndpoints.DELETE_TEMPLATE,
      { id: deletingId }
    );

    if (!error && response?.status) {
      setRefreshKey((prev) => prev + 1);
      setDeleteConfirm(false);
      setDeletingId(null);
    } else {
      alert("Delete failed: " + (error?.message || response?.message));
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "Date/Time",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Template Id",
        selector: (row) => (
          <Tooltip title={row?.temp_id}>
            <div style={{ textAlign: "left" }}>{row?.temp_id}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Vendor",
        selector: (row) => (
          <Tooltip title={row?.vendor}>
            <div style={{ textAlign: "left" }}>{row?.vendor}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Name",
        selector: (row) => (
          <Tooltip title={row?.name}>
            <div style={{ textAlign: "left" }}>{row?.name}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Message",
        selector: (row) => (
          <Tooltip title={row?.message}>
            <div style={{ textAlign: "left" }}>{row?.message || "-"}</div>
          </Tooltip>
        ),
        width: "250px",
        wrap: true,
      },
      {
        name: "Status",
        selector: (row) =>
          row?.status === 1 ? (
            <Chip label="Active" color="success" size="small" />
          ) : row?.status === 0 ? (
            <Chip label="Inactive" color="error" size="small" />
          ) : (
            <Chip label="Pending" color="warning" size="small" />
          ),
        width: "120px",
      },
      {
        name: "Actions",
        selector: (row) => (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                setSelectedTemplate(row);
                setOpenEdit(true);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                setDeletingId(row.id);
                setDeleteConfirm(true);
              }}
            >
              <Delete />
            </IconButton>
          </>
        ),
        width: "120px",
      },
    ],
    []
  );

  return (
    <Box>
      {/* Create Template Button */}
      {(user?.role === "sadm" || user?.role === "adm") && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0 }}>
          <Button variant="contained" onClick={() => setOpenCreate(true)}>
            Create Template
          </Button>
        </Box>
      )}

      {/* Templates Table */}
      <CommonTable
        key={refreshKey} // 🔄 refresh on changes
        columns={columns}
        endpoint={ApiEndpoints.GET_TEMPLATES}
        filters={filters}
        queryParam={query}
      />

      {/* Create Template Modal */}
      <CreateTemplateModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />

      {/* Edit Template Modal */}
      <UpdateTemplateModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        template={selectedTemplate}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this template?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete} variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Templates;
