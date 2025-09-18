import { useMemo,  useContext, useState } from "react";
import { Box, Tooltip,  IconButton, Drawer } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";
import CommonStatus from "../common/CommonStatus";
import { android2, linux2, macintosh2, okhttp, windows2 } from "../../utils/iconsImports";
import LaptopIcon from "@mui/icons-material/Laptop";
import DrawerDetails from "../common/DrawerDetails";
import VisibilityIcon from '@mui/icons-material/Visibility';
 
import CloseIcon from "@mui/icons-material/Close";
 
import companylogo from '../../assets/Images/logo(1).png';
import TransactionDetailsCard from "../common/TransactionDetailsCard";
import ComplaintForm from "../ComplaintForm";
 
const RechargeTxn = ({  query }) => {
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
        name: "Date/Time",
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
            name: "Platform",
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
              }
              else if (row.pf.toLowerCase().includes("okhttp")) {
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
            {
        name: "User",
        selector: (row) => (
          <>
         {row.user_id}
         </>
    ),
        wrap: true,
      },
             {
        name: "Operator",
        selector: (row) => (
          <div style={{ textAlign: "left" ,fontWeight:600}}>
         {row.operator}<br />
          </div>
        ),
        wrap: true,
      },  
      {
        name: "Order Id / Client Ref",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
             {row.txn_id} <br />
            {row.client_ref}
          </div>
        ),
        wrap: true,
        width:"170px"
      },
    
      {
        name: "Route",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
          {row.route}
          </div>
        ),
        wrap: true,
      },
   
     
      {
        name: "Mobile",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {row.mobile_number}
          </div>
        ),
        wrap: true,
      },
    
      {
        name: "Amount",
        selector: (row) => (
          <div
            style={{ color: "green", fontWeight:700, textAlign: "right" }}
          >
            ₹ {parseFloat(row.amount).toFixed(2)}
          </div>
        ),
        wrap: true,
        right: true,
      },
      {
        name: "Comm",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {/* GST: ₹{parseFloat(row.gst).toFixed(2)} <br /> */}
             ₹{parseFloat(row.comm).toFixed(2)}
          </div>
        ),
        wrap: true,
        right: true,
      },
      {
        name: "Di Comm",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
             ₹{parseFloat(row.di_comm).toFixed(2)}
          </div>
        ),
        wrap: true,
        right: true,
      },
      {
        name: "Md Comm",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
             ₹{parseFloat(row.md_comm).toFixed(2)}
          </div>
        ),
        wrap: true,
        right: true,
      },
      {
        name: "Status",
        selector: (row) => 
          <div style={{ textAlign: "left" }}>
        <CommonStatus value={row.status} /> <br />
            {row.operator_id}
          </div>,
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
  : [])

    ],
    []
  );

  const queryParam = "";

  return (
    <>
      <Box sx={{ mx: -4 }}>  
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_RECHARGE_TXN}
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
                { label: "Operator", value: selectedRow.operator },
                { label: "Order Id", value: selectedRow.client_ref },
                { label: " Mobile", value: selectedRow.mobile_number },
                { label: "Amount", value: selectedRow.amount },
                { label: "Account Number", value: selectedRow.account_number },
                { label: "Status", value: selectedRow.status },
               
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

export default RechargeTxn;
