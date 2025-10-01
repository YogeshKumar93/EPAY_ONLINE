import { useMemo, useContext, useState, useRef } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  Drawer,
  Typography,
  Modal,
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
import ComplaintForm from "../ComplaintForm";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import { Logo, smLogo } from "../../iconsImports";
import CommonModal from "../common/CommonModal";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import DoneIcon from "@mui/icons-material/Done";
import { apiCall } from "../../api/apiClient";
import { useToast } from "../../utils/ToastContext";
import TransactionDrawer from "../TransactionDrawer";
const DmtTxn = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedApiResponse, setSelectedApiResponse] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedForRefund, setSelectedForRefund] = useState(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const { showToast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();
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
      { id: "sender_mobile", label: "Sender Mobile", type: "textfield" },
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

  const columns = useMemo(() => {
    const baseColumns = [
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
            {!(user?.role === "ret" || user?.role === "dd") && (
              <Tooltip title={`Updated: ${dateToTime(row.updated_at)}`} arrow>
                <span style={{ marginTop: "8px" }}>
                  {ddmmyy(row.updated_at)}
                  {dateToTime1(row.updated_at)}
                </span>
              </Tooltip>
            )}
          </div>
        ),
        wrap: true,
        width: "80px",
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
          if (row.pf.toLowerCase().includes("windows"))
            icon = <img src={windows2} style={{ width: "22px" }} alt="" />;
          else if (row.pf.toLowerCase().includes("android"))
            icon = <img src={android2} style={{ width: "22px" }} alt="" />;
          else if (row.pf.toLowerCase().includes("mac"))
            icon = <img src={macintosh2} style={{ width: "22px" }} alt="" />;
          else if (row.pf.toLowerCase().includes("linux"))
            icon = <img src={linux2} style={{ width: "22px" }} alt="" />;
          else if (row.pf.toLowerCase().includes("postman"))
            icon = <img src={postman} style={{ width: "22px" }} alt="" />;
          else if (row.pf.toLowerCase().includes("okhttp"))
            icon = <img src={okhttp} style={{ width: "22px" }} alt="" />;
          else icon = <LaptopIcon sx={{ color: "blue", width: "22px" }} />;

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
        width: "40px", // increase width to accommodate text
        wrap: true,
        left: true,
      },
      ...(user?.role === "ret" || user?.role === "dd" || user?.role === "api"
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
        width: "160px",
      },
      {
        name: "TxnId",
        selector: (row) => (
          <div style={{ textAlign: "left", fontWeight: "600" }}>
            {row.txn_id} <br />
          </div>
        ),
        wrap: true,
        width: "100px",
      },
      ...(user.role === "api"
        ? [
            {
              name: "client ref",
              selector: (row) => (
                <div style={{ textAlign: "left", fontWeight: "600" }}>
                  {row.client_ref} <br />
                </div>
              ),
              wrap: true,
              width: "100px",
            },
          ]
        : []),
      {
        name: "Mobile",
        selector: (row) => (
          <div style={{ textAlign: "left", fontWeight: "600" }}>
            {row.sender_mobile}
          </div>
        ),
        wrap: true,
        width: "80px",
      },
      {
        name: "Beneficiary",
        selector: (row) => (
          <div
            style={{ textAlign: "left", fontSize: "10px", fontWeight: "600" }}
          >
            {row.beneficiary_name?.toUpperCase()} <br />
            {/* {row.account_number} <br />
            {row.ifsc_code} */}
          </div>
        ),
        wrap: true,
        center: true,
        width: "150px",
      },
      {
        name: "Amount",
        selector: (row) => (
          <div
            style={{
              color: "red",
              fontWeight: "600",
              textAlign: "right",
            }}
          >
            {parseFloat(row.amount).toFixed(2)}
          </div>
        ),
        right: true,
        width: "80px",
      },
      {
        name: "CCF",
        selector: (row) => (
          <div
            style={{
              color: "red",
              fontWeight: "600",
              textAlign: "right",
            }}
          >
            {parseFloat(row.ccf).toFixed(2)}
          </div>
        ),
        right: true,
        width: "60px",
      },
    ];

    // --- Insert Route and GST after CCF for admin ---
    if (user?.role === "adm") {
      baseColumns.push({
        name: "GST",
        selector: (row) => (
          <div
            style={{
              color: "red",
              fontWeight: "600",
              fontSize: "10px",
              textAlign: "right",
            }}
          >
            {parseFloat(row.gst).toFixed(2)}
          </div>
        ),
        wrap: true,
        width: "100px",
      });
    }

    // Add remaining columns (Comm/TDS, di Comm/tds, Md Comm/tds, Status, View)
    const remainingColumns = [
      {
        name: "Ret Comm",
        selector: (row) => (
          <div
            style={{ textAlign: "right", fontSize: "14px", fontWeight: 600 }}
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
            style={{ textAlign: "right", fontSize: "11px", fontWeight: 600 }}
          >
            <div>
              <CommonStatus value={row.status} />{" "}
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
      // {
      //   name: "Action",
      //   selector: (row) => (
      //     <div
      //       style={{
      //         // color: "red",
      //         fontWeight: "600",
      //         fontSize: "10px",
      //         textAlign: "right",
      //       }}
      //     >
      //       {row.action || "N/A"}
      //     </div>
      //   ),
      //   center: true,
      //   width: "70px",
      // },
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
              <Tooltip title="Print DMT">
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() =>
                    navigate("/print-dmt2", { state: { txnData: row } })
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
    ];

    return [...baseColumns, ...remainingColumns];
  }, [user]);

  const queryParam = "";

  return (
    <>
      <Box sx={{}}>
        <CommonTable
          onFetchRef={handleFetchRef}
          columns={columns}
          endpoint={ApiEndpoints.GET_DMT_TXN}
          filters={filters}
          queryParam={queryParam}
          enableActionsHover={true}
        />
      </Box>

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
            <TransactionDrawer
              row={selectedRow} // pass whole row
              onRaiseIssue={() => {
                setSelectedTxn(selectedRow.txn_id);
                setOpenCreate(true);
              }}
              onClose={() => setDrawerOpen(false)}
              companyLogoUrl={Logo}
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
    </>
  );
};

export default DmtTxn;
