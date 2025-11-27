import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { Box } from "@mui/material";
import { DateRangePicker } from "rsuite";
import CommonTable from "../components/common/CommonTable";
import CommonLoader from "../components/common/CommonLoader";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import predefinedRanges from "../utils/predefinedRanges";
import { yyyymmdd } from "../utils/DateUtils";
import { capitalize1 } from "../utils/TextUtil";
import { currencySetter } from "../utils/Currencyutil";
import AuthContext from "../contexts/AuthContext";

const Unclaimed = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dateVal, setDateVal] = useState(null);       // for UI
  const [dateFilter, setDateFilter] = useState({});   // for API

  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  // Only UI filters (NO appliedFilters)
  const filters = useMemo(
    () => [
      { id: "bank_name", label: "Bank Name", type: "textfield" },
      { id: "id", label: "Id", type: "textfield" },
      { id: "particulars", label: "Particulars", type: "textfield" },
      { id: "handle_by", label: "Handle By", type: "textfield" },
      { id: "daterange", type: "daterange" },
    ],
    []
  );

  // Fetch Entries
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        date_from: dateFilter.start || "",
        date_to: dateFilter.end || "",
      });

      const response = await apiCall(
        `${ApiEndpoints.GET_UNCLAIMED_ENTERIES}?${params}`
      );

      if (response?.data?.success) {
        setEntries(response.data.entries || []);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Table columns including DateRangePicker
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
          value={dateVal}
          onChange={(value) => {
            if (!value) {
              setDateVal(null);
              setDateFilter({});
              fetchEntries();
              return;
            }

            const start = yyyymmdd(value[0]);
            const end = yyyymmdd(value[1]);

            setDateVal(value);
            setDateFilter({ start, end });

            fetchEntries();
          }}
          style={{ width: 200 }}
        />
      ),
      selector: (row) => row.date,
    },

    { name: "Particulars", selector: (row) => capitalize1(row.particulars) },
    { name: "Handled By", selector: (row) => row.handle_by },

    {
      name: "Credit",
      selector: (row) => (
        <span style={{ color: "green" }}>{currencySetter(row.credit)}</span>
      ),
    },
    {
      name: "Debit",
      selector: (row) => (
        <span style={{ color: "red" }}>{currencySetter(row.debit)}</span>
      ),
    },
    { name: "Balance", selector: (row) => currencySetter(row.balance) },

    { name: "Mode", selector: (row) => row.mop },
    { name: "Remark", selector: (row) => row.remark || "-" },

    {
      name: "Status",
      selector: (row) => (
        <span
          style={{
            color: row.status === 0 ? "orange" : "red",
            fontWeight: 600,
          }}
        >
          {row.status === 0 ? "Unclaimed" : "Claimed"}
        </span>
      ),
    },
  ];

  return (
    <>
      <CommonLoader loading={loading} text="Loading Unclaimed Entries..." />

      {!loading && (
        <Box>
          <CommonTable
            endpoint={ApiEndpoints.GET_UNCLAIMED_ENTERIES}
            columns={columns}
            filters={filters}           
            disableSelectionOnClick
          />
        </Box>
      )}
    </>
  );
};

export default Unclaimed;
