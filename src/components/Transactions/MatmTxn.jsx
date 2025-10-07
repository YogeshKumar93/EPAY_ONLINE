import {
  useMemo,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  Box,
  Tooltip,
  Typography,
  Button,
  Drawer,
  IconButton,
} from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";
import CommonStatus from "../common/CommonStatus";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

import companylogo from "../../assets/Images/logo(1).png";
import TransactionDetailsCard from "../common/TransactionDetailsCard";
import Scheduler from "../common/Scheduler";
import { json2Excel } from "../../utils/exportToExcel";
import { apiErrorToast } from "../../utils/ToastUtil";
import { apiCall } from "../../api/apiClient";
import FileDownloadIcon from "@mui/icons-material/FileDownload"; // Excel export icon

const MatmTxn = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { error, response } = await apiCall(
          "post",
          ApiEndpoints.GET_ROUTES
        );
        if (response) {
          console.log("response", response);

          const routeOptions = response.data.map((r) => ({
            label: r.name, // shown in dropdown
            value: r.code, // sent in API calls
          }));
          setRoutes(routeOptions);
        } else {
          console.error("Failed to fetch routes", error);
        }
      } catch (err) {
        console.error("Error fetching routes:", err);
      }
    };

    fetchRoutes();
  }, []);
  const filters = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        type: "dropdown",
        options: [
          { value: "success", label: "Success" },
          { value: "failed", label: "Failed" },
          { value: "refund", label: "Refund" },
          { value: "pending", label: "Pending" },
        ],
        defaultValue: "pending",
      },
      {
        id: "route",
        label: "Route",
        type: "dropdown",
        options: routes, // ✅ dynamic routes here
        roles: ["adm"],
      },
      // { id: "customer_mobile", label: "Customer Mobile", type: "textfield" },
      { id: "txn_id", label: "Txn ID", type: "textfield" },
      { id: "user_id", label: "User ID", type: "textfield" },
      { id: "date_range", type: "daterange" },
    ],
    [routes] // ✅ depends on routes, so dropdown updates automatically
  );
  const handleExportExcel = async () => {
    try {
      // Fetch all users (without pagination/filters) from API
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_MATM_TXN,
        { export: 1 }
      );
      const usersData = response?.data?.data || [];

      if (usersData.length > 0) {
        json2Excel("MatmTxns", usersData); // generates and downloads Users.xlsx
      } else {
        apiErrorToast("no data found");
      }
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Failed to export Excel");
    }
  };
  const fetchUsersRef = useRef(null);
  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };
  const refreshPlans = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };
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
      ...(user?.role === "ret" || user?.role === "dd"
        ? []
        : [
            {
              name: "User",
              selector: (row) => (
                <div style={{ fontSize: "10px", fontWeight: "600" }}>
                  {row.user_id}
                </div>
              ),
              center: true,
              width: "70px",
            },
          ]),

      ...(user?.role === "ret" || user?.role === "dd"
        ? [] // ❌ hide for ret and dd
        : [
            {
              name: "Txn ID /Ref",
              selector: (row) => (
                <div
                  style={{
                    textAlign: "left",
                    fontSize: "10px",
                    fontWeight: "600",
                  }}
                >
                  {row.txn_id}
                  <br />
                  {row.client_ref}
                </div>
              ),
              wrap: true,
              width: "100px",
            },
          ]),
      ...(user?.role === "adm"
        ? []
        : [
            {
              name: "TxnId",
              selector: (row) => (
                <div
                  style={{
                    textAlign: "left",
                    fontSize: "10px",
                    fontWeight: "600",
                  }}
                >
                  {row.txn_id}
                  <br />
                  {/* {row.client_ref} */}
                </div>
              ),
              wrap: true,
              width: "100px",
            },
          ]),
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
        name: "GST",
        selector: (row) => (
          <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
            <div>GST: ₹{parseFloat(row.gst).toFixed(2)}</div>
          </div>
        ),
        wrap: true,
        right: true,
      },
      {
        name: " Comm",
        selector: (row) => (
          <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
            <div>Comm: ₹{parseFloat(row.commission).toFixed(2)}</div>
          </div>
        ),
        wrap: true,
        right: true,
      },
      {
        name: "TDS",
        selector: (row) => (
          <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
            <div>TDS: ₹{parseFloat(row.tds).toFixed(2)}</div>
          </div>
        ),
        wrap: true,
        right: true,
      },
      {
        name: "NET",
        selector: (row) => (
          <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
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

      ...(user?.role === "ret"
        ? [
            {
              name: "View",
              selector: (row) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "80px",
                  }}
                >
                  <Tooltip title="View Transaction">
                    <IconButton
                      color="info"
                      onClick={() => {
                        setSelectedRow(row);
                        setDrawerOpen(true);
                      }}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
              width: "100px",
              center: true,
            },
          ]
        : []),
    ],
    []
  );

  const columnsWithSelection = useMemo(() => {
    // Only show checkbox if user is NOT adm or sadm
    if (user?.role === "adm" || user?.role === "sadm") {
      return columns; // no selection column
    }
    return [
      {
        name: "",
        selector: (row) => (
          <input
            type="checkbox"
            checked={selectedRows.some((r) => r.id === row.id)}
            disabled={row.status?.toLowerCase() === "failed"}
            onChange={() => {
              const isSelected = selectedRows.some((r) => r.id === row.id);
              const newSelectedRows = isSelected
                ? selectedRows.filter((r) => r.id !== row.id)
                : [...selectedRows, row];
              setSelectedRows(newSelectedRows);
            }}
          />
        ),
        width: "40px",
      },
      ...columns,
    ];
  }, [selectedRows, columns]);

  const queryParam = "";

  return (
    <>
      <CommonTable
        onFetchRef={handleFetchRef}
        columns={columnsWithSelection}
        endpoint={ApiEndpoints.GET_MATM_TXN}
        filters={filters}
        queryParam={queryParam}
        enableActionsHover={true}
        enableSelection={false}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        customHeader={
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "8px",
              }}
            >
              {selectedRows.length > 0 && (
                <Tooltip title="View Selected Details">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      // Save selected rows to sessionStorage
                      sessionStorage.setItem(
                        "txnData",
                        JSON.stringify(selectedRows)
                      );

                      // Open new tab/window
                      window.open("/print-dmt2", "_blank");
                    }}
                  >
                    <PrintIcon
                      sx={{ fontSize: 20, color: "#e3e6e9ff", mr: 1 }}
                    />
                    MATM
                  </Button>
                </Tooltip>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "8px",
                flexWrap: "wrap",
              }}
            >
              {user?.role === "adm" && (
                <IconButton
                  color="primary"
                  onClick={handleExportExcel}
                  title="Export to Excel"
                >
                  <FileDownloadIcon />
                </IconButton>
              )}
              <Scheduler onRefresh={refreshPlans} />
            </Box>
          </>
        }
      />

      {/* MATM Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
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
              onClose={() => setDrawerOpen(false)} // ✅ Close drawer
              companyLogoUrl={companylogo}
              dateTime={ddmmyyWithTime(selectedRow.created_at)}
              message={selectedRow.message || "No message"}
              details={[
                { label: "Txn ID", value: selectedRow.txn_id },
                { label: "Client Ref", value: selectedRow.client_ref },
                { label: "Sender Mobile", value: selectedRow.sender_mobile },
                {
                  label: "Beneficiary Name",
                  value: selectedRow.beneficiary_name,
                },
                { label: "Account Number", value: selectedRow.account_number },
                { label: "IFSC Code", value: selectedRow.ifsc_code },
                { label: "Bank Name", value: selectedRow.bank_name },
                { label: "Route", value: selectedRow.route },
                { label: "Charge", value: selectedRow.ccf },
                { label: "GST", value: selectedRow.gst },
                { label: "Commission", value: selectedRow.comm },
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

export default MatmTxn;
