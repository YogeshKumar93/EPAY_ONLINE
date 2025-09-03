// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";

// import useSessionTimeout from "../hooks/useSessionTimeout";


export const getToken = () => localStorage.getItem("access_token");
export const setToken = (token) => localStorage.setItem("access_token", token);
export const clearToken = () => localStorage.removeItem("access_token");
export const clearUser = () => localStorage.removeItem("user");

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem("access_token");
  const initialNepalToken = localStorage.getItem("nepal_token");
  const initialUser = localStorage.getItem("user");
  const initialNepalUser = localStorage.getItem("user_nepal");
  const docsData = JSON.parse(localStorage.getItem("docs"));
  
  const [token, setTokenState] = useState(initialToken);
  const [nepalToken, setNepalToken] = useState(initialNepalToken);
  const [user, setUser] = useState(initialUser);
  const [nepalUser, setNepalUser] = useState(initialNepalUser);
  const [ifDocsUploaded, setIfDocsUploaded] = useState(docsData);
  const [location, setLocation] = useState(JSON.parse(localStorage.getItem("location")));
  const [theame, setTheame] = useState();
  const [iconColor, setIconColor] = useState();
  const [currentView, setCurrentView] = useState(null);
  const [ip, setIp] = useState("");
  const [dmt2Doc, setDmt2Doc] = useState("");
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const isUserNavigatingAway = useRef(false);
  const userIsLoggedIn = !!token;

  const loadUserProfile = async () => {
    try {
      const { error, response } = await apiCall("GET", ApiEndpoints.GET_ME_USER);

      if (error) throw new Error(error.message || "Failed to load user profile");

      if (response?.data) {
        console.log("response data is ",response.data);
        
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
      logout(); // fallback if profile fails
      throw err;
    }
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();

      if (token) {
        try {
          await loadUserProfile();
        } catch (err) {
          console.error("Authentication initialization failed:", err);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (token) => {
    try {
      setToken(token);
      setTokenState(token);
      const userProfile = await loadUserProfile();
      return userProfile;
    } catch (err) {
      clearToken();
      clearUser();
      throw err;
    }
  };

  const loginHandler = (token) => {
    setToken(token);
    setTokenState(token);
    localStorage.setItem("access_token", token);
  };

  const nepalTokenSetter = (token) => {
    setNepalToken(token);
    localStorage.setItem("nepal_token", token);
  };

  const userHandler = (passedUser) => {
    localStorage.setItem("user", JSON.stringify(passedUser));
    setUser(passedUser);
  };

  const nepalUserHandler = (passedUser) => {
    localStorage.setItem("user_nepal", JSON.stringify(passedUser));
    setNepalUser(passedUser);
  };

  // const logOutFromApi = () => {
  //   postJsonData(
  //     ApiEndpoints.LOGOUT,
  //     {},
  //     null,
  //     (res) => {
  //       console.log("logout");
  //     },
  //     (err) => {
  //       apiErrorToast(err);
  //     }
  //   );
  // };

  // Logout API + cleanup
  const logout = async () => {
    try {
      const { error } = await apiCall("POST", ApiEndpoints.LOGOUT);

      if (error) {
        console.error("Logout API failed:", error.message || error);
      }
    } catch (err) {
      console.error("Unexpected logout error:", err);
    }

    // Always clear local state and redirect
    clearAllStorage();
  };

  const logOutHandler = () => {
    logOutFromApi();
    clearAllStorage();
  };

  const clearAllStorage = () => {
    setTokenState(null);
    setNepalToken(null);
    setUser(null);
    setNepalUser(null);
    setIfDocsUploaded(null);
    setLocation(null);
    
    localStorage.removeItem("access_token");
    localStorage.removeItem("aepsType");
    localStorage.removeItem("user");
    localStorage.removeItem("user_nepal");
    localStorage.removeItem("nepal_token");
    localStorage.removeItem("location");
    localStorage.removeItem("docs");
    localStorage.removeItem("MoneyTransfer");
  };

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const latLongHandler = (lat, long) => {
    setLocation({ lat, long });
    localStorage.setItem("location", JSON.stringify({ lat, long }));
  };

  const setDocsInLocal = (options) => {
    localStorage.setItem("docs", JSON.stringify(options));
    setIfDocsUploaded(options);
  };

  // useSessionTimeout(logOutHandler, 1800000);
  // useLogoutOnClose(logOutHandler);

  const contextValue = {
    // Original keys
    user,
    loading,
    login:loginHandler,
    
    logout,
    saveUser,
    isAuthenticated: token,
    
    // New keys from second context
    token: token,
    nepalToken: nepalToken,
    nepalUser: nepalUser,
    location: location,
    isLoggedIn: userIsLoggedIn,
    currentView: currentView,
    setCurrentView: setCurrentView,
    nepalTokenSetter: nepalTokenSetter,
    setTheame: setTheame,
    setIconColor: setIconColor,
    theame: theame,
    iconColor: iconColor,
    saveNepalUser: nepalUserHandler,
    setLocation: latLongHandler,
    setDocsInLocal,
    ifDocsUploaded,
    setValue: setValue,
    value: value,
    setIp: setIp,
    ip: ip,
    setDmt2Doc: setDmt2Doc,
    dmt2Doc: dmt2Doc,
    loadUserProfile,loadUserProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;