import { useMemo, useState, useContext } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import { currencySetter } from "../../utils/Currencyutil";
import { dateToTime, ddmmyy } from "../../utils/DateUtils";
import AddIcon from "@mui/icons-material/Add";
import CreateFundRequest from "../../pages/CreateFundRequest";

import FundRequestModal from "../../pages/FundRequestModal";
import AuthContext from "../../contexts/AuthContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReButton from "../common/ReButton";
import CommonStatus from "../common/CommonStatus";
 
 

const FundRequest = () => {
  const [openCreate, setOpenCreate] = useState(false);
  // const [selectedFund, setSelectedFund] = useState(null);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [selectedRow, setSelectedRow] = useState(null);
  const [status, setStatus] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = (row, statusType) => {
    setSelectedRow(row);
    setStatus(statusType);
    setOpenModal(true);
  };

  // const getStatusColor = useCallback((status) => {
  //   switch (status?.toUpperCase()) {
  //     case "SUCCESS":
  //       return "#2e7d32"; // green
  //     case "FAILED":
  //       return "#d32f2f"; // red
  //     case "REFUND":
  //       return "#ed6c02"; // orange
  //     case "PENDING":
  //       return "#0288d1"; // blue
  //     case "REJECTED":
  //       return "#9e9e9e"; // grey
  //     default:
  //       return "#616161"; // default grey
  //   }
  // }, []);

  // ✅ After create
  const handleSaveCreate = () => {
    setOpenCreate(false);
  };

  // ✅ After update
  // const handleSaveUpdate = () => {
  //   setOpenUpdate(false);
  // };

  // ✅ Handle edit
  // const handleEdit = (row) => {
  //   setSelectedFund(row);
  //   setOpenUpdate(true);
  // };

  // ✅ Columns
  const columns = useMemo(
    () => [
        {
        name: "Created At",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Updated At",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {ddmmyy(row.updated_at)} {dateToTime(row.updated_at)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "ID",
        selector: (row) => row?.id,
        width: "70px",
      },
      {
        name: "Name",
        selector: (row) => <Typography>{row?.name}</Typography>,
        wrap: true,
      },
      {
        name: "Bank",
        selector: (row) => <Typography>{row?.bank_name}</Typography>,
        wrap: true,
      },
      {
        name: "Account / Mode",
        selector: (row) => <Typography>{row?.mode}</Typography>,
        wrap: true,
      },
      {
        name: "Bank Ref ID",
        selector: (row) => <Typography>{row?.bank_ref_id}</Typography>,
        wrap: true,
      },
      {
        name: "Remark",
        selector: (row) => (
          <Tooltip title={row?.remark}>
            <Typography noWrap>{row?.remark}</Typography>
          </Tooltip>
        ),
        grow: 2,
      },
      // {
      //   name: "Ledger Balance",
      //   selector: (row) => (
      //     <Typography>
      //       {currencySetter(parseFloat(row?.ledger_bal).toFixed(2))}
      //     </Typography>
      //   ),
      // },
      {
        name: "Txn ID",
        selector: (row) => row?.txn_id,
      },
      {
        name: "Amount",
        selector: (row) => (
          <Typography sx={{ fontWeight: "bold" }}>
            {currencySetter(parseFloat(row?.amount).toFixed(2))}
          </Typography>
        ),
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
          selector: (row) => (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="approved">
                <Button
                  color="success"
                  size="small"
                  onClick={() => handleOpen(row, "approved")}
                >
                  <CheckCircleIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="reject">
                <Button
                  color="error"
                  size="small"
                  onClick={() => handleOpen(row, "rejected")}
                >
                  <CancelIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Box>
          ),
          width: "120px",
        },
      ]
    : []),
    ]
  );
  

  // ✅ Filters
  const filters = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        type: "dropdown",
        options: [
          { value: "all", label: "All" },
          { value: "success", label: "Success" },
          { value: "failed", label: "Failed" },
          { value: "refund", label: "Refund" },
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
        ],
        defaultValue: "pending",
      },
      { id: "name", label: "Name", type: "textfield" },
      { id: "bank_name", label: "Bank Name", type: "textfield" },
      { id: "txn_id", label: "Txn ID", type: "textfield" },
    ],
    []
  );

  return (
    <Box sx={{}}>
      {/* ✅ Header */}

      {/* ✅ Table */}
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_FUND_REQUESTS}
        filters={filters}
        customHeader={
          (user?.role !== "sadm" || user?.role !== "adm") && (
            <ReButton
              variant="contained"
              label="Request"
              onClick={() => setOpenCreate(true)}
            ></ReButton>
          )
        }
      />

      {/* ✅ Create Fund Request Modal */}
      <CreateFundRequest
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        handleSave={handleSaveCreate}
      />

      {/* Render modal outside table */}
      {openModal && (
        <FundRequestModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          row={selectedRow}
          status={status}
        />
      )}
    </Box>
  );
};

export default FundRequest;
