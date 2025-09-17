import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import CreateBankStatement from "./CreateBankStatement";
import CommonLoader from "../components/common/CommonLoader";
import { Typography, Box } from "@mui/material";

const BankStatements = () => {
  const location = useLocation();
  const { bank_id, bank_name, balance } = location.state || {};
  
  // const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ keep a ref for table refresh
  const fetchStatementsRef = useRef(null);
  const handleFetchRef = (fetchFn) => {
    fetchStatementsRef.current = fetchFn;
  };
  const refreshStatements = () => {
    if (fetchStatementsRef.current) {
      fetchStatementsRef.current();
    }
  };

  useEffect(() => {
    if (bank_id, balance) {
      setLoading(false);
    }
  }, [bank_id,balance]);

  return (
    <>
      <CommonLoader loading={loading} text="Loading Statements..." />

      {!loading && (
        <Box sx={{ p: 0.5 }}>
          <Typography variant="h6">
            Bank Statements for {bank_name?.toUpperCase()}
          </Typography>

          {/* Create Statement Form */}
          <CreateBankStatement
            open={true} // always visible on top of table
            handleClose={() => {}}
            onFetchRef={refreshStatements}
              bankId={bank_id}
  balance={balance} 
          />

          {/* Statements Table */}
          <Box sx={{ mt: 1 }}>
            <CommonTable
              onFetchRef={handleFetchRef}
              endpoint={`${ApiEndpoints.GET_BANK_STATEMENTS}?bank_id=${bank_id}&balance=${balance

              }`}
              columns={[
                { name: "Date", selector: (row) => row.date },
                { name: "Particulars", selector: (row) => row.particulars },
                { name: "Credit", selector: (row) => row.credit },
                   { name: "MOP", selector: (row) => row.mop },
                { name: "Debit", selector: (row) => row.debit },
                { name: "Balance", selector: (row) => row.balance },
                { name: "Status", selector: (row) => row.status },
              ]}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default BankStatements;
