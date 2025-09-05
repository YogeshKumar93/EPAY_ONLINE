import { useMemo, useCallback, useContext, useState } from "react";
import { Box, Tooltip, Typography, Button } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy } from "../../utils/DateUtils";

const IrctcTxn = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [openCreate, setOpenCreate] = useState(false);

  const columns = useMemo(
    () => [
      {
        name: "Txn ID",
        selector: (row) => row.txn_id,
        wrap: true,
      },
      {
        name: "Client Ref",
        selector: (row) => row.client_ref,
        wrap: true,
      },
      {
        name: "IRCTC Txn ID",
        selector: (row) => row.irctc_txn_id,
        wrap: true,
      },
      {
        name: "PNR",
        selector: (row) => row.pnr,
        wrap: true,
      },
      {
        name: "Route",
        selector: (row) => row.route?.toUpperCase(),
        wrap: true,
      },
      {
        name: "Platform",
        selector: (row) => row.pf?.toUpperCase(),
        wrap: true,
      },
      {
        name: "Amount (₹)",
        selector: (row) => `₹ ${parseFloat(row.amount).toFixed(2)}`,
        right: true,
        style: { color: "green", fontWeight: 600 },
      },
      {
        name: "Charges (₹)",
        selector: (row) => parseFloat(row.charges).toFixed(2),
        right: true,
      },
      {
        name: "Commission (₹)",
        selector: (row) => parseFloat(row.commission).toFixed(2),
        right: true,
      },
      {
        name: "GST (₹)",
        selector: (row) => parseFloat(row.gst).toFixed(2),
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
      {
        name: "Created At",
        selector: (row) =>
          `${ddmmyy(row.created_at)} ${dateToTime1(row.created_at)}`,
        wrap: true,
      },
      {
        name: "Updated At",
        selector: (row) =>
          `${ddmmyy(row.updated_at)} ${dateToTime1(row.updated_at)}`,
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
        endpoint={ApiEndpoints.GET_IRCTC_TXN}
        filters={filters}
        queryParam={queryParam}
      />
    </>
  );
};

export default IrctcTxn;
