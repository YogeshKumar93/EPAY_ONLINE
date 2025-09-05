import React, { useEffect, useState } from 'react'
import CommonModal from '../components/common/CommonModal'
import { apiCall } from '../api/apiClient';
import ApiEndpoints from '../api/ApiEndpoints';
import { CircularProgress } from '@mui/material';

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
 
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchBanks = async () => {
    setLoading(true);
    try {
      const response = await apiCall("POST", ApiEndpoints.GET_BANKS);

      if (response?.data) {
        setBanks(response.data); // ✅ extract array
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (err) {
      console.error("Error fetching banks", err);
    } finally {
      setLoading(false);
    }
  };

  fetchBanks();
}, []);


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

{
  name: "bank_name",
  label: "Bank Name",
  type: "select",
  options: banks.map((bank) => ({
    value: bank.id,   // what you want to POST to backend
    label: bank.name, // what you want to display
  })),
  validation: { required: true },
},



  
  {
    name: "mode",
    label: "Account / Mode",
    type: "select",
    validation: { required: true, min: 1 },
  },
{
  name: "bank_ref_id",
  label: "Bank Ref Id",
  type: "text",
  validation: {
    required: true,
    pattern: /^[A-Z]{4}0[0-9A-Z]{6}$/, // matches backend rule
  },
},

{
  name: "date",
  label: "Date",
  type: "date",  
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
