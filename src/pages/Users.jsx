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
import { Assignment, CurrencyRupee, VerifiedUser } from "@mui/icons-material";
import { AssignPlans } from "./AssignPlans";
import AdminCreateUser from "./AdminCreateUser";
import AddLein from "./AddLein";
import debounce from "lodash.debounce";
// import { useNavigate } from "react-router-dom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ChangeRoleModal from "../components/ChangeRole";
import ChangeParentModal from "./ChangeParentModal";

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
  const user = authCtx?.user;

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
  const [userSearch, setUserSearch] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUserFilter, setSelectedUserFilter] = useState(null); // selected option
  const [appliedFilters, setAppliedFilters] = useState({}); // applied filter payload
  // const navigate = useNavigate();
  const [openChangeRole, setOpenChangeRole] = useState(false);
  // const [selectedUser, setSelectedUser] = useState(null);
  const [openChangeParent, setOpenChangeParent] = useState(false);
  const handleOpenChangeParent = (row) => {
    setSelectedUser(row);
    setOpenChangeParent(true);
  };
  const handleCloseChangeParent = () => {
    setSelectedUser(null);
    setOpenChangeParent(false);
  };

  const handleChangeRole = (row) => {
    setSelectedUser(row); // store selected user details
    setOpenChangeRole(true); // open the modal
  };

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

  useEffect(() => {
    if (userSearch.length <= 4) {
      setUserOptions([]); // Clear options if less than or equal to 4 chars
      return;
    }

    const fetchUsersByEstablishment = async (searchTerm) => {
      try {
        const { error, response } = await apiCall(
          "post",
          ApiEndpoints.GET_USER_DEBOUNCE,
          {
            establishment: searchTerm, // send under establishment key
          }
        );
        console.log("respinse ofthe debounce is thius ", response?.data?.id);

        if (!error && response?.data) {
          setUserOptions(
            response.data.map((u) => ({
              id: u.id, // ✅ consistent key
              label: u.establishment,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    const debouncedFetch = debounce(fetchUsersByEstablishment, 500); // 500ms delay
    debouncedFetch(userSearch);

    return () => debouncedFetch.cancel(); // cleanup on unmount or change
  }, [userSearch]);

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
          {["adm", "sadm"].includes(userRole.role) && [
            <MenuItem
              key="edit"
              onClick={() => {
                handleOpenEditUser(row);
                handleMenuClose();
              }}
            >
              <ListItemText>Edit User</ListItemText>
            </MenuItem>,

            <MenuItem
              key="permissions"
              onClick={() => {
                handleOpenPermissions(row);
                handleMenuClose();
              }}
            >
              <ListItemText>Edit Permissions</ListItemText>
            </MenuItem>,

            <MenuItem
              key="documents"
              onClick={() => {
                handleOpenViewDocuments(row);
                handleMenuClose();
              }}
            >
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
            <MenuItem
              key="change_parent"
              onClick={() => {
                handleOpenChangeParent(row);
                handleMenuClose();
              }}
            >
              <ListItemText>Change Parent</ListItemText>
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

  const filters = useMemo(() => {
    const userRole = user?.role?.toLowerCase?.();

    const hierarchy = [
      "sadm",
      "adm",
      "zsm",
      "asm",
      "md",
      "di",
      "ret",
      "dd",
      "api",
    ];

    const hideRoles = (() => {
      const index = hierarchy.indexOf(userRole);
      if (index === -1) return [];
      return hierarchy.slice(0, index + 1);
    })();

    const roleOptions = Object.entries(roleLabels)
      .filter(([key]) => !hideRoles.includes(key))
      .sort((a, b) => hierarchy.indexOf(a[0]) - hierarchy.indexOf(b[0]))
      .map(([key, value]) => ({
        label: value,
        value: key,
      }));

    return [
      {
        id: "role",
        label: "Role",
        type: "dropdown",
        roles: ["adm", "md", "zsm", "asm"],
        options: roleOptions,
      },

      // {
      //   id: "id",
      //   label: "Type Est.",
      //   type: "autocomplete",
      //   options: userOptions,
      //   onSearch: (val) => setUserSearch(val),
      //   getOptionLabel: (option) => option.label,
      //   // Remove valueKey and handle the value extraction in handleFilterChange
      // },
      {
        id: "id",
        label: "Type Est.",
        type: "autocomplete",
        options: userOptions,
        onSearch: (val) => setUserSearch(val),
        getOptionLabel: (option) => option?.label || "",
        isOptionEqualToValue: (option, value) => option.id === value.id, // ✅ this line keeps selection visible
      },
      {
        id: "parent_id",
        label: "Parent Id",
        type: "textfield",
        roles: ["adm"],
      },
      // {
      //   id: "establishment",
      //   label: "Establishment",
      //   type: "textfield",
      //   roles: ["adm"],
      // },
      {
        id: "mobile",
        label: "Mobile Number",
        type: "textfield",
        textType: "number",
      },
    ];
  }, [user?.role, userOptions, appliedFilters]); // Add appliedFilters to dependencies
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
                    {row.parent_establishment || "--"}
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
    if (["adm", "sadm"].includes(userRole.role)) {
      baseColumns.push({
        name: "KYC",
        selector: (row) => {
          let iconColor = "";
          let tooltipTitle = "";

          switch (row.status) {
            case 1:
              iconColor = "success.main";
              tooltipTitle = "KYC Approved";
              break;
            case 2:
              iconColor = "warning.main";
              tooltipTitle = "KYC Pending";
              break;
            case 3:
              iconColor = "error.main";
              tooltipTitle = "KYC Image not Uploaded";
              break;
            default:
              iconColor = "text.disabled";
              tooltipTitle = "KYC Status Unknown";
          }

          return (
            <Tooltip title={tooltipTitle}>
              <IconButton size="small" sx={{ color: iconColor }}>
                <VerifiedUser fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        },
      });
    }

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

    if (userRole.role === "sadm") {
      baseColumns.push({
        name: "Chg Role",
        selector: (row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Change Role">
              <IconButton
                size="small"
                sx={{ color: "secondary.main" }}
                onClick={() => handleChangeRole(row)} // open your ChangeRoleModal
              >
                <ManageAccountsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      });
    }

    // Actions column
    if (["adm", "di", "md", "sadm"].includes(userRole?.role)) {
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
        queryParam={appliedFilters} // only updates when Apply is clicked
        transformData={filterRows}
        onFetchRef={handleFetchRef}
        enableActionsHover={true}
        customHeader={
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {userRole.role === "di" && (
              <ReButton
                label="Add User"
                onClick={() => setOpenCreateUser(true)}
              />
            )}
            {["adm", "sadm"].includes(userRole.role) && (
              <ReButton
                label="Create User"
                onClick={() => setCreateAdmUser(true)}
              />
            )}

            {/* <input
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
            /> */}
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
      {openChangeRole && (
        <ChangeRoleModal
          open={openChangeRole}
          onClose={() => setOpenChangeRole(false)}
          user={selectedUser}
          onSuccess={refreshUsers} // refresh table after API success
        />
      )}
      {openChangeParent && (
        <ChangeParentModal
          open={openChangeParent}
          onClose={handleCloseChangeParent}
          user={selectedUser}
          onSuccess={refreshUsers}
        />
      )}
    </Box>
  );
};

export default Users;
