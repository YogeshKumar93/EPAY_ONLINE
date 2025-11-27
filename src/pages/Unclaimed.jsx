import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
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

const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
 
  const [appliedFilters, setAppliedFilters] = useState({}); //

    const filters = useMemo(
      () => [
        { id: "Bank_id", label: "Bank Id", type: "textfield" },
      { id: "id", label: "Id", type: "textfield" },
      { id: "particulars", label: "particulars", type: "textfield" },
      { id: "handle_by", label: "Handle By", type: "textfield" },
          { id: "daterange",  type: "daterange" },
      ],
      [user?.role,  appliedFilters]
    );

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

      const response = await apiCall(
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
    { name: "Credit", selector: (row) => (
      <span style={{color:"green"}}>
      {currencySetter(row.credit) }
      </span>
    )},
    { name: "Debit", selector: (row) => (
      <span style={{color:"red"}}>
     { currencySetter(row.debit) }
      </span>
    )},
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
}

  ];

  return (
    <>
      <CommonLoader loading={loading} text="Loading Unclaimed Entries..." />

      {!loading && (
        <Box >
      

          <Box style={{ width: "100%" }}>
            <CommonTable
              onFetchRef={handleFetchRef}
              endpoint={`${ApiEndpoints.GET_UNCLAIMED_ENTERIES}`}
              columns={columns}
              filters={filters}
              // loading={loading}
              disableSelectionOnClick
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Unclaimed;
