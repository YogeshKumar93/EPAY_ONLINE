import React, { useContext, useState, useRef, useMemo } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import CommonTable from "../components/common/CommonTable";
import {
  dateToTime,
  dateToTime1,
  ddmmyy,
  ddmmyyWithTime,
} from "../utils/DateUtils";

// Global refresh reference
let refreshRef = null;

const WebHooks = ({ query }) => {
  const { userRole } = useContext(AuthContext);
  const fetchRef = useRef(null);

  // Assign fetch function to ref for global refresh
  const handleFetchRef = (fetchFn) => {
    fetchRef.current = fetchFn;
    refreshRef = fetchFn;
  };

  const refreshWebhooks = () => {
    if (fetchRef.current) fetchRef.current();
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        name: "Date",
        selector: (row) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Tooltip title={`Created: ${ddmmyyWithTime(row.created_at)}`} arrow>
              <div style={{ display: "inline-flex", gap: 4 }}>
                <span>{ddmmyy(row.created_at)}</span>
                <span>{dateToTime1(row.created_at)}</span>
              </div>
            </Tooltip>
            <Tooltip title={`Updated: ${dateToTime(row.updated_at)}`} arrow>
              <span style={{ marginTop: "8px" }}>
                {ddmmyy(row.updated_at)}
                {dateToTime1(row.updated_at)}
              </span>
            </Tooltip>
          </div>
        ),
        wrap: true,
        width: "80px",
      },
      {
        name: "Req Ip",
        selector: (row) => <div>{row.req_ip}</div>,
      },
      {
        name: "Req From",
        selector: (row) => <div>{row.req_from}</div>,
      },
      {
        name: "Txn Id",
        selector: (row) => <div>{row.txn_id}</div>,
      },
      {
        name: "Response",
        selector: (row) => <div>{row.response}</div>,
      },
    ],
    []
  );

  // Optional client-side search/filter
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <Box p={2}>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_WEBHOOKS}
        queryParam={query}
        transformData={filterRows}
        onFetchRef={handleFetchRef}
      />
    </Box>
  );
};

export default WebHooks;
