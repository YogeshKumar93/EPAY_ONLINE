import React, { useState } from 'react'
import CommonModal from '../components/common/CommonModal'
import { apiCall } from '../api/apiClient';
import ApiEndpoints from '../api/ApiEndpoints';

const CreateFundRequest = ({open, handleClose, handleSave}) => {

const [formData, setFormData] = useState({
    bank_name: "",
    status: "",
    asm_id: "",
    user_id: "",
    name: "",
    mode: "",
    bank_ref_id: "",
    date: "",
    amount: "",
    remark: "",
    txn_id:"",
});

const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const onSubmit = async () => {
    // if (!validate()) return;
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        ApiEndpoints.CREATE_FUND_REQUEST,
        formData
      );

      if (response) {
        handleSave(response.data);
        handleClose();
        setFormData({
           bank_name: "",
    status: "",
    asm_id: "",
    user_id: "",
    name: "",
    mode: "",
    bank_ref_id: "",
    date: "",
    amount: "",
    remark: "",
    txn_id:"",
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

const fieldConfig = [
  {
    name: "bank_name",
    label: "Bank Name",
    type: "text",
    validation: { required: true, minLength: 3 },
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Pending", label: "Pending" },
      { value: "Failed", label: "Failed" },
      { value: "Success", label: "Success" },
    ],
    validation: { required: true },
  },
  {
    name: "asm_id",
    label: "Asm Id",
    type: "text",
    validation: { required: false },
  },
  {
    name: "user_id",
    label: "User Id",
    type: "text",
    validation: { required: true, pattern: /^[0-9]+$/ },
  },
  {
    name: "name",
    label: "Merchant Name",
    type: "text",
    validation: { required: true, minLength: 2 },
  },
  {
    name: "mode",
    label: "Account / Mode",
    type: "number",
    validation: { required: true, min: 1 },
  },
  {
    name: "bank_ref_id",
    label: "Bank Ref Id",
    type: "text",
    validation: {
      required: true,
      minLength: 11,
      maxLength: 11,
      pattern: /^[A-Z0-9]+$/, // uppercase alphanumeric only
    },
  },
  {
    name: "date",
    label: "Date",
    type: "number", // important: matches backend "must be a number"
    validation: { required: true },
  },
  {
    name: "amount",
    label: "Amount",
    type: "number",
    validation: { required: true, min: 1 },
  },
  {
    name: "remark",
    label: "Remarks",
    type: "text",
    validation: { required: false, maxLength: 200 },
  },
  {
    name: "txn_id",
    label: "TXN ID",
    type: "text",
    validation: {
      required: true,
      minLength: 6,
      maxLength: 20,
      pattern: /^[A-Za-z0-9_-]+$/,
    },
  },
];


    return (
    
<CommonModal
 open={open}
      onClose={handleClose}
      title="Create Fund Request"
      footerButtons={footerButtons}
      size="medium"
      iconType="info"
       layout="two-column"
      showCloseButton={true}
      closeOnBackdropClick={!loading}
      dividers={true}
      fieldConfig={fieldConfig} // ✅ pass config
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      loading={loading}
      
>


</CommonModal>

  )
}

export default CreateFundRequest
