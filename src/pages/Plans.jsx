import { useMemo, useContext, useState, useEffect, useRef } from "react";
import { Box, Tooltip, Chip, IconButton, Typography } from "@mui/material";
import { Delete, Info as InfoIcon } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonLoader from "../components/common/CommonLoader";
import ReButton from "../components/common/ReButton";
import CreatePlan from "./CreatePlan";
import { Edit } from "@mui/icons-material";
import EditPlan from "../components/EditPlan";

const Plans = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
    const [openEdit, setOpenEdit] = useState(false);
   const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
 const [loading, setLoading] = useState(true); // initially true

 const fetchUsersRef = useRef(null);
 
   const handleFetchRef = (fetchFn) => {
     fetchUsersRef.current = fetchFn;
   };
   const refreshPlans = () => {
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
  
  const handleEditClick = (row) => {
    setSelectedRow(row);
    setOpenEdit(true);
  };

  const handleEditSuccess = () => {
    setOpenEdit(false);
    
  };
  const columns = useMemo(
    () => [
      {
        name: "Date/Time",
        selector: (row) => (
          <div style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
        ),
        wrap: true,
      },
      { name: "Id", selector: (row) => row?.id, wrap: true },
      { name: "Name", selector: (row) => row?.name, wrap: true },
      { name: "Description", selector: (row) => row?.description, wrap: true },

{
  name: "Actions",
  selector: (row, { hoveredRow, enableActionsHover }) => {
    const isHovered = hoveredRow === row.id && enableActionsHover;

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minWidth: "120px",
          position: "relative",
          height: 40, // fixed height to prevent fluctuation
        }}
      >
        {/* Icons always rendered, visibility toggled */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            visibility: isHovered ? "visible" : "hidden",
            transition: "visibility 0.2s, opacity 0.2s",
          }}
        >
          <Tooltip title="Edit">
            <IconButton color="primary" size="small" onClick={() => handleEditClick(row)}>
              <Edit fontSize="small" />
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
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Dash overlay */}
        <Typography
          variant="body2"
          sx={{
            color: "#999",
            textAlign: "center",
            position: "absolute",
            pointerEvents: "none",
            visibility: isHovered ? "hidden" : "visible",
          }}
        >
          -
        </Typography>
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
        endpoint={ApiEndpoints.GET_PLANS}
        filters={filters}
        queryParam={query}
        customHeader={
            <ReButton
            variant="contained"
            label="Plan"
            onClick={() => setOpenCreate(true)}
          />
        }
      />
            <CreatePlan
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        onFetchRef={refreshPlans}
      />
       <EditPlan
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        plans={selectedRow} // Pass the selected row data
        onSuccess={handleEditSuccess}
         onFetchRef={refreshPlans}
      />
    </Box>
  )}
</>

  );
};

export default Plans;
