// useSchemaForm.js
import { useState, useEffect } from "react";
import { apiCall } from "../api/apiClient";

// ✅ Global in-memory cache (persists until page reload)
const schemaCache = {};

export const useSchemaForm = (endpoint, open) => {
  const [schema, setSchema] = useState([]);
  const [formName, setFormName] = useState("");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      (async () => {
        try {
          // ✅ Check cache first
          if (schemaCache[endpoint]) {
            const cached = schemaCache[endpoint];
            setSchema(cached.schema);
            setFormName(cached.formName);
            setFormData((prev) => ({ ...cached.formData, ...prev }));
            setErrors({});
            return; // don't call API
          }

          setLoading(true);
          const res = await apiCall("post", endpoint);

          const payload =
            res?.data?.data || res?.data || res?.response?.data || res;

          console.log("📥 Schema structure:", payload);

          if (payload?.fields) {
            const normalizedFields = payload.fields.map((f) => {
              if (f.name === "service_name" && Array.isArray(f.options)) {
                return {
                  ...f,
                  options: f.options.map((opt) => ({
                    value: opt.name,
                    label: opt.name,
                    ...opt,
                  })),
                };
              }

              if (f.name === "bank_name" && Array.isArray(f.options)) {
                return {
                  ...f,
                  options: f.options.map((opt) => ({
                    value: opt.bank_name,
                    label: opt.bank_name,
                    ...opt,
                  })),
                };
              }

              return f;
            });

            setFormName(payload.formName || "Form");
            setSchema(normalizedFields);

            const initData = {};
            normalizedFields.forEach((f) => {
              initData[f.name] = formData[f.name] ?? "";
            });
            setFormData((prev) => ({ ...initData, ...prev }));
            setErrors({});

            // ✅ Save in cache
            schemaCache[endpoint] = {
              schema: normalizedFields,
              formName: payload.formName || "Form",
              formData: initData,
            };
          } else {
            console.warn("⚠️ No fields found in payload:", payload);
          }
        } catch (err) {
          console.error("❌ Schema fetch failed:", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [open, endpoint]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const field = schema.find((f) => f.name === name);

    let errorMsg = "";

    if (field?.validation?.regex) {
      try {
        const regexString = field.validation.regex;
        const pattern = new RegExp(regexString.replace(/^\/|\/$/g, ""));
        if (!pattern.test(value)) {
          errorMsg =
            field.validation.message || `${field.label || name} is invalid`;
        }
      } catch (err) {
        console.error("Invalid regex from schema:", field.validation.regex, err);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
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
  };
};
