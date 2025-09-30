import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
} from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const ProfileTabs = () => {
  const authCtx = useContext(AuthContext);
  const userId = authCtx.user?.id;

  const [tabIndex, setTabIndex] = useState(0);
  const [tabData, setTabData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const fetchUserTabs = async () => {
    setLoading(true);
    try {
      const payload = { id: userId };
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.GET_ALL_BY_USER,
        payload
      );

      const data = response?.data || {};
      const tabs = Object.keys(data).map((key) => ({
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1),
        content: data[key],
      }));

      setTabData(tabs);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tabs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUserTabs();
  }, [userId]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ py: 3 }}>
        {error}
      </Typography>
    );

  const hiddenFields = ["id", "user_id", "created_at", "updated_at"];

  return (
    <Paper sx={{ mt: 3, p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
      >
        {tabData.map((tab, index) => (
          <Tab key={tab.id || index} label={tab.title || `Tab ${index + 1}`} />
        ))}
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tabData.map((tab, index) => (
          <div
            key={tab.id || index}
            role="tabpanel"
            hidden={tabIndex !== index}
          >
            {tabIndex === index && (
              <Grid container spacing={3}>
                {tab.content &&
                  Object.entries(tab.content)
                    .filter(([key]) => !hiddenFields.includes(key))
                    .map(([key, value]) => {
                      // Documents tab with thumbnails
                      if (tab.id === "documents") {
                        return (
                          <Grid item xs={12} sm={6} md={4} key={key}>
                            <Card
                              sx={{
                                cursor: value ? "pointer" : "default",
                                transition: "0.3s",
                                "&:hover": { boxShadow: 6 },
                              }}
                            >
                              {value ? (
                                <CardMedia
                                  component="img"
                                  height="150"
                                  image={value}
                                  alt={key}
                                  onClick={() => window.open(value, "_blank")}
                                  sx={{ objectFit: "contain" }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: 150,
                                    bgcolor: "#f5f5f5",
                                  }}
                                >
                                  <InsertDriveFileIcon
                                    fontSize="large"
                                    color="disabled"
                                  />
                                </Box>
                              )}
                              <CardContent>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  align="center"
                                >
                                  {key.replace(/_/g, " ").toUpperCase()}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      }

                      // Other tabs - profile info card
                      return (
                        <Grid item xs={12} sm={6} md={4} key={key}>
                          <Card
                            sx={{
                              transition: "0.3s",
                              "&:hover": { boxShadow: 6 },
                            }}
                          >
                            <CardContent>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                              >
                                {key.replace(/_/g, " ").toUpperCase()}
                              </Typography>
                              <Typography variant="body1">
                                {value || "-"}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
              </Grid>
            )}
          </div>
        ))}
      </Box>
    </Paper>
  );
};

export default ProfileTabs;
