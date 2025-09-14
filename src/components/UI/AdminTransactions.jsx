import { useMemo, useCallback } from "react";
import { Box, Button, Tooltip, Chip } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import QRLogin from "../QrLogin";
import { getToken } from "../../contexts/AuthContext";

const AdminTransactions = () => {
  const formatAmount = useCallback((amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "success";
      case "FAILED":
        return "error";
      case "REFUND":
        return "warning";
      case "PENDING":
        return "info";
      default:
        return "default";
    }
  }, []);
  const columns = useMemo(
    () => [
      {
        name: "ID",
        selector: (row) => <div className="blue-highlight-txt">{row.id}</div>,
        width: "100px",
      },
      {
        name: "Order ID",
        selector: (row) => row.order_id,
        width: "150px",
      },
      {
        name: "Date",
        selector: (row) => new Date(row.created_at).toLocaleDateString(),
        width: "120px",
      },
      {
        name: "Type",
        selector: (row) => row.type,
        width: "150px",
      },
      {
        name: "Operator",
        selector: (row) => row.operator,
        width: "180px",
        wrap: true,
      },
      {
        name: "Amount",
        selector: (row) => formatAmount(row.amount),
        width: "120px",
      },
      {
        name: "Status",
        selector: (row) => (
          <Chip
            label={row.status}
            color={getStatusColor(row.status)}
            size="small"
          />
        ),
        width: "120px",
      },
      {
        name: "User",
        selector: (row) => row.establishment,
        width: "200px",
        wrap: true,
      },
      {
        name: "Platform",
        selector: (row) => row.platform || "N/A",
        width: "100px",
      },
      {
        name: "Actions",
        selector: (row) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title="View Details">
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  console.log("View transaction details", row);
                  // modal or details navigation
                }}
              >
                View
              </Button>
            </Tooltip>
          </Box>
        ),
        width: "120px",
      },
    ],
    [formatAmount, getStatusColor]
  );

  // memoized filters
  const filters = useMemo(
    () => [
      { id: "order_id", label: "Order ID", type: "textfield" },
      { id: "operator", label: "Operator", type: "textfield" },
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
      {
        id: "type",
        label: "Transaction Type",
        type: "dropdown",
        options: [
          { value: "All", label: "All" },
          { value: "W2W TRANSFER", label: "W2W Transfer" },
          { value: "MONEY TRANSFER", label: "Money Transfer" },
          { value: "PAYMENTS", label: "Payments" },
          { value: "COLLECTIONS", label: "Collections" },
          { value: "VERIFICATION", label: "Verification" },
        ],
      },
      { id: "establishment", label: "User", type: "textfield" },
    ],
    []
  );

  return (
    <>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_TRANSACTIONS}
        filters={filters}
        // refreshInterval={30000}
      />
    </>
  );
};

export default AdminTransactions;
