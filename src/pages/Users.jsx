import { useMemo, useContext, useState, useRef, useEffect } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  Button,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
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
import AdWalletTransfer from "./AdWalletTransfer";
import CommonStatus from "../components/common/CommonStatus";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditUser from "./EditUser";
import ViewDocuments from "./ViewDocuments";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Assignment, CurrencyRupee } from "@mui/icons-material";
import { AssignPlans } from "./AssignPlans";
import AdminCreateUser from "./AdminCreateUser";
import AddLein from "./AddLein";

const roleLabels = {
  ret: "Retailer",
  adm: "Admin",
  sadm: "Super Admin",
  di: "Distributor",
  asm: "Area Sales Manager",
  zsm: "Zonal Sales Manager",
  api: "Api User",
  dd: "Direct Dealer",
  md: "Master Distributor",
};

const Users = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const fetchUsersRef = useRef(null);
  const userRole = authCtx?.user;

  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [openPermissions, setOpenPermissions] = useState(false);
  const [userMap, setUserMap] = useState({}); // id → name map
  const [searchTerm, setSearchTerm] = useState("");
  const [openViewDocuments, setOpenViewDocuments] = useState(false);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [createadmuser, setCreateAdmUser] = useState(false);
  const [openLeinModal, setOpenLeinModal] = useState(false);
  const [openWalletTranser, setOpenWalletTranser] = useState(false);
  const [openAssignPlans, setOpenAssignPlans] = useState(false);

  const handleOpenAssignPlans = (user) => {
    setSelectedUser(user);
    setOpenAssignPlans(true);
  };
  const handleCloseAssignPlans = () => {
    setSelectedUser(null);
    setOpenAssignPlans(false);
  };

  const handleOpenLein = (row) => {
    setOpenLeinModal(true);
    setSelectedUser(row);
  };
  const handleOpenWalletTransfer = (row) => {
    setOpenWalletTranser(true);
    setSelectedUser(row);
  };
  const handleCloseWalletTransfer = (row) => {
    setOpenWalletTranser(false);
  };
  const handleCloseLein = () => setOpenLeinModal(false);

  const handleOpenEditUser = (user) => {
    setSelectedUser(user);
    setOpenEditUser(true);
  };
  const handleCloseEditUser = () => {
    setOpenEditUser(false);
    setSelectedUser(null);
  };

  const handleOpenPermissions = (user) => {
    setSelectedUser(user);
    setOpenPermissions(true);
  };
  const handleClosePermissions = () => {
    setOpenPermissions(false);
    setSelectedUser(null);
  };

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };
  const refreshUsers = () => {
    if (fetchUsersRef.current) fetchUsersRef.current();
  };

  const handleOpenLockModal = (user) => {
    setUserToToggle(user);
    setLockModalOpen(true);
  };
  const handleCloseLockModal = () => {
    setUserToToggle(null);
    setLockModalOpen(false);
  };

  const filterRows = (rows) => {
    if (!searchTerm) return rows;
    const lowerSearch = searchTerm.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  };

  const handleOpenViewDocuments = (user) => {
    setSelectedUser(user);
    setOpenViewDocuments(true);
  };
  const handleCloseViewDocuments = () => {
    setSelectedUser(null);
    setOpenViewDocuments(false);
  };

  // Fetch user map
  useEffect(() => {
    const fetchUserMap = async () => {
      try {
        const res = await apiCall("post", ApiEndpoints.GET_USERS);
        const usersArray = res?.response?.data?.data;
        if (Array.isArray(usersArray)) {
          const map = {};
          usersArray.forEach((user) => (map[user.id] = user.name));
          setUserMap(map);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUserMap();
  }, []);

  // Action Menu Component
  function ActionMenu({ row }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
      <Box>
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          {userRole.role === "adm" && [
            <MenuItem
              key="edit"
              onClick={() => {
                handleOpenEditUser(row);
                handleMenuClose();
              }}
            >
              {/* <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon> */}
              <ListItemText>Edit User</ListItemText>
            </MenuItem>,

            <MenuItem
              key="permissions"
              onClick={() => {
                handleOpenPermissions(row);
                handleMenuClose();
              }}
            >
              {/* <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon> */}
              <ListItemText>Edit Permissions</ListItemText>
            </MenuItem>,

            <MenuItem
              key="documents"
              onClick={() => {
                handleOpenViewDocuments(row);
                handleMenuClose();
              }}
            >
              {/* <ListItemIcon>
                <VisibilityIcon fontSize="small" />
              </ListItemIcon> */}
              <ListItemText>View Documents</ListItemText>
            </MenuItem>,

            <MenuItem
              key="assign_plan"
              onClick={() => {
                handleOpenAssignPlans(row);
                handleMenuClose();
              }}
            >
              <ListItemText>Assign Plan</ListItemText>
            </MenuItem>,
          ]}

          <MenuItem
            key="lein"
            onClick={() => {
              handleOpenLein(row);
              handleMenuClose();
            }}
          >
            <ListItemText>Lein Amount</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  const filters = useMemo(
    () => [
      {
        id: "mobile",
        label: "Mobile Number",
        type: "textfield",
        textType: "number",
      },
      { id: "id", label: "User Id", type: "textfield" },
      { id: "Parent", label: "Parent", type: "textfield", roles: ["adm"] },
    ],
    []
  );

  const columns = useMemo(() => {
    const baseColumns = [
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
            <div style={{ textAlign: "left", fontWeight: "bold" }}>
              P2PAE{row?.id}
            </div>
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
        name: "Establishment",
        selector: (row) => (
          <Tooltip title={row?.establishment}>
            <div style={{ textAlign: "left" }}>{row?.establishment}</div>
          </Tooltip>
        ),
        width: "100px",
      },
      ...(userRole.role !== "di"
        ? [
            {
              name: "Role",
              selector: (row) => (
                <Tooltip title={roleLabels[row?.role] || row?.role}>
                  <div style={{ textAlign: "left" }}>
                    {roleLabels[row?.role] || row?.role}
                  </div>
                </Tooltip>
              ),
            },
          ]
        : []),
      {
        name: "Mobile",
        selector: (row) => (
          <Tooltip title={row?.mobile}>
            <div style={{ textAlign: "left" }}>{row?.mobile}</div>
          </Tooltip>
        ),
        width: "100px",
      },
      ...(userRole.role !== "di" && userRole.role !== "md"
        ? [
            {
              name: "Parent Est.",
              selector: (row) => {
                const parentName = userMap[row.parent] || "-";
                return (
                  // <Tooltip title={parentName}>
                  <div style={{ textAlign: "left", cursor: "pointer" }}>
                    {row.parent_establishment}
                  </div>
                  // </Tooltip>
                );
              },
            },
          ]
        : []),
      {
        name: "W1",
        selector: (row) => (
          <div style={{ textAlign: "left", cursor: "pointer" }}>
            ₹ {(row.w1 / 100).toFixed(2)}
          </div>
        ),
      },
      ...(userRole.role !== "md"
        ? [
            {
              name: "W2",
              selector: (row) => (
                <div style={{ textAlign: "left", cursor: "pointer" }}>
                  ₹ {(row.w2 / 100).toFixed(2)}
                </div>
              ),
            },
          ]
        : []),
      ...(userRole.role !== "di" && userRole.role !== "md"
        ? [
            {
              name: "W3",
              selector: (row) => (
                <div style={{ textAlign: "left", cursor: "pointer" }}>
                  ₹ {row.w3}
                </div>
              ),
            },
            {
              name: "Lien",
              selector: (row) => (
                <Tooltip title={row.lien}>
                  <div style={{ textAlign: "left", cursor: "pointer" }}>
                    {row.lien}
                  </div>
                </Tooltip>
              ),
            },
          ]
        : []),
    ];

    // Status column
    baseColumns.push({
      name: "Status",
      selector: (row) => {
        if (["adm", "sadm"].includes(userRole.role)) {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
          );
        } else {
          return <CommonStatus value={row.is_active} />;
        }
      },
    });

    // Actions column
    if (["adm", "di", "md"].includes(userRole?.role)) {
      baseColumns.push({
        name: "Actions",
        selector: (row) => (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ActionMenu row={row} />
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => {
                handleOpenWalletTransfer(row);
                handleMenuClose();
              }}
            >
              <CurrencyRupee fontSize="small" sx={{ color: "green" }} />
            </Box>
          </div>
        ),
      });
    }

    return baseColumns;
  }, [userMap, userRole]);

  return (
    <Box>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_USERS}
        filters={filters}
        queryParam={query}
        transformData={filterRows}
        onFetchRef={handleFetchRef}
        enableActionsHover={true}
        customHeader={
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {userRole.role !== "asm" &&
              userRole.role !== "zsm" &&
              userRole.role !== "adm" && (
                <ReButton
                  label="Add User"
                  onClick={() => setOpenCreateUser(true)}
                />
              )}
            {userRole.role === "adm" && (
              <ReButton
                label="Create User"
                onClick={() => setCreateAdmUser(true)}
              />
            )}
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
                flex: 1,
              }}
            />
          </Box>
        }
      />

      {openCreateUser && (
        <CreateUser
          open={openCreateUser}
          onClose={() => setOpenCreateUser(false)}
          onFetchRef={refreshUsers}
        />
      )}

      {createadmuser && (
        <AdminCreateUser
          open={createadmuser}
          onClose={() => setCreateAdmUser(false)}
          onFetchRef={refreshUsers}
        />
      )}

      {openEditUser && selectedUser && (
        <EditUser
          open={openEditUser}
          onClose={handleCloseEditUser}
          user={selectedUser}
          onFetchRef={refreshUsers}
        />
      )}

      {openPermissions && selectedUser && (
        <PermissionsModal
          open={openPermissions}
          handleClose={handleClosePermissions}
          user={selectedUser}
          onFetchRef={refreshUsers}
        />
      )}

      {userToToggle && (
        <BlockUnblockUser
          open={lockModalOpen}
          handleClose={handleCloseLockModal}
          user={userToToggle}
          onSuccess={refreshUsers}
        />
      )}
      {openWalletTranser && (
        <AdWalletTransfer
          open={openWalletTranser}
          row={selectedUser}
          onClose={handleCloseWalletTransfer}
        />
      )}
      {openLeinModal && (
        <AddLein
          open={openLeinModal}
          handleClose={handleCloseLein}
          onFetchRef={() => {}}
          selectedRow={selectedUser}
          type="users"
        />
      )}

      {openViewDocuments && selectedUser && (
        <ViewDocuments
          open={openViewDocuments}
          onClose={handleCloseViewDocuments}
          user={selectedUser}
        />
      )}
      {openAssignPlans && selectedUser && (
        <AssignPlans
          open={openAssignPlans}
          onClose={handleCloseAssignPlans}
          row={selectedUser}
          onSuccess={refreshUsers} // refresh table after assigning
        />
      )}
    </Box>
  );
};

export default Users;
