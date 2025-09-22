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
import {
  dateToTime,
  dateToTime1,
  ddmmyy,
  ddmmyyWithTime,
} from "../utils/DateUtils";

import CommonStatus from "../components/common/CommonStatus";
import CommonLoader from "../components/common/CommonLoader";
import DeleteIcon from "@mui/icons-material/Delete";

import LaptopIcon from "@mui/icons-material/Laptop";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import W2wTransfer from "./w2wTransfer";
import { android2, linux2, macintosh2, windows2 } from "../iconsImports";
import { okhttp } from "../utils/iconsImports";
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

            {!(user?.role === "ret" || user?.role === "dd") && (
              <Tooltip title={`Updated: ${dateToTime(row.updated_at)}`} arrow>
                <span style={{ marginTop: "8px" }}>
                  {ddmmyy(row.updated_at)}
                </span>
              </Tooltip>
            )}
          </div>
        ),
        wrap: true,
        width: "140px",
      },
      {
        name: "Platform",
        selector: (row) => {
          let icon;

          if (row.pf.toLowerCase().includes("windows")) {
            icon = (
              <img
                src={windows2}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("android")) {
            icon = (
              <img
                src={android2}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("mac")) {
            icon = (
              <img
                src={macintosh2}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("linux")) {
            icon = (
              <img
                src={linux2}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("okhttp")) {
            icon = (
              <img
                src={okhttp}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else {
            icon = <LaptopIcon sx={{ color: "blue", width: "22px" }} />;
          }

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                textAlign: "justify",
                gap: 2,
              }}
            >
              {icon}
            </Box>
          );
        },
        width: "20px",
        wrap: true,
        left: true,
      },
      {
        name: "Service",
        selector: (row) => (
          <div
            style={{ textAlign: "left", fontSize: "10px", fontWeight: "600" }}
          >
            {row.operator || "N/A"}
          </div>
        ),
        wrap: true,
        width: "80px",
      },
      ...(user?.role === "ret" || user?.role === "dd"
        ? [] // ❌ hide for ret and dd
        : [
            {
              name: "TxnId/Ref",
              selector: (row) => (
                <>
                  <div style={{ textAlign: "left", fontSize: "13px" }}>
                    {row.txn_id}
                    <br />
                    {row.client_ref}
                  </div>
                </>
              ),
              wrap: true,
              width: "100px",
            },
          ]),
      ...(user?.role === "adm"
        ? [] // ❌ hide for ret and dd
        : [
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
          ]),
      {
        name: "Amount",
        selector: (row) => {
          const loggedInUserId = user.id || user.id; // tumhare auth context se
          let isDebit = row.user_id === loggedInUserId; // logged-in user se nikal raha paisa → red
          let isCredit = row.receiver_id === loggedInUserId; // logged-in user ko paisa mila → green

          let color = isCredit ? "green" : isDebit ? "red" : "black";
          let sign = isCredit ? "+" : isDebit ? "-" : "";

          return (
            <div style={{ color: color, fontWeight: 600 }}>
              {sign} ₹ {parseFloat(row.amount).toFixed(2)}
            </div>
          );
        },
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
        name: "Charge",
        selector: (row) => <div>₹ {parseFloat(row.charge).toFixed(2)}</div>,
        center: true,
        width: "80px",
      },
      {
        name: "GST",
        selector: (row) => <div>{row.gst}</div>,
        center: true,
        width: "60px",
      },
      // {
      //   name: "Status",
      //   selector: (row) => <CommonStatus value={row.status} />,
      //   center: true,
      //   width: "90px",
      // },
    ],
    []
  );

  return (
    <Box>
      <Box
        sx={{
          flex: 1, // chhota portion
          mb: -3,
          borderRadius: 3,
          display: "flex",
        }}
      >
        {user.role !== "adm" && (
          <W2wTransfer type="w2w" handleFetchRef={refreshTransfer} />
        )}
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
