import { useMemo, useCallback, useState } from "react";
import {
  Box,
  Button,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import { currencySetter } from "../../utils/Currencyutil";
import { dateToTime, ddmmyy } from "../../utils/DateUtils";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateFundRequest from "../../pages/CreateFundRequest";
import UpdateFundRequest from "../../pages/UpdateFundRequest";

const FundRequest = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);

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
      default:
        return "#616161"; // grey
    }
  }, []);

  // ✅ After create
  const handleSaveCreate = () => {
    setOpenCreate(false);
    // refresh table if needed
  };

  // ✅ After update
  const handleSaveUpdate = () => {
    setOpenUpdate(false);
    // refresh table if needed
  };

  // ✅ Handle edit
  const handleEdit = (row) => {
    setSelectedFund(row);
    setOpenUpdate(true);
  };

  // ✅ Handle delete
  const handleDelete = (row) => {
    setSelectedFund(row);
    setOpenDelete(true);
  };

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
        name: "Actions",
        selector: (row) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton color="primary" onClick={() => handleEdit(row)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => handleDelete(row)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [getStatusColor]
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
