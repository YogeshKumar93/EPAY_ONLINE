import { useMemo, useContext, useState } from "react";
import { Box, Button, Tooltip, Typography, Chip } from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";

const Services = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);

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
    ],
    []
  );

  return (
    <Box>
      {/* Create Service Button */}
      {(user?.role === "sadm" || user?.role === "adm") && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" onClick={() => setOpenCreate(true)}>
            Create Service
          </Button>
        </Box>
      )}

      {/* Services Table */}
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_SERVICES}
        filters={filters}
        queryParam={query}
        // refreshInterval={30000}
      />
    </Box>
  );
};

export default Services;
