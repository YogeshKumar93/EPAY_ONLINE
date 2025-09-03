import { useMemo, useCallback, useContext, useState } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../../utils/DateUtils";
import { capitalize1 } from "../../utils/TextUtil";
import { currencySetter } from "../../utils/Currencyutil";
import CommonTable from "../common/CommonTable";
import ApiEndpoints from "../../api/ApiEndpoints";
import CreateNotification from "./createNotification";

const Notification = ({ filters = [], query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false); // Modal open state

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
    ],
    []
  );

  return (
    <Box>
      {/* Create Notification Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create Notification
        </Button>
      </Box>

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
    </Box>
  );
};

export default Notification;
