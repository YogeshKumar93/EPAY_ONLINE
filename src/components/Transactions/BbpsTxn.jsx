import { useMemo, useCallback, useContext, useState } from "react";
import { Box, Tooltip, Typography, Button, Drawer } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";
import CommonStatus from "../common/CommonStatus";
import { IconButton } from "rsuite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import TransactionDetailsCard from "../common/TransactionDetailsCard";
import ReplayIcon from "@mui/icons-material/Replay";
import RefreshIcon from "@mui/icons-material/Refresh";
import DoneIcon from "@mui/icons-material/Done";

import { useNavigate } from "react-router-dom";

import {
  android2,
  linux2,
  macintosh2,
  okhttp,
  windows2,
} from "../../utils/iconsImports";
import LaptopIcon from "@mui/icons-material/Laptop";
import { Logo } from "../../iconsImports";
import CommonModal from "../common/CommonModal";

const BbpxTxn = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedForRefund, setSelectedForRefund] = useState(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedApiResponse, setSelectedApiResponse] = useState("");

  const navigate = useNavigate();
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
  const columns = useMemo(
    () => [
      {
        name: "Date",
        selector: (row) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Tooltip
              title={`Created: ${ddmmyyWithTime(row?.created_at)}`}
              arrow
            >
              <span>
                {ddmmyy(row?.created_at)} {dateToTime1(row?.created_at)}
              </span>
            </Tooltip>

            <Tooltip
              title={`Updated: ${ddmmyyWithTime(row?.updated_at)}`}
              arrow
            >
              <span>
                {ddmmyy(row?.updated_at)} {dateToTime1(row?.updated_at)}
              </span>
            </Tooltip>
          </div>
        ),
        wrap: true,
        width: "140px",
      },

      {
        name: "Route",
        selector: (row) => (
          <div style={{ display: "flex", fontSize: "13px" }}>{row.route}</div>
        ),

        center: true,
        width: "140px",
      },
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
      },
      // {
      //   name: "RRN",
      //   selector: (row) => <div style={{ textAlign: "left" }}>{row.rrn}</div>,
      //   wrap: true,
      // },

      {
        name: "Biller",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            <strong>{row.biller_name}</strong> <br />
            ID: {row.biller_id}
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
        name: "Comm / Tds",
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
      ...(user?.role === "adm"
        ? [
            {
              name: "di Comm/ tds",
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
              name: "Md Comm/ tds",
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CommonStatus value={row.status} />
            <span>{row.rrn}</span>
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

export default BbpxTxn;
