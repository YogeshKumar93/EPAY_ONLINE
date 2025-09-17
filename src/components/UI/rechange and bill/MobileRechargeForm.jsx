import {
  Box,
  Button,
  Card,
  styled,
  FormControl,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  Switch,
  TextField,
  Tooltip,
  Typography,
  Avatar,
  Divider,
  IconButton
} from "@mui/material";
import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
// import SuccessRechargeModal from "../modals/SuccessRechargeModal";
import { useContext } from "react";
import { PATTERNS } from "../../../utils/validators";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useToast } from "../../../utils/ToastContext";
import AuthContext from "../../../contexts/AuthContext";
import CardComponent from "./CardComponent";
import CommonCardServices from "./CommonCardServices";
const MobileRechargeForm = ({
  type,
  resetView,
  title,
  id,
  dataCategories=false,
  handleCardClick,
}) => {
  const authCtx = useContext(AuthContext);
  const userLat = authCtx.location && authCtx.location.lat;
  const userLong = authCtx.location && authCtx.location.long;
  const [isMobV, setIsMobV] = useState(true);
  const [isCustomerIdV, setIsCustomerIdV] = useState(true);
  const [checked, setChecked] = useState(true);
  const [request, setRequest] = useState(false);
  const [infoFetched, setInfoFetched] = useState(false);
  const [numberinfo, setNumberinfo] = useState();
  const [operatorCode, setOperatorCode] = useState();
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [opName, setOpName] = useState("");
  const [amount, setAmount] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [operatorVal, setOperatorVal] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState([null]);
  const [defaultIcon, setDefaultIcon] = useState();
  const [operator, setOperator] = useState();
  const [successRecharge, setSuccessRechage] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [IsOptSelected, setIsOptSelected] = useState(false);
  const [data, setData] = useState();
//   const envName = getEnv();
const {showToast} = useToast();
  const scrollContainerRef = useRef(null);
  const refreshUser = authCtx.loadUserProfile;
  console.log("opName", opName);
  let imageSrc;
  try {
    imageSrc = require(`../assets/operators/${operatorCode}.png`);
  } catch (error) {
    imageSrc = null;
  }
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // Adjust this value as needed
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
const getOperatorVal = async () => {
  const { error, response } = await apiCall(
    "get",
    ApiEndpoints.GET_OPERATOR,
    null,
    { sub_type: type === "mobile" ? title : "DTH" }
  );

  if (error) {
    showToast(error,"error");
    return;
  }

  if (response?.data) {
    const formattedOps = response.data.map((item) => ({
      code: item.code,
      name: item.name,
      img: item.img,
    }));
    setOperatorVal(formattedOps);
  }
};

const getNumberInfo = async (number) => {
  setInfoFetched(false);

  const { error, response } = await apiCall(
    "post",
    ApiEndpoints.GET_NUMBER_INFO,
    {
      number,
      type: type === "mobile" ? "M" : "D",
    }
  );

  if (error) {
    if (error.status === 403 || error.status === 404) {
      setInfoFetched(true);
    } else {
      showToast(error,"error");
    }
    return;
  }

  if (response?.info) {
    setNumberinfo({ ...response.info, customer_no: number });
    setInfoFetched(true);
    getOperatorVal();
  } else {
    setNumberinfo();
  }
};
  console.log("thoperatorVal", operatorVal);
  useEffect(() => {
    getOperatorVal();
    if (!numberinfo) {
      setDefaultIcon("");
    }
  }, [numberinfo, handleCardClick]);

  useEffect(() => {
    if (operatorVal && numberinfo) {
      operatorVal.forEach((item) => {
        if (item.code === numberinfo.operator) {
          setDefaultIcon(item.img);
        }
      });
    }
    if (mobile === "" && type === "mobile") {
      setDefaultIcon("");
    }
  }, [operatorVal, numberinfo]);

const handleSubmit = async (event) => {
  event.preventDefault();

  if (infoFetched) {
    document.activeElement.blur();

    let rechargeType;
    if (type === "mobile") {
      rechargeType = title === "Prepaid" ? "PREPAID" : "POSTPAID";
    } else {
      rechargeType = "DTH";
    }

    const number =
      type === "mobile"
        ? title === "Prepaid"
          ? event.currentTarget.mobile.value
          : undefined
        : type === "dth"
        ? customerId
        : undefined;

    const payload = {
      number,
      param1: title === "Postpaid" ? event.currentTarget.mobile.value : undefined,
      operator: operatorCode || numberinfo?.operator,
      amount: event.currentTarget.amount.value,
      type: rechargeType,
      pf: "WEB",
      latitude: userLat || undefined,
      longitude: userLong || undefined,
    };

    // Example: if you want to directly call recharge API here:
    // const { error, response } = await apiCall("post", ApiEndpoints.RECHARGE, payload);

    refreshUser();
    setData(payload);
    setModalVisible(true);
  } else {
    refreshUser();
    getNumberInfo(customerId);
  }
};
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    getOperatorVal();
    // setAnchorEl(event.currentTarget);
  };
  const handleCloseMenue = () => {
    setAnchorEl(null);
  };

  const handleOperatorChange = (event) => {
    // const selectedOperator = operatorVal.find(item => item.code === event.target.value);
    setOperator(selectedOperator);
    setOpName(selectedOperator ? selectedOperator.name : "");
    // Update the operator image
  };

  const handleOpenVal = (opt) => {
    if (!IsOptSelected) {
      setIsOptSelected(true);
    }
    setOpName(opt.name);
    console.log("selested code", opt.code);

    setOperatorCode(opt.code);
    // alert(`You clicked on: ${operatorVal}`);
  };

  const handleBack = () => {
    resetView(false);
  };
  console.log("the opName is ", operatorCode);

  return (
    <>
      <div className="position-relative">
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          sx={{ mb: { md: 2, sm: 4, xs: 4 }, marginLeft: 0 }}
        >
          {dataCategories?dataCategories
            ?.filter((category) => title ==="Postpaid" ? category?.title === "Utility With Commission" : category?.title ==="Utility")
            .map((category, index) => (
              <Box
                key={index}
                sx={{
                  width: "100%",
                  margin: "0 auto",
                  marginBottom: 1,
                  border: "1px solid lightgray",
                  padding: { lg: 1.1, md: 1.2, xs: 2, sm: 3 },
                  borderRadius: 3,

                  paddingRight: 1,
                  flexWrap: "wrap",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Typography
                  variant="h6"
                  align="left"
                  sx={{
                    ml: 0.5,
                    mt:"-8px",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  {category.title}
                </Typography>

                <Box
                  sx={{
                    // overflowX: "scroll",
                    height: "100px",
                    display: "flex",
                  mt:-2,
                    flexDirection: "row",
                    width: {
                      lg: "67vw",
                      md: "67vw",
                      sm: "82vw",
                      xs: "82vw",
                    },
                  }}
                >
                  <IconButton
                  onClick={() => handleScroll("left")}
                  sx={{
                    position: "absolute",
                    left: 0,
                    mt:4,
                    zIndex: 1,
               color:"#000"
                  }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <Box
                  ref={scrollContainerRef}
                  sx={{
                    display: "flex",
                    width: "100%",
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    padding: 1,
                    "&::-webkit-scrollbar": {
                      display: "none", // Hide the scrollbar
                    },
                  }}
                >
                                    {category.data.map((item) => (
                    <Box
                      sx={{
                        px: 1,
                      }}
                    >
                      <CommonCardServices
                        title={item.name}
                        img={item.img}
                        isSelected={id === item.id}
                        onClick={() => handleCardClick(item)}
                        width="200px"
                      />
                    </Box>
                  ))}
                  </Box>
                  <IconButton
                  onClick={() => handleScroll("right")}
                  sx={{
                    position: "absolute",
                    right: 0,
                    mt:4,
                    zIndex: 1,
                   color:"#000"
                  }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
                </Box>
              </Box>
            )):[]}

{dataCategories&&
            <Button
              size="small"
              onClick={handleBack}
              sx={{
                display: "flex",
                alignItems: "center",
                textTransform: "none",
                p: 1.4,
                mr: 1,
                mb: -5,
              }}
            >
              <ArrowBackIcon sx={{ color: "#000", fontSize: "24px" }} />
            </Button>
}
            {/* <Button
            size="small"
            id="verify-btn"
            className="button-props"
            onClick={handleBack}
            sx={{
              mb: 3,
            }}
          >
            <span style={{ marginRight: "5px" }}>Home</span>
            <img
              src={back}
              alt="back"
              style={{ width: "18px", height: "20px" }}
            />
          </Button> */}
          {/* <Loader loading={request} /> */}
          {!IsOptSelected && (
            <Grid container spacing={2}>
              {operatorVal &&
                operatorVal.map((operator, index) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    key={index}
                    sx={{ height: "100px" }}
                  >
                    <CardComponent
                      title={operator.name}
                      img={operator.code}
                      onClick={() => handleOpenVal(operator)}
                    />
                  </Grid>
                ))}
            </Grid>
          )}

          {IsOptSelected && (
            <Grid
              container
              spacing={2}
              sx={{ height: "100%", border: "1px solid #ccc", ml: 0.5 ,width:"100%"}}
            >
              <Grid
                item
                lg={4}
                xs={12}
                sm={3.8}
                sx={{
                  overflowY: "auto",
                  borderRight: "1px solid #ccc",
                }}
              >
                {operatorVal &&
                  operatorVal.map((operator, index) => (
                    <CardComponent
                      title={operator.name}
                      setOpIcon={setOperatorCode}
                      img={operator.code}
                      height="55px"
                      isSelected={opName === operator.name}
                      onClick={() => handleOpenVal(operator)}
                    />
                  ))}
              </Grid>

              <Grid item lg={7.8} xs={12} sm={8.2}>
                <Grid sx={{ height: "75%", position: "relative" }}>
                  <Box sx={{ p: 3 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <img
                          src={imageSrc}
                          alt="Operator Icon"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "20px",
                            fontWeight: "bold",
                          }}
                        >
                          {type === opName ? title : opName}
                        </Typography>
                      </div>

                      {type === "mobile" && (
                        <div style={{ textAlign: "right" }}>
                          <Typography
                            sx={{
                              mr: 4,
                              fontSize: "25px",
                              fontWeight: "bold",
                            }}
                          >
                            {title}
                          </Typography>
                          {/* <Tooltip title={title === "Prepaid" ? "Postpaid" : "Prepaid"}>
                      <Switch
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ "aria-label": "controlled" }}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: primaryColor(),
                          },
                        }}
                      />
                    </Tooltip> */}
                        </div>
                      )}
                    </div>

                    {/* Form Section */}
                    <Box
                      component="form"
                      id="recharge"
                      validate
                      autoComplete="off"
                      onSubmit={handleSubmit}
                      sx={{
                        "& .MuiTextField-root": { m: 2 },
                        objectFit: "contain",
                        overflowY: "scroll",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sx={{
                          mt: 5,
                        }}
                      >
                        {type === "mobile" && (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              label="Mobile Number"
                              id="mobile"
                              type="number" // Change to 'text' to allow for custom input validation
                              size="small"
                              error={
                                !isMobV ||
                                (mobile.length === 10 && mobile.startsWith("0"))
                              }
                              helperText={
                                !isMobV
                                  ? "Enter valid Mobile"
                                  : mobile.length === 10 &&
                                    mobile.startsWith("0")
                                  ? "Mobile number cannot start with 0"
                                  : ""
                              }
                              InputProps={{
                                inputProps: { maxLength: 10 },
                              }}
                              value={mobile}
                              onChange={(e) => {
                                const value = e.target.value;

                                // Prevent typing '0' as the first character and more than 10 digits
                                if (
                                  value.length > 10 ||
                                  (value.length === 1 && value.startsWith("0"))
                                ) {
                                  return; // Do not update state if the condition is met
                                }

                                // Set initial state for validations
                                if (value === "") {
                                  setIsMobV(true);
                                  setMobile(value);
                                  setInfoFetched(false);
                                  setAmount("");
                                  setNumberinfo("");
                                  setOperator("");
                                  return;
                                }

                                // Update validation state
                                const isValidLength = value.length === 10;
                                const isValidPattern =
                                  PATTERNS.MOBILE.test(value);
                                const startsWithZero = value.startsWith("0");

                                // Set the validation flag based on the conditions
                                setIsMobV(isValidPattern && !startsWithZero);

                                setMobile(value);

                                // Fetch number info only if it is a valid 10-digit number
                                if (
                                  title==="Prepaid"&&
                                  isValidLength &&
                                  isValidPattern &&
                                  !startsWithZero
                                ) {
                                  getNumberInfo(value);
                                } else {
                                  setInfoFetched(false);
                                  setAmount("");
                                  setNumberinfo("");
                                  setOperator("");
                                }
                              }}
                              required
                              disabled={request}
                            />
                          </FormControl>
                        )}
                        {type === "dth" && (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              autoComplete="off"
                              label="Customer ID"
                              id="customer-id"
                              type="tel"
                              error={!isCustomerIdV}
                              helperText={
                                !isCustomerIdV ? "Enter valid Customer Id" : ""
                              }
                              size="small"
                              inputProps={{ maxLength: 20 }}
                              onChange={(e) => {
                                const value = e.target.value;
                                setCustomerId(value);
                                setIsCustomerIdV(PATTERNS.DTH.test(value));
                                if (value === "") {
                                  setIsCustomerIdV(true);
                                  setInfoFetched(false);
                                  setAmount("");
                                  setNumberinfo("");
                                  setOperator("");
                                }
                              }}
                              required
                              InputProps={{
                                // endAdornment: infoFetched &&
                                //   envName !== PROJECTS.moneyoddr && (
                                //     <InputAdornment position="end">
                                //       <Button
                                //         variant="text"
                                //         onClick={() =>
                                //           getNumberInfo(customerId)
                                //         }
                                //       >
                                //         get Info
                                //       </Button>
                                //     </InputAdornment>
                                //   ),
                              }}
                            />
                          </FormControl>
                        )}
                      </Grid>

                      <Grid item xs={12}>
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            autoComplete="off"
                            label="Amount"
                            id="amount"
                            size="small"
                            type="number"
                            value={amount || ""}
                            onChange={(e) => setAmount(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "+" || e.key === "-") {
                                e.preventDefault();
                              }
                            }}
                            InputProps={{
                              inputProps: { max: 10000, min: 10 },
                            //   endAdornment: infoFetched &&
                            //     title === "Prepaid" && (
                            //       <InputAdornment position="end">
                            //         <AllPlansBar
                            //           operator={operatorCode && operatorCode}
                            //           onClick={(plan) => setAmount(plan?.plan)}
                            //         />
                            //       </InputAdornment>
                            //     ),
                            }}
                            required
                            disabled={request}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          form="recharge"
                          className="btn-background"
                          sx={{
                            width: "95%",
                            mt: 1,
                          }}
                          disabled={request}
                        >
                          <span>
                            {infoFetched
                              ? "Proceed to pay"
                              : type === "mobile"
                              ? "Proceed"
                              : "Fetch Info"}
                          </span>
                        </Button>
                      </Grid>

                      {/* {infoFetched && numberinfo && (
                        <RepeatRechargeModal
                          data={numberinfo}
                          imageSrc={imageSrc}
                          setAmount={setAmount}
                        />
                      )} */}
                      {/* {modalVisible && (
                        <EnterMpinModal
                          data={data}
                          customerId={customerId}
                          setModalVisible={setModalVisible}
                          setSuccessRechage={setSuccessRechage}
                          apiEnd={ApiEndpoints.PREPAID_RECHARGE}
                          view="recharge"
                          setShowSuccess={setShowSuccess}
                          setMobile={setMobile}
                          setInfoFetched={setInfoFetched}
                        />
                      )} */}
                      {/* {showSuccess && (
                        <SuccessRechargeModal
                          successRecharge={successRecharge}
                          setShowSuccess={setShowSuccess}
                        />
                      )} */}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
};

export default MobileRechargeForm;
