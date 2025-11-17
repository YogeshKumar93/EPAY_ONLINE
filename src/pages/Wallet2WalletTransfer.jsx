import { useMemo, useContext, useState, useEffect, useRef } from "react";
import {
  Tooltip,
  IconButton,
  Box,
  Grid,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import {
  dateToTime,
  dateToTime1,
  ddmmyy,
  ddmmyyWithTime,
} from "../utils/DateUtils";

import CommonStatus from "../components/common/CommonStatus";
import CommonLoader from "../components/common/CommonLoader";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import LaptopIcon from "@mui/icons-material/Laptop";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import W2wTransfer from "./w2wTransfer";
import { android2, linux2, macintosh2, windows2 } from "../iconsImports";
import { apiCall } from "../api/apiClient";
import { useToast } from "../utils/ToastContext";
import ReplayIcon from "@mui/icons-material/Replay";
import { okhttp, postman } from "../utils/iconsImports";
import { debounce } from "lodash";

const Wallet2WalletTransfer = ({}) => {
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
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
   const [userOptions, setUserOptions] = useState([]);
  // User search states
  const [senderSearch, setSenderSearch] = useState("");
  const [receiverSearch, setReceiverSearch] = useState("");
  const [senderOptions, setSenderOptions] = useState([]);
  const [receiverOptions, setReceiverOptions] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});

  const fetchUsersRef = useRef(null);
  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };

  const refreshTransfer = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefundTxn = async (row) => {
    try {
      const payload = { txn_id: row.txn_id };
      const { response } = await apiCall(
        "post",
        ApiEndpoints.REFUND_TXN,
        payload
      );

      if (response?.status) {
        showToast(response.message || "Transaction refunded successfully!");
      } else {
        showToast(response?.error || "Refund failed. Please try again.");
      }
    } catch (error) {
      showToast("Error processing refund transaction.");
      console.error(error);
    }
  };

  // Debounced search for sender
  const debouncedSenderSearch = useRef(
    debounce(async (searchValue) => {
      if (!searchValue || searchValue.trim().length < 4) {
        setSenderOptions([]);
        return;
      }
      try {
        const { response, error } = await apiCall(
          "post",
          ApiEndpoints.GET_USER_DEBOUNCE,
          {
            establishment: searchValue, // ✅ still send ID when searching
          }
        );

        if (!error && response?.data) {
          setSenderOptions(
            response.data.map((u) => ({
              label: u.establishment || u.name || "N/A",
              value: u.id, // ✅ store establishment for filter use
              id: u.id, // keep ID separately for search clarity
            }))
          );
        } else {
          setSenderOptions([]);
        }
      } catch (err) {
        console.error(err);
        setSenderOptions([]);
      }
    }, 500)
  ).current;

  // const handleExportExcel = async () => {
  //   try {
  //     // Fetch all users (without pagination/filters) from API
  //     const { error, response } = await apiCall(
  //       "post",
  //       ApiEndpoints.GET_BBPS_TXN,
  //       { export: 1 }
  //     );
  //     const usersData = response?.data?.data || [];

  //     if (usersData.length > 0) {
  //       json2Excel("BbpsTxns", usersData); // generates and downloads Users.xlsx
  //     } else {
  //       apiErrorToast("no data found");
  //     }
  //   } catch (error) {
  //     console.error("Excel export failed:", error);
  //     alert("Failed to export Excel");
  //   }
  // };

  // Debounced search for receiver
  const debouncedReceiverSearch = useRef(
    debounce(async (searchValue) => {
      if (!searchValue || searchValue.trim().length < 4) {
        setReceiverOptions([]);
        return;
      }
      try {
        const { response, error } = await apiCall(
          "post",
          ApiEndpoints.WALLET_GET_W2W_TRANSACTION,
          {
            establishment: searchValue,
          }
        );

        if (!error && response?.data) {
          setReceiverOptions(
            response.data.map((u) => ({
              label: u.establishment || u.name || "N/A",
              value: u.id,
            }))
          );
        } else {
          setReceiverOptions([]);
        }
      } catch (err) {
        console.error(err);
        setReceiverOptions([]);
      }
    }, 500)
  ).current;

  useEffect(() => {
    debouncedSenderSearch(senderSearch);
  }, [senderSearch]);

  useEffect(() => {
    debouncedReceiverSearch(receiverSearch);
  }, [receiverSearch]);

  // Cleanup debounce on unmount

  const filterRows = (rows) => {
    if (!searchTerm) return rows;
    const lowerSearch = searchTerm.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  };

  const tableEndpoint =
    user?.role === "adm" || user?.role === "sadm"
      ? ApiEndpoints.WALLET_LIST
      : ApiEndpoints.WALLET_GET_W2W_TRANSACTION;

   const filters = useMemo(() => {
    const userRole = user?.role?.toLowerCase?.();

    // ✅ Correct hierarchy order (Top → Bottom)
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

    // ✅ Determine which roles to hide (current + above)
    const hideRoles = (() => {
      const index = hierarchy.indexOf(userRole);
      if (index === -1) return [];
      return hierarchy.slice(0, index + 1);
    })();

    // ✅ Filter dropdown options according to hierarchy
    const roleOptions = Object.entries(roleLabels)
      .filter(([key]) => !hideRoles.includes(key))
      .sort((a, b) => hierarchy.indexOf(a[0]) - hierarchy.indexOf(b[0])) // ensure dropdown order
      .map(([key, value]) => ({
        label: value,
        value: key,
      }));

    return [

      {
        id: "user_id",
        label: "Select User by Role",
        type: "roleuser",
        roles: ["adm", "sadm","di","md","ret","zsm","asm","dd"],
      },
       
      {
        id: "txn_id",
        label: "Txn ID",
        type: "textfield",
        roles: ["adm", "sadm"],
      },
      {
        id: "date_range",
        // label: "Date",
        type: "daterange",
         
      },
    ];
  }, [user?.role, userOptions]);

  const columns = useMemo(
    () => [
      {
        name: "S.No",
        selector: (row) => (
          <div
            style={{ textAlign: "left", fontSize: "14px", fontWeight: "600" }}
          >
            {row.id || "N/A"}
          </div>
        ),
        wrap: true,
        width: "80px",
      },
      {
        name: "Date",
        selector: (row) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Tooltip title={`Created: ${ddmmyyWithTime(row.created_at)}`} arrow>
              <span>
                {ddmmyy(row.created_at)} {dateToTime1(row.created_at)}
              </span>
            </Tooltip>

            <Tooltip title={`Updated: ${ddmmyyWithTime(row.updated_at)}`} arrow>
              <span>
                {ddmmyy(row.updated_at)} {dateToTime1(row.updated_at)}
              </span>
            </Tooltip>
          </div>
        ),
        wrap: true,
        width: "190px",
      },
      ...(user?.role === "adm" || user?.role === "sadm"
        ? [] // ❌ hide for ret and dd
        : [
            {
              name: "Txn ID",
              selector: (row) => (
                <Tooltip title={row.txn_id}>
                  <div style={{ fontWeight: 500, textAlign: "left" }}>
                    {row.txn_id}
                  </div>
                </Tooltip>
              ),
              wrap: true,
              width: "100px",
            },
          ]),
      {
        name: "Pf",
        selector: (row) => {
          let icon;

          if (row.pf.toLowerCase().includes("windows")) {
            icon = (
              <img
                src={windows2}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("android")) {
            icon = (
              <img
                src={android2}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("mac")) {
            icon = (
              <img
                src={macintosh2}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("postman")) {
            icon = (
              <img
                src={postman}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("linux")) {
            icon = (
              <img
                src={linux2}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else if (row.pf.toLowerCase().includes("okhttp")) {
            icon = (
              <img
                src={okhttp}
                style={{ width: "22px" }}
                alt="description of image"
              />
            );
          } else {
            icon = <LaptopIcon sx={{ color: "blue", width: "22px" }} />;
          }

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                textAlign: "justify",
                gap: 2,
              }}
            >
              {icon}
            </Box>
          );
        },
        width: "20px",
        wrap: true,
        left: true,
      },

      ...(user?.role === "adm" || user?.role === "sadm"
        ? [ {
              name: "Sender",
              selector: (row) => (
                <Tooltip title={row.sender_est}>
                  <div style={{ fontWeight: 500, textAlign: "left" }}>
                    {row.sender_est}
                  </div>
                </Tooltip>
              ),
              wrap: true,
              width: "100px",
            },] // ❌ hide for ret and dd
        : [
           
          ]),

        ...(user?.role !== "md"
  ? [
      {
        name: "Receiver",
        selector: (row) => (
          <div style={{ textAlign: "left", fontSize: "14px", fontWeight: "600" }}>
            {row.receiver_est || "N/A"}
          </div>
        ),
        wrap: true,
        width: "80px",
      },
    ]
  : []
),

      {
        name: "Service",
        selector: (row) => (
          <div
            style={{ textAlign: "left", fontSize: "14px", fontWeight: "600" }}
          >
            {row.operator || "N/A"}
          </div>
        ),
        wrap: true,
        width: "80px",
      },
      ...(user?.role === "ret" ||
      user?.role === "dd" ||
      user?.role === "di" ||
      user?.role === "md"
        ? [] // ❌ hide for ret and dd
        : [
            {
              name: "TxnId",
              selector: (row) => (
                <>
                  <div style={{ textAlign: "left", fontSize: "13px" }}>
                    {row.txn_id}
                  </div>
                </>
              ),
              wrap: true,
              width: "100px",
            },
            {
              name: "Client Ref",
              selector: (row) => (
                <>
                  <div style={{ textAlign: "left", fontSize: "13px" }}>
                    {row.client_ref}
                  </div>
                </>
              ),
              wrap: true,
              width: "100px",
            },
          ]),

      {
        name: "Amount",
        selector: (row) => {
          const loggedInUserId = user.id || user.id;
          let isDebit = row.user_id === loggedInUserId;
          let isCredit = row.receiver_id === loggedInUserId;

          let color = isCredit ? "green" : isDebit ? "red" : "black";
          let sign = isCredit ? "+" : isDebit ? "-" : "";

          return (
            <div style={{ color: color, fontWeight: 600 }}>
              {sign} ₹ {parseFloat(row.amount).toFixed(2)}
            </div>
          );
        },
        wrap: true,
        width: "80px",
      },

      {
        name: "Remarks",
        selector: (row) => {
          const text = row.remark || "N/A";
          const displayText =
            text.length > 10 ? `${text.slice(0, 10)}...` : text;

          return (
            <Tooltip title={text}>
              <div>{displayText}</div>
            </Tooltip>
          );
        },
        center: true,
        width: "70px",
      },

      {
        name: "Charge",
        selector: (row) => <div>₹ {parseFloat(row.charge).toFixed(2)}</div>,
        center: true,
        width: "80px",
      },
      {
        name: "GST",
        selector: (row) => <div>{row.gst}</div>,
        center: true,
        width: "60px",
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
        width: "90px",
      },
      ...(user?.role === "ret"
        ? [
            {
              name: "view",
              selector: (row) => (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "80px",
                    }}
                  >
                    <Tooltip title="Print W2W">
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => {
                          // Save individual transaction data
                          sessionStorage.setItem(
                            "txnData",
                            JSON.stringify(row)
                          );

                          // Open receipt page in a new tab
                          window.open("/print-w2w", "_blank");
                        }}
                        sx={{ backgroundColor: "transparent" }}
                      >
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              ),
              width: "100px",
              center: true,
            },
          ]
        : []),
      ...(user?.role === "ret" || user?.role === "dd"
        ? [
            {
              name: "Actions",
              selector: (row) => (
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    display: "flex",
                    gap: "4px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {row?.status === "REFUNDPENDING" && (
                    <Tooltip title="REFUND TXN">
                      <ReplayIcon
                        sx={{
                          color: "orange",
                          fontSize: 25,
                          cursor: "pointer",
                        }}
                        onClick={() => handleRefundTxn(row)}
                      />
                    </Tooltip>
                  )}
                </div>
              ),
              center: true,
              width: "70px",
            },
          ]
        : []),
    ],
    [user]
  );
  const columnsWithSelection = useMemo(() => {
    // Only show checkbox if user is NOT adm or sadm
    if (user?.role === "adm" || user?.role === "sadm") {
      return columns; // no selection column
    }
    return [
      {
        name: "",
        selector: (row) => (
          <input
            type="checkbox"
            checked={selectedRows.some((r) => r.id === row.id)}
            disabled={row.status?.toLowerCase() === "failed"}
            onChange={() => {
              const isSelected = selectedRows.some((r) => r.id === row.id);
              const newSelectedRows = isSelected
                ? selectedRows.filter((r) => r.id !== row.id)
                : [...selectedRows, row];
              setSelectedRows(newSelectedRows);
            }}
          />
        ),
        width: "40px",
      },
      ...columns,
    ];
  }, [selectedRows, columns]);

  return (
    <Box>
      {loading ? (
        <CommonLoader loading={loading} text="Loading Wallet Transfers" />
      ) : (
        <CommonTable
          onFetchRef={handleFetchRef}
          columns={columnsWithSelection}
          endpoint={tableEndpoint}
          filters={filters}
          transformData={filterRows}
          queryParam={{ ...appliedFilters, service: "W2W transfer" }}
          refresh={true}
          includeClientRef={false}
          enableSelection={false}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          enableExcelExport={true}
          exportFileName="W2WTransactions"
          exportEndpoint={tableEndpoint}
          exportPayload={{ ...appliedFilters, service: "W2W transfer" }} // ✅ add this line
          customHeader={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "8px",
              }}
            >
              {selectedRows.length > 0 && (
                <Tooltip title="Print ">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      if (!selectedRows || selectedRows.length === 0) {
                        alert(
                          "Please select at least one transaction to print."
                        );
                        return;
                      }
                      sessionStorage.setItem(
                        "txnData",
                        JSON.stringify(selectedRows)
                      );
                      window.open("/print-w2w", "_blank");
                    }}
                    sx={{ ml: 1 }}
                  >
                    <PrintIcon sx={{ fontSize: 22, color: "#fff", mr: 1 }} />
                    Print
                  </Button>
                </Tooltip>
              )}
            </Box>
          }
        />
      )}
    </Box>
  );
};

export default Wallet2WalletTransfer;
