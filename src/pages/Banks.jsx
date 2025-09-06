import { useMemo, useContext, useState } from "react";
import { Box, Tooltip, Typography, Button } from "@mui/material";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import {  dateToTime1, ddmmyy } from "../utils/DateUtils";
import CreateBankModal from "../components/Bank/CreateBanks";
import AddIcon from "@mui/icons-material/Add";
import ReButton from "../components/common/ReButton";

import CommonStatus from "../components/common/CommonStatus";

const Banks = ({ filters = [], }) => {
  const authCtx = useContext(AuthContext);
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
  selector: (row) => <CommonStatus value={row.status} />,
  center: true,
},
    ],
    []
  );

  const queryParam = "";

  return (
    <>

      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_BANKS}
        filters={filters}
        queryParam={queryParam}
        customHeader={
          <ReButton
             label="Bank"
          
            onClick={() => setOpenCreate(true)}
           
          />
        }
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
