import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert, CircularProgress, Box } from "@mui/material";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

// 🔑 Normalizer (copied from apiErrorToast logic)
const normalizeMessage = (message) => {
  if (!message) return "Something went wrong";

  if (typeof message === "string") return message;

  if (typeof message === "object") {
    return Object.values(message).flat().join(" | ");
  }

  return String(message);
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
    loading: false,
  });

  const showToast = useCallback((message, severity = "info") => {
    setToast({
      open: true,
      message: normalizeMessage(message), // ✅ normalize here
      severity,
      loading: false,
    });
  }, []);

  const showLoadingToast = useCallback((message = "Loading...") => {
    setToast({
      open: true,
      message: normalizeMessage(message),
      severity: "info",
      loading: true,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false, loading: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showLoadingToast, hideToast }}>
      {children}

      <Snackbar
        open={toast.open}
        autoHideDuration={toast.loading ? null : 3000}
        onClose={hideToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ zIndex: 15000 }}
      >
        {toast.loading ? (
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              bgcolor: "#1976d2",
              color: "#fff",
              px: 2,
              py: 1,
              borderRadius: "4px",
            }}
          >
            <CircularProgress color="inherit" size={20} />
            <span>{toast.message}</span>
          </Box>
        ) : (
          <Alert onClose={hideToast} severity={toast.severity} variant="filled">
            {toast.message}
          </Alert>
        )}
      </Snackbar>
    </ToastContext.Provider>
  );
};
