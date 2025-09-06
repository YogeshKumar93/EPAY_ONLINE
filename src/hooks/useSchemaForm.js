// useSchemaForm.js
import { useState, useEffect } from "react";
import { apiCall } from "../api/apiClient";

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
          setLoading(true);
          const res = await apiCall("post", endpoint);

          // 👇 normalize response
          const payload =
            res?.data?.data || res?.data || res?.response?.data || res;

          console.log("📥 Normalized schema payload:", payload);

          if (payload?.fields) {
            const normalizedFields = payload.fields.map((f) => {
              // ✅ normalize service_name dropdown
              if (f.name === "service_name" && Array.isArray(f.options)) {
                return {
                  ...f,
                  options: f.options.map((opt) => ({
                    value: opt.name, // send the service name in payload
                    label: opt.name, // show the service name in dropdown
                    ...opt,          // keep all other info (id, code, etc.)
                  })),
                };
              }

              // ✅ normalize bank_name dropdown (already working)
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

            // initialize form data
const initData = {};
         normalizedFields.forEach((f) => {
  // if schema has default, keep it
  initData[f.name] = f.default ?? "";
});
setFormData(initData);
            setErrors({});
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
