import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { apiCall } from "../api/apiClient";
import CreateAccount from "./CreateAccount";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";

const Accounts = () => {
  const [openModal, setOpenModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch accounts (GET API)
  const getAccounts = async () => {
    try {
      setLoading(true);
      const { error, response } = await apiCall("GET", ApiEndpoints.GET_ACCOUNTS);
      if (!error && response?.status === "SUCCESS") {
        setAccounts(response.data || []);
      } else {
        console.error("Failed to fetch accounts:", error || response);
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);



  // Columns (same as before)
  const columns = [
    { name: "Name", selector: (row) => row.name },
    { name: "User ID", selector: (row) => row.user_id },
    { name: "Establishment", selector: (row) => row.establishment },
    { name: "Mobile", selector: (row) => row.mobile },
    { name: "Type", selector: (row) => row.type },
    { name: "ASM", selector: (row) => row.asm || "-" },
    { name: "Credit Limit", selector: (row) => row.credit_limit },
    { name: "Balance", selector: (row) => row.balance },
    {
      name: "Status",
      selector: (row) => (row.status === 1 ? "Active" : "Inactive"),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#1CA895" }}
          onClick={() => setOpenModal(true)}
        >
          Create Account
        </Button>
      </Box>

      {/* Table - now takes rows directly */}
      <CommonTable
        title="Accounts"
        columns={columns}
        rows={accounts}   // 🔹 Pass data directly
        loading={loading} // optional loader
      />

      {/* Create Account Modal */}
      <CreateAccount
        open={openModal}
        handleClose={() => setOpenModal(false)}
        // handleSave={handleSave}
      />
    </Box>
  );
};

export default Accounts;
