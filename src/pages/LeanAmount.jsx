import { useMemo, useContext, useState, useEffect, useRef } from "react";
import { Tooltip, IconButton, Box, Typography } from "@mui/material";
import { Edit, RemoveCircleOutline } from "@mui/icons-material";
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
import DeleteRiskAccount from "../components/Risks/DeleteRiskAccount";
import CommonDeleteModal from "../components/CommonDeleteModal";
import CancelIcon from "@mui/icons-material/Cancel";

const LeanAmount = ({ filters = [] }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null); // for delete
  const [loading, setLoading] = useState(true);

  const fetchBanksRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchBanksRef.current = fetchFn;
  };

  const refreshBanks = () => {
    fetchBanksRef.current?.();
  };

  const handleDelete = (row) => {
    setSelectedBank(row);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getColumns = (user, handleDelete) => {
    // Base columns visible to all users
    const baseColumns = [
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
        name: "Txn ID",
        selector: (row) => <div style={{ fontWeight: 500 }}>{row.txn_id}</div>,
        wrap: true,
      },
      {
        name: "Given Txn ID",
        selector: (row) => <div>{row.given_txn_id || "N/A"}</div>,
        wrap: true,
      },
      {
        name: "Marked By",
        selector: (row) => <div>{row.marked_by}</div>,
        wrap: true,
      },
      {
        name: "User ID",
        selector: (row) => <div>{row.user_id}</div>,
        center: true,
      },
      {
        name: "Client Ref",
        selector: (row) => <div>{row.client_ref || "N/A"}</div>,
        wrap: true,
      },
      {
        name: "Amount",
        selector: (row) => (
          <div style={{ color: "green", fontWeight: 600 }}>
            ₹ {parseFloat(row.amount).toFixed(2)}
          </div>
        ),
        right: true,
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
      },
      {
        name: "Remarks",
        selector: (row) => <div>{row.remark || "-"}</div>,
        wrap: true,
      },
    ];

    // Actions column: only for adm or sadm
    if (["adm", "sadm"].includes(user?.role)) {
      baseColumns.push({
        name: "Actions",
        selector: (row) => (
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            <Tooltip title="Remove">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(row)}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
        center: true,
        width: "150px",
      });
    }

    return baseColumns;
  };

  // Usage in your component
  const columns = useMemo(() => getColumns(user, handleDelete), [user]);
  return (
    <>
      <CommonLoader loading={loading} text="Loading Banks" />

      {!loading && (
        <>
          <CommonTable
            onFetchRef={handleFetchRef}
            columns={columns}
            endpoint={ApiEndpoints.GET_LEIN}
            filters={filters}
          />

          {/* Common Delete Modal */}
          {selectedBank && (
            <CommonDeleteModal
              open={!!selectedBank}
              handleClose={() => setSelectedBank(null)}
              selectedRow={selectedBank}
              onFetchRef={refreshBanks}
              endpoint={ApiEndpoints.REMOVE_LEIN}
              field="txn_id"
              payloadField="id"
              enableRemark={true} // 🔑 Remark input enabled
            />
          )}
        </>
      )}
    </>
  );
};

export default LeanAmount;
