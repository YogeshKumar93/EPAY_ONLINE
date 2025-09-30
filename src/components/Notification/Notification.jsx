import { useMemo, useContext, useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Fade,
} from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../../utils/DateUtils";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ApiEndpoints from "../../api/ApiEndpoints";
import CreateNotification from "./createNotification";
import UpdateNotification from "./UpdateNotification";
import DeleteNotification from "./DeleteNotification";
import CommonTable from "../common/CommonTable";
import CommonStatus from "../common/CommonStatus";
import ReButton from "../common/ReButton";
import CommonLoader from "../common/CommonLoader";

// sound file (place a .mp3/.wav in your /public folder)
const notificationSound = "/public/beep.mp3";

const Notification = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [selectedNotification, setSelectedNotification] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchUsersRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };

  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
      playSound();
    }
  };

  const playSound = () => {
    const audio = new Audio(notificationSound);
    audio.volume = 0.6; // softer volume
    audio.play().catch(() => {}); // ignore autoplay errors
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setOpenUpdate(true);
  };

  const handleDelete = (row) => {
    setSelectedId(row.id);
    setOpenDelete(true);
  };

  const columns = useMemo(
    () => [
      {
        name: "Date / Time",
        selector: (row) => (
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="body2" color="text.secondary">
              {ddmmyy(row.created_at)} • {dateToTime(row.created_at)}
            </Typography>
          </Box>
        ),
        wrap: true,
      },
      {
        name: "User",
        selector: (row) => (
          <Tooltip title={`User ID: ${row?.user_id}`}>
            <Chip
              label={row?.user_id}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Tooltip>
        ),
        width: "150px",
        wrap: true,
      },
      {
        name: "Title",
        selector: (row) => (
          <Tooltip title={row?.title}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, textAlign: "left" }}
            >
              {row?.title}
            </Typography>
          </Tooltip>
        ),
      },
      {
        name: "Message",
        selector: (row) => (
          <Tooltip title={row?.message}>
            <Typography
              variant="body2"
              sx={{ textAlign: "justify", fontSize: "14px" }}
            >
              {row?.message}
            </Typography>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Status",
        selector: (row) => <CommonStatus is_read={row.is_read} />,
        center: true,
      },
      {
        name: "Actions",
        selector: (row) => {
           

          return (
            <>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(row)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(row)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          );
        },
        width: "120px",
        center: true,
      },
    ],
    []
  );

  return (
    <>
      <CommonLoader loading={loading} text="Loading Notifications..." />

      {!loading && (
        <Box>
          <CommonTable
            columns={columns}
            endpoint={ApiEndpoints.GET_NOTIFICATION}
            filters={filters}
            onFetchRef={handleFetchRef}
            customHeader={
              (user?.role === "sadm" || user?.role === "adm") && (
                <ReButton
                  label="New Notification"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenCreate(true)}
                />
              )
            }
          />

          {/* Create Modal */}
          {openCreate && (
            <CreateNotification
              open={openCreate}
              onClose={() => setOpenCreate(false)}
              onFetchRef={refreshUsers}
            />
          )}

          {/* Update Modal */}
          {openUpdate && (
            <UpdateNotification
              open={openUpdate}
              row={selectedNotification}
              onClose={() => setOpenUpdate(false)}
              notification={selectedId}
              onFetchRef={refreshUsers}
            />
          )}

          {/* Delete Modal */}
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
