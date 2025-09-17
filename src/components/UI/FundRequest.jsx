import { useMemo, useState, useContext, useEffect, useRef } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import { currencySetter } from "../../utils/Currencyutil";
import {
  dateToTime,
  dateToTime1,
  ddmmyy,
  ddmmyyWithTime,
} from "../../utils/DateUtils";
import AddIcon from "@mui/icons-material/Add";
import CreateFundRequest from "../../pages/CreateFundRequest";

import FundRequestModal from "../../pages/FundRequestModal";
import AuthContext from "../../contexts/AuthContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReButton from "../common/ReButton";
import CommonStatus from "../common/CommonStatus";
import CommonLoader from "../common/CommonLoader";

const FundRequest = () => {
  const [openCreate, setOpenCreate] = useState(false);
  // const [selectedFund, setSelectedFund] = useState(null);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [selectedRow, setSelectedRow] = useState(null);
  const [status, setStatus] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true); // initially true

  const fetchUsersRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };
  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // stop loader after data is ready
    }, 1000); // 1 second delay just as an example

    return () => clearTimeout(timer);
  }, []);

  const handleOpen = (row, statusType) => {
    setSelectedRow(row);
    setStatus(statusType);
    setOpenModal(true);
  };

  // ✅ After create
  const handleSaveCreate = () => {
    setOpenCreate(false);
  };

  // ✅ After update
  // const handleSaveUpdate = () => {
  //   setOpenUpdate(false);
  // };

  // ✅ Handle edit
  // const handleEdit = (row) => {
  //   setSelectedFund(row);
  //   setOpenUpdate(true);
  // };

  // ✅ Columns
  const columns = useMemo(() => [
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
      width: "140px",
    },
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => <Typography>{row?.name}</Typography>,
      wrap: true,
    },
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

    // {
    //   name: "Ledger Balance",
    //   selector: (row) => (
    //     <Typography>
    //       {currencySetter(parseFloat(row?.ledger_bal).toFixed(2))}
    //     </Typography>
    //   ),
    // },
    // {
    //   name: "Txn ID",
    //   selector: (row) => row?.txn_id,
    // },
    {
      name: "Amount",
      selector: (row) => (
        <Typography sx={{ fontWeight: "bold" }}>
          {currencySetter(parseFloat(row?.amount).toFixed(2))}
        </Typography>
      ),
    },
    {
      name: "Remark",
      selector: (row) => (
        <Tooltip title={row?.remark}>
          <Typography noWrap>{row?.remark}</Typography>
        </Tooltip>
      ),
      grow: 2,
    },
    {
      name: "Status",
      selector: (row) => <CommonStatus value={row.status} />,
      center: true,
    },

    ...(user?.role === "adm"
      ? [
          {
            name: "Actions",
            selector: (row, { hoveredRow, enableActionsHover }) => {
              const isHovered = enableActionsHover && hoveredRow === row.id;

              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    width: "120px", // fixed width
                  }}
                >
                  {isHovered ? (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Approve">
                        <Button size="small" color="success">
                          <CheckCircleIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <Button size="small" color="error">
                          <CancelIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "#999", textAlign: "center", width: "100%" }}
                    >
                      -
                    </Typography>
                  )}
                </Box>
              );
            },
            width: "120px",
          },
        ]
      : []),              
  ]);

  // ✅ Filters
  const filters = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        type: "dropdown",
        options: [
          // { value: "all", label: "All" },
          { value: "success", label: "Success" },
          // { value: "failed", label: "Failed" },
          { value: "refund", label: "Refund" },
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
        ],
        defaultValue: "pending",
      },
      // { id: "name", label: "Name", type: "textfield" },
      // { id: "bank_name", label: "Bank Name", type: "textfield" },
      // { id: "txn_id", label: "Txn ID", type: "textfield" },
    ],
    []
  );

  return (
    <>
      <CommonLoader loading={loading} text="Loading Fund Requests" />

      {!loading && (
        <Box>
          {/* ✅ Table */}
          <CommonTable
            columns={columns}
            endpoint={ApiEndpoints.GET_FUND_REQUESTS}
            filters={filters}
            onFetchRef={handleFetchRef}
            enableActionsHover={true}
            customHeader={
              user?.role !== "sadm" &&
              user?.role !== "adm" && (
                <ReButton
                  variant="contained"
                  label="Request"
                  onClick={() => setOpenCreate(true)}
                />
              )
            }
          />

          {/* ✅ Create Fund Request Modal */}
          <CreateFundRequest
            open={openCreate}
            handleClose={() => setOpenCreate(false)}
            handleSave={handleSaveCreate}
            onFetchRef={refreshUsers}
          />

          {/* Render modal outside table */}
          {openModal && (
            <FundRequestModal
              open={openModal}
              handleClose={() => setOpenModal(false)}
              row={selectedRow}
              status={status}
              onFetchRef={refreshUsers}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default FundRequest;
