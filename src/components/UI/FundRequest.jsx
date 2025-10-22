import React, { useState, useContext, useRef, useMemo, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import CreateFundRequest from "../../pages/CreateFundRequest";
import FundRequestModal from "../../pages/FundRequestModal";
import AuthContext from "../../contexts/AuthContext";
import ReButton from "../common/ReButton";
import CommonStatus from "../common/CommonStatus";
import { ddmmyy, ddmmyyWithTime, dateToTime1 } from "../../utils/DateUtils";
import { currencySetter } from "../../utils/Currencyutil";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Tooltip, Button, Box as MuiBox } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"; // ✅ import icon from MUI
import EditFundRequest from "./EditFundRequest";
import { Delete } from "@mui/icons-material";
import { IconButton } from "rsuite";
import ReceiptButton from "../ReceiptButton";
import DeleteFundRequestModal from "./DelelteFundReques";
import DeleteFundRequest from "./DelelteFundReques";
import { debounce } from "lodash";
import { apiCall } from "../../api/apiClient";

const FundRequest = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [activeTab, setActiveTab] = useState("pending"); // default
  const [userSearch, setUserSearch] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const fetchUsersRef = useRef(null);
  const [appliedFilters, setAppliedFilters] = useState({}); // applied filter payload

  // ✅ Single modal state
  const [modal, setModal] = useState({ type: null, row: null, status: null });

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };

  const refreshUsers = () => {
    if (fetchUsersRef.current) fetchUsersRef.current();
  };

  const handleOpenModal = (type, row = null, status = null) => {
    setModal({ type, row, status });
  };

  const handleCloseModal = () => {
    setModal({ type: null, row: null, status: null });
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
        if (!error && response?.data) {
          setUserOptions(
            response.data.map((u) => ({
              label: u.establishment,
              value: u.id, // ✅ This is the id
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

  // Simple number to words converter (for up to crores)
  const numberToWords = (num) => {
    if (!num || isNaN(num)) return "";
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " and " + inWords(n % 100) : "")
        );
      if (n < 100000)
        return (
          inWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + inWords(n % 1000) : "")
        );
      if (n < 10000000)
        return (
          inWords(Math.floor(n / 100000)) +
          " Lakh" +
          (n % 100000 ? " " + inWords(n % 100000) : "")
        );
      return (
        inWords(Math.floor(n / 10000000)) +
        " Crore" +
        (n % 10000000 ? " " + inWords(n % 10000000) : "")
      );
    };

    return inWords(Math.floor(num));
  };

  const columns = useMemo(
    () => [
      {
        name: "Date",
        selector: (row) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Tooltip title={`Created: ${ddmmyyWithTime(row.created_at)}`} arrow>
              <div style={{ display: "inline-flex", gap: 4 }}>
                <span>{ddmmyy(row.created_at)}</span>
                <span>{dateToTime1(row.created_at)}</span>
              </div>
            </Tooltip>
            <Tooltip title={`Updated: ${dateToTime1(row.updated_at)}`} arrow>
              <span style={{ marginTop: "8px" }}>
                {ddmmyy(row.updated_at)}
                {dateToTime1(row.updated_at)}
              </span>
            </Tooltip>
          </div>
        ),
        wrap: true,
        width: "80px",
      },
      // ...(user?.role !== "md" && user?.role !== "di"
      //   ? [
      //       {
      //         name: "ID",
      //         selector: (row) => row?.id,
      //         width: "70px",
      //       },
      //     ]
      //   : []),
      ...(user?.role === "adm" || user?.role === "sadm"
        ? [
            {
              name: "Role",
              selector: (row) => {
                const getReadableRole = (role) => {
                  switch (role) {
                    case "ret":
                      return "Retailer";
                    case "dd":
                      return "Direct Dealer";
                    case "di":
                      return "Distributor";
                    case "adm":
                      return "Admin";
                    case "sadm":
                      return "Super Admin";
                    case "md":
                      return "Master Distributor";
                    case "zsm":
                      return "Zonal Sales Manager";
                    case "asm":
                      return "Area Sales Manager";
                    default:
                      return role || "N/A";
                  }
                };

                return <Typography>{getReadableRole(row.role)}</Typography>;
              },
              width: "120px",
              wrap: true,
            },
          ]
        : []),

      ...(user?.role === "adm" || user?.role === "sadm"
        ? [
            {
              name: "Name",
              selector: (row) => <Typography>{row?.name}</Typography>,
              wrap: true,
            },
          ]
        : []),

      {
        name: "Bank",
        selector: (row) => <Typography>{row?.bank_name}</Typography>,
        wrap: true,
      },
      {
        name: "Account / Mode",
        selector: (row) => <Typography>{row?.mode}</Typography>,
        wrap: true,
      },
      {
        name: "Bank Ref ID",
        selector: (row) => <Typography>{row?.bank_ref_id}</Typography>,
        wrap: true,
      },
      {
        name: "Amount",
        selector: (row) => {
          const num = parseFloat(row?.amount);
          const formattedAmount = currencySetter(num.toFixed(2));
          const amountInWords = numberToWords(num);

          return (
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography sx={{ fontWeight: "bold" }}>
                {formattedAmount}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontStyle: "italic",
                  fontSize: "9px",
                  fontWeight: 600,
                }}
              >
                {amountInWords ? `${amountInWords} only` : ""}
              </Typography>
            </Box>
          );
        },
        width: "200px", // ✅ Increased width for better layout
      },
      {
        name: "Remark",
        selector: (row) => (
          <Tooltip title={row?.remark}>
            <Typography Wrap>{row?.remark}</Typography>
          </Tooltip>
          
        ),
       grow:1,
      },
      {
        name: "Admin Remark",
        selector: (row) => (
          <Tooltip title={row?.admin_remark}>
            <Typography Wrap>{row?.admin_remark || "N/A"}</Typography>
          </Tooltip>
        ),
      grow:1,
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
      },
      {
        name: "Receipt",
        selector: (row) => <ReceiptButton row={row} />,
        center: true,
      },

      {
        name: "Actions",
        selector: (row) => (
          <MuiBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            width="150px"
          >
            {/* ✅ Edit - only if pending */}
            {row.status === "pending" && (
              <Tooltip title="Edit">
                <EditIcon
                  fontSize="small"
                  sx={{ color: "blue", cursor: "pointer" }}
                  onClick={() => handleOpenModal("edit", row)}
                />
              </Tooltip>
            )}

            {row.status === "pending" && (
              <Tooltip title="Delete">
                <Delete
                  fontSize="small"
                  sx={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleOpenModal("delete", row)}
                />
              </Tooltip>
            )}

            {/* Admin actions */}
            {(user?.role === "adm" || user?.role === "sadm") &&
              row.status !== "approved" &&
              row.status !== "rejected" && (
                <MuiBox display="flex" gap={2}>
                  <Tooltip title="Approve">
                    <CheckCircleIcon
                      fontSize="small"
                      color="success"
                      onClick={() => handleOpenModal("status", row, "approved")}
                      style={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                  <Tooltip title="Reject">
                    <CancelIcon
                      fontSize="small"
                      color="error"
                      onClick={() => handleOpenModal("status", row, "rejected")}
                      style={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                </MuiBox>
              )}

            {row.status === "rejected" &&
              !["adm", "sadm"].includes(user?.role) && (
                <Tooltip title="Reopen">
                  <OpenInFullIcon
                    fontSize="small"
                    color="warning"
                    onClick={() => handleOpenModal("status", row, "reopen")}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
              )}
          </MuiBox>
        ),
        width: "150px",
      },
    ],
    [user]
  );

  // Filters
  const filters = useMemo(
    () => [
      // {
      //   id: "status",
      //   label: "Status",
      //   type: "dropdown",
      //   options: [
      //     // { value: "success", label: "Success" },
      //     // { value: "refund", label: "Refund" },
      //     { value: "pending", label: "Pending" },
      //     { value: "approved", label: "Approved" },
      //     { value: "rejected", label: "Rejected" },
      //   ],
      //   defaultValue: "pending",
      // },
      {
        id: "user_id",
        label: "User",
        type: "autocomplete",
        options: userOptions,
        onSearch: (val) => setUserSearch(val),
        getOptionLabel: (option) => option.label,
        // Remove valueKey and handle the value extraction in handleFilterChange
      },
      { id: "date_range", type: "daterange" },
    ],
    [user?.role, userOptions, appliedFilters]
  );

  return (
    <Box>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_FUND_REQUESTS}
        filters={filters}
        queryParam={{ status: activeTab }} // send current tab
        onFetchRef={handleFetchRef}
        enableActionsHover
        customHeader={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Left: Tab buttons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {["all", "pending", "approved", "rejected"].map((status) => (
                <Button
                  key={status}
                  variant={activeTab === status ? "contained" : "outlined"}
                  color={activeTab === status ? "primary" : "inherit"}
                  onClick={() => setActiveTab(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </Box>

            {/* Right: Create button */}
            {user?.role !== "sadm" && user?.role !== "adm" && (
              <ReButton
                variant="contained"
                label="Request"
                onClick={() => handleOpenModal("create")}
              />
            )}
          </Box>
        }
        extraFilters={{ status: activeTab }}
      />

      {/* ✅ Centralised modal rendering */}
      {modal.type === "create" && (
        <CreateFundRequest
          open
          handleClose={handleCloseModal}
          handleSave={refreshUsers}
        />
      )}

      {modal.type === "edit" && (
        <EditFundRequest
          open
          handleClose={handleCloseModal}
          row={modal.row}
          onFetchRef={refreshUsers}
        />
      )}

      {modal.type === "delete" && (
        <DeleteFundRequest
          open
          handleClose={handleCloseModal}
          row={modal.row}
          onFetchRef={refreshUsers}
        />
      )}

      {modal.type === "status" && (
        <FundRequestModal
          open
          handleClose={handleCloseModal}
          row={modal.row}
          status={modal.status}
          onFetchRef={refreshUsers}
        />
      )}
    </Box>
  );
};

export default FundRequest;
