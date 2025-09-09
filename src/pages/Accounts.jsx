import React, { useRef, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
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
import CommonLoader from "../components/common/CommonLoader";

const Accounts = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsersRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };

  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };

  // ✅ Add new account
  const handleSaveCreate = (newAccount) => {
    setAccounts((prev) => [newAccount, ...prev]);
    setOpenCreate(false);
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
      selector: (row) => <CommonStatus value={row.status} />,
    },
    {
      name: "Actions",
      selector: (row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              onClick={() => {
                setSelectedAccount(row);
                setOpenUpdate(true);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => {
                setSelectedAccount(row);
                setOpenDelete(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <CommonLoader loading={loading} text="Loading Fund Requests" />

      {!loading && (
        <Box>
          {/* ✅ Table */}
          <CommonTable
            columns={columns}
            loading={loading}
            endpoint={ApiEndpoints.GET_ACCOUNTS}
            onFetchRef={handleFetchRef}
            customHeader={
              <ReButton
                variant="contained"
                label="Account"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreate(true)}
              />
            }
          />

          {/* ✅ Create Account Modal */}
          <CreateAccount
            open={openCreate}
            handleClose={() => setOpenCreate(false)}
            handleSave={handleSaveCreate}
            onFetchRef={refreshUsers} // ✅ trigger fetch after create
          />

          {/* ✅ Update Account Modal */}
          {openUpdate && selectedAccount && (
            <UpdateAccount
              open={openUpdate}
              handleClose={() => {
                setOpenUpdate(false);
                setSelectedAccount(null);
              }}
              selectedAccount={selectedAccount}
              onFetchRef={refreshUsers} // ✅ trigger fetch after update
            />
          )}

          {/* ✅ Delete Account Modal */}
          {openDelete && selectedAccount && (
            <DeleteAccount
              open={openDelete}
              handleClose={() => {
                setOpenDelete(false);
                setSelectedAccount(null);
              }}
              selectedAccount={selectedAccount}
              onFetchRef={refreshUsers} // ✅ trigger fetch after delete
            />
          )}
        </Box>
      )}
    </>
  );
};

export default Accounts;
