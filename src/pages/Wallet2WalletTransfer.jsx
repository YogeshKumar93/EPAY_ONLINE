import { useMemo, useContext, useState, useEffect, useRef } from "react";
import {
  Tooltip,
  IconButton,
  Box,
  Grid,
  Typography,
  Paper,
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
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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
            id: searchValue, // ✅ send ID instead of search text
          }
        );

        if (!error && response?.data) {
          setSenderOptions(
            response.data.map((u) => ({
              label: u.establishment || u.name || "N/A",
              value: u.id, // this is the id
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
          ApiEndpoints.GET_USER_DEBOUNCE,
          {
            id: searchValue, // ✅ send ID instead of search text
          }
        );

        if (!error && response?.data) {
          setReceiverOptions(
            response.data.map((u) => ({
              label: u.establishment || u.name || "N/A",
              value: u.id, // this is the id
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
  }, [senderSearch, debouncedSenderSearch]);

  useEffect(() => {
    debouncedReceiverSearch(receiverSearch);
  }, [receiverSearch, debouncedReceiverSearch]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSenderSearch.cancel();
      debouncedReceiverSearch.cancel();
    };
  }, [debouncedSenderSearch, debouncedReceiverSearch]);

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

  const filters = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        type: "dropdown",
        options: [
          { value: "success", label: "Success" },
          { value: "failed", label: "Failed" },
          { value: "refund", label: "Refund" },
          { value: "pending", label: "Pending" },
        ],
        defaultValue: "pending",
        roles: ["adm", "sadm"],
      },
      {
        id: "sender_id",
        label: "Sender",
        type: "autocomplete",
        options: senderOptions,
        onSearch: (val) => setSenderSearch(val),
        getOptionLabel: (option) => option.label || "N/A",
        onChange: (selected) => {
          setAppliedFilters((prev) => ({
            ...prev,
            sender_id: selected?.value || null, // ✅ send ID to table query
          }));
        },
      },
      {
        id: "receiver_id",
        label: "Receiver",
        type: "autocomplete",
        options: receiverOptions,
        onSearch: (val) => setReceiverSearch(val),
        getOptionLabel: (option) => option.label || "N/A",
        onChange: (selected) => {
          setAppliedFilters((prev) => ({
            ...prev,
            receiver_id: selected?.value || null, // ✅ send ID to table query
          }));
        },
      },

      {
        id: "txn_id",
        label: "Txn ID",
        type: "textfield",
        roles: ["adm", "sadm"],
      },
    ],
    [senderOptions, receiverOptions, appliedFilters]
  );

  const columns = useMemo(
    () => [
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
      {
        name: "Sender",
        selector: (row) => (
          <div
            style={{ textAlign: "left", fontSize: "14px", fontWeight: "600" }}
          >
            {row.sender_est || "N/A"}
          </div>
        ),
        wrap: true,
        width: "80px",
      },
      {
        name: "Reciever",
        selector: (row) => (
          <div
            style={{ textAlign: "left", fontSize: "14px", fontWeight: "600" }}
          >
            {row.receiver_est || "N/A"}
          </div>
        ),
        wrap: true,
        width: "80px",
      },
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
                        onClick={() =>
                          navigate("/print-w2w", { state: { txnData: row } })
                        }
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

  return (
    <Box>
      <Box
        sx={{
          flex: 1,
          borderRadius: 3,
          display: "flex",
        }}
      ></Box>

      <Box sx={{}}>
        {loading ? (
          <CommonLoader loading={loading} text="Loading Wallet Transfers" />
        ) : (
          <CommonTable
            onFetchRef={handleFetchRef}
            columns={columns}
            endpoint={tableEndpoint}
            filters={filters}
            transformData={filterRows}
            queryParam={{ ...appliedFilters, service: "W2W transfer" }}
            refresh={true}
            includeClientRef={false}
          />
        )}
      </Box>
    </Box>
  );
};

export default Wallet2WalletTransfer;
