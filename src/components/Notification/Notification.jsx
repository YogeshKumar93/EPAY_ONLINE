import { useMemo, useCallback, useContext, useState } from "react";
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

const Notification = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false); 
  const [openUpdate, setOpenUpdate] = useState(false); 
  const [openDelete, setOpenDelete] = useState(false); 
const [selectedId, setSelectedId] = useState(null);
const handleEdit = (row) => {
  setSelectedId(row.id);
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
            {row.is_read === 0 ? (
              <Typography>Not Read</Typography>
            ) : (
              <Typography>Already Read</Typography>
            )}
          </Box>
        ),
        wrap: true,
        center: false,
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
    <Box>
      {/* Create Notification Button */}
      {(user?.role === "sadm" || user?.role === "adm") && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" onClick={() => setOpenCreate(true)}>
            Create Notification
          </Button>
        </Box>
      )}

      {/* Notification Table */}
      <CommonTable
        columns={columns}
        endpoint={ApiEndpoints.GET_NOTIFICATION}
        filters={filters}
        // queryParam={query}
        // refreshInterval={30000}
      />

      {/* Create Notification Modal */}
      {openCreate && (
        <CreateNotification
          open={openCreate}
          onClose={() => setOpenCreate(false)}
        />
      )}
          {/* Create Notification Modal */}
      {openUpdate && (
        <UpdateNotification
          open={openUpdate}
          onClose={() => setOpenUpdate(false)}
            notification={selectedId}
        />
      )}
        {openDelete && (
        <DeleteNotification
          open={openDelete}
          onClose={() => setOpenDelete(false)}
            notificationId={selectedId}
        />
      )}
    </Box>
  );
};

export default Notification;
