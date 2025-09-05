import { useMemo, useCallback, useContext, useState } from "react";
import { Box, Tooltip, Typography, Button } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy } from "../../utils/DateUtils";

const RechargeTxn = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [openCreate, setOpenCreate] = useState(false);
  const columns = useMemo(
    () => [
      {
        name: "Txn Details",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            <strong>ID:</strong> {row.txn_id} <br />
            <strong>Ref:</strong> {row.client_ref}
          </div>
        ),
        wrap: true,
      },
      {
        name: "User / Route",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            User ID: {row.user_id} <br />
            Route: {row.route}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Platform",
        selector: (row) => (
          <div style={{ textAlign: "center", fontWeight: 500 }}>
            {row.pf?.toUpperCase()}
          </div>
        ),
        center: true,
      },
      {
        name: "Mobile & Operator",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            <strong>{row.mobile_number}</strong> <br />
            Operator: {row.operator}
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
        name: "Charges",
        selector: (row) => (
          <div style={{ textAlign: "right" }}>
            GST: ₹{parseFloat(row.gst).toFixed(2)} <br />
            Comm: ₹{parseFloat(row.comm).toFixed(2)}
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
        name: "API Response",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>{row.api_response}</div>
        ),
        wrap: true,
      },
      {
        name: "Timestamps",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            <strong>Created:</strong> {ddmmyy(row.created_at)}{" "}
            {dateToTime1(row.created_at)} <br />
            <strong>Updated:</strong> {ddmmyy(row.updated_at)}{" "}
            {dateToTime1(row.updated_at)}
          </div>
        ),
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
        endpoint={ApiEndpoints.GET_RECHARGE_TXN}
        filters={filters}
        queryParam={queryParam}
      />
    </>
  );
};

export default RechargeTxn;
