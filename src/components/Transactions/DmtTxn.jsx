import { useMemo, useCallback, useContext, useState } from "react";
import { Box, Tooltip, Typography, Button, IconButton } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../../utils/DateUtils";
import CommonStatus from "../common/CommonStatus";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ComplaintForm from "../ComplaintForm";
import DrawerDetails from "../common/DrawerDetails";
import VisibilityIcon from '@mui/icons-material/Visibility';

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
        width: "100px",
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
        name: "Sender Mobile",
        selector: (row) => row.sender_mobile,
        wrap: true,
      },
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
        center: true,
        width: "200px",
      },
      {
        name: "Amount",
        selector: (row) => (
          <div style={{ color: "red", fontWeight: "600", textAlign: "right" }}>
            ₹{parseFloat(row.amount).toFixed(2)}
          </div>
        ),
        right: true,
      },
      {
        name: "CCF",
        selector: (row) => (
          <div style={{ color: "red", fontWeight: "600", textAlign: "right" }}>
            {" "}
            {parseFloat(row.ccf).toFixed(2)}
          </div>
        ),
        right: true,
      },
      {
        name: "GST",
        selector: (row) => (
          <div style={{ color: "red", fontWeight: "600", textAlign: "right" }}>
            {parseFloat(row.gst).toFixed(2)}
          </div>
        ),
        right: true,
      },
      {
        name: "Comm",
        selector: (row) => (
          <div
            style={{ color: "green", fontWeight: "600", textAlign: "right" }}
          >
            {" "}
            {parseFloat(row.comm).toFixed(2)}
          </div>
        ),
        right: true,
      },
      {
        name: "TDS",
        selector: (row) => (
          <div style={{ color: "red", fontWeight: "600", textAlign: "right" }}>
            {" "}
            {parseFloat(row.tds).toFixed(2)}
          </div>
        ),
        right: true,
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
      },
      ...(user?.role === "adm"
        ? [
            {
              name: "Actions",
              selector: (row, { hoveredRow, enableActionsHover }) => {
                const isHovered = hoveredRow === row.id || !enableActionsHover;

                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "80px", // fixed width
                    }}
                  >
                    {isHovered ? (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          transition: "opacity 0.2s ease-in-out",
                        }}
                      >
                        <Tooltip title="Raise Complaint">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => {
                              setSelectedTxn(row);
                              setOpenCreate(true);
                            }}
                          >
                            <ReportProblemIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#999",
                          textAlign: "center",
                          minWidth: "80px", // same as icon container
                        }}
                      >
                        -
                      </Typography>
                    )}
                  </Box>
                );
              },
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
        endpoint={ApiEndpoints.GET_DMT_TXN}
        filters={filters}
        queryParam={queryParam}
        enableActionsHover={true}
      />

     <DrawerDetails
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        rowData={selectedRow}
        
        // fields={[
        //   { label: "Gst", key: "gst" },
        //   { label: "Api Response", key: "api_response" },
         
        // ]}
      />

      {/* ✅ Complaint Modal */}
      {openCreate && selectedTxn && (
        <ComplaintForm
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          txnId={selectedTxn}
          type="dmt"
        />
      )}
    </>
  );
};

export default DmtTxn;
