import { useMemo, useContext, useState, useRef } from "react";
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
import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";

const Templates = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
 

  // delete modal states
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

   const fetchUsersRef = useRef(null);
  
    const handleFetchRef = (fetchFn) => {
      fetchUsersRef.current = fetchFn;
    };
    const refreshUsers = () => {
      if (fetchUsersRef.current) {
        fetchUsersRef.current();
      }
    };

  const handleDelete = async () => {
    if (!deletingId) return;

    const { error, response } = await apiCall(
      "POST", // or "DELETE" depending on your backend
      ApiEndpoints.DELETE_TEMPLATE,
      { id: deletingId }
    );

    if (!error && response?.status) {
      refreshUsers();
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
          <CommonStatus value={row.status} />
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
      {/* Templates Table */}
      <CommonTable
         onFetchRef={handleFetchRef} // 🔄 refresh on changes
        columns={columns}
        endpoint={ApiEndpoints.GET_TEMPLATES}
        filters={filters}
        queryParam={query}
        customHeader={
          (user?.role !== "sadm" || user?.role !== "adm") && (
            <ReButton
              variant="contained"
              label="Template"
              onClick={() => setOpenCreate(true)}
            ></ReButton>
          )
        }
      />

      {/* Create Template Modal */}
      <CreateTemplateModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onFetchRef={refreshUsers} 
      />

      {/* Edit Template Modal */}
      <UpdateTemplateModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        template={selectedTemplate}
        onFetchRef={refreshUsers} 
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this template?
          </Typography>
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
