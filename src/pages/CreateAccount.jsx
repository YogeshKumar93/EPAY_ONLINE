// import React, { useState } from "react";
// import {
//   Grid,
   
//   MenuItem,
//   Typography,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import { apiCall } from "../api/apiClient";
// import ApiEndpoints from "../api/ApiEndpoints";
// import CommonModal from "../components/common/CommonModal";
// import { ReTextField } from "../components/common/ReTextField";
 

// const accountTypes = ["Current", "Savings", "Credit"];

// const CreateAccount = ({ open, handleClose, handleSave }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     user_id: "",
//     establishment: "",
//     mobile: "",
//     type: "",
//     asm: "",
//     credit_limit: "",
//     balance: "",
//     status: "1",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const validate = () => {
//     let newErrors = {};

//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.user_id) newErrors.user_id = "User ID is required";
//     if (!formData.establishment.trim())
//       newErrors.establishment = "Establishment is required";
//     if (!formData.asm.trim()) newErrors.asm = "Asm is required";
//     if (!/^\d{10}$/.test(formData.mobile))
//       newErrors.mobile = "Enter a valid 10-digit mobile number";
//     if (formData.credit_limit < 0)
//       newErrors.credit_limit = "Credit limit cannot be negative";
//     if (formData.balance < 0)
//       newErrors.balance = "Balance cannot be negative";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const onSubmit = async () => {
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       const { error, response } = await apiCall(
//         "POST",
//         ApiEndpoints.CREATE_ACCOUNT,
//         formData
//       );

//       if (!error && response?.status === "SUCCESS") {
//         handleSave(response.data); // pass newly created account back
//         handleClose();
//         setFormData({
//           name: "",
//           user_id: "",
//           establishment: "",
//           mobile: "",
//           type: "",
//           asm: "",
//           credit_limit: "",
//           balance: "",
//           status: "1",
//         });
//       } else {
//         console.error("Failed to create account:", error || response);
//         // alert(response?.message || "Failed to create account");
//       }
//     } catch (err) {
//       console.error("Error creating account:", err);
//       alert("Something went wrong while creating account.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Footer buttons for the modal
//   const footerButtons = [
//     {
//       text: "Cancel",
//       variant: "outlined",
//       onClick: handleClose,
//       disabled: loading
//     },
//     {
//       text: "Save",
//       variant: "contained",
//       onClick: onSubmit,
//       disabled: loading,
//       startIcon: loading ? <CircularProgress size={20} color="inherit" /> : null
//     }
//   ];

//   return (
//     <CommonModal
//       open={open}
//       onClose={handleClose}
//       title="Create Account"
//       footerButtons={footerButtons}
//       size="medium"
//       iconType="info"
//       showCloseButton={true}
//       closeOnBackdropClick={!loading}
//       dividers={true}
//     >
//        {/* Row 1 */}
//       <Box display="flex" gap={2} mb={2}>
//            < ReTextField
//           label="Name"
//           name="name"
//           fullWidth
//           value={formData.name}
//           onChange={handleChange}
//           error={!!errors.name}
//           helperText={errors.name}
//           disabled={loading}
//         />

//             <ReTextField
//           label="User ID"
//           name="user_id"
//           type="number"
//           fullWidth
//           value={formData.user_id}
//           onChange={handleChange}
//           error={!!errors.user_id}
//           helperText={errors.user_id}
//           disabled={loading}
//         />
//       </Box>

//       {/* Row 2 */}
//       <Box display="flex" gap={2} mb={2}>
//             <ReTextField
//           label="Establishment"
//           name="establishment"
//           fullWidth
//           value={formData.establishment}
//           onChange={handleChange}
//           error={!!errors.establishment}
//           helperText={errors.establishment}
//           disabled={loading}
//         />

//             <ReTextField
//           label="Mobile"
//           name="mobile"
//           fullWidth
//           value={formData.mobile}
//           onChange={handleChange}
//           error={!!errors.mobile}
//           helperText={errors.mobile}
//           disabled={loading}
//         />
//       </Box>

//       {/* Row 3 */}
//       <Box display="flex" gap={2} mb={2}>
//            <ReTextField
//           select
//           label="Type"
//           name="type"
//           fullWidth
//           value={formData.type}
//           onChange={handleChange}
//           error={!!errors.type}
//           helperText={errors.type}
//           disabled={loading}
//         >
//           {accountTypes.map((option, idx) => (
//             <MenuItem key={idx} value={option}>
//               {option}
//             </MenuItem>
//           ))}
//         </ ReTextField>

//          < ReTextField
//           label="ASM"
//           name="asm"
//           fullWidth
//           value={formData.asm}
//           onChange={handleChange}
//           error={!!errors.asm}
//           helperText={errors.asm}
//           disabled={loading}
//         />

//       </Box>

//       {/* Row 4 */}
//       <Box display="flex" gap={2} mb={2}>
//           <ReTextField
//           label="Credit Limit"
//           name="credit_limit"
//           type="number"
//           fullWidth
//           value={formData.credit_limit}
//           onChange={handleChange}
//           error={!!errors.credit_limit}
//           helperText={errors.credit_limit}
//           disabled={loading}
//         />

//          < ReTextField
//           label="Balance"
//           name="balance"
//           type="number"
//           fullWidth
//           value={formData.balance}
//           onChange={handleChange}
//           error={!!errors.balance}
//           helperText={errors.balance}
//           disabled={loading}
//         />
//       </Box>

//       {/* Status Note */}
//       <Typography
//         variant="caption"
//         color="text.secondary"
//         sx={{ mt: 2, display: "block" }}
//       >
//         * Status will be set to Active (1) by default
//       </Typography>

      
//     </CommonModal>
//   );
// };

// export default CreateAccount;




import React, { useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import CommonModal from "../components/common/CommonModal";

const CreateAccount = ({ open, handleClose, handleSave,onFetchRef,
 }) => {
  const [formData, setFormData] = useState({
    name: "",
    user_id: "",
    establishment: "",
    mobile: "",
    type: "",
    asm: "",
    credit_limit: "",
    balance: "",
    status: "1",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);



  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ API submit
  const onSubmit = async () => {
    // if (!validate()) return;
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_ACCOUNT,
        formData
      );

      if (response) {
        handleSave(response.data);
        onFetchRef();
        handleClose();
        setFormData({
          name: "",
          user_id: "",
          establishment: "",
          mobile: "",
          type: "",
          asm: "",
          credit_limit: "",
          balance: "",
          status: "1",
        });
      } else {
        console.error("Failed to create account:", error || response);
      }
    } catch (err) {
      console.error("Error creating account:", err);
      alert("Something went wrong while creating account.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Footer buttons
  const footerButtons = [
    {
      text: "Cancel",
      variant: "outlined",
      onClick: handleClose,
      disabled: loading,
    },
    {
      text: "Save",
      variant: "contained",
      onClick: onSubmit,
      disabled: loading,
      startIcon: loading ? <CircularProgress size={20} color="inherit" /> : null,
    },
  ];

  // ✅ Field configuration
  const fieldConfig = [
    { name: "name", label: "Name", type: "text" },
    { name: "user_id", label: "User ID", type: "number" },
    { name: "establishment", label: "Establishment", type: "text" },
    { name: "mobile", label: "Mobile", type: "text" },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "Current", label: "Current" },
        { value: "Savings", label: "Savings" },
        { value: "Credit", label: "Credit" },
      ],
    },
    { name: "asm", label: "ASM", type: "text" },
    { name: "credit_limit", label: "Credit Limit", type: "number" },
    { name: "balance", label: "Balance", type: "number" },
  ];

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Create Account"
      footerButtons={footerButtons}
      size="medium"
      iconType="info"
      showCloseButton={true}
      closeOnBackdropClick={!loading}
      dividers={true}
      fieldConfig={fieldConfig} // ✅ pass config
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading}
      layout="two-column" // ✅ NEW: tell CommonModal to render 2 fields/row
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, display: "block" }}
      >
        * Status will be set to Active (1) by default
      </Typography>
    </CommonModal>
  );
};

export default CreateAccount;

