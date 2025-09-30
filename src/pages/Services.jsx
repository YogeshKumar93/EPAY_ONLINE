import { useMemo, useContext, useState, useRef } from "react";
import {
  Box,
  Button,
  Tooltip,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import CreateServiceModal from "../components/CreateServiceModal";
import EditServiceModal from "../components/EditServiceModaL";
import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";
import { Lock, LockOpen } from "@mui/icons-material";
import BlockUnblockService from "./BlockUnblockService";
const Services = ({ query }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [openMpinModal, setOpenMpinModal] = useState(false);
  const [actionType, setActionType] = useState(null); // "block" or "unblock"
  const [actionTarget, setActionTarget] = useState(null); // "service", "api", "users"

  const handleLockUnlockClick = (service, action, type) => {
    // type: "service", "api", "users"
    setSelectedService(service);
    setActionType(action); // block / unblock
    setActionTarget(type); // store which type is being updated
    setOpenMpinModal(true);
  };

  const fetchUsersRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };
  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };
  const columns = useMemo(
    () => [
      {
        name: "User Id",
        selector: (row) => (
          <Tooltip title={row?.id}>
            <div style={{ textAlign: "left" }}>{row?.id}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Service Name",
        selector: (row) => (
          <Tooltip title={row?.name}>
            <div style={{ textAlign: "left" }}>{row?.name}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Code",
        selector: (row) => (
          <Tooltip title={row?.code}>
            <div style={{ textAlign: "left" }}>{row?.code}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Route",
        selector: (row) => (
          <Tooltip title={row?.route}>
            <div style={{ textAlign: "left" }}>{row?.route || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Status",
        selector: (row) => {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span
                style={{
                  color: row.is_active ? "#1EE0AC" : "#e85347",
                  minWidth: "60px",
                  display: "inline-block",
                }}
              >
                {row.is_active ? "Active" : "Inactive"}
              </span>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "40px",
                  justifyContent: "center",
                  visibility: "visible",
                  transition: "visibility 0.2s, opacity 0.2s",
                  opacity: 1,
                }}
              >
                {row.is_active ? (
                  <Tooltip title="Click to Block">
                    <LockOpen
                      sx={{ color: "#1EE0AC", cursor: "pointer" }}
                      onClick={() =>
                        handleLockUnlockClick(row, "block", "service")
                      }
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to Unblock">
                    <Lock
                      sx={{ color: "#e85347", cursor: "pointer" }}
                      onClick={() =>
                        handleLockUnlockClick(row, "unblock", "service")
                      }
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>
          );
        },
      },
      {
        name: "Api Status",
        selector: (row) => {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span
                style={{
                  color: row.is_active_api ? "#1EE0AC" : "#e85347",
                  minWidth: "60px",
                  display: "inline-block",
                }}
              >
                {row.is_active_api ? "Active" : "Inactive"}
              </span>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "40px",
                  justifyContent: "center",
                  visibility: "visible",
                  transition: "visibility 0.2s, opacity 0.2s",
                  opacity: 1,
                }}
              >
                {row.is_active_api ? (
                  <Tooltip title="Click to Block">
                    <LockOpen
                      sx={{ color: "#1EE0AC", cursor: "pointer" }}
                      onClick={() => handleLockUnlockClick(row, "block", "api")}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to Unblock">
                    <Lock
                      sx={{ color: "#e85347", cursor: "pointer" }}
                      onClick={() =>
                        handleLockUnlockClick(row, "unblock", "api")
                      }
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>
          );
        },
      },
      {
        name: "User Status",
        selector: (row) => {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span
                style={{
                  color: row.is_active_users ? "#1EE0AC" : "#e85347",
                  minWidth: "60px",
                  display: "inline-block",
                }}
              >
                {row.is_active_users ? "Active" : "Inactive"}
              </span>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "40px",
                  justifyContent: "center",
                  visibility: "visible",
                  transition: "visibility 0.2s, opacity 0.2s",
                  opacity: 1,
                }}
              >
                {row.is_active_users ? (
                  <Tooltip title="Click to Block">
                    <LockOpen
                      sx={{ color: "#1EE0AC", cursor: "pointer" }}
                      onClick={() =>
                        handleLockUnlockClick(row, "block", "users")
                      }
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to Unblock">
                    <Lock
                      sx={{ color: "#e85347", cursor: "pointer" }}
                      onClick={() =>
                        handleLockUnlockClick(row, "unblock", "users")
                      }
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>
          );
        },
      },

      {
        name: "Actions",
        selector: (row, { hoveredRow, enableActionsHover }) => {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                minWidth: "80px",
              }}
            >
              <IconButton
                color="primary"
                size="small"
                onClick={() => {
                  setSelectedService(row);
                  setOpenEdit(true);
                }}
                sx={{
                  visibility: "visible",
                  transition: "visibility 0.2s, opacity 0.2s",
                  opacity: 1,
                }}
              >
                <Edit />
              </IconButton>
            </Box>
          );
        },
        width: "100px",
      },
    ],
    []
  );

  const filters = useMemo(
    () => [{ id: "name", label: "Service Name", type: "textfield" }],
    []
  );

  return (
    <Box>
      {/* Services Table */}
      <CommonTable
        onFetchRef={handleFetchRef}
        columns={columns}
        endpoint={ApiEndpoints.GET_SERVICES}
        filters={filters}
        queryParam={query}
        customHeader={
          (user?.role !== "sadm" || user?.role !== "adm") && (
            <ReButton
              variant="contained"
              label="Services"
              onClick={() => setOpenCreate(true)}
            ></ReButton>
          )
        }
      />

      {/* Create Service Modal */}
      <CreateServiceModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onFetchRef={refreshUsers}
      />

      {/* Edit Service Modal */}
      <EditServiceModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        service={selectedService}
        onFetchRef={refreshUsers}
      />
      <BlockUnblockService
        open={openMpinModal}
        setOpen={setOpenMpinModal}
        serviceId={selectedService?.id}
        actionType={actionType}
        actionTarget={actionTarget} // <-- pass the type here
        onSuccess={refreshUsers}
      />
    </Box>
  );
};
export default Services;
