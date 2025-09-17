import { useMemo, useContext, useState } from "react";
import { Box, Tooltip, Chip, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import { android2, linux2, macintosh2, okhttp, windows2 } from "../utils/iconsImports";
import LaptopIcon from "@mui/icons-material/Laptop";
import CommonStatus from "../components/common/CommonStatus";

const RetailerLogs = ({  }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [refreshKey, setRefreshKey] = useState(0);
  const [query, setQuery] = useState("");
console.log("queryyy",query);

 const filters = useMemo(
    () => [
      {
        id: "service_name",
        label: "Service Name",
        type: "textfield",
      },
      // {
      //   id: "date_range",
      //   // label: "Date Range",
      //   type: "daterange",
      // },
      // {
      //   id: "mobile",
      //   label: "Mobile",
      //   type: "textfield",
      // },
    ],
    []
  );

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
      { name: "Action", selector: (row) => row?.action, width: "100px" },
      { name: "Service Name", selector: (row) => row?.service_name || "-", width: "150px" },
      { name: "Ip Address", selector: (row) => row?.ip_address || "-", width: "150px" },
      { name: "Request Data", selector: (row) => row?.request_data || "-", width: "150px" },
      { name: "Response Data", selector: (row) => row?.response_data || "-", width: "150px" },
      // { name: "User Agent", selector: (row) => row?.user_agent || "-", width: "150px" },
          {
            name: "User Agent",
            selector: (row) => {
              let icon;
      
              if (row.user_agent.toLowerCase().includes("windows")) {
                icon = (
                  <img
                    src={windows2}
                    style={{ width: "22px" }}
                    alt="description of image"
                  />
                );
              } else if (row.user_agent.toLowerCase().includes("android")) {
                icon = (
                  <img
                    src={android2}
                    style={{ width: "22px" }}
                    alt="description of image"
                  />
                );
              } else if (row.user_agent.toLowerCase().includes("mac")) {
                icon = (
                  <img
                    src={macintosh2}
                    style={{ width: "22px" }}
                    alt="description of image"
                  />
                );
              } else if (row.user_agent.toLowerCase().includes("linux")) {
                icon = (
                  <img
                    src={linux2}
                    style={{ width: "22px" }}
                    alt="description of image"
                  />
                );
              }
              else if (row.user_agent.toLowerCase().includes("okhttp")) {
                icon = (
                  <img
                    src={okhttp}
                    style={{ width: "22px" }}
                    alt="description of image"
                  />
                );
              } else {
                icon = <LaptopIcon sx={{ color: "blue", width: "22px" }} />;
              }
      
              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                    textAlign: "justify",
                    gap: 2,
                  }}
                >
                  {icon}
                  {/* <Typography>{row.user_agent}</Typography> */}
                </Box>
              );
            },
            width: "20px",
            wrap: true,
            left: true,
          },
      {
        name: "Status",
        selector: (row) => 
          <CommonStatus value={row.status} />
      },
   
  ],
  []
);

  return (
    <Box>
     <CommonTable
  columns={columns}
    filters={filters}
  endpoint={ApiEndpoints.GET_LOG}
  queryParam={{ id: user?.id }}   // ✅ merged into params
/>
    </Box>
  );
};

export default RetailerLogs;
