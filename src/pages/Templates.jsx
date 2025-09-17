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
        <Typography variant="body2" sx={{ textAlign: "left" }} noWrap>
          {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
        </Typography>
      ),
      wrap: false,
      width: "150px",
    },
    {
      name: "Template Id",
      selector: (row) => (
        <Tooltip title={row?.temp_id}>
          <Typography variant="body2" sx={{ textAlign: "left" }} noWrap>
            {row?.temp_id}
          </Typography>
        </Tooltip>
      ),
      width: "120px",
    },
    {
      name: "Vendor",
      selector: (row) => (
        <Tooltip title={row?.vendor}>
          <Typography variant="body2" sx={{ textAlign: "left" }} noWrap>
            {row?.vendor || "-"}
          </Typography>
        </Tooltip>
      ),
      width: "150px",
    },
    {
      name: "Name",
      selector: (row) => (
        <Tooltip title={row?.name}>
          <Typography variant="body2" sx={{ textAlign: "left" }} noWrap>
            {row?.name || "-"}
          </Typography>
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
      // wrap: true,
    },
    {
      name: "Status",
      selector: (row, { hoveredRow, enableActionsHover }) => {
        const isHovered = hoveredRow === row.id || !enableActionsHover;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              minWidth: "120px",
            }}
          >
            <CommonStatus value={row.status} />
          </Box>
        );
      },
      center: true,
      width: "120px",
    },
    {
      name: "Actions",
      selector: (row, { hoveredRow, enableActionsHover }) => {
        const isHovered = hoveredRow === row.id || !enableActionsHover;
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "120px",
              gap: 1,
            }}
          >
            {isHovered ? (
              <>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => {
                    setSelectedTemplate(row);
                    setOpenEdit(true);
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => {
                    setDeletingId(row.id);
                    setDeleteConfirm(true);
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </>
            ) : (
              <Typography variant="body2" sx={{ color: "#999" }}>
                -
              </Typography>
            )}
          </Box>
        );
      },
      width: "120px",
      center: true,
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
