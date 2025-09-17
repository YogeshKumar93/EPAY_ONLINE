import React from "react";
import { useMemo, useContext, useState, useEffect, useRef } from "react";
import { Tooltip, IconButton, Box,Button, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../utils/DateUtils";
import CreateBankModal from "../components/Bank/CreateBanks";
import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";
import CommonLoader from "../components/common/CommonLoader";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateBanks from "../components/Bank/UpdateBanks";
import DeleteBank from "./DeleteBank";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import UpdateComplaint from "../components/UpdateComplains";
const Complaint = ({ filters = [] }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchComplaintsRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchComplaintsRef.current = fetchFn;
  };

  const refreshComplaints = () => {
    if (fetchComplaintsRef.current) {
      fetchComplaintsRef.current();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ role-based filters
  const finalFilters = useMemo(() => {
    if (user?.username === "sadm" || user?.username === "adm") return filters;
    return [...filters, { field: "user_id", operator: "=", value: user?.id }];
  }, [filters, user]);


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
        width: "160px",
        wrap: true,
      },
      { name: "Txn ID", selector: (row) => row.txnId, wrap: true },
      {
        name: "Establishment",
        selector: (row) => row.establishment,
        wrap: true,
      },
      { name: "Operator", selector: (row) => row.operator, wrap: true },
      { name: "Route", selector: (row) => row.route, wrap: true },
      {
        name: "Number",
        selector: (row) => (
          <Tooltip title={row.number}>
            <div>****{row.number.toString().slice(-4)}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Amount",
        selector: (row) => (
          <div style={{ color: "green", fontWeight: "600" }}>
            ₹ {parseFloat(row.amount).toFixed(2)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Txn Status",
        selector: (row) => <CommonStatus value={row.txn_status} />,
        center: true,
      },
      {
        name: "Complaint Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
      },
       {
      name: "Actions",
      selector: (row, { hoveredRow, enableActionsHover }) => {
        const isHovered = hoveredRow === row.id || !enableActionsHover;

        return (
          <Box sx={{ display: "flex", justifyContent: "center", minWidth: "100px" }}>
            {isHovered ? (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSelectedRow(row);
                  setOpenUpdate(true);
                }}
              >
                Update
              </Button>
            ) : (
              <Typography variant="body2" sx={{ color: "#999", textAlign: "center" }}>
                -
              </Typography>
            )}
          </Box>
        );
      },
      center: true,
      width: "100px",
    },
    ],
    []
  );

  return (
    <>
      <CommonLoader loading={loading} text="Loading Complaints" />

      {!loading && (
        <>
          <CommonTable
            onFetchRef={handleFetchRef}
            columns={columns}
            endpoint={ApiEndpoints.GET_COMPLAINS}
            filters={finalFilters} // ✅ role-based filters
            queryParam=""
            customHeader={
              <ReButton
                label="New Complaint"
                onClick={() => setOpenCreate(true)}
              />
            }
          />

          {/* ✅ Update Modal */}
          <UpdateComplaint
            open={openUpdate}
            onClose={() => setOpenUpdate(false)}
            complaintId={selectedRow?.id}
            onSuccess={refreshComplaints} // refresh table after update
          />
        </>
      )}
    </>
  );
};

export default Complaint;
