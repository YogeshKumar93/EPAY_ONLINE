import { useMemo, useCallback, useContext, useState } from "react";
import { Box, Tooltip, Typography, Button } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";
import CommonStatus from "../common/CommonStatus";

const PayoutTxn = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [openCreate, setOpenCreate] = useState(false);

  const columns = useMemo(
    () => [
            
      {
        name: "Date",
        selector: (row) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Tooltip title={`Created: ${ddmmyyWithTime(row.created_at)}`} arrow>
              <span>
                {ddmmyy(row.created_at)} {dateToTime1(row.created_at)}
              </span>
            </Tooltip>
      
            <Tooltip title={`Updated: ${ddmmyyWithTime(row.updated_at)}`} arrow>
              <span>
               {ddmmyy(row.updated_at)} {dateToTime1(row.updated_at)}
              </span>
            </Tooltip>
          </div>
        ),
        wrap: true,
        width: "140px", 
      },
      {
        name: "Txn ID",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>{row.txn_id}</div>
        ),
        wrap: true,
      },

      {
        name: "Mobile Number",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>{row.mobile_number}</div>
        ),
        wrap: true,
      },
      {
        name: "Beneficiary",
        selector: (row) => (
          <div style={{ textAlign: "left", fontWeight: 500 }}>
            {row.beneficiary_name}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Bank Details",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {row.bank_name?.toUpperCase()} <br />
            {row.account_number} <br />
            {row.ifsc_code}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Amount",
        selector: (row) => (
          <div
            style={{ color: "green", fontWeight: "600", textAlign: "right" }}
          >
            ₹ {parseFloat(row.amount).toFixed(2)}
          </div>
        ),
        wrap: true,
        right: true,
      },
      {
        name: "CCF",
        selector: (row) => (
          <>
        ₹{parseFloat(row.ccf).toFixed(2)}
       </>
        ),
        wrap: true,
        right: true,
      },
      {
        name: "GST",
        selector: (row) => (
          <>
            ₹{parseFloat(row.gst).toFixed(2)}
                </>  ),
        wrap: true,
        right: true,
      },
      {
        name: "Comm",
        selector: (row) => (
          <>
            ₹{parseFloat(row.comm).toFixed(2)}
                </>  ),
        wrap: true,
        right: true,
      },
      {
        name: "TDS",
        selector: (row) => (
          <>
            ₹{parseFloat(row.tds).toFixed(2)}
                </>  ),
        wrap: true,
        right: true,
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
       
        center: true,
      },
    
    ],
    []
  );

  const queryParam = "";

  return (
    <>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_PAYOUT_TXN}
        filters={filters}
        queryParam={queryParam}
      />
    </>
  );
};

export default PayoutTxn;
