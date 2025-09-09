import { useMemo, useCallback, useContext, useState, useEffect, useRef } from "react";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../../utils/DateUtils";
import { capitalize1 } from "../../utils/TextUtil";
import { currencySetter } from "../../utils/Currencyutil";
import EditIcon from "@mui/icons-material/Edit";
import ApiEndpoints from "../../api/ApiEndpoints";
import CreateNotification from "./createNotification";
import UpdateNotification from "./UpdateNotification";
import CommonTable from "../common/CommonTable";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteNotification from "./DeleteNotification";
import AddIcon from "@mui/icons-material/Add";
import CommonStatus from "../common/CommonStatus";
import ReButton from "../common/ReButton";
import CommonLoader from "../common/CommonLoader";

const Notification = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [selectedNotification, setSelectedNotification] = useState([])

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

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleEdit = (notification) => {
    // setSelectedId(row.id);
    setSelectedNotification(notification)
    setOpenUpdate(true);
  };
  const handleDelete = (row) => {
    setSelectedId(row.id);
    setOpenDelete(true);
  };

  const columns = useMemo(
    () => [
      {
        name: "Date/Time",
        selector: (row) => (
          <div className="mb-1" style={{ textAlign: "left" }}>
            {ddmmyy(row.created_at)} {dateToTime(row.created_at)}
          </div>
        ),
        wrap: true,
      },
      {
        name: "User Id",
        selector: (row) => (
          <Tooltip title={row?.user_id}>
            <div style={{ textAlign: "left" }}>{row?.user_id}</div>
          </Tooltip>
        ),
        width: "185px",
        wrap: true,
      },
      {
        name: "Title",
        selector: (row) => (
          <Tooltip title={row?.title}>
            <div style={{ textAlign: "left" }}>{row?.title}</div>
          </Tooltip>
        ),
      },
      {
        name: "Message",
        selector: (row) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              textAlign: "justify",
              fontWeight: "500",
            }}
          >
            <Tooltip title={row?.message}>
              <div style={{ textAlign: "left" }}>{row?.message}</div>
            </Tooltip>
          </Box>
        ),
        wrap: true,
        center: false,
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus is_read={row.is_read}  />,
        center: true,
      },
      {
        name: "Actions",
        selector: (row) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton color="primary" onClick={() => handleEdit(row)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => handleDelete(row)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  return (
<>
  <CommonLoader loading={loading} text="Loading Fund Requests" />

      {!loading && (
    <Box>
      {/* Create Notification Button */}

      {/* Notification Table */}
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_NOTIFICATION}
        filters={filters}
           onFetchRef={handleFetchRef} 
        customHeader={
          (user?.role === "sadm" || user?.role === "adm") && (
            <ReButton
              label="Notification"
              onClick={() => setOpenCreate(true)}
            />
          )
        }
        
      />

      {/* Create Notification Modal */}
      {openCreate && (
        <CreateNotification
          open={openCreate}
          onClose={() => setOpenCreate(false)}
           onFetchRef={refreshUsers} 
        />
      )}
      {/* Create Notification Modal */}
      {openUpdate && (
        <UpdateNotification
          open={openUpdate}
          row = {selectedNotification}
          onClose={() => setOpenUpdate(false)}
          notification={selectedId}
           onFetchRef={refreshUsers} 
        />
      )}
      {openDelete && (
        <DeleteNotification
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          notificationId={selectedId}
           onFetchRef={refreshUsers} 
        />
      )}
    </Box>
  )}
</>

  );
};

export default Notification;
