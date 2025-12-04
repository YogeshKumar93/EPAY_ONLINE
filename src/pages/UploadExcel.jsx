import React, { useState } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";

const UploadExcel = ({ bankId, balance, onFetchRef }) => {
  const { showToast } = useToast();

  // ⭐ User-selected date (same as DownloadExcel uses selectedDate)
  const [selectedDate, setSelectedDate] = useState("");

  // ⭐ Form state (date always comes from selectedDate)
  const [formData, setFormData] = useState({
    bank_id: bankId,
    balance: balance || 0,
    date: "",
    credit: 0,
    debit: 0,
    mop: "",
    handle_by: "",
    particulars: "",
  });

  // ⭐ Update date
  const handleDateChange = (e) => {
    const newDate = e.target.value;

    setSelectedDate(newDate);

    setFormData((prev) => ({
      ...prev,
      date: newDate, // ✔ same date usage as in DownloadExcel
    }));
  };

  // ⭐ Submit Form
  const handleSubmit = async () => {
    if (!formData.date) {
      showToast("Please select a date", "error");
      return;
    }

    const { error, response } = await apiCall(
      "POST",
      ApiEndpoints.CREATE_BANK_STATEMENT,
      formData
    );

    if (response) {
      showToast(response?.message || "Statement Created", "success");
      onFetchRef?.();

      // Reset but keep same selectedDate (same logic as sample Excel)
      setFormData({
        bank_id: bankId,
        balance: balance || 0,
        date: selectedDate, // ✔ keep same user-selected date
        credit: 0,
        debit: 0,
        mop: "",
        handle_by: "",
        particulars: "",
      });
    } else {
      showToast(error?.message || "Failed to create Statement", "error");
    }
  };

  return (
    <>
      {/* ⭐ Same date format usage as DownloadExcel */}
      <input type="date" value={selectedDate} onChange={handleDateChange} />

      <button onClick={handleSubmit}>Submit</button>
    </>
  );
};

export default UploadExcel;
