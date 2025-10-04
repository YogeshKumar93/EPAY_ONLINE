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
const AdminComm = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [plans, setPlans] = useState([]);

  const fetchUsersRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };
  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
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

  useEffect(() => {
    fetchPlans();
  }, []);

  // ✅ Filters with lazy loaded dropdown & plan_id selection
  const filters = useMemo(
    () => [
      {
        id: "plan_id",
        label: "Plan",
        type: "dropdown",
        options: plans,
      },
      { id: "service_name", label: "Service Name", type: "textfield" },
      { id: "rule_type", label: "Rule Type", type: "textfield" },
    ],
    [plans]
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
    </Box>
  );
};

export default AdminComm;
