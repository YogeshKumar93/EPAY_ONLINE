// // component/VerifyMpinLogin.js
// import React, { useContext, useState } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   CircularProgress,
//   Grid,
//   IconButton
// } from '@mui/material';
// import { Edit, Close } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { apiCall } from '../../api/apiClient';

// import ApiEndpoints from '../../api/ApiEndpoints';
// import AuthContext from '../../contexts/AuthContext';
// import { okSuccessToast } from '../../utils/ToastUtil';
// import { useToast } from '../../utils/ToastContext';

// const VerifyMpinLogin = ({
//   username,
//   password,
//   otpRef: initialOtpRef,   // ✅ receive initial otpRef
//   secureValidate,
//   setIsOtpField,
//   onVerificationSuccess,
//   btn = 'Verify'
// }) => {
//   const [code, setCode] = useState(['', '', '', '', '', '']);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [otpRef, setOtpRef] = useState(initialOtpRef); // ✅ keep otpRef in state
// const {showToast} = useToast();

//   const authCtx = useContext(AuthContext);
//   const navigate = useNavigate();
//   const user = authCtx?.user;
//   console.log("user", user);

//   const handleInputChange = (index, value) => {
//     if (!/^\d*$/.test(value)) return;
//     const newCode = [...code];
//     newCode[index] = value;
//     setCode(newCode);

//     if (value && index < 5) {
//       document.getElementById(`pin-input-${index + 1}`).focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === 'Backspace' && !code[index] && index > 0) {
//       document.getElementById(`pin-input-${index - 1}`).focus();
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text');
//     if (/^\d{6}$/.test(pastedData)) {
//       const newCode = pastedData.split('').slice(0, 6);
//       setCode(newCode);
//       document.getElementById(`pin-input-5`).focus();
//     }
//   };

//   const handleVerify = async () => {
//     const fullCode = code.join('');
//     if (fullCode.length !== 6) {
//       setError(`${secureValidate === 'MPIN' ? 'MPIN' : 'OTP'} must be 6 digits`);
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       let endpoint, payload;

//       endpoint = ApiEndpoints.LOGIN_OTP_VALIDATE;
//       if (secureValidate === 'MPIN') {
//         payload = {
//           username,
//           password,
//           otp_ref: otpRef,   // ✅ always use state otpRef
//           mpin: fullCode
//         };
//       } else {
//         payload = {
//           username,
//           otp: fullCode,
//           otp_ref: otpRef,   // ✅ always use state otpRef
//           password
//         };
//       }

//       const { error: apiError, response } = await apiCall("POST", endpoint, payload);

//       if (apiError) {
//         setError(apiError.message || "Verification failed");
//         return;
//       }

//       if (response) {
//         console.log("login response", response);

//         const token = response.data;
//         authCtx.login(token);

//         const userResult = await apiCall("get", ApiEndpoints.GET_ME_USER);
//         if (userResult.response) {
//           const userData = userResult.response.data;
//           authCtx.saveUser(userData);
//           localStorage.setItem("user", JSON.stringify(userData));

//           if (userData.role === "adm" || userData.role === "sadm") {
//             navigate("/admin/dashboard");
//           } else if (userData.role === "asm") {
//             navigate("/asm/dashboard");
//           } else if (userData.role === "di") {
//             navigate("/ad/dashboard");
//           } else if (userData.role === "ret" || userData.role === "dd") {
//             navigate("/customer/dashboard");
//           } else {
//             navigate("/other/dashboard");
//           }
//         }
//       }
//     } catch (err) {
//       setError(err.message || "Verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendCode = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       let endpoint, payload;

//       if (secureValidate === "MPIN") {
//         endpoint = ApiEndpoints.RESET_MPIN;
//         payload = { username, type: "MPIN" };
//       } else {
//         endpoint = ApiEndpoints.RESEND_OTP;
//         payload = { username, type: "OTP" };
//       }

//       const { error: apiError, response } = await apiCall("POST", endpoint, payload);

//       if (apiError) {
//         setError(apiError.message || "Failed to resend code");
//         return;
//       }

