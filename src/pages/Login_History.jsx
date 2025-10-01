import { useMemo, useContext, useState, useEffect, useRef } from "react";
import { Tooltip, IconButton, Box, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
import { dateToTime1, ddmmyy, ddmmyyWithTime } from "../utils/DateUtils";
import CommonLoader from "../components/common/CommonLoader";
import LaptopIcon from "@mui/icons-material/Laptop";
import { useNavigate } from "react-router-dom";
import { android2, linux2, macintosh2, windows2 } from "../iconsImports";
import { okhttp, postman } from "../utils/iconsImports";

const Login_History = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const { userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const filterRows = (rows) => {
    if (!searchTerm) return rows;
    const lowerSearch = searchTerm.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(lowerSearch)
      )
    );
  };

  const filters = useMemo(
    () => [
      { id: "user_id", label: "User Id", type: "textfield", roles: ["adm"] },
      { id: "ip", label: "IP Address", type: "textfield" },
      { id: "device", label: "Device", type: "textfield" },
    ],
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
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
      // {
      //   name: "Pf",
      //   selector: (row) => {
      //     let icon;
      //     if (row.device.toLowerCase().includes("windows"))
      //       icon = <img src={windows2} style={{ width: "22px" }} alt="" />;
      //     else if (row.device.toLowerCase().includes("android"))
      //       icon = <img src={android2} style={{ width: "22px" }} alt="" />;
      //     else if (row.device.toLowerCase().includes("mac"))
      //       icon = <img src={macintosh2} style={{ width: "22px" }} alt="" />;
      //     else if (row.device.toLowerCase().includes("linux"))
      //       icon = <img src={linux2} style={{ width: "22px" }} alt="" />;
      //     else if (row.device.toLowerCase().includes("postman"))
      //       icon = <img src={postman} style={{ width: "22px" }} alt="" />;
      //     else if (row.device.toLowerCase().includes("okhttp"))
      //       icon = <img src={okhttp} style={{ width: "22px" }} alt="" />;
      //     else icon = <LaptopIcon sx={{ color: "blue", width: "22px" }} />;

      //     return (
      //       <Box
      //         sx={{
      //           display: "flex",
      //           flexDirection: "column", // stack vertically
      //           alignItems: "center",
      //           fontSize: "13px",
      //           textAlign: "center",
      //           gap: 0.5,
      //         }}
      //       >
      //         {icon}
      //       </Box>
      //     );
      //   },
      //   width: "40px", // increase width to accommodate text
      //   wrap: true,
      //   left: true,
      // },
      ...(user?.role !== "ret" && user?.role !== "dd"
        ? [
            {
              name: "User Id",
              selector: (row) => (
                <Tooltip title={row.user_id}>
                  <div style={{ textAlign: "left" }}>{row.user_id}</div>
                </Tooltip>
              ),
              wrap: true,
            },
          ]
        : []),
      {
        name: "IP",
        selector: (row) => <div style={{ textAlign: "left" }}>{row.ip}</div>,
        wrap: true,
      },
      {
        name: "Login Device",
        selector: (row) => {
          let icon;
          const device = (row.device || "").toLowerCase();
          if (device.includes("windows"))
            icon = <img src={windows2} alt="Windows" style={{ width: 22 }} />;
          else if (device.includes("android"))
            icon = <img src={android2} alt="Android" style={{ width: 22 }} />;
          else if (device.includes("mac"))
            icon = <img src={macintosh2} alt="Mac" style={{ width: 22 }} />;
          else if (device.includes("linux"))
            icon = <img src={linux2} alt="Linux" style={{ width: 22 }} />;
          else if (device.includes("postman"))
            icon = <img src={postman} alt="Postman" style={{ width: 22 }} />;
          else if (device.includes("okhttp"))
            icon = <img src={okhttp} alt="okhttp" style={{ width: 22 }} />;
          else icon = <LaptopIcon sx={{ color: "blue", width: 22 }} />;

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {icon}
              <Typography>{row.device}</Typography>
            </Box>
          );
        },
        width: "250px",
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
            columns={columns}
            endpoint={ApiEndpoints.LOGIN_HISTORY}
            queryParam={query}
            filters={filters}
            transformData={filterRows} // client-side search
            onFetchRef={handleFetchRef}
          />
        </>
      )}
    </>
  );
};

export default Login_History;
