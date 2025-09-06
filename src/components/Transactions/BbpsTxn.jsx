import { useMemo, useCallback, useContext, useState } from "react";
import { Box, Tooltip, Typography, Button } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";

const BbpxTxn = ({ filters = [], query }) => {
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
        name: "Client Ref",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>{row.client_ref}</div>
        ),
        wrap: true,
      },
      {
        name: "Biller",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            <strong>{row.biller_name}</strong> <br />
            ID: {row.biller_id}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Consumer",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            Number: {row.consumer_number} <br />
            Mobile: {row.customer_mobile}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Route / Platform",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {row.route} <br />
            {row.pf?.toUpperCase()}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Amount (₹)",
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
        name: "Charges & Comm",
        selector: (row) => (
          <div style={{ textAlign: "right" }}>
            Charges: ₹{parseFloat(row.charges).toFixed(2)} <br />
            GST: ₹{parseFloat(row.gst).toFixed(2)} <br />
            Comm: ₹{parseFloat(row.commission).toFixed(2)} <br />
            TDS: ₹{parseFloat(row.tds).toFixed(2)} <br />
            Net Comm: ₹{parseFloat(row.net_commission).toFixed(2)}
          </div>
        ),
        wrap: true,
        right: true,
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
      {
        name: "RRN",
        selector: (row) => <div style={{ textAlign: "left" }}>{row.rrn}</div>,
        wrap: true,
      },
   
    ],
    []
  );

  const queryParam = "";

  return (
    <>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_BBPS_TXN}
        filters={filters}
        queryParam={queryParam}
      />
    </>
  );
};

export default BbpxTxn;
