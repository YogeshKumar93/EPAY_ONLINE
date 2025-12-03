import React, { useState, useEffect, useRef, useMemo, useContext, use } from "react";
import { Box, Typography } from "@mui/material";
import CommonTable from "../components/common/CommonTable";
import CommonLoader from "../components/common/CommonLoader";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";

const AccountSummary = () => {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
console.log("summary",summary);

  const [accountOptions, setAccountOptions] = useState([]);
  // const [selectedAccount, setSelectedAccount] = useState(null);
  // const{showToast}=showToast()
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
  // const fetchEntries = async (accId = selectedAccount) => {
  //   if (!accId) {
  //     setEntries([]);
  //     setSummary(null);
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const payload = {
  //       account_id: accId,
  //     };

  //     const { error, response } = await apiCall(
  //       "POST",
  //       ApiEndpoints.GET_ACCOUNT_SUMMARY,
  //       payload
  //     );

  //     if (response) {
  //       setEntries(response?.data?.data || []);
  //       setSummary(response?.data?.summary);
  //       console.log("the summaru is", response?.data?.summary)
  //     } else {

  //       setEntries([]);
  //       setSummary(null);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setEntries([]);
  //     setSummary(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (selectedAccount) {
  //     fetchEntries(selectedAccount);
  //   } else {
  //     setEntries([]);
  //     setSummary(null);
  //   }
  // }, [selectedAccount]);

//   const fetchEntries = async (accId) => {
//   if (!accId) {
//     setEntries([]);
//     setSummary(null);
//     return;
//   }

//   setLoading(true);

//   try {
//     const payload = { account_id: accId };

//     const { error, response } = await apiCall(
//       "POST",
//       ApiEndpoints.GET_ACCOUNT_SUMMARY,
//       payload
//     );

//     if (!error && response) {
//       setEntries(response.data.data || []);
//       console.log("response sdhs",response.data.data);
      
//       setSummary(response || []);
//     } else {
//       setEntries([]);
//       setSummary(null);
//     }

//   } catch (err) {
//     console.error(err);
//     setEntries([]);
//     setSummary(null);
//   }

//   setLoading(false);
// };



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



  ];

  return (
    <>
      <CommonLoader loading={loading} text="Loading Entries..." />

      {!loading && (
        <Box>



          {/* ORIGINAL TABLE */}
          <CommonTable
            onFetchRef={handleFetchRef}
            columns={columns}
            filters={tableFilters}
            setSummary={setSummary}
            // externalData={entries}
            endpoint={ApiEndpoints.GET_ACCOUNT_SUMMARY}
            customHeader={
              (
 <Box
  sx={{
    display: "flex",
    gap: 1,
    mb: 1,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignItems: "center",
    p: 0.25,
    borderRadius: 1,
    ml:60
  }}
>
  {/* Total Credit */}
  <Box
    sx={{
      flex: "0 0 auto",
      background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
      p: 1,
      borderRadius: 1.5,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      minWidth: "180px",
      border: "1px solid #81c784",
    }}
  >
    <Typography variant="body2" fontWeight={600} color="#2e7d32">
      Total Credit
    </Typography>
    <Typography variant="h6" fontWeight={700} color="#1b5e20">
      ₹ {summary?.total_credit}
    </Typography>
  </Box>

  {/* Total Debit */}
  <Box
    sx={{
      flex: "0 0 auto",
      background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
      p: 1,
      borderRadius: 1.5,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      minWidth: "180px",
      border: "1px solid #e57373",
    }}
  >
    <Typography variant="body2" fontWeight={600} color="#c62828">
      Total Debit
    </Typography>
    <Typography variant="h6" fontWeight={700} color="#b71c1c">
      ₹ {summary?.total_debit}
    </Typography>
  </Box>

  {/* Total Entries */}
  <Box
    sx={{
      flex: "0 0 auto",
      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      p: 1,
      borderRadius: 1.5,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      minWidth: "180px",
      border: "1px solid #64b5f6",
    }}
  >
    <Typography variant="body2" fontWeight={600} color="#1565c0">
      Total Entries
    </Typography>
    <Typography variant="h6" fontWeight={700} color="#0d47a1">
      {summary?.total_entries}
    </Typography>
  </Box>
</Box>

              )
            }
          />

        </Box>
      )}
    </>
  );

};

export default AccountSummary;
