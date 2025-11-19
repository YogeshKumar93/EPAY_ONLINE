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

import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";
import biggpayLogo from "../assets/Images/PPALogor.png";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonTable from "../components/common/CommonTable";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../utils/DateUtils";
import CommonStatus from "../components/common/CommonStatus";
import TransactionDetailsCard from "../components/common/TransactionDetailsCard";
import CommonModal from "../components/common/CommonModal";
import { apiCall } from "../api/apiClient";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";
import Scheduler from "../components/common/Scheduler";

const AllTranscation = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedApiResponse, setSelectedApiResponse] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openLeinModal, setOpenLeinModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [routes, setRoutes] = useState([]);
  const fetchUsersRef = useRef(null);
  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };
  const refreshPlans = () => {
    fetchUsersRef.current?.();
  };

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

  const handleCloseLein = () => setOpenLeinModal(false);

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
          { value: "refunded", label: "Refunded" },
          { value: "refundpending", label: "Refund Pending" },
          { value: "pending", label: "Pending" },
        ],
        defaultValue: "pending",
      },
      {
        id: "route",
        label: "Route",
        type: "dropdown",
        options: routes,
        roles: ["adm", "sadm"],
      },
      { id: "amount", label: "Amount", type: "textfield" },
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

  const columns = useMemo(
    () => [
      {
        name: "S.No",
        selector: (row) => row.serialNo,
        wrap: true,
        width: "80px",
      },
      {
        name: "Date",
        selector: (row) => (
          <Box display="flex" flexDirection="column">
            <Tooltip title={`Created: ${ddmmyyWithTime(row.created_at)}`} arrow>
              {/* <span>
                {ddmmyy(row.created_at)} {dateToTime1(row.created_at)}
              </span> */}
              <div style={{ display: "inline-flex", gap: 4 }}>
                <span>{ddmmyy(row.created_at)}</span>
                <span>{dateToTime1(row.created_at)}</span>
              </div>
            </Tooltip>
          </Box>
        ),
        wrap: true,
        width: "190px",
      },
      ...(user?.role === "adm" || user?.role === "sadm"
        ? [
            {
              name: "User Id",
              selector: (row) => (
                <div style={{ fontSize: "13px", fontWeight: "600" }}>
                  {row.user_id}
                </div>
              ),
              center: true,
              width: "70px",
            },
          ]
        : []),
      // {
      //   name: "Service",
      //   selector: (row) => <div>{row.service_name}</div>,
      //   center: true,
      //   width: "70px",
      // },
      {
        name: "Txn ID",
        selector: (row) => <div>{row.txn_id}</div>,
        center: true,
        width: "70px",
      },
      ...(user?.role === "adm" || user?.role === "sadm"
        ? [
            {
              name: "Route",
              selector: (row) => (
                <div style={{ fontSize: "13px", fontWeight: "600" }}>
                  {row.route}
                </div>
              ),
              center: true,
              width: "70px",
            },
          ]
        : []),
      {
        name: "Operator",
        selector: (row) => (
          <div style={{ fontSize: "12px", fontWeight: "600" }}>
            {row.operator_name}
          </div>
        ),
        center: true,
        width: "70px",
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

      ...(user?.role === "adm" ||
      user?.role === "di" ||
      user?.role === "sadm" ||
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
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <div style={{ color: "green" }}>
                    {parseFloat(row.di_comm).toFixed(2)}
                  </div>
                </div>
              ),
              right: true,
              width: "60px",
            },
          ]
        : []),
      ...(user?.role === "adm" || user?.role === "sadm"
        ? [
            {
              name: "Admin Comm",
              selector: (row) => (
                <div style={{ fontSize: "13px", fontWeight: "600" }}>
                  {row.a_comm}
                </div>
              ),
              center: true,
              width: "70px",
            },
          ]
        : []),
      ...(user?.role === "adm" ||
      user?.role === "md" ||
      user?.role === "sadm" ||
      user?.role === "asm" ||
      user?.role === "zsm"
        ? [
            {
              name: "Md Comm",
              selector: (row) => (
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <div style={{ color: "green" }}>
                    {parseFloat(row.md_comm).toFixed(2)}
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
      user?.role === "sadm" ||
      user?.role === "asm" ||
      user?.role === "zsm"
        ? [
            {
              name: "Ret Comm",
              selector: (row) => (
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <div style={{ color: "green" }}>
                    {parseFloat(row.ret_comm).toFixed(2)}
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
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
      },
    ],
    []
  );

  // const columnsWithSelection = useMemo(() => {
  //   if (user?.role === "adm" || user?.role === "sadm") return columns;
  //   return [
  //     {
  //       name: "",
  //       selector: (row) => (
  //         <input
  //           type="checkbox"
  //           checked={selectedRows.some((r) => r.id === row.id)}
  //           disabled={row.status?.toLowerCase() === "failed"}
  //           onChange={() => {
  //             const isSelected = selectedRows.some((r) => r.id === row.id);
  //             setSelectedRows(
  //               isSelected
  //                 ? selectedRows.filter((r) => r.id !== row.id)
  //                 : [...selectedRows, row]
  //             );
  //           }}
  //         />
  //       ),
  //       width: 40,
  //     },
  //     ...columns,
  //   ];
  // }, [selectedRows, columns]);

  return (
    <>
      <CommonTable
        onFetchRef={handleFetchRef}
        columns={columns}
        endpoint={ApiEndpoints.GET_ALL_TXN}
        filters={filters}
        queryParam={query || ""}
        enableActionsHover
        enableSelection={false}
        enableExcelExport={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        exportFileName="Alltxns"
        exportEndpoint={ApiEndpoints.GET_ALL_TXN}
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
              {/* {selectedRows.length > 0 && (
                <Tooltip title="PRINT">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      if (!selectedRows || selectedRows.length === 0) {
                        alert(
                          "Please select at least one transaction to print."
                        );
                        return;
                      }

                      // Save all selected rows
                      sessionStorage.setItem(
                        "txnData",
                        JSON.stringify(selectedRows)
                      );

                      // Open receipt page in a new tab
                      window.open("/print-dmt2", "_blank");
                    }}
                    sx={{ ml: 1 }}
                  >
                    <PrintIcon
                      sx={{ fontSize: 20, color: "#e3e6e9ff", mr: 1 }}
                    />
                    Print
                  </Button>
                </Tooltip>
              )} */}
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
              <Scheduler onRefresh={refreshPlans} />
            </Box>
          </>
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

export default AllTranscation;
