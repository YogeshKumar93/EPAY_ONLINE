import React, { useContext, useMemo, useRef, useState } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import { ddmmyy, dateToTime } from "../utils/DateUtils";
 

import ReButton from "../components/common/ReButton";
 
import CommonTable from "../components/common/CommonTable";
import CreateSideLayouts from "./CreateSideLayout";
import UpdateSideLayouts from "./UpdateSideLayout";

const SideLayout = ({filters = [], query}) => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedSideLayout, setSelectedSideLayout] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

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
    refreshUsers(); // refresh table after saving
  };

    const handleSaveUpdate = () => {
    setOpenUpdate(false);
  };

const columns = useMemo(() => [
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
    name: "Type",
    selector: (row) => (
      <Tooltip title={row?.type}>
        <div style={{ textAlign: "left" }}>{row?.type}</div>
      </Tooltip>
    ),
    wrap: true,
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
], []);


  return (
    <Box sx={{}}>
      <CommonTable
        onFetchRef={handleFetchRef}
        columns={columns}
        // endpoint={ApiEndpoints.GET_COLOURS}
        // filters={filters}
        queryParam={query}
        Button={Button}
        customHeader={
          <ReButton
            variant="contained"
            label="Side Nav Layout"
            onClick={() => setOpenCreate(true)}
          ></ReButton>
        }
      />

      <CreateSideLayouts 
      open={openCreate}
      handleClose={()=> setOpenCreate(false)}
      handleSave={handleSaveCreate}
      onFetchRef={refreshUsers}
      />

      <UpdateSideLayouts 
      open={openUpdate}
      row={selectedSideLayout}
      handleClose={()=>{
        setOpenUpdate(false);
        setSelectedColor(null);        
      }}
      handleSave={handleSaveUpdate}
      onFetchRef={refreshUsers}
      />
    </Box>
  );
};

export default SideLayout;
