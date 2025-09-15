import { useMemo, useContext, useState, useRef } from "react";
import { Box, Button, Tooltip, Chip, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import CreateServiceModal from "../components/CreateServiceModal";
import EditServiceModal from "../components/EditServiceModaL";
import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";
import { Lock, LockOpen } from "@mui/icons-material";


const Services = ({  query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchUsersRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };
  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "User Id",
        selector: (row) => (
          <Tooltip title={row?.id}>
            <div style={{ textAlign: "left" }}>{row?.id}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Service Name",
        selector: (row) => (
          <Tooltip title={row?.name}>
            <div style={{ textAlign: "left" }}>{row?.name}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Code",
        selector: (row) => (
          <Tooltip title={row?.code}>
            <div style={{ textAlign: "left" }}>{row?.code}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Route",
        selector: (row) => (
          <Tooltip title={row?.route}>
            <div style={{ textAlign: "left" }}>{row?.route || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
  name: "Status",
  selector: (row) =>
    row.is_active ? (
      <Tooltip title="Active">
        <LockOpen sx={{ color: "green" }} />
      </Tooltip>
    ) : (
      <Tooltip title="Inactive">
        <Lock sx={{ color: "red" }} />
      </Tooltip>
    ),
},
{
  name: "Api Status",
  selector: (row) =>
    row.is_active_api ? (
      <Tooltip title="Active">
        <LockOpen sx={{ color: "green" }} />
      </Tooltip>
    ) : (
      <Tooltip title="Inactive">
        <Lock sx={{ color: "red" }} />
      </Tooltip>
    ),
},
{
  name: "User Status",
  selector: (row) =>
    row.is_active_users ? (
      <Tooltip title="Active">
        <LockOpen sx={{ color: "green" }} />
      </Tooltip>
    ) : (
      <Tooltip title="Inactive">
        <Lock sx={{ color: "red" }} />
      </Tooltip>
    ),
},

      {
        name: "Actions",
        selector: (row) => (
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedService(row);
              setOpenEdit(true);
            }}
          >
            <Edit />
          </IconButton>
        ),
        width: "100px",
      },
    ],
    []
  );

  const filters = useMemo(()=>[
    {id:"name", label:"Service Name", type:"textfield"},
  ],[]);

  return (
    <Box>
      {/* Services Table */}
      <CommonTable
        onFetchRef={handleFetchRef}
        columns={columns}
        endpoint={ApiEndpoints.GET_SERVICES}
        filters={filters}
        queryParam={query}
        customHeader={
          (user?.role !== "sadm" || user?.role !== "adm") && (
            <ReButton
              variant="contained"
              label="Services"
              onClick={() => setOpenCreate(true)}
            ></ReButton>
          )
        }
      />

      {/* Create Service Modal */}
      <CreateServiceModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onFetchRef={refreshUsers}
      />

      {/* Edit Service Modal */}
      <EditServiceModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        service={selectedService}
        onFetchRef={refreshUsers}
      />
    </Box>
  );
};

export default Services;
