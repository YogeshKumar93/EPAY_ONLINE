import { useMemo, useCallback, useContext, useState, useRef } from "react";
import {
  Box,
  Tooltip,
  Typography,
  Button,
  Drawer,
  Menu,
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
import { IconButton } from "rsuite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import TransactionDetailsCard from "../common/TransactionDetailsCard";

import RefreshIcon from "@mui/icons-material/Refresh";
import DoneIcon from "@mui/icons-material/Done";

import { useNavigate } from "react-router-dom";

import {
  android2,
  linux2,
  macintosh2,
  okhttp,
  postman,
  windows2,
} from "../../utils/iconsImports";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddLein from "../LienAmount/AddLein";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../common/CommonModal";
import { Logo } from "../../iconsImports";

const BbpxTxn = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  // const [responseModalOpen, setResponseModalOpen] = useState(false);
  // const [selectedApiResponse, setSelectedApiResponse] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedForRefund, setSelectedForRefund] = useState(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedApiResponse, setSelectedApiResponse] = useState("");

  const navigate = useNavigate();
  const { showToast } = useToast();
  const handleRefundClick = (row) => {
    setSelectedForRefund(row);
    setConfirmModalOpen(true);
  };
  const fetchUsersRef = useRef(null);
  const [selectedTransaction, setSelectedTrancation] = useState("");

  const [openLeinModal, setOpenLeinModal] = useState(false);

  const handleOpenLein = (row) => {
    setOpenLeinModal(true);
    setSelectedTrancation(row);
  };
  const handleCloseLein = () => setOpenLeinModal(false);

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
      { id: "customer_mobile", label: "Customer Mobile", type: "textfield" },
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
  const ActionColumn = ({ row, handleRefundClick, handleOpenLein }) => {
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
          {row?.status === "SUCCESS" && (
            <MenuItem
              onClick={() => {
                handleRefundClick(row);
                handleClose();
              }}
            >
              Refund
            </MenuItem>
          )}

          {row?.status === "PENDING" && (
            <>
              <MenuItem
                onClick={() => {
                  // mark as success handler if needed
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

          {(row?.status === "FAILED" || row?.status === "REFUND") && (
            <MenuItem
              onClick={() => {
                // rollback handler if needed
                handleClose();
              }}
            >
              Rollback
            </MenuItem>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Tooltip title={`Created: ${ddmmyyWithTime(row.created_at)}`} arrow>
              <div style={{ display: "inline-flex", gap: 4 }}>
                <span>{ddmmyy(row.created_at)}</span>
                <span>{dateToTime1(row.created_at)}</span>
              </div>
            </Tooltip>
            <Tooltip title={`Updated: ${dateToTime(row.updated_at)}`} arrow>
              <span style={{ marginTop: "8px" }}>
                {ddmmyy(row.updated_at)}
                {dateToTime1(row.updated_at)}
              </span>
            </Tooltip>
          </div>
        ),
        wrap: true,
        width: "80px",
      },

      ...(user?.role === "adm" || user?.role === "sadm"
        ? [
            {
              name: "Route",
              selector: (row) => (
                <div style={{ fontSize: "10px", fontWeight: "600" }}>
                  {row.route}
                </div>
              ),
              center: true,
              width: "70px",
            },
          ]
        : []),
      {
        name: "Pf",
        selector: (row) => {
          let icon;
          if (row.pf.toLowerCase().includes("windows"))
            icon = <img src={windows2} style={{ width: "22px" }} alt="" />;
          else if (row.pf.toLowerCase().includes("android"))
            icon = <img src={android2} style={{ width: "22px" }} alt="" />;
          else if (row.pf.toLowerCase().includes("mac"))
            icon = <img src={macintosh2} style={{ width: "22px" }} alt="" />;
          else if (row.pf.toLowerCase().includes("postman"))
            icon = <img src={postman} style={{ width: "22px" }} alt="" />;
          else if (row.pf.toLowerCase().includes("linux"))
            icon = <img src={linux2} style={{ width: "22px" }} alt="" />;
          else if (row.pf.toLowerCase().includes("okhttp"))
            icon = <img src={okhttp} style={{ width: "22px" }} alt="" />;
          else icon = <LaptopIcon sx={{ color: "blue", width: "22px" }} />;
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
      ...(user?.role === "adm" || user?.role === "sadm" || user?.role === "api"
        ? [
            {
              name: "TxnId/Ref",
              selector: (row) => (
                <div style={{ textAlign: "left", fontSize: "13px" }}>
                  {row.txn_id}
                  <br />
                  {row.client_ref}
                </div>
              ),
              wrap: true,
            },
          ]
        : []),
      ...(user?.role !== "adm" && user?.role !== "sadm" && user?.role !== "api"
        ? [
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
                  {row.txn_id} <br />
                </div>
              ),
              wrap: true,
              width: "100px",
            },
          ]
        : []),

      // {
      //   name: "RRN",
      //   selector: (row) => <div style={{ textAlign: "left" }}>{row.rrn}</div>,
      //   wrap: true,
      // },

      {
        name: "Service",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            <strong>{row.biller_name}</strong> <br />
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
      {
        name: "Consumer",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            Number: {row.consumer_number} <br />
            Mobile: {row.customer_mobile}
          </div>
        ),
        wrap: true,
      },

      {
        name: "Amount",
        selector: (row) => (
          <div style={{ color: "red", fontWeight: "600", textAlign: "right" }}>
            ₹ {parseFloat(row.amount).toFixed(2)}
          </div>
        ),
        wrap: true,
        right: true,
      },
      {
        name: "Charge",
        selector: (row) => (
          <div style={{ color: "red", textAlign: "right" }}>
            ₹{parseFloat(row.charges).toFixed(2)} <br />
            {/* GST: ₹{parseFloat(row.gst).toFixed(2)} <br />
            Comm: ₹{parseFloat(row.commission).toFixed(2)} <br />
            TDS: ₹{parseFloat(row.tds).toFixed(2)} <br />
            Net Comm: ₹{parseFloat(row.net_commission).toFixed(2)} */}
          </div>
        ),
        wrap: true,
        right: true,
      },
      {
        name: "Ret Comm",
        selector: (row) => (
          <div
            style={{ textAlign: "right", fontSize: "10px", fontWeight: 600 }}
          >
            <div style={{ color: "green" }}>
              {parseFloat(row.commission).toFixed(2)}
            </div>
            <div style={{ color: "blue" }}>
              {parseFloat(row.tds).toFixed(2)}
            </div>
          </div>
        ),
        right: true,
        width: "60px",
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
        name: "Status",
        selector: (row) => (
          <div
            style={{
              textAlign: "right",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            <div>
              <CommonStatus value={row.status} />
            </div>
            <div
              style={{
                whiteSpace: "normal", // allow wrapping
                wordBreak: "break-word", // break long values
                textAlign: "right",
              }}
            >
              {row.operator_id}
            </div>
          </div>
        ),
        center: true,
        width: "70px",
      },
      ...(user?.role === "adm" || user?.role === "sadm"
        ? [
            {
              name: "Action",
              selector: (row) => (
                <ActionColumn
                  row={row}
                  handleRefundClick={handleRefundClick}
                  handleOpenLein={handleOpenLein}
                />
              ),
              center: true,
              width: "100px",
            },
          ]
        : []),

      {
        name: "View",
        selector: (row) => (
          <>
            {/* View BBPS visible to ret, dd, adm */}
            <Tooltip title="View BBPS">
              <Box
                component="span"
                onClick={() => {
                  setSelectedRow(row);
                  setDrawerOpen(true);
                }}
                sx={{
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  color: "info.main", // same color as IconButton
                }}
              >
                <VisibilityIcon />
              </Box>
            </Tooltip>

            {/* Print Bbps visible only to ret and dd */}
            {(user?.role === "ret" || user?.role === "dd") && (
              <Tooltip title="Print Bbps">
                <Box
                  component="span"
                  onClick={() =>
                    navigate("/print-bbps", { state: { txnData: row } })
                  }
                  sx={{
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    color: "secondary.main",
                    ml: 1, // spacing between icons
                  }}
                >
                  <PrintIcon />
                </Box>
              </Tooltip>
            )}
          </>
        ),
        width: "100px",
        center: true,
      },
    ],
    []
  );

  const queryParam = "";

  return (
    <>
      <CommonTable
        columns={columns}
        onFetchRef={handleFetchRef}
        endpoint={ApiEndpoints.GET_BBPS_TXN}
        filters={filters}
        queryParam={queryParam}
        enableActionsHover={true}
      />
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
      {/* BBPS Details Drawer */}

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
              companyLogoUrl={Logo}
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

export default BbpxTxn;
