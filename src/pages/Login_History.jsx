import React, { useContext, useState, useRef, useMemo } from "react";
import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  TextField,
} from "@mui/material";

import { ddmmyy, dateToTime } from "../utils/DateUtils";
import LaptopIcon from "@mui/icons-material/Laptop";
import CachedIcon from "@mui/icons-material/Cached";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
// import { android2, macintosh2, windows2, linux2 } from "../iconsImports";
import CommonTable from "../components/common/CommonTable";
import {
  android2,
  linux2,
  macintosh2,
  okhttp,
  postman,
  windows2,
} from "../utils/iconsImports";

// Global refresh reference
let refreshRef = null;

const Login_History = ({ query }) => {
  const { userRole } = useContext(AuthContext);
  const fetchRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Assign fetch function to ref for global refresh
  const handleFetchRef = (fetchFn) => {
    fetchRef.current = fetchFn;
    refreshRef = fetchFn;
  };

  const refreshLoginHistory = () => {
    if (fetchRef.current) fetchRef.current();
  };

  // Client-side filtering for top search input
  const filterRows = (rows) => {
    if (!searchTerm) return rows;
    const lowerSearch = searchTerm.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(lowerSearch)
      )
    );
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        name: "Login At",
        selector: (row) => (
          <div>
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
        ),
      },
      {
        name: "User Id",
        selector: (row) => <div>{row.user_id}</div>,
        omit: userRole?.role !== "Admin",
      },
      {
        name: "Login IP",
        selector: (row) => (
          <Tooltip title={row.ip}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 15,
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                textAlign: "justify",
              }}
            >
              {row.ip}
            </div>
          </Tooltip>
        ),
      },
      {
        name: "Login Device",
        selector: (row) => {
          let icon;
          const device = (row.device || "").toLowerCase();
          if (device.includes("windows"))
            icon = <img src={windows2} alt="Windows" style={{ width: 22 }} />;
          else if (device.includes("android"))
            icon = <img src={android2} alt="Android" style={{ width: 22 }} />;
          else if (device.includes("mac"))
            icon = <img src={macintosh2} alt="Mac" style={{ width: 22 }} />;
          else if (device.includes("linux"))
            icon = <img src={linux2} alt="Linux" style={{ width: 22 }} />;
          else icon = <LaptopIcon sx={{ color: "blue", width: 22 }} />;

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {icon}
              <Typography>{row.device}</Typography>
            </Box>
          );
        },
        width: "300px",
      },
    ],
    [userRole]
  );

  // Filters for table
  const filters = useMemo(
    () => [
      { id: "user_id", label: "User Id", type: "textfield", roles: ["Admin"] },
      { id: "ip", label: "IP Address", type: "textfield" },
      { id: "device", label: "Device", type: "textfield" },
    ],
    [userRole]
  );

  return (
    <Box p={2}>
      {/* Top search + refresh */}

      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.LOGIN_HISTORY}
        queryParam={query}
        filters={filters}
        transformData={filterRows} // client-side search
        onFetchRef={handleFetchRef}
      />
    </Box>
  );
};

export default Login_History;
