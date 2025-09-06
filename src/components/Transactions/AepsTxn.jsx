import { useMemo, useCallback, useContext, useState } from "react";
import { Box, Tooltip, Typography, Button } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";

const AepsTxn = ({ filters = [], query }) => {
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
      selector: (row) => <div style={{ textAlign: "left" }}>{row.txn_id}</div>,
      wrap: true,
    },
    {
      name: "Client Ref",
      selector: (row) => <div style={{ textAlign: "left" }}>{row.client_ref}</div>,
      wrap: true,
    },
    {
      name: "Aadhaar No.",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          **** **** {row.aadhaar_number.slice(-4)}
        </div>
      ),
      wrap: true,
    },
    {
      name: "Bank / IIN",
      selector: (row) => (
        <div style={{ textAlign: "left" }}>
          {row.bank_name?.toUpperCase()} <br /> {row.iin}
        </div>
      ),
      wrap: true,
    },
    {
      name: "Txn Type",
      selector: (row) => (
        <div style={{ fontWeight: 500, textAlign: "center" }}>{row.txn_type}</div>
      ),
      center: true,
    },
    {
      name: "Amount",
      selector: (row) => (
        <div style={{ color: "green", fontWeight: 600, textAlign: "right" }}>
          ₹ {parseFloat(row.amount).toFixed(2)}
        </div>
      ),
      right: true,
    },
    {
      name: "Commission",
      selector: (row) => (
        <div style={{ textAlign: "right" }}>₹ {parseFloat(row.comm).toFixed(2)}</div>
      ),
      right: true,
    },
    {
      name: "Balance",
      selector: (row) => (
        <div style={{ textAlign: "right", fontWeight: 600 }}>
          ₹ {parseFloat(row.balance).toFixed(2)}
        </div>
      ),
      right: true,
    },
    {
      name: "RRN",
      selector: (row) => <div style={{ textAlign: "center" }}>{row.rrn}</div>,
      center: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <div
          style={{
            color:
              row.status === "SUCCESS"
                ? "green"
                : row.status === "PENDING"
                ? "orange"
                : "red",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {row.status}
        </div>
      ),
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
        endpoint={ApiEndpoints.GET_AEPS_TXN}
        filters={filters}
        queryParam={queryParam}
      />
    </>
  );
};

export default AepsTxn;
