import { useMemo, useContext, useState } from "react";
import { Box, Button, Tooltip, Chip, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonStatus from "../components/common/CommonStatus";

const Navs = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = useMemo(
    () => [

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
        name: "Url",
        selector: (row) => (
          <Tooltip title={row?.url}>
            <div style={{ textAlign: "left" }}>{row?.url || "-"}</div>
          </Tooltip>
        ),
        wrap:"true",
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
      },
    ],
    []
  );

  return (
    <Box>
     

      <CommonTable
        key={refreshKey} // 🔄 refresh on changes
        columns={columns}
        endpoint={ApiEndpoints.GET_SIDENAV}
        filters={filters}
        queryParam={query}
/>
 
    </Box>
  );
};

export default Navs;
