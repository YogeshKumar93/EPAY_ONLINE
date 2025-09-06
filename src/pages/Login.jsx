// Login.js (final version with all corrections)
import React, { useContext, useEffect, useState } from "react";
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
import * as Yup from "yup";
import AuthContext from "../contexts/AuthContext";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiCall } from "../api/apiClient";
import { ReTextField } from "../components/common/ReTextField";

import VerifyMpinLogin from "../components/UI/VerifyMpinLogin";
import { getGeoLocation } from "../utils/GeoLocationUtil";
import { okErrorToast } from "../utils/ToastUtil";
import ForgotPassword from "../components/common/ForgotPassword";
import ReButton from "../components/common/ReButton";

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
  const navigate = useNavigate();
  const [forgotModal, setForgotModalOpen] = useState(false);
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
    locationVal();
    return () => {};
  }, []);

  const locationVal = getGeoLocation(
    (lat, long) => {
      authCtx.setLocation(lat, long);
      return [lat, long];
    },
    (err) => {
      okErrorToast("Location", err);
    }
  );

  const onSubmit = async (data) => {
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
        setLoading(false);
        return;
      }

      console.log("response is ", response);

      //  if (response.data?.access_token) {
      //     const token = response.data.access_token;

      //     navigate('/customer/dashboard');

      //      authCtx.login(token);

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

        // 🔹 Extract role from response (depends on your API response structure)
        // const role = response.data.role || response.data.user?.role;

        // 🔹 Navigate based on role

        if (user?.role === "adm") {
          navigate("/admin/dashboard");
        } else if (user?.role === "ret") {
          navigate("/customer/dashboard");
        } else if (user?.role === "user") {
          navigate("/user/home");
        } else {
          navigate("/"); // fallback
        }
      } else {
        setLoginError("Unexpected response from server");
      }
    } catch (err) {
      setLoginError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMpinVerificationSuccess = () => {
    setIsMpinRequired(false);
    // AuthContext will handle navigation based on user role
  };

  const handleMpinVerificationClose = () => {
    setIsMpinRequired(false);
  };
  const handleForgotPassword = () => {
    setForgotModalOpen(true);
  };

  return (
       <Grid container sx={{ height: "100vh", width: "100vw" }}>
      {/* <Grid
        container
        sx={{
          minHeight: "100vh",
          p: 2,
        }}
        justifyContent="center"
        alignItems="center"
      > */}

{/* Left Side with Image */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundImage:
            "url('https://source.unsplash.com/1600x900/?t",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "80%",
          width:"900px"
        }}
      />


    {/* Right Side with Login Form */}
      <Grid
        item
        xs={12}
        md={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ p: 4, height: "100%" }}
      >
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography
              variant="h5"
              align="center"
              fontWeight={600}
              gutterBottom
            >
              Login
            </Typography>

            {loginError && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {loginError}
              </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <ReTextField
                fullWidth
                label="User Id"
                {...register("mobile", {
                  onChange: (e) => setUsername(e.target.value), // 🔹 keep username state updated
                })}
                margin="normal"
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroid color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <ReTextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />{" "}
              <Box display="flex" justifyContent="flex-end" mt={1} mb={2}>
                <Button
                  variant="text"
                  size="small"
                  sx={{ textTransform: "none", color: "primary.main" }}
                  onClick={() => handleForgotPassword()}
                >
                  Forgot Password?
                </Button>
              </Box>
              <Button
                type="submit"
                fullWidth
                lable={"Login"}
                variant="contained"
                size="large"
                sx={{ mt: 3, py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Login"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{ mt: 2, py: 1.5 }}
                onClick={() => navigate("/sign-up")}
              >
                Sign Up
              </Button>
            </Box>
          </Paper>
        </Grid>
      {/* </Grid> */}

      {/* MPIN/OTP Verification Modal */}
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
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
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
      <ForgotPassword
        open={forgotModal}
        onClose={() => setForgotModalOpen(false)}
        initialUsername={username}
      />
 </Grid>
  );
};

export default Login;
