import { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DateRangePicker } from "rsuite";
import CachedIcon from "@mui/icons-material/Cached";

import CommonTable from "../components/common/CommonTable";
import CreateBankStatement from "./CreateBankStatement";
import CommonLoader from "../components/common/CommonLoader";

import predefinedRanges from "../utils/predefinedRanges";
import { yyyymmdd, datemonthYear1 } from "../utils/DateUtils";
import { capitalize1 } from "../utils/TextUtil";
import { currencySetter } from "../utils/Currencyutil";
import ApiEndpoints from "../api/ApiEndpoints";
import sampleFileImg from "../assets/sampleFile.png";
import excelImg from "../assets/ExcelFile.png";
import uploadImg from "../assets/uploadFile.png";
import AuthContext from "../contexts/AuthContext";
// import { primaryColor, secondaryColor } from "../utils/setThemeColor";

const BankStatements = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const { bank_id, bank_name, balance: oldBalance } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [filterValues, setFilterValues] = useState({ date: {}, dateVal: "" });
  const [query, setQuery] = useState(`bank_id=${bank_id}`);

  const fetchStatementsRef = useRef(null);
  const handleFetchRef = (fetchFn) => {
    fetchStatementsRef.current = fetchFn;
  };
  const refreshStatements = () => {
    if (fetchStatementsRef.current) fetchStatementsRef.current();
  };

  useEffect(() => {
    if (bank_id && oldBalance !== undefined) setLoading(false);
  }, [bank_id, oldBalance]);

  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = `${process.env.PUBLIC_URL}/uplodeexcel2.xlsx`;
    link.download = "uplodeexcel2.xlsx";
    link.click();
  };

  const columns = [
    { name: "ID", selector: (row) => row.bank_id, width: "80px" },
    {
      name: (
        <DateRangePicker
          showOneCalendar
          placeholder="Date"
          size="medium"
          cleanable
          ranges={predefinedRanges}
          value={filterValues.dateVal}
          onChange={(value) => {
            if (!value) {
              setFilterValues({ date: {}, dateVal: "" });
              setQuery(`bank_id=${bank_id}`);
              return;
            }

            const dates = { start: value[0], end: value[1] };
            const startDate = yyyymmdd(dates.start);
            const endDate = yyyymmdd(dates.end);

            setFilterValues({
              ...filterValues,
              date: { start: startDate, end: endDate },
              dateVal: value,
            });

            setQuery(`bank_id=${bank_id}&start=${startDate}&end=${endDate}`);
          }}
          style={{ width: 200 }}
        />
      ),
      selector: (row) => datemonthYear1(row.created_at),
    },
    { name: "By", selector: (row) => row.handle_by },
    {
      name: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span>Particulars</span>
          <FormControl sx={{ width: 200 }}>
            <TextField
              autoComplete="off"
              size="small"
              placeholder="Search"
              onChange={(e) =>
                setQuery(`bank_id=${bank_id}&search=${e.target.value}`)
              }
            />
          </FormControl>
        </Box>
      ),
      selector: (row) => (
        <div
          className="break-words"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            textAlign: "left",
            fontSize: "13px",
          }}
        >
          {row.particulars ? capitalize1(row.particulars) : "-"}
        </div>
      ),
      width: "300px",
      wrap: true,
    },
    {
      name: "Remarks",
      selector: (row) => (
        <div
          className="break-words"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            textAlign: "left",
            fontSize: "13px",
          }}
        >
          {row.remarks ? capitalize1(row.remarks) : "-"}
        </div>
      ),
      width: "200px",
      wrap: true,
    },
    { name: "MOP", selector: (row) => row.mop },
    { name: "Credit", selector: (row) => currencySetter(row.credit) },
    { name: "Debit", selector: (row) => currencySetter(row.debit) },
    { name: "Balance", selector: (row) => currencySetter(row.balance) },
  ];

  return (
    <>
      <CommonLoader loading={loading} text="Loading Statements..." />

      {!loading && (
        <Box>
          <CreateBankStatement
            open={true}
            handleClose={() => {}}
            onFetchRef={refreshStatements}
            bankId={bank_id}
            balance={oldBalance}
          />

          <CommonTable
            onFetchRef={handleFetchRef}
            endpoint={ApiEndpoints.GET_BANK_STATEMENTS}
            queryParam={query}
            columns={columns}
            customHeader={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  mb: 1,
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    backgroundColor: "#2275b7",
                    color: "#fff",
                    "&:hover": { backgroundColor: "orange" },
                  }}
                  onClick={() => navigate(-1)}
                  startIcon={<CachedIcon />}
                >
                  Back
                </Button>

                <Box sx={{ display: "flex", gap: 1 }}>
                  {/* Upload Excel */}
                  <Tooltip title="Upload Excel">
                    <IconButton
                      component="label"
                      size="small"
                      sx={{
                        color: "#fff",
                        "&:hover": { backgroundColor: "rgba(80, 11, 185, 0.27)" },
                      }}
                    >
                      <img
                        src={uploadImg}
                        alt="Upload"
                        style={{ width: 23, height: 23 }}
                      />
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            ExcelToJsonUploader({
                              file,
                              bankId: bank_id,
                              refresh: refreshStatements,
                              setQuery,
                            });
                            e.target.value = "";
                          }
                        }}
                      />
                    </IconButton>
                  </Tooltip>

                  {/* Download Sample */}
                  <Tooltip title="Download Sample Excel">
                    <IconButton
                      size="small"
                      sx={{
                        "&:hover": { backgroundColor: "#54a09fff" },
                        padding: "6px",
                      }}
                      onClick={handleDownloadSample}
                    >
                      <img
                        src={sampleFileImg}
                        alt="Sample Excel"
                        style={{ width: 23, height: 23 }}
                      />
                    </IconButton>
                  </Tooltip>

                  {/* Download Excel */}
                  <Tooltip title="Download Excel">
                    <IconButton
                      component="label"
                      size="small"
                      sx={{
                        color: "#fff",
                        "&:hover": { backgroundColor: "#098f60ff" },
                      }}
                    >
                      <img
                        src={excelImg}
                        alt="Excel"
                        style={{ width: 23, height: 23 }}
                      />
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            ExcelToJsonUploader({
                              file,
                              bankId: bank_id,
                              refresh: refreshStatements,
                              setQuery,
                            });
                            e.target.value = "";
                          }
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            }
          />
        </Box>
      )}
    </>
  );
};

export default BankStatements;
