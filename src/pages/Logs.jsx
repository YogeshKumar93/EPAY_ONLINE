import { useMemo, useContext, useState } from "react";
import { Box, Tooltip, Chip, IconButton } from "@mui/material";
import { Delete, Info as InfoIcon } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import DeleteLogModal from "../components/DeleteLogModal";
import DrawerDetails from "../components/common/DrawerDetails";
import CommonStatus from "../components/common/CommonStatus";

const Logs = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [refreshKey, setRefreshKey] = useState(0);

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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
      { name: "Id", selector: (row) => row?.id, wrap: true },
      { name: "User Id", selector: (row) => row?.user_id, wrap: true },
      { name: "Service Name", selector: (row) => row?.service_name, wrap: true },
      { name: "Role", selector: (row) => row?.role, wrap: true },
      { name: "Action", selector: (row) => row?.action, width: "100px" },
      {
  name: "Status",
  selector: (row) => <CommonStatus value={row.status} />,
  center: true,
},
      {
        name: "Actions",
        selector: (row) => (
          <>
            <IconButton
              color="info"
              onClick={() => {
                setSelectedRow(row);
                setDrawerOpen(true);
              }}
              size="small"
            >
              <InfoIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                setSelectedLogId(row.id);
                setOpenDelete(true);
              }}
              size="small"
            >
              <Delete />
            </IconButton>
          </>
        ),
        width: "120px",
      },
    ],
    []
  );

  return (
    <Box>
      <CommonTable
        key={refreshKey}
        columns={columns}
        endpoint={ApiEndpoints.GET_LOGS}
        filters={filters}
        queryParam={query}
      />

      {/* Delete Modal */}
      <DeleteLogModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        logId={selectedLogId}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />

      {/* Drawer Details */}
      <DrawerDetails
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        rowData={selectedRow}
        fields={[
          { label: "IP Address", key: "ip_address" },
          { label: "Request Data", key: "request_data" },
          { label: "Response Data", key: "response_data" },
          { label: "User Agent", key: "user_agent" },
        ]}
      />
    </Box>
  );
};

export default Logs;
