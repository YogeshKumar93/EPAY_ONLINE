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
  Button
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
import { ReButton } from "../components/common/ReButton";
import VerifyMpinLogin from "../components/UI/VerifyMpinLogin";
import { getGeoLocation } from "../utils/GeoLocationUtil";
import { okErrorToast } from "../utils/ToastUtil";


const validationSchema = Yup.object({
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
    .required("Mobile number is required"),
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
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors } } = useForm({
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
    console.log("response is ",response);
    
      if (response?.data === "MPIN") {
        setSecureValidate("MPIN");
        setIsMpinRequired(true);
      } else if (response?.data === "OTP") {
        setSecureValidate("OTP");
        setIsMpinRequired(true);
      } else if (response?.data?.access_token) {
        const token = response.data.access_token;
        await authCtx.login(token);
        // Navigation will be handled by AuthContext based on user role
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

  return (
    <>
<Grid
  container
  sx={{
    minHeight: "100vh",
    p: 2,
  }}
  justifyContent="center"
  alignItems="center"
>
  <Grid
    item
    xs={12}
    sm={8}
    md={6}
    lg={4}
  >
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
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
          label="Mobile Number"
          {...register("mobile")}
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
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <ReButton
          type="submit"
          fullWidth
          lable={"Login"}
          variant="contained"
          size="large"
          sx={{ mt: 3, py: 1.5 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </ReButton>

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
</Grid>


      {/* MPIN/OTP Verification Modal */}
      <Modal
        open={isMpinRequired}
        onClose={handleMpinVerificationClose}
        aria-labelledby="verification-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <VerifyMpinLogin
            username={username}
            password={password}
            secureValidate={secureValidate}
            setIsOtpField={setIsMpinRequired}
            onVerificationSuccess={handleMpinVerificationSuccess}
            btn="Verify & Login"
          />
        </Box>
      </Modal>
    </>
  );
};

export default Login;