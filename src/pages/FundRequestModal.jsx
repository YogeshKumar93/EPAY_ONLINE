import * as React from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  Grid,
  TextField,
  IconButton,
  Tooltip,
  Button,
  Drawer,
} from "@mui/material";


import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import numWords from "num-words";
import { useState } from "react";
import PinInput from "react-pin-input";

import { secondaryColor } from "../theme/setThemeColor";
import { Icon } from "@iconify/react";
import ApiEndpoints from "../api/ApiEndpoints";

const FundRequestModal = ({ row, action = "status", refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [mpin, setMpin] = useState("");
  const [remarkVal, setRemarkVal] = useState("");
  const [numberToWord, setNumberToWord] = useState(numWords(row.amount));

  const handleOpen = () => {
    setNumberToWord(numWords(row.amount));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAmountChange = (event) => {
    setNumberToWord(numWords(event.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      id: row.id,
      amount: form.amt.value,
      remark: remarkVal,
      action: action,
      mpin: mpin,
    };

    setRequest(true);

    post(
      ApiEndpoints.UPDATE_FUND_REQUEST,
      data,
      setRequest,
      (response) => {
        if (data.action === "REJECT") {
          okSuccessToast("Request cancelled successfully");
        } else {
          okSuccessToast("Request Processed successfully");
        }
        handleClose();
        if (refresh) refresh();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.4 }}>
      {action === "APPROVE" && (
      <Tooltip title="Approve">
  <IconButton onClick={handleOpen} sx={{ color: "#32b83b" }}>
    <Icon icon="mdi:check-circle" width={25} height={25} />
  </IconButton>
</Tooltip>
      )}

      {action === "REOPEN" && (
        <Tooltip title="Reopen">
          <Button
            className="button-red"
            sx={{ fontSize: "10px", background: secondaryColor() }}
            variant="contained"
            onClick={handleOpen}
          >
            Reopen
          </Button>
        </Tooltip>
      )}

      {action === "REJECT" && (
       <Tooltip title="Reject">
  <IconButton onClick={handleOpen} sx={{ color: "#e01a1a" }}>
    <Icon icon="mdi:close-circle" width={25} height={25} />
  </IconButton>
</Tooltip>
      )}

      <Drawer open={open} anchor="right" onClose={handleClose}>
        <Box sx={{ width: 400 }} className="sm_modal">
          <ModalHeader
            subtitle="Take Action: Quick and Simple Fund Request!"
            title={`${action} (${row.name})`}
            handleClose={handleClose}
          />

          <Box
            component="form"
            id="cred_req"
            autoComplete="off"
            validate="true"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 2 },
              objectFit: "contain",
              overflowY: "scroll",
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Amount"
                    id="amt"
                    defaultValue={row.amount}
                    inputProps={{
                      readOnly: action !== "APPROVE" ? true : false,
                      maxLength: 9,
                      type: "number",
                    }}
                    onChange={handleAmountChange}
                    size="small"
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Amount in Words"
                    id="inWords"
                    value={numberToWord}
                    inputProps={{ readOnly: true }}
                    size="small"
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Remarks"
                    id="remarks"
                    size="small"
                    onChange={(e) => setRemarkVal(e.target.value)}
                    required
                  />
                </FormControl>
              </Grid>

              <Grid
                item
                md={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl>
                  <div style={{ textAlign: "center", marginBottom: "8px" }}>
                    M-PIN
                  </div>
                  <PinInput
                    length={6}
                    type="password"
                    onChange={(value) => setMpin(value)}
                    inputMode="numeric"
                    regexCriteria={/^[0-9]*$/}
                    inputStyle={{
                      width: "40px",
                      height: "40px",
                      marginRight: "5px",
                      textAlign: "center",
                      border: "none",
                      borderBottom: "1px solid #000",
                      outline: "none",
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid
                item
                md={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  pr: 12,
                  mt: 2,
                }}
              >
                <Box sx={{ mr: 4 }}>
                  <ResetMpin />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mr: "5px" }}>
            <ModalFooter form="cred_req" type="submit" request={request} />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default FundRequestModal;
