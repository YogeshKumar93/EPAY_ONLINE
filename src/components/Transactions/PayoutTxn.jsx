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

const PayoutTxn = ({ query }) => {
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "13px",
            }}
          >
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
        name: "Route",
        selector: (row) => (
          <div style={{ display: "flex", fontSize: "13px" }}>{row.route}</div>
        ),

        center: true,
          width: "140px",
      },
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

      {
        name: "Mobile Number",
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
      //   name: "Beneficiary",
      //   selector: (row) => (
      //     <div style={{ textAlign: "left", fontWeight: 500 }}>
      //       {row.beneficiary_name}
      //     </div>
      //   ),
      //   wrap: true,
      // },
      {
        name: "Beneficiary Details",
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
      {
        name: "GST",
        selector: (row) =>  <div style={{ color: "red", fontWeight: "600", textAlign: "right" }}>₹{parseFloat(row.gst).toFixed(2)}</div>,
        wrap: true,
        right: true,
      },

      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,

        center: true,
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
        endpoint={ApiEndpoints.GET_PAYOUT_TXN}
        filters={filters}
        queryParam={queryParam}
         enableActionsHover={true}
      />

  {/* Payout Details Drawer */}
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

export default PayoutTxn;
