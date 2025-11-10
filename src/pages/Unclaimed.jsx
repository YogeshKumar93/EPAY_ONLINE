import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DateRangePicker } from "rsuite";
import Icon from "@mdi/react";
import { mdiFileExcel } from "@mdi/js";

import CommonTable from "../components/common/CommonTable";
import CommonLoader from "../components/common/CommonLoader";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import predefinedRanges from "../utils/predefinedRanges";
import { yyyymmdd } from "../utils/DateUtils";
import { capitalize1 } from "../utils/TextUtil";
import { currencySetter } from "../utils/Currencyutil";
import { secondaryColor } from "../utils/setThemeColor";

const Unclaimed = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    userId: "",
    status: "unclaimed",
    date: {},
    dateVal: "",
  });

  const fetchEntriesRef = useRef(null);
  const handleFetchRef = (fetchFn) => {
    fetchEntriesRef.current = fetchFn;
  };
  const refreshEntries = () => {
    if (fetchEntriesRef.current) fetchEntriesRef.current();
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        user_id: filters.userId,
        status: filters.status,
        date_from: filters.date.start || "",
        date_to: filters.date.end || "",
      }).toString();

      const response = await apiCall.get(
        `${ApiEndpoints.GET_UNCLAIMED_ENTERIES}?${queryParams}`
      );
      if (response?.data?.success) {
        setEntries(response.data.entries || []);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error("Error fetching unclaimed entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ userId: "", status: "unclaimed", date: {}, dateVal: "" });
    fetchEntries();
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, width: "80px" },
    { name: "Bank ID", selector: (row) => row.bank_id },
    {
      name: (
        <DateRangePicker
          showOneCalendar
          placeholder="Date"
          size="medium"
          cleanable
          ranges={predefinedRanges}
          value={filters.dateVal}
          onChange={(value) => {
            if (!value) {
              setFilters({ ...filters, date: {}, dateVal: "" });
              fetchEntries();
              return;
            }
            const dates = { start: value[0], end: value[1] };
            setFilters({
              ...filters,
              date: { start: yyyymmdd(dates.start), end: yyyymmdd(dates.end) },
              dateVal: value,
            });
            fetchEntries();
          }}
          style={{ width: 200 }}
        />
      ),
      selector: (row) => row.date,
    },
    { name: "Particulars", selector: (row) => capitalize1(row.particulars) },
    { name: "Handled By", selector: (row) => row.handle_by },
    { name: "Credit", selector: (row) => currencySetter(row.credit) },
    { name: "Debit", selector: (row) => currencySetter(row.debit) },
    { name: "Balance", selector: (row) => currencySetter(row.balance) },
    { name: "Mode", selector: (row) => row.mop },
    { name: "Remark", selector: (row) => row.remark || "-" },
    {
      name: "Status",
      selector: (row) => (row.status === 0 ? "Unclaimed" : "Claimed"),
    },
  ];

  return (
    <>
      <CommonLoader loading={loading} text="Loading Unclaimed Entries..." />

      {!loading && (
        <Box p={2}>
          <Box
            mb={2}
            sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
          >
            {/* <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="User ID"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                size="small"
              />
              <TextField
                select
                label="Status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                size="small"
              >
                <MenuItem value="unclaimed">Unclaimed</MenuItem>
                <MenuItem value="claimed">Claimed</MenuItem>
              </TextField>
              <Button variant="contained" onClick={fetchEntries}>
                Search
              </Button>
              <Button onClick={handleReset}>Reset</Button>
            </Box> */}
            {/* 
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Download Sample Excel">
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: "#6C4BC7",
                    color: "#fff",
                    "&:hover": { backgroundColor: secondaryColor() },
                  }}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = `${process.env.PUBLIC_URL}/sample_unclaimed.xlsx`;
                    link.download = "sample_unclaimed.xlsx";
                    link.click();
                  }}
                >
                  <Icon path={mdiFileExcel} size={1} />
                </IconButton>
              </Tooltip>
            </Box> */}
          </Box>

          <Box style={{ width: "100%" }}>
            <CommonTable
              onFetchRef={handleFetchRef}
              endpoint={`${ApiEndpoints.GET_UNCLAIMED_ENTERIES}`}
              columns={columns}
              loading={loading}
              disableSelectionOnClick
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Unclaimed;
