import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CreateAccount from "./CreateAccount";
import UpdateAccount from "./UpdateAccount";
import DeleteAccount from "./DeleteAccount";
import DescriptionIcon from "@mui/icons-material/Description";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonTable from "../components/common/CommonTable";
import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";
import CommonLoader from "../components/common/CommonLoader";
import AuthContext from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { apiCall } from "../api/apiClient";

const Accounts = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const fetchUsersRef = useRef(null);
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState({}); // applied filter payload
  const [globalLoader, setGlobalLoader] = useState(false);

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };

  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };

  const handleAccountStatement = (row) => {
    navigate(`/admin/accountstatements`, {
      state: {
        account_id: row.id,
        balance: row.balance,
        user_id: row.user_id,
        establishment: row.establishment,
        mobile: row.mobile,
        name:row.name,
      },
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
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

  // ✅ Add new account
  const handleSaveCreate = (newAccount) => {
    setAccounts((prev) => [newAccount, ...prev]);
    setOpenCreate(false);
  };
  const filters = useMemo(
    () => [
      { id: "mobile", label: "Mobile Number", type: "textfield" },
      {
        id: "user_id",
        label: "User ID",
        type: "autocomplete",
        options: userOptions,
        onSearch: (val) => setUserSearch(val),
        getOptionLabel: (option) => option?.label || "",
        isOptionEqualToValue: (option, value) => option.id === value.id, // ✅ this line keeps selection visible
      },
    ],
    [user?.role, userOptions, appliedFilters]
  );
  // ✅ Columns definition
  const columns = [
    { name: "Name", selector: (row) => row.name },
    { name: "ID", selector: (row) => row.id },
    { name: "Establishment", selector: (row) => row.establishment },
    { name: "Mobile", selector: (row) => row.mobile },
    { name: "Credit Limit", selector: (row) => row.credit_limit },
    { name: "Balance", selector: (row) => row.balance },
    {
      name: "Status",
      selector: (row) => <CommonStatus value={row.status} />,
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "120px",
              position: "relative",
              height: 40, // reserve fixed height to prevent fluctuation
            }}
          >
            {/* Icons always rendered, visibility toggled */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                visibility: "visible",
                transition: "visibility 0.2s, opacity 0.2s",
              }}
            >
              <Tooltip title="Account Statement">
                <IconButton
                  color="info"
                  size="small"
                  onClick={() => handleAccountStatement(row)}
                >
                  <DescriptionIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  size="small"
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
                  size="small"
                  onClick={() => {
                    setSelectedAccount(row);
                    setOpenDelete(true);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        );
      },
      width: "120px",
      center: true,
    },
  ];

  const queryParam = "";

  return (
    <>
      <CommonLoader loading={loading} text="Loading Accounts" />

      {!loading && (
        <Box>
          {/* ✅ Table */}
          <CommonTable
            columns={columns}
            loading={loading}
            endpoint={ApiEndpoints.GET_ACCOUNTS}
            onFetchRef={handleFetchRef}
            filters={filters}
            queryParam={appliedFilters} // only updates when Apply is clicked
            customHeader={
                   <Button
                label="Account"
                 onClick={() => setOpenCreate(true)}
                variant="contained"
                size="medium"
                sx={{
                  background: "linear-gradient(135deg, #490277 0%, #6A1B9A 100%)",
                  color: "#FFFFFF",
                  textTransform: "none",
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                  paddingX: 1.8,
                  paddingY: 1,
                  borderRadius: "10px",
                  boxShadow: "0px 4px 12px rgba(73, 2, 119, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5A048F 0%, #7B2BB5 100%)",
                    boxShadow: "0px 6px 16px rgba(73, 2, 119, 0.45)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                    boxShadow: "0px 2px 6px rgba(73, 2, 119, 0.2)",
                  },
                }}
              >
                Add Account
              </Button>
            }
          />

          {/* ✅ Create Account Modal */}
          <CreateAccount
            open={openCreate}
            handleClose={() => setOpenCreate(false)}
            handleSave={handleSaveCreate}
            onFetchRef={refreshUsers} // ✅ trigger fetch after create
            setGlobalLoader={setLoading}
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
