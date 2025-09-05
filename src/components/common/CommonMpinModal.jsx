import { Button, FormControl, Grid, Modal } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import PinInput from "react-pin-input";

import { useContext } from "react";
import CommonModal from "./CommonModal";
import AuthContext from "../../contexts/AuthContext";
import ResetMpin from "./ResetMpin";
import OtpInput from "react-otp-input";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const CommonMpinModal = ({
  open,
  setOpen,
  hooksetterfunc,
  radioPrevValue,
  mPinCallBack,
  title = "Enter MPIN",
}) => {
  const [err, setErr] = useState("");
  const [otp, setOtp] = useState("");
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const username = user && user.username;

  const handleClose = () => {
    setOpen(false);
    if (hooksetterfunc) hooksetterfunc(radioPrevValue);
    setErr("");
    setOtp("");
  };

  const handleMpinCB = (value) => {
    if (mPinCallBack) mPinCallBack(value);
    setOpen(false);
  };

  const handleChange = (value) => {
    setOtp(value);
    if (value.length === 6) {
      handleMpinCB(value);
    }
    if (err !== "") {
      setErr("");
    }
  };

  const handleSubmit = () => {
    if (otp.length < 6) {
      setErr("Please enter a 6-digit MPIN");
      return;
    }
    handleMpinCB(otp);
  };

  return (
    <CommonModal open={open} onClose={handleClose} title={title}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ "& .MuiTextField-root": { m: 2 } }}
      >
        <Grid container sx={{ pt: 1 }}>
          <Grid
            item
            md={12}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <OtpInput
              value={otp}
              onChange={handleChange}
              numInputs={6}
              isInputSecure={true}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: "40px",
                height: "40px",
                margin: "0 5px",
                fontSize: "18px",
                borderBottom: "2px solid #000",
                outline: "none",
                textAlign: "center",
              }}
            />
          </Grid>

          {err && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                ml: 5,
                fontSize: "12px",
                px: 2,
                color: "#DC5F5F",
                width: "100%",
              }}
            >
              <div>{err}</div>
            </Box>
          )}
        </Grid>

        <Grid
          container
          sx={{ display: "flex", justifyContent: "end", pr: 4, mt: 2 }}
        >
          <Grid item>
            <ResetMpin variant="text" py mt username={username} />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={{
            bgcolor: "#8cc751",
            py: 1.5,
            fontSize: "15px",
            fontWeight: "bold",
            borderRadius: "8px",
            textTransform: "none",
            mt: 2,
            "&:hover": { bgcolor: "rgb(72, 176, 77)" },
          }}
        >
          Set New Password
        </Button>
      </Box>
    </CommonModal>
  );
};

export default CommonMpinModal;
