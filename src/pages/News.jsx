import React, { useState, useEffect, useRef } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { Button, Box, Typography, TextField, IconButton, Tooltip, Modal } from "@mui/material";
import CommonTable from "../components/common/CommonTable";
import ReButton from "../components/common/ReButton";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../utils/DateUtils";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonModal from "../components/common/CommonModal";

const News = ({ user }) => {
  const [openModal, setOpenModal] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const fetchRef = useRef(null);

  // Load news
  const loadNews = async () => {
    setLoading(true);
    try {
      const { error, response } = await apiCall("POST", ApiEndpoints.GET_NEWS);
      if (response) setNews(response.data);
      else apiErrorToast(error?.message || "Failed to fetch news");
    } catch (err) {
      console.error(err);
      apiErrorToast("Something went wrong while fetching news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRef.current = loadNews;
    loadNews();
  }, []);

  // Table columns definition
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Date",
      selector: (row) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Tooltip title={`Created: ${ddmmyyWithTime(row.created_at)}`} arrow>
            <span>
              {ddmmyy(row.created_at)} {dateToTime1(row.created_at)}
            </span>
          </Tooltip>
          <Tooltip title={`Updated: ${ddmmyyWithTime(row.updated_at)}`} arrow>
            <span>
              {ddmmyy(row.updated_at)} {dateToTime1(row.updated_at)}
            </span>
          </Tooltip>
        </div>
      ),
      wrap: true,
      width: "140px",
    },
    { name: "Description", selector: (row) => row.description },
    {
      name: "Actions",
      selector: (row) => (
        <IconButton color="error" size="small" onClick={() => handleDelete(row)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
      width: "80px",
      center: true,
    },
  ];

  const filters = []; // Add filter configs if needed

  // Create news
  const handleCreateNews = async () => {
    if (!description.trim()) {
      apiErrorToast("Description cannot be empty");
      return;
    }

    try {
      const payload = { description };
      const { error, response } = await apiCall("POST", ApiEndpoints.CREATE_NEWS, payload);

      if (response) {
        okSuccessToast(response?.message || "News created successfully");
        setOpenModal(false);
        setDescription("");
        if (fetchRef.current) fetchRef.current();
      } else {
        apiErrorToast(error?.message || "Create news failed");
      }
    } catch (err) {
      console.error("Error creating news:", err);
      apiErrorToast("Something went wrong while creating news");
    }
  };

  // Delete news
  const handleDelete = async (row) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;

    try {
      const { error, response } = await apiCall("POST", ApiEndpoints.DELETE_NEWS, { id: row.id });

      if (response) {
        okSuccessToast(response?.message || "News deleted successfully");
        if (fetchRef.current) fetchRef.current();
      } else {
        apiErrorToast(error?.message || "Delete failed");
      }
    } catch (err) {
      console.error("Error deleting news:", err);
      apiErrorToast("Something went wrong while deleting news");
    }
  };

  return (
    <div>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_NEWS}
        filters={filters}
        onFetchRef={(fetchData) => (fetchRef.current = fetchData)}
        enableActionsHover={true}
        showAddButton={false} // Disable table's internal add button to prevent double modal
        customHeader={
          user?.role !== "sadm" && user?.role !== "adm" && (
            <ReButton variant="contained" onClick={() => setOpenModal(true)} label="News" />
          )
        }
      />

      {/* Create News Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Typography variant="h6" mb={2}>
            Create News
          </Typography>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={() => setOpenModal(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleCreateNews}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default News;
