import React from "react";
import { Box, Divider } from "@mui/material";
// import MyButton from "../component/MyButton";
import LogoComponent from "../../assets/Images/logo(1).png";
// import { indoNepal } from "../iconsImports";
// import Loader from "../component/loading-screen/Loader";
// import Mount from "../component/Mount";
import ReButton from "./ReButton";
import CommonLoader from "./CommonLoader";

const ModalFooter = ({
  form,
  btn,
  twobuttons = false,
  request = false,
  disable = false,
  disableButtontwo = false,
  handleClose,
  type = "submit",
  onClick,
  onClick2,
  icon = false,
  nepalFooter = false,
  loadingInButton = true,
  red1 = false,
  red2 = false,
}) => {
  return (
    <>
      <Divider sx={{ color: "#000", mt: 3, mb: 2 }} />
      <div
        style={{
          width: "100%",
          // mt: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            backdropFilter: "blur(16px) saturate(180%)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderRadius: "12px",
            paddingLeft: 12,
            paddingRight: 12,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* <LogoComponent width="100px" /> */}
          {/* <LogoComponent width="150px" /> */}
        </div>

        {!nepalFooter && (
          <Box sx={{ position: "relative" }}>
            {!handleClose && (
              <div className="d-flex justify-content-between">
                {/* <Mount visible={loadingInButton}> */}
                  <CommonLoader loading={request} size="small" />
                {/* </Mount> */}
                <ReButton
                  text={btn ? btn : "Save"}
                  disabled={request || disable}
                  type={type}
                  form={form ? form : ""}
                  red={red1}
                  onClick={onClick}
                  icon={icon}
                     label={"Proceed"}
                />
                {twobuttons && (
                  <Box sx={{ ml: 4 }}>
                    <ReButton
                      text={twobuttons ? twobuttons : "Save"}
                      disabled={request || disableButtontwo}
                      type={type}
                      form={form ? form : ""}
                      red={red2}
                      onClick={onClick2}
                      icon={icon}
                       label={"Proceed"}
                    />
                  </Box>
                )}
              </div>
            )}
            <CommonLoader loading={request} size="small" />
            {handleClose && (
              <ReButton text={btn ? btn : "Cancel"} onClick={handleClose} />
            )}
          </Box>
        )}
        {nepalFooter && (
          <Box sx={{ position: "relative" }}>
            {/* <img src={indoNepal} alt="imgof nepal" style={{ width: "100px" }} /> */}
          </Box>
        )}
      </div>
    </>
  );
};

export default ModalFooter;