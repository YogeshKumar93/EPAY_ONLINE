import { useMemo, useCallback, useContext, useState, useRef } from "react";
import {
  Box,
  Tooltip,
  Typography,
  Button,
  Drawer,
  IconButton,
  MenuItem,
} from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import {
  dateToTime,
  dateToTime1,
  ddmmyy,
  ddmmyyWithTime,
} from "../../utils/DateUtils";
import CommonStatus from "../common/CommonStatus";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import biggpayLogo from "../../assets/Images/PPALogor.png";
import companylogo from "../../assets/Images/logo(1).png";
import TransactionDetailsCard from "../common/TransactionDetailsCard";
import {
  android2,
  linux2,
  macintosh2,
  okhttp,
  postman,
  windows2,
} from "../../utils/iconsImports";
import LaptopIcon from "@mui/icons-material/Laptop";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../iconsImports";
import CommonModal from "../common/CommonModal";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import DoneIcon from "@mui/icons-material/Done";
import { apiCall } from "../../api/apiClient";
import { useToast } from "../../utils/ToastContext";
import AddLein from "../../pages/AddLein";
import { json2Excel } from "../../utils/exportToExcel";
import { apiErrorToast } from "../../utils/ToastUtil";
import FileDownloadIcon from "@mui/icons-material/FileDownload"; // Excel export icon
import Scheduler from "../common/Scheduler";

