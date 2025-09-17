import React, { useState } from "react";
import { Tabs, Tab, Box, CircularProgress, Button } from "@mui/material";
import { useSchemaForm } from "../../hooks/useSchemaForm";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiCall } from "../../api/apiClient";
import { useToast } from "../../utils/ToastContext";
import CommonFormField from "../common/CommonFormField";

export const BusinessInformation = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [maxStep, setMaxStep] = useState(0); // ✅ highest unlocked tab
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const basic = useSchemaForm(ApiEndpoints.BASIC_SCHEMA, activeTab === 0);
  const contact = useSchemaForm(ApiEndpoints.CONTACT_SCHEMA, activeTab === 1);
  const address = useSchemaForm(ApiEndpoints.ADDRESS_SCHEMA, activeTab === 2);
  const identification = useSchemaForm(
    ApiEndpoints.IDENTIFICATION_SCHEMA,
    activeTab === 3
  );
  const bank = useSchemaForm(ApiEndpoints.BANK_SCHEMA, activeTab === 4);
  const documents = useSchemaForm(
    ApiEndpoints.DOCUMENTS_SCHEMA,
    activeTab === 5
  );
  const kyc = useSchemaForm(ApiEndpoints.KYC_SCHEMA, activeTab === 6);

  const tabs = [
    { label: "Basic", data: basic, submitApi: ApiEndpoints.CREATE_BASIC },
    { label: "Contact", data: contact, submitApi: ApiEndpoints.CREATE_CONTACT },
    { label: "Address", data: address, submitApi: ApiEndpoints.CREATE_ADDRESS },
    {
      label: "Identification",
      data: identification,
      submitApi: ApiEndpoints.CREATE_IDENTIFICATION,
    },
    { label: "Bank", data: bank, submitApi: ApiEndpoints.CREATE_BANK },
    {
      label: "Documents",
      data: documents,
      submitApi: ApiEndpoints.CREATE_DOCUMENTS,
    },
    { label: "KYC", data: kyc, submitApi: ApiEndpoints.CREATE_KYC },
  ];

  const currentTab = tabs[activeTab];

  const handleSubmit = async () => {
    const { schema, formData } = currentTab.data;

    if (!schema || !schema.length) {
      showToast("Schema not loaded yet", "error");
      return;
    }

    setSubmitting(true);
    try {
      const { error, response } = await apiCall(
        "POST",
        currentTab.submitApi,
        formData
      );

      console.log("📌 API Response:", response);
      console.log("📌 response.data (step):", response?.data);

      if (response) {
        showToast(
          response?.message || `${currentTab.label} saved successfully`,
          "success"
        );

        const nextStep = response?.data;
        if (nextStep != null) {
          if (nextStep === 2) {
            showToast(
              "🎉 All steps completed! Business information is done.",
              "success"
            );
            return;
          }

          const valueToTabIndex = {
            9: 0, // Basic
            8: 1, // Contact
            7: 2, // Address
            6: 3, // Identification
            5: 4, // Bank
            4: 5, // Documents
            3: 6, // KYC
          };

          const tabIndex = valueToTabIndex[nextStep] ?? 0;
          console.log(`📌 Switching to tab index: ${tabIndex}`);

          // ✅ unlock the tab
          setMaxStep((prev) => Math.max(prev, tabIndex));
          setActiveTab(tabIndex);
        }
      } else {
        showToast(
          error?.message || `Failed to save ${currentTab.label}`,
          "error"
        );
      }
    } catch (err) {
      console.error(`❌ Error saving ${currentTab.label}:`, err);
      showToast("Something went wrong while saving", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onChange={(e, val) => {
          if (val <= maxStep) setActiveTab(val); // ✅ only allow unlocked tabs
        }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((tab, idx) => (
          <Tab key={idx} label={tab.label} disabled={idx > maxStep} />
        ))}
      </Tabs>

      {/* Tab Content */}
      <Box mt={2}>
        {currentTab.data.loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {currentTab.data.schema.map((field, i) => (
              <CommonFormField
                key={i}
                field={field}
                formData={currentTab.data.formData}
                handleChange={currentTab.data.handleChange}
                errors={currentTab.data.errors}
                loading={currentTab.data.loading}
              />
            ))}

            {/* Footer Buttons */}
            <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={submitting || currentTab.data.loading}
              >
                {submitting ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
