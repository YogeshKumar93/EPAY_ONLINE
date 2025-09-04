import { useMemo, useCallback, useContext } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import { currencySetter } from "../../utils/Currencyutil";
import { dateToTime, ddmmyy } from "../../utils/DateUtils";
import { capitalize1 } from "../../utils/TextUtil";
import AuthContext from "../../contexts/AuthContext";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import LaptopIcon from "@mui/icons-material/Laptop";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

const FundRequest = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const getStatusColor = useCallback((status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "success";
      case "FAILED":
        return "error";
      case "REFUND":
        return "warning";
      case "PENDING":
        return "info";
      default:
        return "default";
    }
  }, []);

  // memoized columns
  const columns = useMemo(
    () => [
      {
        name: "Date/Time",
        selector: (row) => (
          <div className="mb-1" style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Route",
        cell: (row) => (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <div>
              {row.platform === "APP" ? (
                <Tooltip title="APP">
                  <InstallMobileIcon fontSize="small" />
                </Tooltip>
              ) : row.platform === "WEB" ? (
                <Tooltip title="WEB">
                  <LaptopIcon fontSize="small" />
                </Tooltip>
              ) : row.platform === "ANDROID" ? (
                <Tooltip title="ANDROID">
                  <AndroidIcon fontSize="small" />
                </Tooltip>
              ) : row.platform === "IOS" ? (
                <Tooltip title="IOS">
                  <AppleIcon fontSize="small" />
                </Tooltip>
              ) : (
                <Tooltip title="API">
                  <SyncAltIcon fontSize="small" />
                </Tooltip>
              )}
            </div>
          </div>
        ),
        width: "70px",
      },
      {
        name: "Number",
        selector: (row) => (
          <div style={{ textAlign: "left" }} className="d-flex">
            <span
              style={{ marginRight: "4px", cursor: "pointer" }}
              onClick={() => {
                navigator.clipboard.writeText(row.number);
              }}
            >
              {row.number}
            </span>
          </div>
        ),
        center: false,
      },
      {
        name: "Particular",
        selector: (row) => (
          <Tooltip title={row?.operator}>
            <div style={{ textAlign: "left" }}>{capitalize1(row?.operator)}</div>
          </Tooltip>
        ),
        width: "185px",
        wrap: true,
      },
      {
        name: "Amount txn",
        selector: (row) => (
          <Tooltip title={row?.amount}>
            <div style={{ textAlign: "left" }}>
              {parseFloat(row?.amount).toFixed(2)}
            </div>
          </Tooltip>
        ),
      },
      {
        name: "Debit",
        selector: (row) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "16px",
                textAlign: "justify",
                fontWeight: "500",
              }}
            >
              {(user.role === "Ad" || user.role === "Md") &&
                row.txn_type === "DR" && (
                  <div style={{ color: "red", textAlign: "left" }}>
                    {row.type === "W2W TRANSFER"
                      ? currencySetter(parseFloat(row.net_amount).toFixed(2))
                      : "0"}
                  </div>
                )}

              {(user.role === "Ret" || user.role === "Dd") &&
                row.txn_type === "DR" && (
                  <div style={{ color: "red", textAlign: "left" }}>
                    -{currencySetter(parseFloat(row.net_amount).toFixed(2))}
                  </div>
                )}
            </Box>
          );
        },
        wrap: true,
        center: false,
      },
      {
        name: "Credit",
        selector: (row) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "16px",
                textAlign: "justify",
                fontWeight: "500",
              }}
            >
              {(user.role === "Ad" || user.role === "Md") &&
                row.txn_type === "CR" && (
                  <div style={{ color: "green", textAlign: "left" }}>
                    {row.type === "W2W TRANSFER"
                      ? currencySetter(parseFloat(row.net_amount).toFixed(2))
                      : currencySetter(parseFloat(row.ad_comm).toFixed(2))}
                  </div>
                )}

              {(user.role === "Ret" || user.role === "Dd") &&
                row.txn_type === "CR" && (
                  <div style={{ color: "green", textAlign: "left" }}>
                    + {currencySetter(parseFloat(row.net_amount).toFixed(2))}
                  </div>
                )}
            </Box>
          );
        },
        wrap: true,
        center: false,
      },
      {
        name: "Closing Balance",
        selector: (row) => {
          return (
            <Tooltip title={row.ip}>
              {(user.role === "Ad" || user.role === "Md") && (
                <Typography>
                  {row.user_id === user.id
                    ? currencySetter(parseFloat(row.w1).toFixed(2))
                    : currencySetter(parseFloat(row.ad_closing).toFixed(2))}
                </Typography>
              )}

              {(user.role === "Dd" || user.role === "Ret") && (
                <>
                  <Typography align="left">
                    {currencySetter(parseFloat(row.w1).toFixed(2))}
                  </Typography>
                  <Typography align="left">
                    {currencySetter(parseFloat(row.w2).toFixed(2))}
                  </Typography>
                </>
              )}
            </Tooltip>
          );
        },
        width: "190px",
      },
      {
        name: "Status",
        selector: (row) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {row?.status?.status}
          </Box>
        ),
      },
    ],
    [user]
  );

  const filters = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        type: "dropdown",
        options: [
          { value: "All", label: "All" },
          { value: "SUCCESS", label: "Success" },
          { value: "FAILED", label: "Failed" },
          { value: "REFUND", label: "Refund" },
          { value: "PENDING", label: "Pending" },
        ],
      },
      { id: "establishment", label: "User", type: "textfield" },
    ],
    []
  );

  return (
    <CommonTable
      columns={columns}
      endpoint={ApiEndpoints.GET_FUND_REQUESTS}
      queryParam="status=SUCCESS"
      filters={filters}
      defaultFilters={{
        status: "SUCCESS",
      }}
    />
  );
};

export default FundRequest;