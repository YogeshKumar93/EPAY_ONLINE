import React, { useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { useToast } from "../utils/ToastContext";

const DownloadExcel = ({
  open,
  handleClose,
  onFetchRef,
  bankId,
  selectedDate,
}) => {
  const { showToast } = useToast();

  useEffect(() => {
    if (open) {
      generateAndDownloadExcel();
    }
  }, [open]);

  const generateAndDownloadExcel = async () => {
    try {
      // Fetch schema
      const { data: schemaResponse } = await apiCall(
        "POST",
        ApiEndpoints.GET_BANK_STATEMENT_SCHEMA
      );

      const fields = schemaResponse?.fields?.map((f) => f.name) || [
        "date",
        "credit",
        "debit",
        "mop",
        "handle_by",
        "particulars",
      ];

      const getDefaultDate = () => {
  const d = new Date();
  return d.toISOString().split("T")[0]; // "2025-12-03"
};


     
     const dateToUse = selectedDate || getDefaultDate();


      const dummyData = [
        {
          date: dateToUse || 13 / 11 / 2025,
          credit: 205000,
          debit: 0,
          mop: "OFFLINE",
          handle_by: "RAUSHAN",
          particulars: "P2PAE",
        },
        {
          date: dateToUse || 12 / 11 / 2025,
          credit: 0,
          debit: 901000,
          mop: "SHANKY",
          handle_by: "NATKHAT",
          particulars: "TRANSUP",
        },
      ];

      const worksheet = XLSX.utils.json_to_sheet(dummyData, { header: fields });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "BankStatement");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `BankStatement_Sample_${bankId || "Data"}.xlsx`);
      showToast("Sample Excel downloaded successfully!", "success");

      handleClose?.();
      onFetchRef?.();
    } catch (err) {
      console.error("Excel download error:", err);
      showToast("Failed to download Excel file", "error");
    }
  };

  return null;
};

export default DownloadExcel;
