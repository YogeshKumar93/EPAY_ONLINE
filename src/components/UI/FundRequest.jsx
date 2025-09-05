import { useMemo, useCallback, useState, useContext } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import { currencySetter } from "../../utils/Currencyutil";
import { dateToTime, ddmmyy } from "../../utils/DateUtils";
import AddIcon from "@mui/icons-material/Add";
import CreateFundRequest from "../../pages/CreateFundRequest";
import UpdateFundRequest from "../../pages/UpdateFundRequest";
import FundRequestModal from "../../pages/FundRequestModal";
import AuthContext from "../../contexts/AuthContext";

const FundRequest = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  // const [selectedFund, setSelectedFund] = useState(null);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const getStatusColor = useCallback((status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "#2e7d32"; // green
      case "FAILED":
        return "#d32f2f"; // red
      case "REFUND":
        return "#ed6c02"; // orange
      case "PENDING":
        return "#0288d1"; // blue
      case "REJECTED":
        return "#9e9e9e"; // grey
      default:
        return "#616161"; // default grey
    }
  }, []);

  // ✅ After create
  const handleSaveCreate = () => {
    setOpenCreate(false);
  };

  // ✅ After update
  const handleSaveUpdate = () => {
    setOpenUpdate(false);
  };

  // ✅ Handle edit
  // const handleEdit = (row) => {
  //   setSelectedFund(row);
  //   setOpenUpdate(true);
  // };

  // ✅ Columns
  const columns = useMemo(
    () => [
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
        name: "Bank Name",
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
      {
        name: "Ledger Balance",
        selector: (row) => (
          <Typography>
            {currencySetter(parseFloat(row?.ledger_bal).toFixed(2))}
          </Typography>
        ),
      },
      {
        name: "Date",
        selector: (row) => ddmmyy(row?.date),
      },
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
        selector: (row) => (
          <Box
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: "6px",
              bgcolor: getStatusColor(row?.status),
              color: "white",
              fontSize: "12px",
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            {row?.status}
          </Box>
        ),
      },
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
        name: <span className="mx-3">Actions</span>,
        selector: (row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {row?.status === "REJECTED" ? (
              <FundRequestModal row={row} action="REOPEN" />
            ) : row?.status === "PENDING" ? (
              <>
                <FundRequestModal row={row} action="APPROVE" />
                <FundRequestModal row={row} action="REJECT" />
              </>
            ) : null}
          </Box>
        ),
        wrap: true,
        width: "170px",
        omit: user && user.role === "adm" ? false : true,
      },
    ],
    [getStatusColor, user]
  );

  // ✅ Filters
  const filters = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        type: "dropdown",
        options: [
          { value: "All", label: "All" },
          { value: "SUCCESS", label: "Success" },
          { value: "FAILED", label: "Failed" },
          { value: "REFUND", label: "Refund" },
          { value: "PENDING", label: "Pending" },
          { value: "REJECTED", label: "Rejected" },
        ],
      },
      { id: "name", label: "Name", type: "textfield" },
      { id: "bank_name", label: "Bank Name", type: "textfield" },
      { id: "txn_id", label: "Txn ID", type: "textfield" },
    ],
    []
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* ✅ Header */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#1CA895" }}
          onClick={() => setOpenCreate(true)}
        >
          Create Fund Request
        </Button>
      </Box>

      {/* ✅ Table */}
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_FUND_REQUESTS}
        filters={filters}
      />

      {/* ✅ Create Fund Request Modal */}
      <CreateFundRequest
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        handleSave={handleSaveCreate}
      />

      {/* ✅ Update Fund Request Modal */}
      <UpdateFundRequest
        open={openUpdate}
        handleClose={() => setOpenUpdate(false)}
        handleSave={handleSaveUpdate}
        selectedFundRequest={selectedFund}
      />
    </Box>
  );
};

export default FundRequest;
