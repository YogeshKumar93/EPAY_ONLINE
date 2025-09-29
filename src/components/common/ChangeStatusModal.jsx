import * as React from "react";
import { useState } from "react";
import {
  Box,
  Modal,
  FormControl,
  Grid,
  TextField,
  Tooltip,
  Button,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import RefreshIcon from "@mui/icons-material/Refresh";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "auto",
  overflowY: "auto",
  p: 2,
};

const ChangeStatusModal = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [status, setStatus] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const changeStatus = (event) => {
    event.preventDefault();
    const msg = event.currentTarget.msg.value;

    setRequest(true);
    setTimeout(() => {
      setRequest(false);
      handleClose();
      Swal.fire(`Status changed to ${status} with message: "${msg}"`);
      if (refresh) refresh();
    }, 1000); // simulate small delay
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-start">
      <Box display="flex" gap={1}>
        {row?.status === "SUCCESS" && (
          <>
            <Tooltip title="Refund">
              <ReplayIcon
                sx={{ color: "#FFBF00", cursor: "pointer" }}
                onClick={() => {
                  handleOpen();
                  setStatus("REFUND");
                }}
              />
            </Tooltip>
            <Tooltip title="Fail">
              <ClearIcon
                sx={{ color: "red", cursor: "pointer" }}
                onClick={() => {
                  handleOpen();
                  setStatus("FAIL");
                }}
              />
            </Tooltip>
          </>
        )}
        {row?.status === "PENDING" && (
          <>
            <Tooltip title="Success">
              <CheckIcon
                sx={{ color: "green", cursor: "pointer" }}
                onClick={() => {
                  handleOpen();
                  setStatus("SUCCESS");
                }}
              />
            </Tooltip>
            <Tooltip title="Refund">
              <ReplayIcon
                sx={{ color: "#FFBF00", cursor: "pointer" }}
                onClick={() => {
                  handleOpen();
                  setStatus("REFUND");
                }}
              />
            </Tooltip>
          </>
        )}
        {row?.status === "FAILED" && (
          <>
            <Tooltip title="Rollback">
              <RefreshIcon
                sx={{ color: "blue", cursor: "pointer" }}
                onClick={() => {
                  handleOpen();
                  setStatus("ROLLBACK");
                }}
              />
            </Tooltip>
            <Tooltip title="Pass">
              <DownloadDoneIcon
                sx={{ color: "green", cursor: "pointer" }}
                onClick={() => {
                  handleOpen();
                  setStatus("PASS");
                }}
              />
            </Tooltip>
          </>
        )}
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <h3>Change Status</h3>
            <Button onClick={handleClose}>X</Button>
          </Box>

          <Box
            component="form"
            id="changeStatus"
            noValidate
            autoComplete="off"
            onSubmit={changeStatus}
            sx={{ "& .MuiTextField-root": { m: 1 } }}
          >
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  autoComplete="off"
                  label="Message"
                  id="msg"
                  size="small"
                  required
                />
              </FormControl>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={request}
                color="primary"
              >
                {request ? "Changing..." : "Change Status"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ChangeStatusModal;
