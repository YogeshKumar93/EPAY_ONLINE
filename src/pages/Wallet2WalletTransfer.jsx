import { useMemo, useContext, useState, useEffect, useRef } from "react";
import {
  Tooltip,
  IconButton,
  Box,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../utils/DateUtils";

import CommonStatus from "../components/common/CommonStatus";
import CommonLoader from "../components/common/CommonLoader";
import DeleteIcon from "@mui/icons-material/Delete";

import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import W2wTransfer from "./w2wTransfer";
const Wallet2WalletTransfer = ({ filters = [] }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const fetchUsersRef = useRef(null);
  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };

  const refreshTransfer = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const tableEndpoint =
    user?.role === "adm" || user?.role === "sadm"
      ? ApiEndpoints.WALLET_LIST
      : ApiEndpoints.WALLET_GET_W2W_TRANSACTION;

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
          <Tooltip title={row.txn_id}>
            <div style={{ fontWeight: 500, textAlign: "left" }}>
              {row.txn_id}
            </div>
          </Tooltip>
        ),
        wrap: true,
        width: "100px",
      },
      {
        name: "Amount",
        selector: (row) => (
          <div style={{ color: "green", fontWeight: "600" }}>
            ₹ {parseFloat(row.amount).toFixed(2)}
          </div>
        ),
        wrap: true,
        width: "80px",
      },
      {
        name: "Remarks",
        selector: (row) => <div>{row.remark || "N/A"}</div>,
        center: true,
        width: "70px",
      },
      {
        name: "GST",
        selector: (row) => <div>{row.gst}%</div>,
        center: true,
        width: "60px",
      },
      {
        name: "Charge",
        selector: (row) => <div>₹ {parseFloat(row.charge).toFixed(2)}</div>,
        center: true,
        width: "80px",
      },
      {
        name: "Route",
        selector: (row) => <div style={{ textAlign: "left" }}>{row.route}</div>,
        wrap: true,
      },
      // {
      //   name: "Client Ref",
      //   selector: (row) => (
      //     <Tooltip title={row.client_ref}>
      //       <div style={{ textAlign: "left" }}>{row.client_ref}</div>
      //     </Tooltip>
      //   ),
      //   wrap: true,
      // },
      // {
      //   name: "IP",
      //   selector: (row) => {
      //     let loc = {};
      //     try {
      //       loc = JSON.parse(row.location);
      //     } catch (e) {}
      //     return <div>{loc?.ip || "-"}</div>;
      //   },
      //   center: true,
      //   width: "120px",
      // },
      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
        width: "90px",
      },
    ],
    []
  );

  return (
    <Box>
      {/* LEFT: W2W Transfer Form */}
      <Box
        sx={{
          flex: 1, // chhota portion
          mb: -3,
          borderRadius: 3,
          display: "flex",
        }}
      >
        <W2wTransfer type="w2w" handleFetchRef={refreshTransfer} />
      </Box>

      <Box sx={{}}>
        {loading ? (
          <CommonLoader loading={loading} text="Loading Wallet Transfers" />
        ) : (
          <CommonTable
            onFetchRef={handleFetchRef}
            columns={columns}
            endpoint={tableEndpoint}
            filters={filters}
            queryParam=""
            refresh={false}
          />
        )}
      </Box>
    </Box>
  );
};

export default Wallet2WalletTransfer;
