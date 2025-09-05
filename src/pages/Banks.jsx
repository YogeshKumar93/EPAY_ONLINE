import { useMemo, useCallback, useContext, useState } from "react";
import { Box, Tooltip, Typography,Button } from "@mui/material";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import { currencySetter } from "../utils/Currencyutil";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, dateToTime1, ddmmyy } from "../utils/DateUtils";
import { capitalize1 } from "../utils/TextUtil";
import CreateBankModal from "../components/Bank/CreateBanks";

const Banks = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [openCreate, setOpenCreate] = useState(false);

  // memoized columns
  const columns = useMemo(
    () => [
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
        name: "Account Number",
        selector: (row) => (
          <Tooltip title={row.acc_number}>
            <div style={{ textAlign: "left" }}>
              **** **** {row.acc_number.toString().slice(-4)}
            </div>
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
        name: "Created At",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime1(row.created_at)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Updated At",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {ddmmyy(row.updated_at)} {dateToTime1(row.updated_at)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "Status",
        selector: (row) => (
          <div
            style={{
              color: row.status === 1 ? "green" : "red",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {row.status === 1 ? "Active" : "Inactive"}
          </div>
        ),
        center: true,
      },
    ],
    []
  );

  const queryParam = "";

  return (
    <>
      {/* Top Bar with Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreate(true)}
        >
          + Create Bank
        </Button>
      </Box>

      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_BANKS}
        filters={filters}
        queryParam={queryParam}
      />

      {/* Create Bank Modal */}
      {openCreate && (
        <CreateBankModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
        />
      )}
    </>
  );
};

export default Banks;
