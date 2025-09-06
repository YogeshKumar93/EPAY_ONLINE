import { useMemo, useContext, useState } from "react";
import { Box, Button, Tooltip, Chip, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import CreateServiceModal from "../components/CreateServiceModal";
import EditServiceModal from "../components/EditServiceModaL";
import ReButton from "../components/common/ReButton";

const Services = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
          row?.is_active === 1 ? (
            <Chip label="Active" color="success" size="small" />
          ) : row?.is_active === 0 ? (
            <Chip label="Inactive" color="error" size="small" />
          ) : (
            <Chip label="Pending" color="warning" size="small" />
          ),
        width: "120px",
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

  return (
    <Box>
     

      {/* Services Table */}
      <CommonTable
        key={refreshKey} // 🔄 refresh on changes
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
    >
  
    </ReButton>
               )
  }
/>
      

      {/* Create Service Modal */}
      <CreateServiceModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />

      {/* Edit Service Modal */}
      <EditServiceModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        service={selectedService}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    </Box>
  );
};

export default Services;
