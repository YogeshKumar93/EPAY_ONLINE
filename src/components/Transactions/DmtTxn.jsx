import { useMemo, useContext, useState } from "react";
import { Box, Tooltip, IconButton, Drawer, Typography } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime, dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";
import CommonStatus from "../common/CommonStatus";
import ComplaintForm from "../ComplaintForm";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import TransactionDetailsCard from "../common/TransactionDetailsCard";
import companylogo from "../../assets/Images/logo(1).png";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";

const DmtTxn = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();

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

  const columns = useMemo(
    () => [
  {
  name: "Date",
  selector: (row) => (
    <div style={{ display: "flex", flexDirection: "column", fontSize: "11px", fontWeight:"600" }}>
      <Tooltip title={`Created: ${dateToTime(row.created_at)}`} arrow>
        <span>{ddmmyy(row.created_at)}</span>
      </Tooltip>
      <Tooltip title={`Updated: ${dateToTime(row.updated_at)}`} arrow>
        <span style={{ marginTop: "8px" }}>{ddmmyy(row.updated_at)}</span>
      </Tooltip>
    </div>
  ),
  wrap: true,
  width: "80px",
},


      {
        name: "Route",
        selector: (row) => <div style={{ fontSize: "10px", fontWeight:"600" }}>{row.route}</div>,
        center: true,
        width: "70px",
      },
      {
        name: "TxnId/Ref",
        selector: (row) => (
          <div style={{ textAlign: "left", fontSize: "10px", fontWeight:"600" }}>
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
        selector: (row) => (<div style={{textAlign: "left", fontSize: "10px", fontWeight:"600"}}>
          {row.sender_mobile}
          </div>),
        wrap: true,
          width: "80px",
      },
      {
        name: "Beneficiary",
        selector: (row) => (
          <div style={{ textAlign: "left", fontSize: "10px", fontWeight:"600" }}>
            {row.beneficiary_name?.toUpperCase()} <br />
            {row.account_number} <br />
            {row.ifsc_code}
          </div>
        ),
        wrap: true,
        center: true,
        width: "150px",
      },
      {
        name: "Amount",
        selector: (row) => (
          <div style={{ color: "red", fontWeight: "600", textAlign: "right", fontSize: "10px" }}>
            ₹{parseFloat(row.amount).toFixed(2)}
          </div>
        ),
        right: true,
          width: "80px",
      },
      {
        name: "CCF",
        selector: (row) => (
          <div style={{ color: "red", fontWeight: "600", fontSize: "10px", textAlign: "right" }}>
            {parseFloat(row.ccf).toFixed(2)}
          </div>
        ),
        right: true,
          width: "60px",
      },
      {
        name: "GST",
        selector: (row) => (
          <div style={{ color: "red", fontWeight: "600", fontSize: "10px", textAlign: "right" }}>
            {parseFloat(row.gst).toFixed(2)}
          </div>
        ),
        right: true,
          width: "60px",
      },
      {
        name: "Comm",
        selector: (row) => (
          <div style={{ color: "green", fontWeight: "600", fontSize: "10px", textAlign: "right" }}>
            {parseFloat(row.comm).toFixed(2)}
          </div>
        ),
        right: true,
          width: "60px",
      },
      {
        name: "TDS",
        selector: (row) => (
          <div style={{ color: "red", fontWeight: "600", fontSize: "10px", textAlign: "right" }}>
            {parseFloat(row.tds).toFixed(2)}
          </div>
        ),
        right: true,
          width: "60px",
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
          width: "70px",
      },
      ...(user?.role === "ret"
        ? [
            {
              name: "Actions",
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
                  <Tooltip title="Print DMT">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate("/customer/print-dmt", {
                          state: { txnData: row },
                        })
                      }
                      size="small"
                    >
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
                width: "40px",
              center: true,
            },
          ]
        : []),
    ],
    [user]
  );

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
                  { label: "Operator", value: selectedRow.operator },
                { label: "Operator Id", value: selectedRow.operator_id },
                { label: "Order Id", value: selectedRow.order_id },
                { label: "MOP", value: selectedRow.mop },
              
               
                { label: "Customer Number", value: selectedRow.sender_mobile },
               { label: "CCF", value: selectedRow.ccf },
                { label: "Charge", value: selectedRow.ccf },
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
