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

const FundRequest = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const fetchUsersRef = useRef(null); // ref to call table fetch

  const [openCreate, setOpenCreate] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [status, setStatus] = useState("");

  // Expose CommonTable fetch function
  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };

  const refreshUsers = () => {
    if (fetchUsersRef.current) fetchUsersRef.current();
  };

  // Open approve/reject/reopen modal
  const handleOpen = (row, statusType) => {
    setSelectedRow(row);
    setStatus(statusType);
    setOpenModal(true);
  };

  // After creating a fund request
  const handleSaveCreate = () => {
    setOpenCreate(false);
    refreshUsers(); // refresh table
  };

  // Table columns
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
      { name: "ID", selector: (row) => row?.id, width: "70px" },
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
      {
        name: "Actions",
        selector: (row, { hoveredRow, enableActionsHover }) => {
          if (user?.role !== "adm") return null;

          const isHovered = enableActionsHover && hoveredRow === row.id;
          return (
            <MuiBox
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
              width="120px"
            >
              {isHovered &&
                row.status !== "approved" &&
                row.status !== "rejected" && (
                  <MuiBox display="flex" gap={1}>
                    <Tooltip title="Approve">
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleOpen(row, "approved")}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleOpen(row, "rejected")}
                      >
                        <CancelIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                  </MuiBox>
                )}
              {isHovered && row.status === "rejected" && (
                <Tooltip title="Reopen">
                  <Button
                    size="small"
                    color="warning"
                    onClick={() => handleOpen(row, "reopen")}
                  >
                    <OpenInFullIcon fontSize="small" />
                  </Button>
                </Tooltip>
              )}
              {!isHovered && (
                <Typography variant="body2" sx={{ color: "#999" }}>
                  -
                </Typography>
              )}
            </MuiBox>
          );
        },
        width: "120px",
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
    ],
    []
  );

  return (
    <Box>
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_FUND_REQUESTS}
        filters={filters}
        onFetchRef={handleFetchRef} // ✅ pass fetchData to parent
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

      {/* Create Fund Request */}
      <CreateFundRequest
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        handleSave={handleSaveCreate}
        onFetchRef={refreshUsers}
      />

      {/* Approve / Reject / Reopen modal */}
      {openModal && (
        <FundRequestModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          row={selectedRow}
          status={status}
          onFetchRef={refreshUsers} // refresh table after modal action
        />
      )}
    </Box>
  );
};

export default FundRequest;
