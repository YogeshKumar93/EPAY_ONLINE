import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect } from "react";

import { useState } from "react";
import { useContext } from "react";

import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../common/CommonModal";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonMpinModal from "../common/CommonMpinModal";
import Loader from "../common/Loader";
import CommonLoader from "../common/CommonLoader";
import defaultLayout from '../../assets/Images/defaultLayout.png';
import servicelayout  from "../../assets/Images/layout2.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const ChangeLayoutModal = ({ open, onClose, onSuccess, username }) => {
  const { showToast } = useToast();
  const [request, setRequest] = useState(false);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const [MpinCallBackVal, setMpinCallBackVal] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [otpRef, setOtpRef] = useState(null);
  const [otp, setOtp] = useState("");
  const [mpin, setMpin] = useState("");
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const loadUserProfile = authCtx?.loadUserProfile;
  
  const [value, setValue] = React.useState(user?.layout * 1);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const newValue = event.target.value * 1;
    setValue(newValue);
    setSelectedLayout(newValue);
    setMpinModalOpen(true);
  };
const changeSwitch = useCallback(
  async (mpin) => {
    if (!selectedLayout) return;

    const data = { is_layout: selectedLayout, mpin: mpin * 1 };
    setRequest(true);
    
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CHANGE_USER_LAYOUT,
        data,
        null
      );

      if (response) {
        const userData = response?.data?.data;
        showToast(response?.data?.message || "Layout changed successfully", "success");
        // authCtx.saveUser(userData);
        
         loadUserProfile(); // Refresh user profile to get updated layout
        onClose();
        setMpinCallBackVal(false);
      
      } else {
        showToast(error?.message || "Failed to change layout", "error");
       
      }
    } catch (err) {
      console.error("Error changing layout:", err);
      showToast("Something went wrong while changing layout", "error");
    } finally {
      setRequest(false);
    }
  },
  [selectedLayout, authCtx, onClose, onSuccess, showToast, setRequest, setMpinCallBackVal]
);
  useEffect(() => {
    if (user?.is_layout) {
      setValue(user?.is_layout * 1);
    }
  }, [user]);

  useEffect(() => {
    if (MpinCallBackVal && selectedLayout) {
      changeSwitch(MpinCallBackVal);
    }
  }, [MpinCallBackVal, selectedLayout, changeSwitch]);

  const handleClose = () => {
    setSelectedLayout(null);
    setMpinCallBackVal(false);
    onClose();
  };

  return (
    <>
      <CommonLoader loading={request} text="Changing Layout..." />

      <CommonModal
        open={open}
        title="Choose between layouts"
        onClose={handleClose}
        footerButtons={[]}
      >
        <Box sx={{ my: 3, display: "flex", justifyContent: "center" }}>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
              row
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 4 },
              }}
            >
              <FormControlLabel
                value={1}
                control={<Radio />}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      border: "2px solid #7d7fa8ff",
                    }}
                  >
                    <Typography
                      sx={{
                        mb: 2,
                        textAlign: "center",
                        textDecoration:
                          value === 1 ? "underline solid #4045A1 3px" : "none",
                        fontWeight: value === 1 ? "bold" : "normal",
                        color: value === 1 ? "#4045A1" : "inherit",
                      }}
                    >
                      Default Layout
                    </Typography>
                    <img
        src={defaultLayout} 
        alt="default layout"
        style={{
          width: 300,
          height: 150,
          borderRadius: 8,
          objectFit: "cover",
        }}
      />
                    {/* <img src={defaultLayout} alt="default" width="300px" /> */}
                    <Box
                      sx={{
                        width: { xs: 200, sm: 250, md: 300 },
                        height: 25,
                        bgcolor: value === 1 ? "primary.main" : "grey.200",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: value === 1 ? "white" : "grey.500",
                      }}
                    >
                      Default Layout Preview
                    </Box>
                  </Box>
                }
                labelPlacement="top"
                sx={{ m: 0 }}
              />
              <FormControlLabel
                value={2}
                control={<Radio />}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                         border: "2px solid #7d7fa8ff",
                    }}
                  >
                    <Typography
                      sx={{
                        mb: 2,
                        textAlign: "center",
                        textDecoration:
                          value === 2 ? "underline solid #4045A1 3px" : "none",
                        fontWeight: value === 2 ? "bold" : "normal",
                        color: value === 2 ? "#4045A1" : "inherit",
                      }}
                    >
                      Services Layout
                    </Typography>
                              <img
        src={servicelayout} 
        alt="default layout"
        style={{
          width: 300,
          height: 150,
          borderRadius: 8,
          objectFit: "cover",
        }}
      />
                    {/* <img src={servicelayout} alt="new_nav" width="300px" /> */}
                    <Box
                      sx={{
                        width: { xs: 200, sm: 250, md: 300 },
                        height: 25,
                        bgcolor: value === 2 ? "secondary.main" : "grey.200",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: value === 2 ? "white" : "grey.500",
                      }}
                    >
                      Services Layout Preview
                    </Box>
                  </Box>
                }
                labelPlacement="top"
                sx={{ m: 0 }}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </CommonModal>
      {/* MPIN Verification Modal */}
      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        mPinCallBack={(mPinValue) => {
          setMpinCallBackVal(mPinValue);
        }}
        title="Verify MPIN to Change Layout"
        onClose={() => {
          setMpinModalOpen(false);
          setSelectedLayout(null);
        }}
      />
    </>
  );
};

export default ChangeLayoutModal;
