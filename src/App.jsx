import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/GlobalStyles.css";
import { ToastProvider } from "./utils/ToastContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AppRoutes />
          </LocalizationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
