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
import { apiCall } from "../../api/apiClient";

const WalletLedger2 = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [loading, setLoading] = useState(true); // initially true
  const [services, setServices] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // stop loader after data is ready
    }, 1000); // 1 second delay just as an example

    return () => clearTimeout(timer);
  }, []);

  const fetchServices = async () => {
    try {
      const { response } = await apiCall("POST", ApiEndpoints.GET_SERVICES);
      if (response?.data) {
        setServices(
          response?.data.map((service) => ({
            value: service.name, // ✅ send name in payload
            label: service.name || `Service ${service.name}`,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);

  const filters = useMemo(
    () => [
      {
        id: "service_name",
        label: "Service Name",
        type: "dropdown",
        options: services,
      },

      {
        id: "mobile",
        label: "Mobile",
        type: "textfield",
      },
      {
        id: "date_range",
        // label: "Date Range",
        type: "daterange",
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

      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
      },
      {
        name: "View",
        selector: (row) => (
          <Tooltip title="View wallet ledger">
            <IconButton
              color="info"
              // onClick={() => {
              //   setSelectedRow(row);
              //   setDrawerOpen(true);
              // }}
              size="small"
              sx={{ backgroundColor: "transparent" }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [user]
  );

  const queryParam = "type_txn=LEDGER";

  return (
    <>
      {/* Loader */}
      <CommonLoader loading={loading} text="Loading Wallet Ledger" />

      {/* Table */}
      {!loading && (
        <CommonTable
          columns={columns}
          endpoint={ApiEndpoints.GET_WALLETLEDGER_2}
          filters={filters}
          queryParam={queryParam}
          refresh={true}
          enableExcelExport={true}
          exportFileName="PayoutTransactions"
          exportEndpoint={ApiEndpoints.GET_WALLETLEDGER_2}
        />
      )}
    </>
  );
};

export default WalletLedger2;
