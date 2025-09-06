import { useMemo, useCallback, useContext, useState } from "react";
import { Box, Tooltip, Typography, Button } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy,ddmmyyWithTime } from "../../utils/DateUtils";

const DmtTxn = ({ filters = [], query }) => {
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
        selector: (row) => row.txn_id,
        sortable: true,
        wrap: true,
      },
      {
        name: "Client Ref",
        selector: (row) => row.client_ref,
        wrap: true,
      },
      {
        name: "Sender Mobile",
        selector: (row) => row.sender_mobile,
        wrap: true,
      },
      {
        name: "Beneficiary Name",
        selector: (row) => row.beneficiary_name,
        wrap: true,
        style: { fontWeight: 500 },
      },
      {
        name: "Bank Name",
        selector: (row) => row.bank_name?.toUpperCase(),
        wrap: true,
      },
      {
        name: "Account No.",
        selector: (row) =>
          row.account_number ? `****${row.account_number.slice(-4)}` : "",
        wrap: true,
      },
      {
        name: "IFSC",
        selector: (row) => row.ifsc_code,
        wrap: true,
      },
      {
        name: "Amount (₹)",
        selector: (row) => parseFloat(row.amount).toFixed(2),
        right: true,
        style: { color: "green", fontWeight: 600 },
      },
      {
        name: "CCF (₹)",
        selector: (row) => parseFloat(row.ccf).toFixed(2),
        right: true,
      },
      {
        name: "GST (₹)",
        selector: (row) => parseFloat(row.gst).toFixed(2),
        right: true,
      },
      {
        name: "Comm (₹)",
        selector: (row) => parseFloat(row.comm).toFixed(2),
        right: true,
      },
      {
        name: "TDS (₹)",
        selector: (row) => parseFloat(row.tds).toFixed(2),
        right: true,
      },
      {
        name: "Status",
        selector: (row) => row.status,
        center: true,
        style: (row) => ({
          color:
            row.status === "SUCCESS"
              ? "green"
              : row.status === "PENDING"
              ? "orange"
              : "red",
          fontWeight: 600,
        }),
      },
   
    ],
    []
  );

  const queryParam = "";

  return (
    <>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_DMT_TXN}
        filters={filters}
        queryParam={queryParam}
      />
    </>
  );
};

export default DmtTxn;
