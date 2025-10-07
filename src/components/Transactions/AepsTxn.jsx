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

import biggpayLogo from "../../assets/Images/PPALogor.png";
import TransactionDetailsCard from "../common/TransactionDetailsCard";
import { android2, linux2, macintosh2, windows2 } from "../../iconsImports";
import { okhttp } from "../../utils/iconsImports";
import LaptopIcon from "@mui/icons-material/Laptop";
import PrintIcon from "@mui/icons-material/Print";
import { Navigate, useNavigate } from "react-router-dom";
import CommonModal from "../common/CommonModal";
import { useToast } from "../../utils/ToastContext";
import { apiCall } from "../../api/apiClient";
import Scheduler from "../common/Scheduler";
import AddLein from "../../pages/AddLein";
import { json2Excel } from "../../utils/exportToExcel";
import { apiErrorToast } from "../../utils/ToastUtil";
import FileDownloadIcon from "@mui/icons-material/FileDownload"; // Excel export icon

const AepsTxn = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedApiResponse, setSelectedApiResponse] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { showToast } = useToast();
  const [selectedForRefund, setSelectedForRefund] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTrancation] = useState("");
  const [openLeinModal, setOpenLeinModal] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [routes, setRoutes] = useState([]);

  const handleOpenLein = (row) => {
    setOpenLeinModal(true);
    setSelectedTrancation(row);
  };
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
  const handleCloseLein = () => setOpenLeinModal(false);
  const handleRefundClick = (row) => {
    setSelectedForRefund(row);
    setConfirmModalOpen(true);
  };
  const handleConfirmRefund = async () => {
    if (!selectedForRefund) return;
    setRefundLoading(true);

    const { error, response } = await apiCall("post", ApiEndpoints.REFUND_TXN, {
      txn_id: selectedForRefund.txn_id,
    });

    if (response) {
      showToast(
        response?.message || "Refund processed successfully",
        "success"
      );

      // Close modal and reset selected row
      setConfirmModalOpen(false);
      setSelectedForRefund(null);
    } else {
      showToast(error?.message || "Failed to process refund", "error");
    }

    setRefundLoading(false);
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
        ApiEndpoints.GET_AEPS_TXN,
        { export: 1 }
      );
      const usersData = response?.data?.data || [];

      if (usersData.length > 0) {
        json2Excel("AepsTxns", usersData); // generates and downloads Users.xlsx
      } else {
        apiErrorToast("no data found");
      }
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Failed to export Excel");
    }
  };
  const ActionColumn = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
      <div style={{ textAlign: "center" }}>
        <IconButton size="small" onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {row.status === "PENDING" && (
            <>
              <MenuItem
                onClick={() => {
                  // mark as success handler
                  handleClose();
                }}
              >
                Mark as Success
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleRefundClick(row);
                  handleClose();
                }}
              >
                Refund
              </MenuItem>
            </>
          )}

          <MenuItem
            onClick={() => {
              handleOpenLein(row);
              handleClose();
            }}
          >
            Mark Lein
          </MenuItem>
        </Menu>
      </div>
    );
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
        width: "190px",
      },
      {
        name: "Route",
        selector: (row) => (
          <div style={{ fontSize: "10px", fontWeight: "600" }}>{row.route}</div>
        ),
        center: true,
        width: "70px",
      },
      {
        name: "Pf",
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
      ...(user?.role === "ret" || user?.role === "dd"
        ? []
        : [
            {
              name: "Est.",
              selector: (row) => (
                <div style={{ fontSize: "10px", fontWeight: "600" }}>
                  {row.establishment}
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
        name: "Aadhaar No.",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            **** **** {row.aadhaar_number.slice(-4)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Service",
        selector: (row) => (
          <div style={{ textAlign: "left", fontWeight: "600" }}>
            {row.operator} <br />
            {["adm", "sadm"].includes(user?.role) && (
              <>
                <span
                  style={{
                    fontWeight: "normal",
                    fontSize: "8px",
                    color: "blue",
                  }}
                >
                  STATUS
                </span>
                <span
                  style={{
                    fontWeight: "normal",
                    fontSize: "8px",
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                    marginLeft: "6px",
                  }}
                  onClick={() => {
                    setSelectedApiResponse(
                      row.api_response || "No response available"
                    );
                    setResponseModalOpen(true);
                  }}
                >
                  RESPONSE
                </span>
              </>
            )}
          </div>
        ),
        wrap: true,
      },
      // {
      //   name: "Bank / IIN",
      //   selector: (row) => (
      //     <div style={{ textAlign: "left" }}>
      //       {row.bank_name?.toUpperCase()} <br /> {row.iin}
      //     </div>
      //   ),
      //   wrap: true,
      // },

      {
        name: "Amount",
        selector: (row) => (
          <div style={{ color: "green", fontWeight: 600, textAlign: "right" }}>
            ₹ {parseFloat(row.amount).toFixed(2)}
          </div>
        ),
        right: true,
      },
      {
        name: "Ret Comm",
        selector: (row) => (
          <div
            style={{ textAlign: "right", fontSize: "10px", fontWeight: 600 }}
          >
            <div style={{ color: "green" }}>
              {parseFloat(row.ret_comm).toFixed(2)}
            </div>
            <div style={{ color: "blue" }}>
              {parseFloat(row.ret_tds).toFixed(2)}
            </div>
          </div>
        ),
        right: true,
        width: "60px",
      },
      ...(user?.role === "adm"
        ? [
            {
              name: "Di Comm",
              selector: (row) => (
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "10px",
                    fontWeight: 600,
                  }}
                >
                  <div style={{ color: "green" }}>
                    {parseFloat(row.di_comm).toFixed(2)}
                  </div>
                  <div style={{ color: "blue" }}>
                    {parseFloat(row.di_tds).toFixed(2)}
                  </div>
                </div>
              ),
              right: true,
              width: "60px",
            },
            {
              name: "Md Comm",
              selector: (row) => (
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "10px",
                    fontWeight: 600,
                  }}
                >
                  <div style={{ color: "green" }}>
                    {parseFloat(row.md_comm).toFixed(2)}
                  </div>
                  <div style={{ color: "blue" }}>
                    {parseFloat(row.md_tds).toFixed(2)}
                  </div>
                </div>
              ),
              right: true,
              width: "60px",
            },
          ]
        : []),

      {
        name: "Balance",
        selector: (row) => (
          <div style={{ textAlign: "right", fontWeight: 600 }}>
            ₹ {parseFloat(row.balance).toFixed(2)}
          </div>
        ),
        right: true,
      },
      {
        name: "RRN",
        selector: (row) => <div style={{ textAlign: "center" }}>{row.rrn}</div>,
        center: true,
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
              gap: 1, // space between icons
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

            {/* Print Aeps visible only to ret and dd */}
            {(user?.role === "ret" || user?.role === "dd") && (
              <Tooltip title="Print Aeps">
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() =>
                    navigate("/print-aeps", { state: { txnData: row } })
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
        endpoint={ApiEndpoints.GET_AEPS_TXN}
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
                    AEPS
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

      {/* AEPS Details Drawer */}
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
              companyLogoUrl={biggpayLogo}
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
                { label: "Charge", value: selectedRow.charges },
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
      <CommonModal
        open={responseModalOpen}
        onClose={() => setResponseModalOpen(false)}
        title="API Response"
        iconType="info"
        footerButtons={[
          {
            text: "Close",
            variant: "contained",
            onClick: () => setResponseModalOpen(false),
          },
        ]}
      >
        <Typography
          sx={{
            whiteSpace: "pre-wrap",
            fontSize: "14px",
            color: "#333",
            wordBreak: "break-word",
          }}
        >
          {selectedApiResponse}
        </Typography>
      </CommonModal>
      <CommonModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Refund"
        footerButtons={[
          {
            text: "Cancel",
            variant: "outlined",
            onClick: () => setConfirmModalOpen(false),
          },
          {
            text: "Confirm",
            variant: "contained",
            onClick: handleConfirmRefund,
            disabled: refundLoading,
          },
        ]}
      >
        <Typography sx={{ fontSize: 14 }}>
          Are you sure you want to refund transaction ID:{" "}
          {selectedForRefund?.txn_id}?
        </Typography>
      </CommonModal>
      {openLeinModal && (
        <AddLein
          open={openLeinModal}
          handleClose={handleCloseLein}
          onFetchRef={() => {}}
          selectedRow={selectedTransaction}
          type="transaction"
        />
      )}
    </>
  );
};

export default AepsTxn;
