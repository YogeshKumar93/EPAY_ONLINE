// Login.js (Updated Layout - Image Left, Login Right, Full Functionality, Scrollbar Hidden)
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  Grid,
  Modal,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PhoneAndroid,
  Lock,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import * as Yup from "yup";
import AuthContext from "../contexts/AuthContext";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import { ReTextField } from "../components/common/ReTextField";
import backImg from "../assets/Login/login second.png";
import VerifyMpinLogin from "../components/UI/VerifyMpinLogin";
import { getGeoLocation } from "../utils/GeoLocationUtil";
import { okErrorToast } from "../utils/ToastUtil";
import ForgotPassword from "../components/common/ForgotPassword";
import biggpayLogo from "../assets/Images/PPALogo6.png";
import lockicon from "../assets/lock.png";
import mobilelogin from "../assets/mobile.png";
import ReCAPTCHA from "react-google-recaptcha";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const validationSchema = Yup.object({
  mobile: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Only letters and numbers are allowed")
    .required("Mobile is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMpinRequired, setIsMpinRequired] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureValidate, setSecureValidate] = useState("");
  const [loginError, setLoginError] = useState("");
  const [otpRef, setOtpRef] = useState("");
  const [forgotModal, setForgotModalOpen] = useState(false);

  const [captchaChecked, setCaptchaChecked] = useState(false);
  const captchaRef = useRef(null);

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [location, setLocation] = useState({ lat: null, long: null });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    getGeoLocation(
      (lat, long) => {
        console.log("✅ User Location fetched:", { lat, long });
        setLocation({ lat, long });
        localStorage.setItem("location", JSON.stringify({ lat, long }));
      },
      (err) => {
        console.error("❌ Location Error:", err);
        okErrorToast("Location access denied or unavailable");
      }
    );
  }, []);

  const onSubmit = async (data) => {
    if (!location.lat || !location.long) {
      setLoginError(
        "Unable to detect location. Please enable GPS and try again."
      );
      console.error("Login blocked: Missing location data", location);
      return;
    }
    // else if (!captchaChecked) {
    //   return true;
    // }

    setLoading(true);
    setLoginError("");
    setUsername(data.mobile);
    setPassword(data.password);

    try {
      const { error, response } = await apiCall("POST", ApiEndpoints.SIGN_IN, {
        username: data.mobile,
        password: data.password,
        latitude: location.lat,
        longitude: location.long,
      });

      if (error) {
        setLoginError(error.message || "Login failed");
        return;
      }

     if (response) {
        const token = response.message.token;
        await authCtx.login(token);
        
      const userResult = await apiCall("get", ApiEndpoints.GET_ME_USER);
              if (userResult.response) {
                const userData = userResult.response.data;
                authCtx.saveUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
      
                if (userData.role === "adm" || userData.role === "sadm") {
                  navigate("/admin/banks");
                
                
                } else {
                  navigate("/other/banks");
                }
              }
        else navigate("/");
      } else {
        setLoginError("Unexpected response from server");
      }
    } catch (err) {
      setLoginError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  const handleForgotPassword = () => setForgotModalOpen(true);

  // const captchaclickApi = () => {
  //   setCaptchaChecked(true);
  //   console.log("Clicked Captcha");
  // };

  const mobileInputProps = {
    style: { padding: 0, borderRadius: "20px" },
    endAdornment: (
      <img
        src={PersonIcon}
        alt="mobile"
        style={{ width: "57px" }}
        sx={{ color: "#757575" }}
      />
    ),
  };

  // InputProps for Password
  const passwordInputProps = (showPassword, setShowPassword) => ({
    style: { padding: 0, borderRadius: "20px" },
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
        {/* <img
          src={lockicon}
          alt="lock"
          style={{ width: "57px", alignItems: "flex-end" }}
        /> */}
      </InputAdornment>
    ),
  });

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND IMAGE FULL WIDTH */}
    <Box
  component="img"
  src={backImg}
  alt="Background"
  sx={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    display: { xs: "none", md: "block" }, // ⭐ Hide on mobile
  }}
