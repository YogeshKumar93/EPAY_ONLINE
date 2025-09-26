import React, { useState, useContext, useRef, useMemo } from "react";
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
import { Delete } from "@mui/icons-material";
import { IconButton } from "rsuite";
import DeleteFundRequestModal from "./DelelteFundReques";
import DeleteFundRequest from "./DelelteFundReques";
import ReceiptButton from "../ReceiptButton";
import EditFundRequest from "./EditFundRequest";

const FundRequest = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const fetchUsersRef = useRef(null);

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

  const columns = useMemo(
    () => [
      {
        name: "Date",
        selector: (row) => (
          <MuiBox display="flex" flexDirection="column">
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
          </MuiBox>
        ),
        width: "140px",
        wrap: true,
      },
      ...(user?.role !== "md" && user?.role !== "di"
        ? [
            {
              name: "ID",
              selector: (row) => row?.id,
              width: "70px",
            },
          ]
        : []),
      ...(user?.role === "adm" || user?.role === "sadm"
        ? [
            {
              name: "Role",
              selector: (row) => (
                <Typography sx={{ fontSize: "10px", fontWeight: 600 }}>
                  {row.role}
                </Typography>
              ),
              width: "100px",
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
        width: "100px",
      },
      {
        name: "Admin Remark",
        selector: (row) => (
          <Tooltip title={row?.admin_remark}>
            <Typography noWrap>{row?.admin_remark || "N/A"}</Typography>
          </Tooltip>
        ),
        grow: 2,
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
      },
      {
        name: "Reciept",
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
            {/* Admin actions */}
            {user?.role === "adm" && (
              <>
                {row.status !== "approved" && row.status !== "rejected" && (
                  <>
                    <Tooltip title="Approve">
                      <CheckCircleIcon
                        fontSize="small"
                        sx={{ color: "green", cursor: "pointer" }}
                        onClick={() =>
                          handleOpenModal("status", row, "approved")
                        }
                      />
                    </Tooltip>
                    <Tooltip title="Reject">
                      <CancelIcon
                        fontSize="small"
                        sx={{ color: "red", cursor: "pointer" }}
                        onClick={() =>
                          handleOpenModal("status", row, "rejected")
                        }
                      />
                    </Tooltip>
                  </>
                )}
                {row.status === "rejected" && (
                  <Tooltip title="Reopen">
                    <Button
                      size="small"
                      color="warning"
                      onClick={() => handleOpenModal("status", row, "reopen")}
                    >
                      <OpenInFullIcon fontSize="small" />
                    </Button>
                  </Tooltip>
                )}
              </>
            )}
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

            {/* ✅ Delete - only if pending */}
            {row.status === "pending" && (
              <Tooltip title="Delete">
                <Delete
                  fontSize="small"
                  sx={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleOpenModal("delete", row)}
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
      {
        id: "status",
        label: "Status",
        type: "dropdown",
        options: [
          { value: "success", label: "Success" },
          { value: "refund", label: "Refund" },
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
        ],
        defaultValue: "pending",
      },
      { id: "date_range", type: "daterange" },
    ],
    []
  );

  return (
    <Box>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_FUND_REQUESTS}
        filters={filters}
        onFetchRef={handleFetchRef}
        enableActionsHover
        customHeader={
          user?.role !== "sadm" &&
          user?.role !== "adm" && (
            <ReButton
              variant="contained"
              label="Request"
              onClick={() => handleOpenModal("create")}
            />
          )
        }
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
