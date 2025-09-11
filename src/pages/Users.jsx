import { useMemo, useContext, useState, useRef } from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import PermissionsModal from "./PermissionsModal";
import SettingsIcon from "@mui/icons-material/Settings";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BlockUnblockUser from "./BlockUnblockUser";

const Users = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const fetchUsersRef = useRef(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openPermissions, setOpenPermissions] = useState(false);

  // 🔐 Lock/Unlock Modal
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);

  const handleOpenPermissions = (user) => {
    setSelectedUser(user);
    setOpenPermissions(true);
  };

  const handleClosePermissions = () => {
    setSelectedUser(null);
    setOpenPermissions(false);
  };

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };

  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };

  const handleOpenLockModal = (user) => {
    setUserToToggle(user);
    setLockModalOpen(true);
  };

  const handleCloseLockModal = () => {
    setUserToToggle(null);
    setLockModalOpen(false);
  };

  const filters = useMemo(
    () => [
      { id: "mobile", label: "Mobile Number", type: "textfield" },
      { id: "id", label: "User Id", type: "textfield" },
      { id: "Parent", label: "Parent", type: "textfield" },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        name: "Date/Time",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
        ),
      },
      {
        name: "Id",
        selector: (row) => (
          <Tooltip title={row?.id}>
            <div style={{ textAlign: "left" }}>{row?.id}</div>
          </Tooltip>
        ),
      },
      {
        name: "Name",
        selector: (row) => (
          <Tooltip title={row?.name}>
            <div style={{ textAlign: "left" }}>{row?.name}</div>
          </Tooltip>
        ),
      },
      {
        name: "W1",
        selector: (row) => (
          <Tooltip title={row?.w1}>
            <div style={{ textAlign: "left" }}>{row?.w1}</div>
          </Tooltip>
        ),
      },
      {
        name: "W2",
        selector: (row) => (
          <Tooltip title={row?.w2}>
            <div style={{ textAlign: "left" }}>{row?.w2}</div>
          </Tooltip>
        ),
      },
      {
        name: "Lien Amount",
        selector: (row) => (
          <Tooltip title={row?.lien}>
            <div style={{ textAlign: "left" }}>{row?.lien}</div>
          </Tooltip>
        ),
      },
      {
        name: "Mobile",
        selector: (row) => (
          <Tooltip title={row?.mobile}>
            <div style={{ textAlign: "left" }}>{row?.mobile}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Status",
        selector: (row) =>
          row.is_active === 1 ? (
            <Tooltip title="Click to Block">
              <IconButton onClick={() => handleOpenLockModal(row)}>
                <LockOpenIcon color="success" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Click to Unblock">
              <IconButton onClick={() => handleOpenLockModal(row)}>
                <LockOutlinedIcon color="error" />
              </IconButton>
            </Tooltip>
          ),
      },
      {
        name: "Permissions",
        selector: (row) => (
          <Tooltip title="Edit Permissions">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenPermissions(row)}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  return (
    <Box>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_USERS}
        filters={filters}
        queryParam={query}
        onFetchRef={handleFetchRef}
      />

      {/* Permissions Modal */}
      {selectedUser && (
        <PermissionsModal
          open={openPermissions}
          handleClose={handleClosePermissions}
          user={selectedUser}
          onFetchRef={refreshUsers}
        />
      )}

      {/* Lock/Unlock Modal */}
      {userToToggle && (
        <BlockUnblockUser
          open={lockModalOpen}
          handleClose={handleCloseLockModal}
          user={userToToggle}
          onSuccess={refreshUsers}
        />
      )}
    </Box>
  );
};

export default Users;
