import { useMemo, useCallback, useContext, useEffect, useState } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import { currencySetter } from "../../utils/Currencyutil";
import { dateToTime, ddmmyy } from "../../utils/DateUtils";
import { capitalize1 } from "../../utils/TextUtil";
import AuthContext from "../../contexts/AuthContext";
import CommonStatus from "../common/CommonStatus";
import CommonLoader from "../common/CommonLoader";

const AccountLadger = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [loading, setLoading] = useState(true); // initially true

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // stop loader after data is ready
    }, 1000); // 1 second delay just as an example

    return () => clearTimeout(timer);
  }, []);

  const filters = useMemo(
    () => [
      {
        id: "user_id",
        label: "User Name",
        type: "textfield",
      },
      {
        id: "date_range",
        // label: "Date Range",
        type: "daterange",
      },
      {
        id: "mobile",
        label: "Mobile",
        type: "textfield",
      },
    ],
    []
  );

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
        name: "Narration",
        selector: (row) => (
          <Tooltip title={row?.narration}>
            <div style={{ textAlign: "left" }}>
              {capitalize1(row?.narration)}
            </div>
          </Tooltip>
        ),
        width: "185px",
        wrap: true,
      },
      {
        name: "Transaction Id",
        selector: (row) => (
          <Tooltip title={row?.txn_id}>
            <div style={{ textAlign: "left" }}>{capitalize1(row?.txn_id)}</div>
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
        name: "Opening Balance",
        selector: (row) => (
          <Tooltip title={row?.opening_balance}>
            <div style={{ textAlign: "left" }}>
              {parseFloat(row?.opening_balance).toFixed(2)}
            </div>
          </Tooltip>
        ),
      },
      {
        name: "Closing Balance",
        selector: (row) => (
          <Tooltip title={row?.closing_balance}>
            <div style={{ textAlign: "left" }}>
              {parseFloat(row?.closing_balance).toFixed(2)}
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

              {(user.role === "ret" || user.role === "dd") &&
                row.txn_type === "DR" && (
                  <div style={{ color: "red", textAlign: "left" }}>
                    -{currencySetter(parseFloat(row.amount).toFixed(2))}
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

              {(user.role === "ret" || user.role === "dd") &&
                row.txn_type === "CR" && (
                  <div style={{ color: "green", textAlign: "left" }}>
                    + {currencySetter(parseFloat(row.amount).toFixed(2))}
                  </div>
                )}
            </Box>
          );
        },
        wrap: true,
        center: false,
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
      },
    ],
    [user]
  );

  const queryParam = "type_txn=LEDGER";

  return (
    <>
      {/* Loader */}
      <CommonLoader loading={loading} text="Loading Fund Requests" />

      {/* Table */}
      {!loading && (
        <CommonTable
          columns={columns}
          endpoint={ApiEndpoints.GET_WALLETLEDGER}
          filters={filters}
          queryParam={queryParam}
          refresh={true}
        />
      )}
    </>
  );
};

export default AccountLadger;
