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
import React, { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { useToast } from "../../utils/ToastContext";
import CommonModal from "../common/CommonModal";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import CommonLoader from "../common/CommonLoader";
import defaultLayout from "../../assets/Images/defaultLayout.png";
import servicelayout from "../../assets/Images/layout2.png";

const ChangeLayoutModal = ({ open, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const loadUserProfile = authCtx?.loadUserProfile;

  const [value, setValue] = useState(user?.layout * 1 || 1);
  const [request, setRequest] = useState(false);

  const changeLayout = useCallback(
    async (layoutValue) => {
      setRequest(true);
      try {
        const { error, response } = await apiCall(
          "POST",
          ApiEndpoints.CHANGE_USER_LAYOUT,
          { is_layout: layoutValue }
        );

        if (response) {
          showToast(
            response?.data?.message || "Layout changed successfully",
            "success"
          );
          loadUserProfile(); // refresh user profile
          onClose();
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
    [showToast, loadUserProfile, onClose]
  );

  const handleChange = (event) => {
    const layoutValue = Number(event.target.value);
    setValue(layoutValue);
    changeLayout(layoutValue); // direct API call on selection
  };

  return (
    <>
      <CommonLoader loading={request} text="Changing Layout..." />
      <CommonModal
        open={open}
        title="Choose between layouts"
        onClose={onClose}
        footerButtons={[]}
      >
        <Box sx={{ my: 3, display: "flex", justifyContent: "center" }}>
          <FormControl>
            <RadioGroup
              row
              value={value}
              onChange={handleChange}
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 4 },
              }}
            >
              {/* Default Layout */}
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
              {/* Services Layout */}
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
                      alt="services layout"
                      style={{
                        width: 300,
                        height: 150,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
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
    </>
  );
};

export default ChangeLayoutModal;
