import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
 import './styles/GlobalStyles.css';
import { ToastProvider } from "./utils/ToastContext";
function App() {
  return (
    <ThemeProvider>
            <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
