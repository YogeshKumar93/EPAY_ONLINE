import { useState, useEffect } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";

// ✅ Global cache to persist schema across the project
const schemaCache = {};

export const useSchemaForm = (endpoint, open) => {
  const [schema, setSchema] = useState([]);
  const [formName, setFormName] = useState("");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchSchema = async (forceRefresh = false) => {
    if (!open) return;

    try {
      // ✅ Always fetch fresh for Account Statement
      if (
        !forceRefresh &&
        schemaCache[endpoint] &&
        endpoint !== ApiEndpoints.GET_ACCOUNT_STATEMENT_SCHEMA
      ) {
        const cached = schemaCache[endpoint];
        setSchema(cached.schema);
        setFormName(cached.formName);
        setFormData(cached.formData);
        setErrors({});
        return;
      }

      setLoading(true);
      const res = await apiCall("post", endpoint);
      const payload =
        res?.data?.data || res?.data || res?.response?.data || res;

      if (!payload?.fields) {
        console.warn("⚠️ No fields found in payload:", payload);
        return;
      }

      // Normalize fields
      let normalizedFields = payload.fields.map((f) => {
        let normalizedField = { ...f };

        // Bank normalization
        if (
          (f.name === "bank_id" || f.name === "bank_name") &&
          Array.isArray(f.options)
        ) {
          normalizedField = {
            ...f,
            options: f.options.map((opt) => ({
              value:
                f.name === "bank_id"
                  ? opt.bank_id || opt.id || opt.value
                  : opt.bank_name || opt.value,
              label: opt.bank_name || opt.name || opt.label || "Unknown",
              ...opt,
            })),
          };
        }

        // Service_name normalization
        if (f.name === "service_name" && Array.isArray(f.options)) {
          normalizedField = {
            ...normalizedField,
            options: f.options.map((opt) => ({
              value: opt.name,
              label: opt.name,
              ...opt,
            })),
          };
        }

        // Regex cleanup
        if (f.validation?.regex) {
          normalizedField.validation.regex = f.validation.regex.replace(
            /^\/|\/$/g,
            ""
          );
        }

        return normalizedField;
      });

      // Inject bank_name if missing
      // if (!normalizedFields.find((f) => f.name === "bank_name")) {
      //   normalizedFields.push({
      //     name: "bank_name",
      //     label: "Bank Name",
      //     type: "text",
      //     placeholder: "Bank name",
      //     required: false,
      //     validation: { type: "string" },
      //   });
      // }

      setSchema(normalizedFields);
      setFormName(payload.formName || "Form");

      // Initialize formData
      const initData = {};
      normalizedFields.forEach((f) => {
        initData[f.name] = formData[f.name] ?? "";
      });
      setFormData(initData);
      setErrors({});

      // Cache it only if NOT account statement schema
      if (endpoint !== ApiEndpoints.GET_ACCOUNT_STATEMENT_SCHEMA) {
        schemaCache[endpoint] = {
          schema: normalizedFields,
          formName: payload.formName || "Form",
          formData: initData,
        };
      }
    } catch (err) {
      console.error("❌ Schema fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchema();
  }, [open, endpoint]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const field = schema.find((f) => f.name === name);

    let errorMsg = "";

    if (field?.validation?.regex && value) {
      try {
        const pattern = new RegExp(field.validation.regex);
        if (!pattern.test(value)) {
          errorMsg =
            field.validation.message || `${field.label || name} is invalid`;
        }
      } catch (err) {
        console.error("Invalid regex:", field.validation.regex, err);
      }
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-fill bank_name/bank_id & IFSC if selecting bank
      if ((name === "bank_id" || name === "bank_name") && field?.options) {
        const selectedBank = field.options.find(
          (opt) =>
            opt.value == value || opt.bank_id == value || opt.bank_name == value
        );

        if (selectedBank) {
          if (name === "bank_id" && selectedBank.bank_name)
            newData.bank_name = selectedBank.bank_name;
          if (name === "bank_name" && selectedBank.bank_id)
            newData.bank_id = selectedBank.bank_id;

          const ifscField = schema.find(
            (f) => f.name === "ifsc" || f.name === "ifsc_code"
          )?.name;
          if (ifscField) newData[ifscField] = selectedBank.ifsc || "";
        }
      }

      return newData;
    });

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  return {
    schema,
    formName,
    formData,
    setFormData,
    handleChange,
    errors,
    setErrors,
    loading,
    fetchSchema, // expose to force refresh
  };
};
