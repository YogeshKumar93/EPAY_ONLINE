import { useMemo, useContext, useState } from "react";
import { Box, Tooltip, Chip, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import DeleteLogModal from "../components/DeleteLogModal";

const DeleteLogs = ({ filters = [] }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [refreshKey, setRefreshKey] = useState(0);
  const [query, setQuery] = useState("");
console.log("queryyy",query);

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
      { name: "Role", selector: (row) => row?.role, wrap: true },
      { name: "Action", selector: (row) => row?.action, width: "100px" },
      { name: "Service Name", selector: (row) => row?.service_name || "-", width: "150px" },
      { name: "Ip Address", selector: (row) => row?.ip_address || "-", width: "150px" },
      { name: "Request Data", selector: (row) => row?.request_data || "-", width: "150px" },
      { name: "Response Data", selector: (row) => row?.response_data || "-", width: "150px" },
      { name: "User Agent", selector: (row) => row?.user_agent || "-", width: "150px" },
      {
        name: "Status",
        selector: (row) => {
          if (row?.status === "Success") {
            return <Chip label="Success" color="success" size="small" />;
          } else if (row?.status === "Failed" || row?.status === "Error") {
            return <Chip label="Failed" color="error" size="small" />;
          } else {
            return <Chip label={row?.status || "Pending"} color="warning" size="small" />;
          }
        },
        width: "120px",
      },

    ],
    []
  );

  return (
    <Box>
     <CommonTable
  columns={columns}
  endpoint={ApiEndpoints.GET_LOG}
  queryParam={{ id: user?.id }}   // ✅ merged into params
/>


    </Box>
  );
};

export default DeleteLogs;
