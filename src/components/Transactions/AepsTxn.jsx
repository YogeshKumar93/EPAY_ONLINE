import { useMemo, useContext, useState, useEffect, useRef } from "react";
import {
  Box,
  Tooltip,
  Typography,
  Button,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";
import CommonStatus from "../common/CommonStatus";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LaptopIcon from "@mui/icons-material/Laptop";
import { useNavigate } from "react-router-dom";

import biggpayLogo from "../../assets/Images/PPALogor.png";
import TransactionDetailsCard from "../common/TransactionDetailsCard";
import { android2, linux2, macintosh2, windows2 } from "../../iconsImports";
import CommonModal from "../common/CommonModal";
import Scheduler from "../common/Scheduler";
import AddLein from "../../pages/AddLein";
import { apiCall } from "../../api/apiClient";
import { useToast } from "../../utils/ToastContext";
import { json2Excel } from "../../utils/exportToExcel";
import { apiErrorToast } from "../../utils/ToastUtil";

const AepsTxn = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedApiResponse, setSelectedApiResponse] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedForRefund, setSelectedForRefund] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openLeinModal, setOpenLeinModal] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [openFailModal, setOpenFailModal] = useState(false);

  const [reason, setReason] = useState("");

  // const handleOpenLein = (row) => {
  //   setOpenLeinModal(true);
  //   setSelectedTrancation(row);
  // };

  const refreshPlans = () => {
    fetchUsersRef.current?.();
  };

  // Fetch routes dynamically
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { error, response } = await apiCall(
          "post",
          ApiEndpoints.GET_ROUTES
        );
        if (response) {
          const routeOptions = response.data.map((r) => ({
            label: r.name,
            value: r.code,
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

  const handleOpenLein = (row) => {
    setOpenLeinModal(true);
    setSelectedTransaction(row);
  };

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
      setConfirmModalOpen(false);
      setSelectedForRefund(null);
      refreshPlans();
    } else {
      showToast(error?.message || "Failed to process refund", "error");
    }

    setRefundLoading(false);
  };

  // Filters
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
        options: routes,
        roles: ["adm"],
      },
      { id: "txn_id", label: "Txn ID", type: "textfield" },
      {
        id: "user_id",
        label: "User ID",
        type: "textfield",
        roles: ["adm", "sadm"],
      },
      { id: "date_range", type: "daterange" },
    ],
    [routes]
  );

  const handleExportExcel = async () => {
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_AEPS_TXN,
        { export: 1 }
      );
      const usersData = response?.data?.data || [];
      if (usersData.length > 0) {
        json2Excel("AepsTxns", usersData);
      } else {
        apiErrorToast("No data found");
      }
    } catch (error) {
      console.error("Excel export failed:", error);
      apiErrorToast("Failed to export Excel");
    }
  };

  // const ActionColumn = ({ row }) => {
  //   const [anchorEl, setAnchorEl] = useState(null);
  //   const open = Boolean(anchorEl);

  //   return (
  //     <>
  //       <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
  //         <MoreVertIcon />
  //       </IconButton>
  //       <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
  //         {row.status === "PENDING" && (
  //           <>
  //             <MenuItem
  //               onClick={() => {
  //                 // ✅ your existing success handler (keep as is)
  //                 setAnchorEl(null);
  //                 handleMarkSuccess(row);
  //               }}
  //             >
  //               Mark Success
  //             </MenuItem>

  //             <MenuItem
  //               onClick={() => {
  //                 setSelectedTxn(row);
  //                 setOpenFailModal(true);
  //                 setAnchorEl(null);
  //               }}
  //             >
  //               Mark Failed
  //             </MenuItem>
  //           </>
  //         )}
  //         <MenuItem
  //           onClick={() => {
  //             handleOpenLein(row);
  //             setAnchorEl(null);
  //           }}
  //         >
  //           Mark Lein
  //         </MenuItem>
  //       </Menu>
  //     </>
  //   );
  // };

  const columns = useMemo(
    () => [
      {
        name: "Date",
        selector: (row) => (
          <Box display="flex" flexDirection="column">
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
          </Box>
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
          const pf = row.pf?.toLowerCase() || "";
          if (pf.includes("windows"))
            icon = <img src={windows2} style={{ width: 22 }} />;
          else if (pf.includes("android"))
            icon = <img src={android2} style={{ width: 22 }} />;
          else if (pf.includes("mac"))
            icon = <img src={macintosh2} style={{ width: 22 }} />;
          else if (pf.includes("linux"))
            icon = <img src={linux2} style={{ width: 22 }} />;
          else if (pf.includes("okhttp"))
            icon = <img src={okhttp} style={{ width: 22 }} />;
          else icon = <LaptopIcon sx={{ color: "blue", width: 22 }} />;
          return (
            <Box display="flex" alignItems="center" gap={2}>
              {icon}
            </Box>
          );
        },
        width: "20px",
      },
      // Additional conditional columns based on roles
      ...(user?.role !== "ret" && user?.role !== "dd"
        ? [
            {
              name: "Est.",
              selector: (row) => (
                <div style={{ fontSize: 10, fontWeight: 600 }}>
                  {row.establishment}
                </div>
              ),
              width: 70,
              center: true,
            },
            {
              name: "Txn ID /Ref",
              selector: (row) => (
                <div style={{ fontSize: 10, fontWeight: 600 }}>
                  {row.txn_id}
                  <br />
                  {row.client_ref}
                </div>
              ),
              width: 100,
            },
          ]
        : []),
      {
        name: "Aadhaar No.",
        selector: (row) => <div>**** **** {row.aadhaar_number?.slice(-4)}</div>,
      },
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
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
      },
      // ...((user?.role === "adm" || user?.role === "sadm") &&
      // user?.permissions?.txn_actions === 1
      //   ? [
      //       {
      //         name: "Action",
      //         selector: (row) => (
      //           <ActionColumn
      //             row={row}
      //             // handleRefundClick={handleRefundClick}
      //             handleOpenLein={handleOpenLein}
      //           />
      //         ),
      //         center: true,
      //         width: "100px",
      //       },
      //     ]
      //   : []),
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
                  onClick={() => {
                    // Save individual transaction data
                    sessionStorage.setItem("txnData", JSON.stringify(row));

                    // Open receipt page in a new tab
                    window.open("/print-aeps", "_blank");
                  }}
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
      // ...(user?.role === "ret" || user?.role === "dd"
      //   ? [
      //       {
      //         name: "Actions",
      //         selector: (row) => (
      //           <div
      //             style={{
      //               fontSize: "10px",
      //               fontWeight: "600",
      //               display: "flex",
      //               gap: "4px",
      //               justifyContent: "center",
      //               alignItems: "center",
      //             }}
      //           >
      //             {/* FAILED or REFUND: Refresh */}
      //             {/* {row?.status === "REFUNDPENDING" && (
      //               <Tooltip title="REFUND TXN">
      //                 <ReplayIcon
      //                   sx={{
      //                     color: "orange",
      //                     fontSize: 25,
      //                     cursor: "pointer",
      //                   }}
      //                   onClick={() => handleRefundTxn(row)}
      //                 />
      //               </Tooltip>
      //             )} */}
      //           </div>
      //         ),
      //         center: true,
      //         width: "70px",
      //       },
      //     ]
      //   : []),
    ],
    []
  );

  const columnsWithSelection = useMemo(() => {
    if (user?.role === "adm" || user?.role === "sadm") return columns;
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
              setSelectedRows(
                isSelected
                  ? selectedRows.filter((r) => r.id !== row.id)
                  : [...selectedRows, row]
              );
            }}
          />
        ),
        width: 40,
      },
      ...columns,
    ];
  }, [selectedRows, columns]);

  return (
    <>
      <CommonTable
        onFetchRef={handleFetchRef}
        columns={columnsWithSelection}
        endpoint={ApiEndpoints.GET_AEPS_TXN}
        filters={filters}
        queryParam={query || ""}
        enableActionsHover
        enableSelection={false}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        customHeader={
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
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
        }
      />

      {/* Transaction Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box width={400} display="flex" flexDirection="column" height="100%">
          {selectedRow && (
            <TransactionDetailsCard
              amount={selectedRow.amount}
              status={selectedRow.status}
              onClose={() => setDrawerOpen(false)}
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

      {/* Modals */}
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
          sx={{ whiteSpace: "pre-wrap", fontSize: 14, wordBreak: "break-word" }}
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
        <Typography fontSize={14}>
          Are you sure you want to refund transaction ID:{" "}
          <strong>{selectedForRefund?.txn_id}</strong>?
        </Typography>
      </CommonModal>

      <CommonModal
        open={openFailModal}
        onClose={() => setOpenFailModal(false)}
        title="Mark as Failed"
        footerButtons={[
          { text: "Cancel", onClick: () => setOpenFailModal(false) },
          {
            text: "Submit",
            variant: "contained",
            onClick: async () => {
              await apiCall("post", ApiEndpoints.REFUND_FAILED_TXN, {
                txn_id: selectedTxn?.txn_id,
                reason,
              });
              showToast("Transaction marked as failed", "success");
              setOpenFailModal(false);
              setReason("");
              refreshPlans();
            },
          },
        ]}
      >
        <Typography fontSize={14} mb={1}>
          Transaction ID: <strong>{selectedTxn?.txn_id}</strong>
        </Typography>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason"
          style={{ width: "100%", height: 60, padding: 6 }}
        />
      </CommonModal>
      <CommonModal
        open={openFailModal}
        onClose={() => setOpenFailModal(false)}
        title="Mark as Failed"
        footerButtons={[
          { text: "Cancel", onClick: () => setOpenFailModal(false) },
          {
            text: "Submit",
            variant: "contained",
            onClick: async () => {
              await apiCall("post", ApiEndpoints.REFUND_FAILED_TXN, {
                txn_id: selectedTxn?.txn_id,
                reason,
              });
              showToast("Transaction marked as failed", "success");
              setOpenFailModal(false);
              setReason("");
              refreshPlans();
            },
          },
        ]}
      >
        <Typography fontSize={14} mb={1}>
          Transaction ID: <strong>{selectedTxn?.txn_id}</strong>
        </Typography>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason"
          style={{ width: "100%", height: 60, padding: 6 }}
        />
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