//       // ✅ Save new otpRef if present in response.message
//       if (response?.message) {
//         showToast(`${secureValidate === "MPIN" ? "MPIN" : "OTP"} sent successfully`,"success");
//         setOtpRef(response.message);
//         console.log("Updated otpRef:", response.message);
//       }
//     } catch (err) {
//       setError(err.message || "Failed to resend code");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToLogin = () => {
//     setIsOtpField(false);
//     setCode(['', '', '', '', '', '']);
//     setError('');
//   };

//   return (
//     <Box sx={{ p: 3, minWidth: 500 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h6" fontWeight="bold">
//           Verify {secureValidate === 'MPIN' ? 'MPIN' : 'OTP'}
//         </Typography>
//         <IconButton onClick={handleBackToLogin} size="small">
//           <Close />
//         </IconButton>
//       </Box>

//       <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
//         Enter the 6-digit {secureValidate === 'MPIN' ? 'MPIN' : 'OTP'} sent to
//         <Box component="span" fontWeight="bold"> *******{username.slice(-3)}</Box>
//         <IconButton size="small" onClick={() => setIsOtpField(false)} sx={{ ml: 1 }}>
//           <Edit fontSize="small" />
//         </IconButton>
//       </Typography>

//       {error && (
//         <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
//           {error}
//         </Typography>
//       )}

//       <Grid container spacing={1} justifyContent="center" sx={{ mb: 3 }}>
//         {code.map((digit, index) => (
//           <Grid item key={index}>
//             <TextField
//               id={`pin-input-${index}`}
//               value={digit}
//               onChange={(e) => handleInputChange(index, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(index, e)}
//               onPaste={index === 0 ? handlePaste : undefined}
//               inputProps={{
//                 maxLength: 1,
//                 style: {
//                   textAlign: 'center',
//                   padding: '8px',
//                   width: '40px',
//                   height: '40px',
//                   fontSize: '18px'
//                 }
//               }}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: digit ? '#4253F0' : '#ccc',
//                   },
//                   '&:hover fieldset': {
//                     borderColor: '#4253F0',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#4253F0',
//                     borderWidth: '2px',
//                   },
//                 },
//               }}
//             />
//           </Grid>
//         ))}
//       </Grid>

//       <Button
//         fullWidth
//         variant="contained"
//         onClick={handleVerify}
//         disabled={loading || code.join('').length !== 6}
//         sx={{ mb: 2, backgroundColor: '#4253F0', '&:hover': { backgroundColor: '#3446D0' } }}
//       >
//         {loading ? <CircularProgress size={24} /> : btn}
//       </Button>

//       <Button
//         fullWidth
//         variant="outlined"
//         onClick={handleResendCode}
//         disabled={loading}
//         sx={{ mb: 2 }}
//       >
//         Resend {secureValidate === 'MPIN' ? 'MPIN' : 'OTP'}
//       </Button>

//       <Button
//         fullWidth
//         variant="text"
//         onClick={handleBackToLogin}
//         disabled={loading}
//       >
//         Back to Login
//       </Button>
//     </Box>
//   );
// };

