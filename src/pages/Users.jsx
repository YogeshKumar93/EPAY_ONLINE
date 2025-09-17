import { useMemo, useContext, useState, useRef, useEffect } from "react";
import { Box, Tooltip, IconButton, Button, Typography } from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import PermissionsModal from "./PermissionsModal";
import SettingsIcon from "@mui/icons-material/Settings";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BlockUnblockUser from "./BlockUnblockUser";
import ReButton from "../components/common/ReButton";
import CreateUser from "../components/User/createUser";
import EditIcon from "@mui/icons-material/Edit";
import { apiCall } from "../api/apiClient";
const Users = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const fetchUsersRef = useRef(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openPermissions, setOpenPermissions] = useState(false);
  const [userMap, setUserMap] = useState({}); // id → name map

  // 🔐 Lock/Unlock Modal
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);
  const [openCreateUser, setOpenCreateUser] = useState(false);

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

  const handleEdit = (user) => {
    // Implement edit functionality here
    console.log("Edit user:", user);
  };

  useEffect(() => {
    const fetchUserMap = async () => {
      try {
        const res = await apiCall("post", ApiEndpoints.GET_USERS);
        console.log("Full API response:", res);

        const usersArray = res?.response?.data?.data;
        if (Array.isArray(usersArray)) {
          const map = {};
          usersArray.forEach((user) => {
            console.log("Mapping user:", user.id, user.name); // Debug each user
            map[user.id] = user.name;
          });

          console.log("Final ID → Name map:", map); // Check final mapping
          setUserMap(map);
        } else {
          console.warn("Users array is missing or not an array", usersArray);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUserMap();
  }, []);

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
        name: "Mobile",
        selector: (row) => (
          <Tooltip title={row?.mobile}>
            <div style={{ textAlign: "left" }}>{row?.mobile}</div>
          </Tooltip>
        ),
        width: "100px",
      },
      {
        name: "Establishment",
        selector: (row) => (
          <Tooltip title={row?.establishment}>
            <div style={{ textAlign: "left" }}>{row?.establishment}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Parent",
        selector: (row) => {
          if (!row.parent) return "-";
          const parentName = userMap[row.parent];
          return (
            <Tooltip title={`Parent ID: ${row.parent}`}>
              <div style={{ textAlign: "left" }}>
                {parentName || `ID ${row.parent}`}
              </div>
            </Tooltip>
          );
        },
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
        name: "Lien",
        selector: (row) => (
          <Tooltip title={row?.lien}>
            <div style={{ textAlign: "left" }}>{row?.lien}</div>
          </Tooltip>
        ),
      },
      {
        name: "Status",
        selector: (row, { hoveredRow, enableActionsHover }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span
              style={{
                color: row.is_active === 1 ? "green" : "red",
                minWidth: "30px",
                display: "inline-block",
              }}
            >
              {row.is_active === 1 ? "Active" : "Inactive"}
            </span>
            {/* ✅ Hover/Always show based on prop */}
            {(!enableActionsHover || hoveredRow === row.id) && (
              <Box sx={{ transition: "opacity 0.2s" }}>
                {row.is_active === 1 ? (
                  <Tooltip title="Click to Block">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenLockModal(row)}
                      sx={{ color: "success.main" }}
                    >
                      <LockOpenIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to Unblock">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenLockModal(row)}
                      sx={{ color: "error.main" }}
                    >
                      <LockOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          </Box>
        ),
      },
      {
        name: "Actions",
        selector: (row, { hoveredRow, enableActionsHover }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "80px", // fix width for stability
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                transition: "opacity 0.2s ease-in-out",
                opacity: !enableActionsHover || hoveredRow === row.id ? 1 : 0,
                visibility:
                  !enableActionsHover || hoveredRow === row.id
                    ? "visible"
                    : "hidden",
              }}
            >
              <Tooltip title="Edit User">
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={() => handleEdit(row)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit Permissions">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleOpenPermissions(row)}
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ),
      },
    ],
    [userMap]
  );

  return (
    <Box>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_USERS}
        filters={filters}
        queryParam={query}
        onFetchRef={handleFetchRef}
        enableActionsHover={true}
        customHeader={
          <ReButton label="Add User" onClick={() => setOpenCreateUser(true)} />
        }
      />

      {openCreateUser && (
        <CreateUser
          open={openCreateUser}
          onClose={() => setOpenCreateUser(false)}
          onFetchRef={refreshUsers}
        />
      )}

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
