import { useMemo, useContext, useState, useEffect, useRef } from "react";
import { Tooltip, IconButton, Box, Typography, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../utils/DateUtils";
import CreateBankModal from "../components/Bank/CreateBanks";
// import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";

import DeleteIcon from "@mui/icons-material/Delete";
import UpdateBanks from "../components/Bank/UpdateBanks";
import DeleteBank from "./DeleteBank";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import CommonLoader from "../components/common/CommonLoader";

const Banks = ({ filters = [] }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const navigate = useNavigate();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const bank_name = location.state?.bank_name || "Bank";
  const acc_number = location.state?.acc_number || "Account Number";
  const [globalLoader, setGlobalLoader] = useState(false);
  // const [appliedFilters, setAppliedFilters] = useState({});

  // ✅ keep a ref to CommonTable for refreshing
  const fetchBanksRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchBanksRef.current = fetchFn;
  };

  const refreshBanks = () => {
    if (fetchBanksRef.current) {
      fetchBanksRef.current();
    }
  };

  const handleDelete = (row) => {
    setSelectedBank(row);
    setOpenDelete(true);
  };

  const handleStatement = (row) => {
    navigate(`/admin/bankstatements/${row.id}`, {
      state: {
        bank_id: row.id,
        bank_name: row.bank_name,
        balance: row.balance,
        acc_number: row.acc_number,
      },
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // const filters = useMemo(
  //   () => [
  //     { id: "mobile", label: "Mobile Number", type: "textfield" },
  //     {
  //       id: "user_id",
  //       label: "Type Est.",
  //       type: "autocomplete",
  //       options: userOptions,
  //       onSearch: (val) => setUserSearch(val),
  //       getOptionLabel: (option) => option?.label || "",
  //       isOptionEqualToValue: (option, value) => option.id === value.id, // ✅ this line keeps selection visible
  //     },
  //     { id: "asm", label: "Asm Id", type: "textfield" },
  //   ],
  //   [user?.role, userOptions, appliedFilters]
  // );

  // memoized columns
  const columns = useMemo(
    () => [
      {
        name: "Date",
        selector: (row) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Tooltip title={`Created: ${ddmmyyWithTime(row.created_at)}`} arrow>
              <span>{ddmmyy(row.created_at)}</span>
            </Tooltip>
            <br />

            <Tooltip title={`Updated: ${ddmmyyWithTime(row.updated_at)}`} arrow>
              <span>{ddmmyy(row.updated_at)}</span>
            </Tooltip>
          </div>
        ),
        wrap: true,
        width: "140px",
      },
    
      {
        name: "Bank Name",
        selector: (row) => (
          <div style={{ textAlign: "left", fontWeight: 500 }}>
            {row.bank_name?.toUpperCase()}
          </div>
        ),
        wrap: true,
      },
        {
        name: "Handled By",
        selector: (row) => <div style={{ textAlign: "left" }}>{row.handled_by_est}</div>,
        
      },
      {
        name: "Account Number",
        selector: (row) => (
          <Tooltip title={row.acc_number}>
            <div style={{ textAlign: "left" }}>{row.acc_number}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "IFSC Code",
        selector: (row) => <div style={{ textAlign: "left" }}>{row.ifsc}</div>,
        wrap: true,
      },
      
      {
        name: "Balance",
        selector: (row) => (
          <div style={{ color: "green", fontWeight: "600", textAlign: "left" }}>
            ₹ {parseFloat(row.balance).toFixed(2)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus value={row.status} />,
        center: true,
      },
      {
        name: "Actions",
        selector: (row) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "120px",
                position: "relative",
              }}
            >
              {/* Icons are always rendered but hidden when not hovered */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  visibility: "visible", // keeps layout stable
                }}
              >
                <Tooltip title="Statement">
                  <IconButton
                    color="info"
                    size="small"
                    onClick={() => handleStatement(row)}
                  >
                    <DescriptionIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      setSelectedRow(row);
                      setOpenEdit(true);
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>

                {user?.role === "adm" ||
                  (user?.role === "sadm" && (
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(row)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ))}
              </Box>
            </Box>
          );
        },
        width: "120px",
        center: true,
      },
    ],
    []
  );

  const queryParam = "";

  return (
    <>
      <CommonLoader loading={loading} text="Loading Banks" />

      {!loading && (
        <>
          <CommonTable
            onFetchRef={handleFetchRef}
            columns={columns}
            endpoint={ApiEndpoints.GET_BANKS}
            filters={filters}
            queryParam={queryParam}
            customHeader={
              <Button
                label="Bank"
                onClick={() => setOpenCreate(true)}
                variant="contained"
                size="medium"
                sx={{
                  background:
                    "linear-gradient(135deg, #490277 0%, #6A1B9A 100%)",
                  color: "#FFFFFF",
                  textTransform: "none",
                  fontWeight: 500,
                  letterSpacing: "0.3px",
                  paddingX: 3,
                  paddingY: 1.2,
                  marginBottom: 2,
                  borderRadius: "10px",
                  boxShadow: "0px 4px 12px rgba(73, 2, 119, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5A048F 0%, #7B2BB5 100%)",
                    boxShadow: "0px 6px 16px rgba(73, 2, 119, 0.45)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                    boxShadow: "0px 2px 6px rgba(73, 2, 119, 0.2)",
                  },
                }}
              >
                Add Bank
              </Button>
            }
          />

          {/* Create Bank Modal */}
          {openCreate && (
            <CreateBankModal
              open={openCreate}
              onClose={() => setOpenCreate(false)}
              onFetchRef={refreshBanks}
              setGlobalLoader={setLoading}
            />
          )}

          {/* Edit Bank Modal */}
          {openEdit && selectedRow && (
            <UpdateBanks
              open={openEdit}
              onClose={() => {
                setOpenEdit(false);
                setSelectedRow(null);
              }}
              bankData={selectedRow}
              onFetchRef={refreshBanks}
            />
          )}

          {/* Delete Bank Modal */}
          {selectedBank && (
            <DeleteBank
              open={openDelete}
              handleClose={() => {
                setOpenDelete(false);
                setSelectedBank(null);
              }}
              selectedBank={selectedBank}
              onFetchRef={refreshBanks}
            />
          )}
        </>
      )}
    </>
  );
};

export default Banks;
