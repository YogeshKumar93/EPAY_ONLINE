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
import CreateServiceModal from "../components/CreateServiceModal";
import EditServiceModal from "../components/EditServiceModaL";
import ReButton from "../components/common/ReButton";
import CreateCommissionRule from "./CreateCommissionRule";
import EditCommissionModal from "../components/EditCommissionModal";
import { apiCall } from "../api/apiClient";

const CommissionRule = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
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
    setRefreshKey((prev) => prev + 1); // Refresh table after creation
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setOpenEdit(true);
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    setRefreshKey((prev) => prev + 1); // Refresh table after edit
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
        name: "Id",
        selector: (row) => (
          <Tooltip title={row?.id || ""}>
            <div style={{ textAlign: "left" }}>{row?.id || "-"}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Plan Id",
        selector: (row) => (
          <Tooltip title={row?.plan_id || ""}>
            <div style={{ textAlign: "left" }}>{row?.plan_id || "-"}</div>
          </Tooltip>
        ),
        wrap: true,
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
        name: "DD Comm",
        selector: (row) => (
          <Tooltip title={row?.comm_dd || ""}>
            <div style={{ textAlign: "left" }}>{row?.comm_dd || "-"}</div>
          </Tooltip>
        ),
        width: "100px",
      },
      {
        name: "Ret Comm",
        selector: (row) => (
          <Tooltip title={row?.comm_ret || ""}>
            <div style={{ textAlign: "left" }}>{row?.comm_ret || "-"}</div>
          </Tooltip>
        ),
        width: "100px",
      },
      {
        name: "Di Comm",
        selector: (row) => (
          <Tooltip title={row?.comm_di || ""}>
            <div style={{ textAlign: "left" }}>{row?.comm_di || "-"}</div>
          </Tooltip>
        ),
        width: "100px",
      },
      {
        name: "Md Comm",
        selector: (row) => (
          <Tooltip title={row?.comm_md || ""}>
            <div style={{ textAlign: "left" }}>{row?.comm_md || "-"}</div>
          </Tooltip>
        ),
        width: "100px",
      },
      {
        name: "Min Amt",
        selector: (row) => (
          <Tooltip title={row?.min_amount || ""}>
            <div style={{ textAlign: "left" }}>{row?.min_amount || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Max Amt",
        selector: (row) => (
          <Tooltip title={row?.max_amount || ""}>
            <div style={{ textAlign: "left" }}>{row?.max_amount || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Actions",
        selector: (row) => (
          <IconButton color="primary" onClick={() => handleEditClick(row)}>
            <Edit />
          </IconButton>
        ),
        width: "100px",
      },
    ],
    []
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Services Table */}
      <CommonTable
       onFetchRef={handleFetchRef} 
        columns={columns}
        endpoint={ApiEndpoints.GET_COMMISSION_RULE}
        filters={filters}
        queryParam={query}
        customHeader={
          <ReButton
            variant="contained"
            label="Create Commission Rule"
            onClick={() => setOpenCreate(true)}
          />
        }
      />

      {/* Create Commission Rule Modal */}
      <CreateCommissionRule
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        handleSave={handleSaveCreate}
         onFetchRef={refreshUsers}
      />

      {/* Edit Commission Rule Modal */}
      <EditCommissionModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        commissionRule={selectedRow} // Pass the selected row data
        onSuccess={handleEditSuccess}
         onFetchRef={refreshUsers}
      />
    </Box>
  );
};

export default CommissionRule;