/>


      {/* LOGIN FORM OVERLAY ON LEFT SIDE */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
        left: { xs: 0, md: 40 },

          height: "100%",
          width: { xs: "100%", md: "45%" }, // form left area on desktop
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 3, md: 8 },
          zIndex: 2, // keeps it above image
          background: "rgba(255,255,255,0.0)",
          boxSizing: "border-box",
        }}
      >
        {/* form container (keeps exact functionality) */}
        <Box sx={{ width: "100%", maxWidth: 520 }}>
          {/* Logo */}
          <Box
            component="img"
            src={biggpayLogo}
            alt="Logo"
            sx={{
              width: "100%",
              maxWidth: 300,
              mb: 3,
              objectFit: "contain",

              cursor: "pointer",
              display: "block",
              mx: "auto",
            }}
            // onClick={() => window.open("https://p2pae.com")}
          />

          {/* Error */}
          {loginError && (
            <Typography color="error" align="center" sx={{ mb: 3 }}>
              {loginError}
            </Typography>
          )}

          {/* form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: "100%" }}
          >
            {/* User ID */}
            <ReTextField
              fullWidth
              size="medium"
              placeholder="Enter Username"
              sx={{
                mt: 4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px", // ⭐ custom border radius
                },
                "& .MuiInputLabel-root": {
                  transform: "translate(14px, 12px) scale(1)", // label inside
                },
                "& .MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75)", // label moves up on typing
                },
              }}
              label="User ID"
              {...register("mobile", {
                onChange: (e) => setUsername(e.target.value),
              })}
              margin="normal"
              error={!!errors.mobile}
              helperText={errors.mobile?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#757575" }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <ReTextField
              fullWidth
              size="medium"
              placeholder="Enter Password"
              sx={{
                mt: 5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px", // rounded input
                },
                "& .MuiInputLabel-root": {
                  transform: "translate(14px, 12px) scale(1)", // label inside
                },
                "& .MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75)", // label moves up
                },
              }}
              label="Password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                ...passwordInputProps(showPassword, setShowPassword), // keep eye toggle
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#757575", ml: 2 }} />
                    {/* OR your image:
        <img
          src={passwordIcon}
          alt="password"
          style={{ width: 20, height: 20, opacity: 0.7 }}
        />
        */}
                  </InputAdornment>
                ),
              }}
            />

            {/* Forgot Password (right aligned) */}
            <Box display="flex" justifyContent="flex-end" mt={1.3}>
              <Button
                variant="text"
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  color: "#5210c1",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </Button>
            </Box>

            {/* ReCAPTCHA - kept commented as in your original code */}
            {/*
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_SITE_KEY}
              ref={captchaRef}
              onExpired={() => setCaptchaChecked(false)}
              onChange={captchaclickApi}
              style={{ width: "100%", justifyContent: "center", display: "flex", alignItems:"center", mb:2 }}
            />
          */}

            {/* Terms & Conditions (keeps state and link) */}
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" color="textSecondary" fontSize={12}>
                  I agree
                  {/* <Link
                  href="/terms-conditions"
                  underline="always"
                  color="#4253F0"
                  fontSize={12}
                >
                  Terms and Conditions
                </Link> */}
                {/* </Typography>
              }
              sx={{ width: "100%", textAlign: "center", marginBottom: 0 }}
            /> */} 

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                background:
                  "linear-gradient(to right, #492077, rgba(73, 32, 119, 0.7))",

                "&:hover": {
                  background: "#5210c1",
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>

            {/* Buttons
            <Button
              fullWidth
              variant="contained"
              sx={{
                mb: 2,
                backgroundColor: "#FACC15",
                color: "#1E3A8A",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#EAB308" },
              }}
            >BTN
            </Button> */}

            {/* Back to QR button (keeps navigation)
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowBackIcon />}
              sx={{
                py: 0.5,
                borderRadius: 2,
                fontWeight: 600,
                minWidth: 80,
                color: "#5210c1",
                borderColor: "#5210c1",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#5210c1",
                  color: "#fff",
                  borderColor: "#5210c1",
                },
              }}
              onClick={() => navigate("/qrLogin")}
            >
              Back to QR
            </Button>
          </Box> */}

            {/* Sign up link (keeps UX)
          <Box sx={{ mt: 2 }}>
            <Typography component="span" sx={{ mr: 1 }}>
              or
            </Typography>
            <Link href="/signup" underline="hover" color="#5210c1">
              Sign up
            </Link>
          </Box> */}
          </Box>
        </Box>
      </Box>

      {/* MPIN / OTP Modal (unchanged)
      <Modal
        open={isMpinRequired}
        onClose={handleMpinVerificationClose}
        aria-labelledby="verification-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500, md: 600 },
            p: 4,
            borderRadius: 3,
          }}
        >
          <VerifyMpinLogin
            username={username}
            password={password}
            otpRef={otpRef}
            secureValidate={secureValidate}
            setIsOtpField={setIsMpinRequired}
            onVerificationSuccess={handleMpinVerificationSuccess}
            btn="Verify & Login"
          />
        </Box>
      </Modal> */}

      {/* Forgot Password Modal (unchanged) */}
      <ForgotPassword
        open={forgotModal}
        onClose={() => setForgotModalOpen(false)}
        initialUsername={username}
      />
    </Box>
  );
};

export default Login;

