import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiCall } from "../api/apiClient";
import CreateAccount from "./CreateAccount";
import UpdateAccount from "./UpdateAccount"; // ✅ import update modal
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import DeleteAccount from "./DeleteAccount";

const Accounts = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch accounts
  const getAccounts = async () => {
    try {
      setLoading(true);
      const { error, response } = await apiCall("GET", ApiEndpoints.GET_ACCOUNTS);
      if (!error && response?.status === "SUCCESS") {
      setAccounts(response?.data || []);

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

  // ✅ Add new account
  const handleSaveCreate = (newAccount) => {
    setAccounts((prev) => [newAccount, ...prev]);
  };

  // ✅ Update existing account
  const handleSaveUpdate = (updatedAccount) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
    );
  };

  // ✅ Handle edit
  const handleEdit = (row) => {
    setSelectedAccount(row);
    setOpenUpdate(true);
  };

const handleDelete = (row) => {
  setSelectedAccount(row);
  setOpenDelete(true);
};


  // ✅ Columns definition
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
            <IconButton color="error" onClick={() => handleDelete(row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

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
          Create Account
        </Button>
      </Box>

      {/* ✅ Table */}
<CommonTable
  title="Accounts"
  columns={columns}
  data={accounts}   // instead of rows
  loading={loading}
/>
      {/* ✅ Create Account Modal */}
      <CreateAccount
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        handleSave={handleSaveCreate}
      />

      {/* ✅ Update Account Modal */}
      {selectedAccount && (
        <UpdateAccount
          open={openUpdate}
          handleClose={() => {
            setOpenUpdate(false);
            setSelectedAccount(null);
          }}
          handleSave={handleSaveUpdate}
          selectedAccount={selectedAccount}
        />
      )}

       {/* ✅ Delete Account Modal */}
{selectedAccount && (
  <DeleteAccount
    open={openDelete}
    handleClose={() => {
      setOpenDelete(false);
      setSelectedAccount(null);
    }}
    selectedAccount={selectedAccount}
    onDeleted={(id) =>
      setAccounts((prev) => prev.filter((acc) => acc.id !== id))
    }
  />
)}


    </Box>
  );
};

export default Accounts;
