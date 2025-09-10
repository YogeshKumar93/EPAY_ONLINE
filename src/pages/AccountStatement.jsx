import { useMemo, useContext, useState, useRef } from "react";
import { Box, Button, Tooltip, Chip, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { dateToTime, ddmmyy } from "../utils/DateUtils";
import CommonTable from "../components/common/CommonTable";
import ApiEndpoints from "../api/ApiEndpoints";

import ReButton from "../components/common/ReButton";
import CommonStatus from "../components/common/CommonStatus";
import AuthContext from "../contexts/AuthContext";
import CreateAccountStatement from "./CreateAccountStatement";
import UpdateAccountStatement from "./UpdateAccountStatement";

const AccountStatement = ({ filters = [], query }) => {


  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
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

    const handleSaveCreate = () =>{
      setOpenCreate(false);
      refreshUsers();
    }

    const handleSaveUpdate = () => {
      setOpenUpdate(false);
    }

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
        selector: (row) =>
 <CommonStatus value={row.is_active} />
      },
      {
        name: "Actions",
        selector: (row) => (
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedService(row);
              setOpenEdit(true);
            }}
          >
            <Edit />
          </IconButton>
        ),
        width: "100px",
      },
    ],
    []
  );

  return (
    <Box>
     

      {/* Services Table */}
      <CommonTable
        onFetchRef={handleFetchRef} 
        columns={columns}
        endpoint={ApiEndpoints.GET_ACCOUNT_STATEMENTS}
        filters={filters}
        Button= {Button}
        queryParam={query}
         customHeader={
               (user?.role !== "sadm" || user?.role !== "adm") && (
    <ReButton
      variant="contained"
     label="Create"
     
      onClick={() => setOpenCreate(true)}
    >
  
    </ReButton>
               )
  }
/>

<CreateAccountStatement 
open={openCreate}
      handleClose={()=> setOpenCreate(false)}
      handleSave={handleSaveCreate}
      onFetchRef={refreshUsers}
/>

<UpdateAccountStatement 
 open={openUpdate}
      row={selectedAccount}
      handleClose={()=>{
        setOpenUpdate(false);
             
      }}
      handleSave={handleSaveUpdate}
      onFetchRef={refreshUsers}
/>
      

    </Box>
  );
};

export default AccountStatement;
