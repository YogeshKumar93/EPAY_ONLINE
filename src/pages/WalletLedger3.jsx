import { useMemo, useCallback, useContext, useEffect, useState } from "react";
import { Box, Drawer, IconButton, Tooltip, Typography } from "@mui/material";
 
 

 
// import { capitalize1 } from "../../utils/TextUtil";
 
// import CommonStatus from "../common/CommonStatus";
 
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommonLoader from "../components/common/CommonLoader";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy, ddmmyyWithTime } from "../utils/DateUtils";
import CommonStatus from "../components/common/CommonStatus";
import { capitalize1 } from "../utils/TextUtil";
import TransactionDetailsCard from "../components/common/TransactionDetailsCard";
import ComplaintForm from "../components/ComplaintForm";
import companylogo from "../assets/Images/PPALogor.png";
import { apiCall } from "../api/apiClient";

const WalletLedger3 = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [loading, setLoading] = useState(true); // initially true
   const [selectedRow, setSelectedRow] = useState(null);
    const [openCreate, setOpenCreate] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "80px",
              gap: 1,
            }}
          >
            {/* View Transaction visible to all */}
            <Tooltip title="View Transaction">
              <IconButton
                color="info"
                onClick={() => {
                  setSelectedRow(row);
                  setDrawerOpen(true);
                }}
                size="small"
                sx={{ backgroundColor: "transparent" }}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            {/* Print payout visible only to ret and dd */}
            {(user?.role === "ret" || user?.role === "dd") && (
              <Tooltip title="Print payout">
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() =>
                    navigate("/print-payout", { state: { txnData: row } })
                  }
                  sx={{ backgroundColor: "transparent" }}
                >
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ),
        width: "100px",
        center: true,
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
          endpoint={ApiEndpoints.GET_WALLETLEDGER_3}
          filters={filters}
          queryParam={queryParam}
          refresh={true}
        />
      )}

   {/* Complaint Modal */}
      {openCreate && selectedTxn && (
        <ComplaintForm
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          txnId={selectedTxn}
          type="dmt"
        />
      )}

      {/* Transaction Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box
          sx={{
            width: 400,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {selectedRow && (
            <TransactionDetailsCard
              amount={selectedRow.amount}
              status={selectedRow.status}
              onClose={() => setDrawerOpen(false)}
              companyLogoUrl={companylogo}
              dateTime={ddmmyyWithTime(selectedRow.created_at)}
              message={selectedRow.message || "No message"}
              details={[
                { label: "Operator", value: selectedRow.operator },
                { label: "Operator Id", value: selectedRow.operator_id },
                { label: "Order Id", value: selectedRow.order_id },
                { label: "MOP", value: selectedRow.mop },
                { label: "Customer Number", value: selectedRow.sender_mobile },
                { label: "CCF", value: selectedRow.ccf },
                { label: "Charge", value: selectedRow.charges },
                { label: "GST", value: selectedRow.gst },
                { label: "TDS", value: selectedRow.tds },
              ]}
              onRaiseIssue={() => {
                setSelectedTxn(selectedRow.txn_id);
                setOpenCreate(true);
              }}
            />
          )}
        </Box>
      </Drawer>

    </>
  );
};

export default WalletLedger3;
