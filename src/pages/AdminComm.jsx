import { useMemo, useContext, useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Tooltip,
  Chip,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import ReButton from "../components/common/ReButton";
import { apiCall } from "../api/apiClient";
import CreateAdminComm from "../components/AdminComm/CreateAdminComm";
import EditAdminCommission from "../components/AdminComm/EditAdminCommission";
import DeleteIcon from "@mui/icons-material/Delete";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { okSuccessToast } from "../utils/ToastUtil";
import { useToast } from "../utils/ToastContext";

const AdminComm = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const { showToast } = useToast();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const [plans, setPlans] = useState([]);
  const [services, setServices] = useState([]);
  const fetchUsersRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };
  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };
  const handleToggleStatus = async (row) => {
    const newStatus = row.status === 1 ? 0 : 1; // 0 = block, 1 = unblock
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.BLOCK_UNBLOCK_ADMINCOMM,
        { id: row.id, status: newStatus }
      );

      if (response) {
        okSuccessToast(response?.message || "Admin comm updated successfully");
        refreshUsers();
      } else {
        showToast(error?.message);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  // ✅ Fetch plans only once (lazy load)
  const fetchPlans = async () => {
    // if (plansLoaded) return;
    try {
      const { response } = await apiCall(
        "POST",
        ApiEndpoints.GET_PLANS,
        null,
        null
      );
      console.log("response", response);
      if (response?.data) {
        setPlans(
          response.data.map((plan) => ({
            value: plan.id,
            label: plan.name || `Plan ${plan.id}`,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const { response } = await apiCall("POST", ApiEndpoints.GET_SERVICES);
      if (response?.data) {
        setServices(
          response?.data.map((service) => ({
            value: service.name, // ✅ send name in payload
            label: service.name || `Service ${service.name}`,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleDeleteClick = (row) => {
    setRowToDelete(row);
    setOpenDelete(true);
  };

  useEffect(() => {
    fetchPlans();
    fetchServices();
  }, []);

  // ✅ Filters with lazy loaded dropdown & plan_id selection
  const filters = useMemo(
    () => [
      // {
      //   id: "plan_id",
      //   label: "Plan",
      //   type: "dropdown",
      //   options: plans,
      // },
      {
        id: "service_name",
        label: "Service Name",
        type: "dropdown",
        options: services,
      },
      {
        id: "rule_type",
        label: "Rule Type",
        type: "dropdown",
        options: [
          { value: "charge", label: "Charge" },
          { value: "commission", label: "Commission" },
        ],
      },
    ],
    [services]
  );

  const handleSaveCreate = () => {
    setOpenCreate(false);
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setOpenEdit(true);
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
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
        name: "Service Name",
        selector: (row) => (
          <Tooltip title={row?.service_name || ""}>
            <div style={{ textAlign: "left" }}>{row?.service_name || "-"}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Route",
        selector: (row) => (
          <Tooltip title={row?.route || ""}>
            <div style={{ textAlign: "left" }}>{row?.route || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Rule Type",
        selector: (row) => (
          <Tooltip title={row?.rule_type || ""}>
            <div style={{ textAlign: "left" }}>{row?.rule_type || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Value Type",
        selector: (row) => (
          <Tooltip title={row?.value_type || ""}>
            <div style={{ textAlign: "left" }}>{row?.value_type || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Admin Comm",
        selector: (row) => (
          <Tooltip title={row?.a_comm || ""}>
            <div style={{ textAlign: "left" }}>{row?.a_comm || "-"}</div>
          </Tooltip>
        ),
        width: "100px",
      },
      {
        name: "Slab",
        selector: (row) => (
          <Tooltip title={`${row?.min_amount} -- ${row?.max_amount}`}>
            <div style={{ textAlign: "left" }}>
              {row?.min_amount || "-"} -- {row?.max_amount || "-"}
            </div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Status",
        selector: (row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {row.status === 1 ? (
              <Tooltip title="Click to Block">
                <IconButton
                  size="small"
                  onClick={() => handleToggleStatus(row)}
                  sx={{ color: "success.main" }}
                >
                  <LockOpenIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Click to Unblock">
                <IconButton
                  size="small"
                  onClick={() => handleToggleStatus(row)}
                  sx={{ color: "error.main" }}
                >
                  <LockOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ),
        width: "150px",
      },

      {
        name: "Actions",
        selector: (row) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "100px",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, transition: "opacity 0.2s" }}>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => handleEditClick(row)}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              {user?.role === "sadm" && (
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(row)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        ),
        width: "120px",
        center: true,
      },
    ],
    []
  );

  return (
    <Box sx={{ p: 1 }}>
      {/* Services Table */}
      <CommonTable
        onFetchRef={handleFetchRef}
        columns={columns}
        endpoint={ApiEndpoints.GET_ADMIN_COMMISSIONS}
        filters={filters}
        queryParam={query}
        customHeader={
          <ReButton
            variant="contained"
            label=" Commission "
            onClick={() => setOpenCreate(true)}
          />
        }
      />

      {/* Create Commission Rule Modal */}
      <CreateAdminComm
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        handleSave={handleSaveCreate}
        onFetchRef={refreshUsers}
      />

      {/* Edit Commission Rule Modal */}
      <EditAdminCommission
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        commissionRule={selectedRow} // Pass the selected row data
        onSuccess={handleEditSuccess}
        onFetchRef={refreshUsers}
      />
      {openDelete && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 3,
              borderRadius: 2,
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mb={2}>
              Are you sure you want to delete this rule?
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={async () => {
                  try {
                    const { error, response } = await apiCall(
                      "POST",
                      ApiEndpoints.DELETE_ADMIN_RULE,
                      { id: rowToDelete.id }
                    );
                    if (response) {
                      okSuccessToast(
                        response?.message || "Deleted successfully"
                      );
                      refreshUsers();
                    } else {
                      showToast(error?.message || "Failed to delete", "error");
                    }
                  } catch (err) {
                    console.error(err);
                    showToast("Something went wrong");
                  } finally {
                    setOpenDelete(false);
                    setRowToDelete(null);
                  }
                }}
              >
                Yes, Delete
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenDelete(false);
                  setRowToDelete(null);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AdminComm;
