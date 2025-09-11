import { useMemo, useContext, useState, useRef, useEffect } from "react";
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
import { useLocation, useParams } from "react-router-dom";

const AccountStatement = ({ filters = [], query }) => {


  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
   const [loading, setLoading] = useState(true);
 const authCtx = useContext(AuthContext);
 const user = authCtx?.user;

 const {id} = useParams;
 const location = useLocation();
 const account_id = location.state?.account_id || id;

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

     useEffect(() => {
        if (account_id) {
          setLoading(false);
        }
      }, [account_id]);

  const columns = useMemo(
    () => [
      {
        name: "Account Id",
        selector: (row) => (
          <Tooltip title={row?.account_id}>
            <div style={{ textAlign: "left" }}>{row?.account_id}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Remarks",
        selector: (row) => (
          <Tooltip title={row?.remarks}>
            <div style={{ textAlign: "left" }}>{row?.remarks}</div>
          </Tooltip>
        ),
        wrap: true,
      },
      {
        name: "Bank Id",
        selector: (row) => (
          <Tooltip title={row?.bank_id}>
            <div style={{ textAlign: "left" }}>{row?.bank_id}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Credit",
        selector: (row) => (
          <Tooltip title={row?.credit}>
            <div style={{ textAlign: "left" }}>{row?.credit || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
       {
        name: "Debit",
        selector: (row) => (
          <Tooltip title={row?.debit}>
            <div style={{ textAlign: "left" }}>{row?.debit || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
       {
        name: "Balance",
        selector: (row) => (
          <Tooltip title={row?.balance}>
            <div style={{ textAlign: "left" }}>{row?.balance || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
       {
        name: "Particulars",
        selector: (row) => (
          <Tooltip title={row?.particulars}>
            <div style={{ textAlign: "left" }}>{row?.particulars || "-"}</div>
          </Tooltip>
        ),
        width: "150px",
      },
      {
        name: "Status",
        selector: (row) =>
 <CommonStatus value={row.is_active} />
      },
      // {
      //   name: "Actions",
      //   selector: (row) => (
      //     <IconButton
      //       color="primary"
      //       onClick={() => {
      //         setSelectedService(row);
      //         setOpenEdit(true);
      //       }}
      //     >
      //       <Edit />
      //     </IconButton>
      //   ),
      //   width: "100px",
      // },
    ],
    []
  );

  return (
    <Box>
     
       <h2>Account Statements for Bank ID: {id}</h2>
         <p>Account ID: {account_id}</p>

         <CreateAccountStatement 
open={openCreate}
      handleClose={()=> setOpenCreate(false)}
      handleSave={handleSaveCreate}
      onFetchRef={refreshUsers}
      accountId={account_id}
/>

      {/* Services Table */}
      <CommonTable
        onFetchRef={handleFetchRef} 
        columns={columns}
        endpoint={ApiEndpoints.GET_ACCOUNT_STATEMENTS}
        filters={filters}
        Button= {Button}
        queryParam={`account_id=${account_id}`}
  //        customHeader={
  //              (user?.role !== "sadm" || user?.role !== "adm") && (
  //   <ReButton
  //     variant="contained"
  //    label="Create"
     
  //     onClick={() => setOpenCreate(true)}
  //   >
  
  //   </ReButton>
  //              )
  // }
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
