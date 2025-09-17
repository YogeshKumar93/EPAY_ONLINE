import { useMemo, useContext, useState, useRef } from "react";
import { Box, Button, Tooltip, Chip, IconButton, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
// import CreateServiceModal from "../components/CreateServiceModal";
// import EditServiceModal from "../components/EditServiceModaL";

import CreateLayouts from "../pages/CreateLayouts";
import UpdateLayouts from "./UpdateLayouts";
import ReButton from "../components/common/ReButton";

const Layouts = ({ filters = [], query }) => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  // const [openEdit, setOpenEdit] = useState(false);
  // const [selectedService, setSelectedService] = useState(null);
 
 const fetchUsersRef = useRef(null);

  const handleFetchRef = (fetchFn) => {
    fetchUsersRef.current = fetchFn;
  };
  const refreshUsers = () => {
    if (fetchUsersRef.current) {
      fetchUsersRef.current();
    }
  };
  const handleSaveCreate = () => {
    setOpenCreate(false);
  };

  const handleSaveUpdate = () => {
    setOpenUpdate(false);
  };

  const handleEdit = (layout) => {
    setSelectedLayout(layout);
    // setSelectedColor(row);
    setOpenUpdate(true);
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
      {
        name: "Name",
        selector: (row) => (
          <Tooltip title={row?.name}>
            <div style={{ textAlign: "left" }}>{row?.name}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Element Type",
        selector: (row) => (
          <Tooltip title={row?.element_type}>
            <div style={{ textAlign: "left" }}>{row?.element_type}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Colour",
        selector: (row) => (
          <Tooltip title={row?.color_code}>
            <div style={{ textAlign: "left" }}>{row?.color_code}</div>
          </Tooltip>
        ),
        width: "150px",
      },
  {
      name: "Actions",
      selector: (row, { hoveredRow, enableActionsHover }) => {
        const isHovered = hoveredRow === row.id || !enableActionsHover;

        return (
          <Box sx={{ display: "flex", justifyContent: "center", minWidth: "120px" }}>
            {isHovered ? (
              <Box sx={{ display: "flex", gap: 1, transition: "opacity 0.2s" }}>
                <Tooltip title="Edit">
                  <IconButton color="primary" size="small" onClick={() => handleEdit(row)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "#999", textAlign: "center", minWidth: "120px" }}
              >
                -
              </Typography>
            )}
          </Box>
        );
      },
      width: "120px",
      center: true,
    },
    ],
    []
  );

  return (
    <Box sx={{ }}>
      <CommonTable
     onFetchRef={handleFetchRef} 
        columns={columns}
        // endpoint={ApiEndpoints.GET_COLOURS}
        endpoint={ApiEndpoints.GET_COLOURS}
        filters={filters}
        queryParam={query}
        Button={Button}
        customHeader={
          <ReButton
            variant="contained"
            label="Layout"
            onClick={() => setOpenCreate(true)}
          ></ReButton>
        }
      />

      <CreateLayouts
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        handleSave={handleSaveCreate}
        onFetchRef={refreshUsers} 
      />

      <UpdateLayouts
        open={openUpdate}
        row={selectedLayout}
        handleClose={() => {
          setOpenUpdate(false);
          setSelectedColor(null);
        }}
        handleSave={handleSaveUpdate}
        // selectedAccount={selectedAccount}
        onFetchRef={refreshUsers} 
      />
    </Box>
  );
};

export default Layouts;