// export default VerifyMpinLogin;
// component/VerifyMpinLogin.js
import React, { useContext, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";
import { Edit, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import AuthContext from "../../contexts/AuthContext";
import { useToast } from "../../utils/ToastContext";

const VerifyMpinLogin = ({
  username,
  password,
  otpRef: initialOtpRef,
  secureValidate,
  setIsOtpField,
  onVerificationSuccess,
  btn = "Verify",
}) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpRef, setOtpRef] = useState(initialOtpRef);
  const { showToast } = useToast();

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`pin-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`pin-input-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("").slice(0, 6);
      setCode(newCode);
      document.getElementById(`pin-input-5`).focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError(
        `${secureValidate === "MPIN" ? "MPIN" : "OTP"} must be 6 digits`
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      let endpoint, payload;

      endpoint = ApiEndpoints.LOGIN_OTP_VALIDATE;
      if (secureValidate === "MPIN") {
        payload = { username, password, otp_ref: otpRef, mpin: fullCode };
      } else {
        payload = { username, otp: fullCode, otp_ref: otpRef, password };
      }

      const { error: apiError, response } = await apiCall("POST", endpoint, payload);

      if (apiError) {
        setError(apiError.message || "Verification failed");
        return;
      }

      if (response) {
        const token = response.data;
        authCtx.login(token);

        const userResult = await apiCall("get", ApiEndpoints.GET_ME_USER);
        if (userResult.response) {
          const userData = userResult.response.data;
          authCtx.saveUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));

          if (userData.role === "adm" || userData.role === "sadm") {
            navigate("/admin/dashboard");
          } else if (userData.role === "asm") {
            navigate("/asm/dashboard");
          } else if (userData.role === "di") {
            navigate("/ad/dashboard");
          } else if (userData.role === "ret" || userData.role === "dd") {
            navigate("/customer/dashboard");
          } else {
            navigate("/other/dashboard");
          }
        }
      }
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");

    try {
      let endpoint, payload;

      if (secureValidate === "MPIN") {
        endpoint = ApiEndpoints.RESET_MPIN;
        payload = { username, type: "MPIN" };
      } else {
        endpoint = ApiEndpoints.RESEND_OTP;
        payload = { username, type: "OTP" };
      }

      const { error: apiError, response } = await apiCall("POST", endpoint, payload);

      if (apiError) {
        setError(apiError.message || "Failed to resend code");
        return;
      }

      if (response?.message) {
        showToast(
          `${secureValidate === "MPIN" ? "MPIN" : "OTP"} sent successfully`,
          "success"
        );
        setOtpRef(response.message);
      }
    } catch (err) {
      setError(err.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIsOtpField(false);
    setCode(["", "", "", "", "", ""]);
    setError("");
  };

  return (
  <Paper
  elevation={6}
  sx={{
    p: { xs: 2, sm: 3, md: 4 }, // responsive padding
    minwidth: { xs: "90%", sm: "90%", md: "500px" }, // responsive width
    maxWidth: "100%",
    borderRadius: 3,
    background: "#1E3A8A",
    color: "#fff",
    mx: "auto", // center horizontally
  }}
>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#fff" }}>
          Verify {secureValidate === "MPIN" ? "MPIN" : "OTP"}
        </Typography>
        <IconButton
          onClick={handleBackToLogin}
          size="small"
          sx={{ color: "#fff" }}
        >
          <Close />
        </IconButton>
      </Box>

      <Typography
        variant="body2"
        sx={{ mb: 3, color: "#E5E7EB" }}
      >
        Enter the 6-digit {secureValidate === "MPIN" ? "MPIN" : "OTP"} 
        <Box component="span" fontWeight="bold" sx={{ color: "#FFD60A" }}>
          {" "}
          {/* *******{username.slice(-3)} */}
        </Box>
        {/* <IconButton
          size="small"
          onClick={() => setIsOtpField(false)}
          sx={{ ml: 1, color: "#FFD60A" }}
        >
          <Edit fontSize="small" />
        </IconButton> */}
      </Typography>

      {error && (
        <Typography
          color="#fff"
          variant="body2"
          sx={{ mb: 2, textAlign: "center" }}
        >
          {error}
        </Typography>
      )}

      {/* Code Inputs */}
      <Grid container spacing={1.5} justifyContent="center" sx={{ mb: 3 }}>
        {code.map((digit, index) => (
          <Grid item key={index}>
            <TextField
              id={`pin-input-${index}`}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: "center",
                  padding: "10px",
                  width: "48px",
                  height: "48px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#1E3A8A",
                },
              }}
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: digit ? "#FACC15" : "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#FACC15",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FACC15",
                    borderWidth: "2px",
                  },
                },
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Buttons */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleVerify}
        disabled={loading || code.join("").length !== 6}
        sx={{
          mb: 2,
          backgroundColor: "#FACC15",
          color: "#1E3A8A",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#EAB308" },
        }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "#1E3A8A" }} /> : btn}
      </Button>

      <Button
        fullWidth
        variant="outlined"
        onClick={handleResendCode}
        disabled={loading}
        sx={{
          mb: 2,
          borderColor: "#fff",
          color: "#fff",
          "&:hover": { borderColor: "#FACC15", color: "#FACC15" },
        }}
      >
        Resend {secureValidate === "MPIN" ? "MPIN" : "OTP"}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={handleBackToLogin}
        disabled={loading}
        sx={{
          color: "#fff",
          "&:hover": { color: "#FFD60A" },
        }}
      >
        Back to Login
      </Button>
    </Paper>
  );
};

export default VerifyMpinLogin;
