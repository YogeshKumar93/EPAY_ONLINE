import { useMemo, useContext, useState } from "react";
import { Box, Tooltip, IconButton, Drawer } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";
import CommonStatus from "../common/CommonStatus";
import ComplaintForm from "../ComplaintForm";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import TransactionDetailsCard from "../common/TransactionDetailsCard";
import companylogo from "../../assets/Images/PPALogor.png";
import {
  android2,
  linux2,
  macintosh2,
  okhttp,
  windows2,
} from "../../utils/iconsImports";
import LaptopIcon from "@mui/icons-material/Laptop";

const DmtTxn = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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
    ],
    []
  );

  const columns = useMemo(() => {
    const baseColumns = [
      {
        name: "Date",
        selector: (row) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
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
      ...(user?.role === "ret" || user?.role === "dd"
        ? []
        : [
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
          ]),
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
                  {row.establishment || "N/A"}
                </div>
              ),
              center: true,
              width: "70px",
            },
          ]),
      {
        name: "Service",
        selector: (row) => (
          <div
            style={{ textAlign: "left", fontSize: "14px", fontWeight: "600" }}
          >
            {row.operator}
          </div>
        ),
        wrap: true,
        width: "80px",
      },
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
            {row.client_ref}
          </div>
        ),
        wrap: true,
        width: "100px",
      },
      {
        name: "Mobile",
        selector: (row) => (
          <div
            style={{ textAlign: "left", fontSize: "12px", fontWeight: "600" }}
          >
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
            {row.account_number} <br />
            {row.ifsc_code}
          </div>
        ),
        wrap: true,
        center: true,
        width: "100px",
      },
      {
        name: "Amount",
        selector: (row) => (
          <div
            style={{
              color: "red",
              fontWeight: "600",
              textAlign: "right",
              fontSize: "10px",
            }}
          >
            ₹{parseFloat(row.amount).toFixed(2)}
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
              fontSize: "10px",
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

    const remainingColumns = [
      {
        name: "Comm / Tds",
        selector: (row) => (
          <div
            style={{ textAlign: "right", fontSize: "10px", fontWeight: 600 }}
          >
            <div style={{ color: "green" }}>
              {parseFloat(row.comm).toFixed(2)}
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
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
        width: "70px",
      },
      {
        name: "Action",
        selector: (row) => (
          <div
            style={{
              fontWeight: "600",
              fontSize: "10px",
              textAlign: "right",
            }}
          >
            {row.action || "N/A"}
          </div>
        ),
        center: true,
        width: "70px",
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
    ];

    return [...baseColumns, ...remainingColumns];
  }, [user]);

  const queryParam = "";

  return (
    <>
      <Box sx={{ mx: -4 }}>
        <CommonTable
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

export default DmtTxn;
