import { useMemo, useContext, useState } from "react";
import { Box, Button, Tooltip, Chip, IconButton } from "@mui/material";
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
  const [refreshKey, setRefreshKey] = useState(0);

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
        selector: (row) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton color="primary" onClick={() => handleEdit(row)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDelete(row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <Box sx={{ }}>
      <CommonTable
        key={refreshKey} // 🔄 refresh on changes
        columns={columns}
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
      />
    </Box>
  );
};

export default Layouts;
