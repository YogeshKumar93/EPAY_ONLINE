import { useMemo, useCallback, useContext, useState } from "react";
import { Box, Tooltip, Typography, Button } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";
import CommonStatus from "../common/CommonStatus";

const MatmTxn = ({ filters = [], query }) => {
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
          <div style={{ textAlign: "left", fontWeight: 500 }}>{row.txn_id}</div>
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
            <strong style={{ fontSize: "0.95rem" }}>{row.biller_name}</strong>
            <br />
            <span style={{ fontSize: "0.8rem", color: "#666" }}>
              ID: {row.biller_id}
            </span>
          </div>
        ),
        wrap: true,
      },
      {
        name: "Consumer",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            <span>Number: {row.consumer_number}</span>
            <br />
            <span style={{ color: "#444" }}>Mobile: {row.customer_mobile}</span>
          </div>
        ),
        wrap: true,
      },
      {
        name: "Route / Platform",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            <span>{row.route}</span>
            <br />
            <span style={{ fontWeight: 500, color: "#1976d2" }}>
              {row.pf?.toUpperCase()}
            </span>
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
          <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
            <div>Charges: ₹{parseFloat(row.charges).toFixed(2)}</div>
            <div>GST: ₹{parseFloat(row.gst).toFixed(2)}</div>
            <div>Comm: ₹{parseFloat(row.commission).toFixed(2)}</div>
            <div>TDS: ₹{parseFloat(row.tds).toFixed(2)}</div>
            <div style={{ fontWeight: 600, color: "#1976d2" }}>
              Net: ₹{parseFloat(row.net_commission).toFixed(2)}
            </div>
          </div>
        ),
        wrap: true,
        right: true,
      },
       {
        name: "RRN",
        selector: (row) => (
          <div style={{ textAlign: "left", fontSize: "0.85rem" }}>
            {row.rrn}
          </div>
        ),
        wrap: true,
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
        endpoint={ApiEndpoints.GET_MATM_TXN}
        filters={filters}
        queryParam={queryParam}
      />
    </>
  );
};

export default MatmTxn;
