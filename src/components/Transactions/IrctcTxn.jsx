import { useMemo, useCallback, useContext, useState } from "react";
import { Box, Tooltip, Typography, Button, Drawer } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";
import CommonStatus from "../common/CommonStatus";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
 
import companylogo from '../../assets/Images/logo(1).png';
import TransactionDetailsCard from "../common/TransactionDetailsCard";

const IrctcTxn = ({ query }) => {
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
      {
        name: "Txn ID",
        selector: (row) => row.txn_id,
        wrap: true,
      },
      {
        name: "Client Ref",
        selector: (row) => row.client_ref,
        wrap: true,
      },
      {
        name: "IRCTC Txn ID",
        selector: (row) => row.irctc_txn_id,
        wrap: true,
      },
      {
        name: "PNR",
        selector: (row) => row.pnr,
        wrap: true,
      },
      {
        name: "Route",
        selector: (row) => row.route?.toUpperCase(),
        wrap: true,
      },
      {
        name: "Platform",
        selector: (row) => row.pf?.toUpperCase(),
        wrap: true,
      },
      {
        name: "Amount (₹)",
        selector: (row) => `₹ ${parseFloat(row.amount).toFixed(2)}`,
        right: true,
        style: { color: "green", fontWeight: 600 },
      },
      {
        name: "Charges (₹)",
        selector: (row) => parseFloat(row.charges).toFixed(2),
        right: true,
      },
      {
        name: "Commission (₹)",
        selector: (row) => parseFloat(row.commission).toFixed(2),
        right: true,
      },
      {
        name: "GST (₹)",
        selector: (row) => parseFloat(row.gst).toFixed(2),
        right: true,
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus  value={row.status} />,
       center:"true",
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

  const queryParam = "";

  return (
    <>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_IRCTC_TXN}
        filters={filters}
        queryParam={queryParam}
          enableActionsHover={true}
      />
        {/* Transaction Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
       
      >
        <Box sx={{ width: 400,  display: "flex", flexDirection: "column", height: "100%" }}>
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
                { label: "Beneficiary Name", value: selectedRow.beneficiary_name },
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

export default IrctcTxn;
