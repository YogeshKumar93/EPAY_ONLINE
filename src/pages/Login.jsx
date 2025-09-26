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
import { Visibility, VisibilityOff, PhoneAndroid, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AuthContext from "../contexts/AuthContext";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import { ReTextField } from "../components/common/ReTextField";
import backImg from "../assets/Images/LoginNew.svg";
import VerifyMpinLogin from "../components/UI/VerifyMpinLogin";
import { getGeoLocation } from "../utils/GeoLocationUtil";
import { okErrorToast } from "../utils/ToastUtil";
import ForgotPassword from "../components/common/ForgotPassword";
import biggpayLogo from "../assets/Images/PPALogo.jpeg";
import lockicon from "../assets/lock.png";
import mobilelogin from "../assets/mobile.png";
import ReCAPTCHA from "react-google-recaptcha";

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
    const captchaRef = useRef(null);
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    getGeoLocation(
      (lat, long) => authCtx.setLocation(lat, long),
      (err) => okErrorToast("Location", err)
    );
  }, []);

  const onSubmit = async (data) => {
    if (!agreedToTerms) {
      setLoginError("You must agree to the Terms and Conditions");
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
      });

      if (error) {
        setLoginError(error.message || "Login failed");
        return;
      }

      if (response?.data === "MPIN") {
        setSecureValidate("MPIN");
        setIsMpinRequired(true);
      } else if (response?.data === "OTP") {
        setSecureValidate("OTP");
        setOtpRef(response.message);
        setIsMpinRequired(true);
      } else if (response?.data?.access_token) {
        const token = response.data.access_token;
        await authCtx.login(token);

        if (user?.role === "adm") navigate("/admin/dashboard");
        else if (user?.role === "ret") navigate("/customer/dashboard");
        else if (user?.role === "user") navigate("/user/home");
        else if (user?.role === "md") navigate("/md/dashboard");
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

  const handleMpinVerificationSuccess = () => setIsMpinRequired(false);
  const handleMpinVerificationClose = () => setIsMpinRequired(false);
  const handleForgotPassword = () => setForgotModalOpen(true);

  
  const captchaclickApi = () => {
    setCaptchaChecked(true);
    console.log("Clicked Captcha");
  };

const mobileInputProps = {
  style: { padding: 0, borderRadius: "10px" },
  endAdornment: (
    <img
      src={mobilelogin}
      alt="mobile"
      style={{ width: "57px" }}
    />
  ),
};

// InputProps for Password
const passwordInputProps = (showPassword, setShowPassword) => ({
  style: { padding: 0, borderRadius: "10px" },
  endAdornment: (
    <InputAdornment position="end">
      <IconButton onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
      <img
        src={lockicon}
        alt="lock"
        style={{ width: "57px", alignItems: "flex-end" }}
      />
    </InputAdornment>
  ),
});


  return (
    <Grid
      container
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      {/* Left Side - Background Image */}
<Grid
  item
  xs={false}
  md={7}
  sx={{
    display: { xs: "none", md: "flex" },
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5224a3ff",
    width: "55%",
    border: "3px solid #4adc51ff",
  }}
>
  <Box
    component="img"
    src={backImg}
    alt="Background"
    sx={{
      height: "80%",
      objectFit: "contain",
      boxShadow: "0px 4px 20px rgba(0,0,0,0.5)", // 👈 shadow only on image
      borderRadius: 2, // optional if you want rounded corners
    }}
  />
</Grid>


      {/* Right Side - Login Form */}
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 4, sm: 3, md: 3 },
         
          height: "100vh",
          boxSizing: "border-box",
          width: { xs: "100%", md: "45%" },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 500 }}>
          {/* <a href="https://impsguru.com"> */}
            <Box
              component="img"
              src={biggpayLogo}
              alt="Logo"
              sx={{
                width: "100%",
                maxWidth: 330,
                mb: 3,
                objectFit: "contain",
                cursor: "pointer",
                display: "block",
                mx: "auto",
              }}
              onClick={() => navigate("/login")} 
            />
          {/* </a> */}

      
        {loginError && (
          <Typography color="error" align="center" sx={{ mb: 3 }}>
            {loginError}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
          {/* User ID */}
          <ReTextField
            fullWidth
            size="medium"
            sx={{ mt: 4 }}
            label="User ID"
            {...register("mobile", { onChange: (e) => setUsername(e.target.value) })}
            margin="normal"
            error={!!errors.mobile}
            helperText={errors.mobile?.message}
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment position="start">
            //       <PhoneAndroid color="action" />
            //     </InputAdornment>
            //   ),
            // }}
            InputProps={mobileInputProps}  
          />

          {/* Password */}
          <ReTextField
            fullWidth
            size="medium"
            sx={{ mt: 5 }}
            label="Password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment position="start">
            //       <Lock color="action" />
            //     </InputAdornment>
            //   ),
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
            //         {showPassword ? <VisibilityOff /> : <Visibility />}
            //       </IconButton>
            //     </InputAdornment>
            //   ),
            // }}
                  InputProps={passwordInputProps(showPassword, setShowPassword)} 
          />

          {/* Forgot Password */}
          <Box display="flex" justifyContent="flex-end" mt={1.3} >
            <Button
              variant="text"
              size="small"
              sx={{ textTransform: "none", fontWeight: 500, color: "#0052CC", "&:hover": { textDecoration: "underline" } }}
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </Button>
          </Box>
             {/* <ReCAPTCHA
                    sitekey={import.meta.env.VITE_SITE_KEY}

                    ref={captchaRef}
                    onExpired={() => setCaptchaChecked(false)}
                    onChange={captchaclickApi}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      display: "flex",
                      alignItems:"center",
                      mb:2,
                    }}
                  /> */}

          {/* Terms & Conditions */}
          <FormControlLabel
            control={<Checkbox checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />}
            label={
              <Typography variant="body2" color="textSecondary" fontSize={12}>
                I agree to the{" "}
                <Link href="/terms-conditions" underline="always" color="#4253F0" fontSize={12}>
                  Terms and Conditions
                </Link>
              </Typography>
            }
            sx={{ width: "100%", textAlign: "center", marginBottom: 0 }}
          />

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 2, py: 1.5, borderRadius: 2, fontWeight: 600, background: "linear-gradient(90deg,#0052CC,#007BFF)" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </Box>
        </Box>
      </Grid>

      {/* MPIN/OTP Modal */}
      <Modal open={isMpinRequired} onClose={handleMpinVerificationClose} aria-labelledby="verification-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
           
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500, md: 600 },
            // boxShadow: 24,
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
      </Modal>

      {/* Forgot Password Modal */}
      <ForgotPassword open={forgotModal} onClose={() => setForgotModalOpen(false)} initialUsername={username} />
    </Grid>
  );
};

export default Login;
