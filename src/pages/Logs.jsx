import { useMemo, useContext, useState, useEffect, useRef } from "react";
import { Box, Tooltip, Chip, IconButton, Typography } from "@mui/material";
import { Delete, Info as InfoIcon } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy, ddmmyyWithTime } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import DeleteLogModal from "../components/DeleteLogModal";
import DrawerDetails from "../components/common/DrawerDetails";
import CommonStatus from "../components/common/CommonStatus";
import CommonLoader from "../components/common/CommonLoader";
import { android2, linux2, macintosh2, okhttp, windows2 } from "../utils/iconsImports";
import LaptopIcon from "@mui/icons-material/Laptop";


const Logs = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
 

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
 const [loading, setLoading] = useState(true); // initially true

 const fetchUsersRef = useRef(null);
 
   const handleFetchRef = (fetchFn) => {
     fetchUsersRef.current = fetchFn;
   };
   const refreshUsers = () => {
     if (fetchUsersRef.current) {
       fetchUsersRef.current();
     }
   };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // stop loader after data is ready
    }, 1000); // 1 second delay just as an example

    return () => clearTimeout(timer);
  }, []);

  const columns = useMemo(
    () => [
      {
        name: "Date/Time",
        selector: (row) => (
          
         <Tooltip title={`Created: ${ddmmyyWithTime(row.created_at)}`} arrow>
                    <span>
                      {ddmmyy(row.created_at)}  
                    </span>
                  </Tooltip>
        ),
        wrap: true,
      },
      { name: "Id", selector: (row) => row?.id, wrap: true },
      { name: "User Id", selector: (row) => row?.user_id, wrap: true },
      { name: "Service Name", selector: (row) => row?.service_name, wrap: true },
      { name: "Role", selector: (row) => row?.role, wrap: true },
      { name: "Action", selector: (row) => row?.action, width: "100px" },
      // { name: "User Agent", selector: (row) => row?.user_agent, width: "100px" },
       {
      name: "User Agent",
      selector: (row) => {
        let icon;

        if (row.user_agent.toLowerCase().includes("windows")) {
          icon = (
            <img
              src={windows2}
              style={{ width: "22px" }}
              alt="description of image"
            />
          );
        } else if (row.user_agent.toLowerCase().includes("android")) {
          icon = (
            <img
              src={android2}
              style={{ width: "22px" }}
              alt="description of image"
            />
          );
        } else if (row.user_agent.toLowerCase().includes("mac")) {
          icon = (
            <img
              src={macintosh2}
              style={{ width: "22px" }}
              alt="description of image"
            />
          );
        } else if (row.user_agent.toLowerCase().includes("linux")) {
          icon = (
            <img
              src={linux2}
              style={{ width: "22px" }}
              alt="description of image"
            />
          );
        }
        else if (row.user_agent.toLowerCase().includes("okhttp")) {
          icon = (
            <img
              src={okhttp}
              style={{ width: "22px" }}
              alt="description of image"
            />
          );
        } else {
          icon = <LaptopIcon sx={{ color: "blue", width: "22px" }} />;
        }

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "13px",
              textAlign: "justify",
              gap: 2,
            }}
          >
            {icon}
            {/* <Typography>{row.user_agent}</Typography> */}
          </Box>
        );
      },
      width: "20px",
      wrap: true,
      left: true,
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
          justifyContent: "center",
          alignItems: "center",
          minWidth: "120px",
          position: "relative",
          height: 40, // reserve fixed height to prevent row fluctuation
        }}
      >
        {/* Icons always rendered, visibility toggled */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            visibility: "visible",
            transition: "visibility 0.2s, opacity 0.2s",
          }}
        >
          <Tooltip title="Details">
            <IconButton
              color="info"
              size="small"
              onClick={() => {
                setSelectedRow(row);
                setDrawerOpen(true);
              }}
            >
              <InfoIcon fontSize="medium" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => {
                setSelectedLogId(row.id);
                setOpenDelete(true);
              }}
            >
              <Delete fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Box>

       
      </Box>
    );
  },
  width: "120px",
  center: true,
}

    ],
    []
  );

  return (

  <>
  <CommonLoader loading={loading} text="Loading Fund Requests" />

  {!loading && (
    <Box>
      <CommonTable
        onFetchRef={handleFetchRef} 
        columns={columns}
        endpoint={ApiEndpoints.GET_LOGS}
        filters={filters}
        queryParam={query}
      />

      {/* Delete Modal */}
      <DeleteLogModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        logId={selectedLogId}
        onFetchRef={refreshUsers} 
      />

      {/* Drawer Details */}
      <DrawerDetails
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        rowData={selectedRow}
        
        fields={[
          { label: "IP Address", key: "ip_address" },
          { label: "Request Data", key: "request_data" },
          { label: "Response Data", key: "response_data" },
          // { label: "User Agent", key: "user_agent" },
        ]}
      />
    </Box>
  )}
</>

  );
};

export default Logs;
