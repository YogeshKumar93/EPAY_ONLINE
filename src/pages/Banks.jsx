import { useMemo, useContext, useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../utils/DateUtils";
import CreateBankModal from "../components/Bank/CreateBanks";
import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";
import CommonLoader from "../components/common/CommonLoader";

const Banks = ({ filters = [] }) => {
  const authCtx = useContext(AuthContext);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(true); // initially true

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // stop loader after data is ready
    }, 1000); // 1 second delay just as an example

    return () => clearTimeout(timer);
  }, []);

  // memoized columns
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
        selector: (row) => (
          <div style={{ textAlign: "left" }}>{row.ifsc}</div>
        ),
        wrap: true,
      },
      {
        name: "Balance",
        selector: (row) => (
          <div
            style={{ color: "green", fontWeight: "600", textAlign: "left" }}
          >
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
    ],
    []
  );

  const queryParam = "";

  return (
    <>
      <CommonLoader loading={loading} text="Loading Fund Requests" />

      {!loading && (
        <>
          <CommonTable
            columns={columns}
            endpoint={ApiEndpoints.GET_BANKS}
            filters={filters}
            queryParam={queryParam}
            customHeader={
              <ReButton label="Bank" onClick={() => setOpenCreate(true)} />
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
      )}
    </>
  );
};

export default Banks;