const PayoutTxn = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const navigate = useNavigate();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedForRefund, setSelectedForRefund] = useState(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedApiResponse, setSelectedApiResponse] = useState("");
  const { showToast } = useToast();
  const [selectedTransaction, setSelectedTrancation] = useState("");
  const [openLeinModal, setOpenLeinModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRefundClick = (row) => {
    setSelectedForRefund(row);
    setConfirmModalOpen(true);
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

      // Refresh table
      refreshPlans();
    } else {
      showToast(error?.message || "Failed to process refund", "error");
    }

    setRefundLoading(false);
  };
  const handleExportExcel = async () => {
    try {
      // Fetch all users (without pagination/filters) from API
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_PAYOUT_TXN,
        { export: 1 }
      );
      const usersData = response?.data || [];

      if (usersData.length > 0) {
        json2Excel("PayoutTxns", usersData); // generates and downloads Users.xlsx
      } else {
        apiErrorToast("no data found");
      }
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Failed to export Excel");
    }
  };
  const handleOpenLein = (row) => {
    setOpenLeinModal(true);
    setSelectedTrancation(row);
  };
  const handleCloseLein = () => setOpenLeinModal(false);
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
      { id: "mobile_number", label: "Mobile Number", type: "textfield" },
      { id: "txn_id", label: "Txn ID", type: "textfield" },
      { id: "route", label: "Route", type: "textfield", roles: ["adm"] },
      {
        id: "client_ref",
        label: "Client Ref",
        type: "textfield",
        roles: ["adm"],
      },
    ],
    []
  );
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
      },
      // ...(user?.role === "adm" || user?.role === "sadm"
      //   ? [
      //       {
      //         name: "Route",
      //         selector: (row) => (
      //           <div style={{ fontSize: "10px", fontWeight: "600" }}>
      //             {row.route}
      //           </div>
      //         ),
      //         center: true,
      //         width: "70px",
      //       },
      //     ]
      //   : []),
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
          } else if (row.pf.toLowerCase().includes("postman")) {
            icon = (
              <img
                src={postman}
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
                flexDirection: "column", // stack vertically
                alignItems: "center",
                fontSize: "13px",
                textAlign: "center",
                gap: 0.5,
              }}
            >
              {icon}
              {(user?.role === "adm" || user?.role === "sadm") && (
                <Typography variant="caption" sx={{ fontSize: 10 }}>
                  {row.route || "-"}
                </Typography>
              )}
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
      {
        name: "Service",
        selector: (row) => (
          <div style={{ textAlign: "left", fontWeight: "600" }}>
            {row.operator} <br />
            <span
              style={{ fontWeight: "normal", fontSize: "8px", color: "blue" }}
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
                marginLeft: "6px", // gap between status and response
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

      {
        name: "Number",
        selector: (row) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "13px",
            }}
          >
            {row.mobile_number}
          </div>
        ),
        wrap: true,
      },
      // {
      //   name: "Purpose",
      //   selector: (row) => (
      //     <div style={{ textAlign: "left", fontWeight: 500 }}>
      //       {row?.purpose || "N/A"}
      //     </div>
      //   ),
      //   wrap: true,
      // },
      {
        name: "Beneficiary",
        selector: (row) => (
          <div style={{ textAlign: "left", fontSize: "12px" }}>
            {row.beneficiary_name?.toUpperCase()} <br />
            {row.account_number} <br />
            {row.ifsc_code}
          </div>
        ),
        wrap: true,
        width: "250px",
      },
      {
        name: "Amount",
        selector: (row) => (
          <div style={{ color: "red", fontWeight: "600", textAlign: "right" }}>
            ₹{parseFloat(row.amount).toFixed(2)}
          </div>
        ),
        wrap: true,
        right: true,
      },

      {
        name: "Charges",
        selector: (row) => (
          <div style={{ color: "red", fontWeight: "600", textAlign: "right" }}>
            ₹{parseFloat(row.charges).toFixed(2)}
          </div>
        ),
        wrap: true,
        right: true,
      },
      ...(user?.role === "adm" ||
      user?.role === "di" ||
      user?.role === "md" ||
      user?.role === "asm" ||
      user?.role === "zsm"
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
                    {parseFloat(row?.di_comm || 0).toFixed(2)}
                  </div>
                  <div style={{ color: "blue" }}>
                    {parseFloat(row?.di_tds || 0).toFixed(2)}
                  </div>
                </div>
              ),
              right: true,
              width: "60px",
            },
          ]
        : []),
      ...(user?.role === "adm" ||
      user?.role === "md" ||
      user?.role === "asm" ||
      user?.role === "zsm"
        ? [
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
                    {parseFloat(row?.md_comm || 0).toFixed(2)}
                  </div>
                  <div style={{ color: "blue" }}>
                    {parseFloat(row?.md_tds || 0).toFixed(2)}
                  </div>
                </div>
              ),
              right: true,
              width: "60px",
            },
          ]
        : []),
      ...(user?.role === "ret" ||
      user?.role === "dd" ||
      user?.role === "di" ||
      user?.role === "md"
        ? [] // ❌ hide for ret and dd
        : [
            {
              name: "GST",
              selector: (row) => (
                <div
                  style={{
                    color: "red",
                    fontWeight: "600",
                    textAlign: "right",
                  }}
                >
                  ₹{parseFloat(row.gst).toFixed(2)}
                </div>
              ),
              wrap: true,
              width: "100px",
            },
          ]),

      {
        name: "Status",
        selector: (row) => (
          <div style={{ textAlign: "center" }}>
            <CommonStatus value={row.status} />
            <div style={{ fontSize: "10px", marginTop: "4px" }}>
              {row?.operator_id || "N/A"}
            </div>
          </div>
        ),
        center: true,
      },
      ...(user?.role === "adm" || user?.role === "sadm"
        ? [
            {
              name: "Action",
              selector: (row) => (
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    display: "flex",
                    gap: "4px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* SUCCESS: only Replay */}
                  {row?.status === "SUCCESS" && (
                    <Tooltip title="Click To Refund">
                      <ReplayIcon
                        sx={{ color: "red", fontSize: 25, cursor: "pointer" }}
                        onClick={() => handleRefundClick(row)}
                      />
                    </Tooltip>
                  )}

                  {/* PENDING: CheckCircle + Replay */}
                  {row?.status === "PENDING" && (
                    <>
                      <Tooltip title="Click To Success">
                        <DoneIcon sx={{ color: "green", fontSize: 25 }} />
                      </Tooltip>
                      <Tooltip title="Click To Refund">
                        <ReplayIcon
                          sx={{ color: "red", fontSize: 25, cursor: "pointer" }}
                          onClick={() => handleRefundClick(row)}
                        />
                      </Tooltip>
                    </>
                  )}

                  {/* FAILED or REFUND: Refresh */}
                  {(row?.status === "FAILED" || row?.status === "REFUND") && (
                    <Tooltip title="Click To Rollback">
                      <RefreshIcon
                        sx={{
                          color: "orange",
                          fontSize: 25,
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  )}
                  <MenuItem
                    onClick={() => {
                      handleOpenLein(row);
                    }}
                  >
                    Mark Lein
                  </MenuItem>
                </div>
              ),
              center: true,
              width: "70px",
            },
          ]
        : []),

      {
        name: "View",
        selector: (row) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "80px",
              gap: 1, // spacing between icons
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
        endpoint={ApiEndpoints.GET_PAYOUT_TXN}
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
                      window.open("/print-payout", "_blank");
                    }}
                  >
                    <PrintIcon
                      sx={{ fontSize: 20, color: "#e3e6e9ff", mr: 1 }}
                    />
                    Payout
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

      {/* Payout Details Drawer */}
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
                { label: "purpose", value: selectedRow.purpose },
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

export default PayoutTxn;
