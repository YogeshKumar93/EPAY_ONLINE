import { useMemo, useContext, useState } from "react";
import { Box, Button, Tooltip, Chip, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import CreateServiceModal from "../components/CreateServiceModal";
import EditServiceModal from "../components/EditServiceModaL";

const Layouts = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
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
        name: "Name",
        selector: (row) => (
          <Tooltip title={row?.name}>
            <div style={{ textAlign: "left" }}>{row?.name}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Colour",
        selector: (row) => (
          <Tooltip title={row?.color_code}>
            <div style={{ textAlign: "left" }}>{row?.color_code}</div>
          </Tooltip>
        ),
        width: "150px",
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
        endpoint={ApiEndpoints.GET_COLOURS}
        filters={filters}
        queryParam={query}
      />
    </Box>
  );
};

export default Layouts;
