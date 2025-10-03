import React, { useEffect, useState, useContext } from "react";
import {
  Modal,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";

const ProfileTabs = ({ open, onClose }) => {
  const authCtx = useContext(AuthContext);
  const userId = authCtx.user?.id;

  const [tabIndex, setTabIndex] = useState(0);
  const [tabData, setTabData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const fetchUserTabs = async () => {
    setLoading(true);
    try {
      const payload = { id: userId };
      const { response } = await apiCall(
        "post",
        ApiEndpoints.GET_ALL_BY_USER,
        payload
      );
      const data = response?.data || {};

      const tabs = Object.keys(data).map((key) => ({
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1),
        content: data[key] || {}, // if null, set empty object so tab still renders
      }));

      setTabData(tabs);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && userId) fetchUserTabs();
  }, [open, userId]);

  const hiddenFields = ["id", "user_id", "created_at", "updated_at"];
  const kycImages = [
    "aadhaar_front",
    "aadhaar_back",
    "shop_image",
    "pan_card",
    "photo",
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 900,
          bgcolor: "background.paper",
          borderRadius: 3,
          p: 3,
          boxShadow: 24,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          User Information
        </Typography>

        {loading && (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 5 }} />
        )}
        {error && (
          <Typography color="error" align="center" sx={{ py: 3 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && tabData.length > 0 && (
          <>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
            >
              {tabData.map((tab, index) => (
                <Tab
                  key={tab.id || index}
                  label={tab.title || `Tab ${index + 1}`}
                />
              ))}
            </Tabs>

            {tabData.map((tab, index) => (
              <div
                key={tab.id || index}
                role="tabpanel"
                hidden={tabIndex !== index}
              >
                {tabIndex === index && (
                  <Grid container spacing={2}>
                    {tab.id === "kyc"
                      ? kycImages.map((key) => {
                          const imageUrl = tab.content[key];
                          return (
                            <Grid item xs={12} sm={6} md={4} key={key}>
                              <Card>
                                {imageUrl && (
                                  <CardMedia
                                    component="img"
                                    height="120"
                                    image={imageUrl}
                                    alt={key}
                                    onClick={() =>
                                      window.open(imageUrl, "_blank")
                                    }
                                    sx={{
                                      objectFit: "contain",
                                      cursor: "pointer",
                                    }}
                                  />
                                )}
                                <CardContent>
                                  <Typography
                                    variant="subtitle2"
                                    align="center"
                                  >
                                    {key.replace(/_/g, " ").toUpperCase()}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })
                      : Object.entries(tab.content)
                          .filter(([key]) => !hiddenFields.includes(key))
                          .map(([key, value]) => (
                            <Grid item xs={12} sm={6} md={4} key={key}>
                              <Card>
                                <CardContent>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {key.replace(/_/g, " ").toUpperCase()}
                                  </Typography>
                                  <Typography variant="body2">
                                    {value || "-"}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                  </Grid>
                )}
              </div>
            ))}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ProfileTabs;
