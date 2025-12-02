import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { Box } from "@mui/material";
import CommonTable from "../components/common/CommonTable";
import CommonLoader from "../components/common/CommonLoader";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";

const AccountSummary = () => {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const [accountOptions, setAccountOptions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const fetchEntriesRef = useRef(null);
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const handleFetchRef = (fn) => {
    fetchEntriesRef.current = fn;
  };

  const refreshEntries = () => {
    if (fetchEntriesRef.current) fetchEntriesRef.current();
  };

  // -------------------------
  // Fetch accounts for dropdown
  // -------------------------
  const fetchAccounts = async () => {
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.GET_ACCOUNTS,
        {}
      );

      if (!error && response?.data) {
        setAccountOptions(response.data);
      } else {
        setAccountOptions([]);
      }
    } catch (err) {
      console.error(err);
      setAccountOptions([]);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // -------------------------
  // Filter Config
  // -------------------------
  const tableFilters = useMemo(
    () => [
      {
        id: "account_id",
        type: "dropdown",
        placeholder: "Select Account",
        options: accountOptions.map((acc) => ({
          value: acc.id,
          label: acc.name || acc.id,
          full: acc,
        })),
        onOpen: fetchAccounts,
      },
    ],
    [accountOptions]
  );

  // -------------------------
  // Fetch entries + summary
  // -------------------------
  const fetchEntries = async (accId = selectedAccount) => {
    if (!accId) {
      setEntries([]);
      setSummary(null);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        account_id: accId,
      };

      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.GET_ACCOUNT_SUMMARY,
        payload
      );

      if (!error && response?.data.data) {
        setEntries(response?.data?.data || []);
        setSummary(response?.data?.summary || []);
      } else {
        setEntries([]);
        setSummary(null);
      }
    } catch (err) {
      console.error(err);
      setEntries([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };


  // -------------------------
  // Table Columns Mapping
  // -------------------------
  const columns = [
    { name: "Created At", selector: (row) => row?.created_at },
   
    { name: "Bank Txn", selector: (row) => row?.bank_txnid },
    { name: "Particulars", selector: (row) => row?.particulars },
    { name: "Remarks", selector: (row) => row?.remarks },
     { name: "Credit", selector: (row) => row?.credit },
    { name: "Debit", selector: (row) => row?.debit },
    { name: "Balance", selector: (row) => row?.balance },
    

    // SUMMARY in Action Column
    {
      name: "Summary",
      width: "260px",
      cell: () =>
        summary ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>
              <b>Total Credit:</b> {summary?.total_credit}
            </span>
            <span>
              <b>Total Debit:</b> {summary?.total_debit}
            </span>
            <span>
              <b>Total Entries:</b> {summary?.total_entries}
            </span>
          </div>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <>
      <CommonLoader loading={loading} text="Loading Entries..." />

      {!loading && (
        <Box>
          <CommonTable
            onFetchRef={handleFetchRef}
            columns={columns}
            filters={tableFilters}
            externalData={entries}
            endpoint={ApiEndpoints.GET_ACCOUNT_SUMMARY}
          
          />
        </Box>
      )}
    </>
  );
};

export default AccountSummary;
