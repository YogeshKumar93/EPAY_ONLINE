import React, { memo, useEffect, useState, useContext } from "react";
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";

export const RoleUserFilter = memo(
  ({ filter, value, onChange, onRoleSelect }) => {
    const [role, setRole] = useState("");
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const authCtx = useContext(AuthContext);
    const userRole = authCtx?.user?.role;

    // Available role full name
    const roleFullNameMap = {
      sadm: "Super Admin",
      adm: "Admin",
      zsm: "Zonal Sales Manager",
      asm: "Area Sales Manager",
      md: "Master Distributor",
      di: "Distributor",
      ret: "Retailer",
      dd: "Direct Dealer",
      api: "API User",
    };

    // Role hierarchy
    const hierarchy = {
      sadm: ["sadm", "adm", "zsm", "asm", "md", "di", "ret", "dd", "api"],
      adm: ["adm", "zsm", "asm", "md", "di", "ret", "dd", "api"],
      zsm: ["asm", "md", "di", "ret", "dd"],
      asm: ["md", "di", "ret", "dd"],
      md: ["di", "ret"],
      di: ["ret"],
      ret: [],
      dd: [],
      api: [],
    };

    const availableRoles = hierarchy[userRole] || [];

    // 🔥 RESET when parent resets appliedFilters
    useEffect(() => {
      if (!value) {
        setRole("");
        setSelectedUser(null);
        setUserList([]);
      }
    }, [value]);

    // 🔥 Fetch users based on role
    useEffect(() => {
      if (!role) {
        setUserList([]);
        setSelectedUser(null);
        return;
      }

      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const { response } = await apiCall("POST", ApiEndpoints.GET_USERS, {
            role,
            export: 1,
          });

          const users = response?.data?.data || response?.data || [];
          setUserList(users);
        } catch (err) {
          console.error("Error fetching users:", err);
        } finally {
          setLoadingUsers(false);
        }
      };

      fetchUsers();
    }, [role]);

    const handleRoleChange = (e) => {
      const newRole = e.target.value;
      setRole(newRole);
      setSelectedUser(null);
      setUserList([]);

      if (onRoleSelect) onRoleSelect(!!newRole);
    };

    const handleUserChange = (event, newValue) => {
      setSelectedUser(newValue);

      // Always update filter id normally
      // if (onChange) {
      //   onChange(filter.id, newValue?.id || "");
      // }

     // When selecting value in filter
if (["sadm", "adm", "asm", "zsm", "dd"].includes(role)) {
  // 👉 Send ONLY user_id
  onChange("user_id", newValue?.id || "");

  // ❌ Clear receiver_id so it's not sent
  onChange("receiver_id", "");
} 
else if (["md", "di", "ret"].includes(role)) {
  // 👉 Send ONLY receiver_id
  onChange("receiver_id", newValue?.id || "");

  // ❌ Clear user_id so it's not sent
  onChange("user_id", "");
}
else {
  // 👉 For all other roles, clear both
  onChange("user_id", "");
  onChange("receiver_id", "");
}

    };

    if (availableRoles.length === 0) return null;

    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
        {/* 🔹 ROLE Selection */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>User By Role</InputLabel>
          <Select value={role} label="User By Role" onChange={handleRoleChange}>
            {availableRoles.map((r) => (
              <MenuItem key={r} value={r}>
                {roleFullNameMap[r]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 🔹 USER Selection */}
        {role && (
          <Autocomplete
            size="small"
            sx={{ width: 350 }}
            options={userList}
            value={selectedUser}
            onChange={handleUserChange}
            loading={loadingUsers}
            getOptionLabel={(option) =>
              `${option.establishment || "Unknown"} - (P2PAE${
                option?.id || ""
              })`
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText={loadingUsers ? "Loading..." : "No users found"}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select User"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingUsers && (
                        <CircularProgress color="inherit" size={20} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <MenuItem {...props} key={option.id}>
                {option.establishment || "Unknown"} - (P2PAE{option.id})
              </MenuItem>
            )}
          />
        )}
      </Box>
    );
  }
);
