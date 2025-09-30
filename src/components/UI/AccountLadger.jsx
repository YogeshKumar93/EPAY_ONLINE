import { useMemo, useCallback, useContext, useEffect, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import { currencySetter } from "../../utils/Currencyutil";
import { dateToTime, ddmmyy } from "../../utils/DateUtils";
import { capitalize1 } from "../../utils/TextUtil";
import AuthContext from "../../contexts/AuthContext";
import CommonStatus from "../common/CommonStatus";
import CommonLoader from "../common/CommonLoader";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { RemoveRedEye } from "@mui/icons-material";
import WalletTxnData from "../WalletTxnData";

const AccountLadger = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [loading, setLoading] = useState(true); // initially true
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
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
        name: "Service",
        selector: (row) => (
          <div style={{ fontWeight: 500, color: "#000" }}> {row.service}</div>
        ),
        center: true,
      },
      ...(user?.role === "adm" || user?.role === "sadm"
        ? [
            {
              name: "Est.",
              selector: (row) => (
                <div style={{ fontWeight: 500, color: "#000" }}>
                  {row.establishment}
                </div>
              ),
              center: true,
            },
          ]
        : []),
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
        name: "Amount",
        selector: (row) => {
          const isCredit = row.txn_type === "CR";
          const sign = isCredit ? "+" : "-";
          const color = isCredit ? "green" : "red";

          return (
            <Tooltip title={row?.amount}>
              <div
                style={{
                  textAlign: "left",
                  color: color,
                  fontWeight: 500,
                }}
              >
                {sign} {parseFloat(row?.amount).toFixed(2)}
              </div>
            </Tooltip>
          );
        },
      },

      {
        name: "Opening",
        selector: (row) => (
          <Tooltip title={row?.opening_balance}>
            <div style={{ textAlign: "left" }}>
              {parseFloat(row?.opening_balance).toFixed(2)}
            </div>
          </Tooltip>
        ),
      },
      {
        name: "Closing",
        selector: (row) => (
          <Tooltip title={row?.closing_balance}>
            <div style={{ textAlign: "left" }}>
              {parseFloat(row?.closing_balance).toFixed(2)}
            </div>
          </Tooltip>
        ),
      },

      //  {
      //         name: "View",
      //         selector: (row) => (
      //           <Tooltip title="View wallet ledger">
      //             <IconButton
      //               color="info"
      //               // onClick={() => {
      //               //   setSelectedRow(row);
      //               //   setDrawerOpen(true);
      //               // }}
      //               size="small"
      //               sx={{ backgroundColor: "transparent" }}
      //             >
      //               <VisibilityIcon />
      //             </IconButton>
      //           </Tooltip>
      //         ),
      //       },

      // {
      //   name: "Status",
      //   selector: (row) => <CommonStatus value={row.status} />,
      //   center: true,
      // },
      {
        name: "Action",
        selector: (row) => (
          <button
            onClick={() => {
              setSelectedRowId(row.txn_id);
              setDetailOpen(true);
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#007bff",
              fontSize: "16px",
            }}
          >
            <RemoveRedEye />
          </button>
        ),
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
 <WalletTxnData
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        rowId={selectedRowId}
      />

    </>
  );
};

export default AccountLadger;
