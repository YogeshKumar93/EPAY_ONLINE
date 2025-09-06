import React, { useState } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CreateAccount from "./CreateAccount";
import UpdateAccount from "./UpdateAccount";
import DeleteAccount from "./DeleteAccount";

import ApiEndpoints from "../api/ApiEndpoints";
import CommonTable from "../components/common/CommonTable";
import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";

const Accounts = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Manual refresh trigger
  const handleManualRefresh = () => {
    // CommonTable will handle fetch since endpoint is passed
  };

  // ✅ Add new account
  const handleSaveCreate = (newAccount) => {
    setAccounts((prev) => [newAccount, ...prev]);
    handleManualRefresh();
    setOpenCreate(false);
  };

  // ✅ Update existing account
  const handleSaveUpdate = (updatedAccount) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
    );

    // handleManualRefresh();
    // setOpenUpdate(false);
    // setSelectedAccount(null);
  };

  // ✅ Handle edit
  const handleEdit = (row) => {
    setSelectedAccount(row);
    setOpenUpdate(true);
  };

  // ✅ Handle delete
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
      selector: (row) =>  <CommonStatus value={row.status} />,
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
  ];

  return (
    <Box sx={{}}>
      {/* ✅ Header */}

      {/* ✅ Table */}
      <CommonTable
        title="Accounts"
        columns={columns}
        loading={loading}
        endpoint={ApiEndpoints.GET_ACCOUNTS}
        handleManualRefresh={handleManualRefresh}
        customHeader={
          <ReButton
            variant="contained"
            label="Account"
            onClick={() => setOpenCreate(true)}
          ></ReButton>
        }
      />

      {/* ✅ Create Account Modal */}
      <CreateAccount
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        handleSave={handleSaveCreate}
      />

      {/* ✅ Update Account Modal */}
      {openUpdate && selectedAccount && (
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
        />
      )}
    </Box>
  );
};

export default Accounts;
