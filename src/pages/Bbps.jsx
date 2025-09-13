import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";
import SearchIcon from "@mui/icons-material/Search";
import { Tooltip } from "@mui/material";
import BbpsBillers from "./BbpsBillers";
import AuthContext from "../contexts/AuthContext";

const Bbps = () => {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.BBPS_GET_CATEGORIES
    );

    if (response) {
      const data = response?.data || response?.response?.data || [];
      setCategories(data);
      setFiltered(data);
    } else if (error) {
      apiErrorToast(error?.message || "Failed to fetch categories");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(categories);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        categories.filter((c) => c.category_name?.toLowerCase().includes(q))
      );
    }
  }, [search, categories]);

  return (
    <>
      {!selectedCategory ? (
        <>
          {/* 🔹 Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography
              variant="h6"
              fontWeight="700"
              sx={{ color: "#2B1A4C", flexShrink: 0 }}
            >
              BBPS Categories
            </Typography>

            <TextField
              placeholder="Search categories..."
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{
                width: { xs: "60%", sm: "300px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  height: 40,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* 🔹 Loader */}
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : user?.is_layout === 2 ? (
            // ✅ Layout 2: sleek scrollable row

            <Box
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                pb: 1.5,
                "&::-webkit-scrollbar": { height: 6 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#bbb",
                  borderRadius: 3,
                },
              }}
            >
              {filtered.length > 0 ? (
                filtered.map((cat) => (
                  <Tooltip key={cat.id} title={cat.category_name} arrow>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        minWidth: 110,
                        height: 90,
                        cursor: "pointer",
                        flex: "0 0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.03)",
                          boxShadow: "0 6px 14px rgba(37, 99, 235, 0.25)",
                          background:
                            "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)",
                        },
                      }}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      <CardContent
                        sx={{
                          textAlign: "center",
                          p: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {(cat.icon_url || cat.icon) && (
                          <Box
                            component="img"
                            src={cat.icon_url || cat.icon}
                            alt={cat.category_name}
                            sx={{
                              width: 32,
                              height: 32,
                              mb: 1,
                              objectFit: "contain",
                            }}
                          />
                        )}
                        <Typography
                          variant="caption"
                          fontWeight="600"
                          sx={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            maxWidth: 90,
                            color: "#1E3C72",
                            fontSize: "0.72rem",
                          }}
                        >
                          {cat.category_name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Tooltip>
                ))
              ) : (
                <Typography
                  textAlign="center"
                  color="text.secondary"
                  width="100%"
                >
                  No categories found.
                </Typography>
              )}
            </Box>
          ) : (
            // ✅ Layout 1: default grid
            <Box display="flex" flexWrap="wrap" gap={2.8}>
              {filtered.length > 0 ? (
                filtered.map((cat) => (
                  <Card
                    key={cat.id}
                    sx={{
                      borderRadius: 3,
                      boxShadow: 3,
                      "&:hover": { boxShadow: 6 },
                      width: 240,
                      height: 120,
                      cursor: "pointer",
                    }}
                  >
                    <CardActionArea
                      sx={{ height: "100%" }}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      <CardContent
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        {(cat.icon_url || cat.icon) && (
                          <Box
                            component="img"
                            src={cat.icon_url || cat.icon}
                            alt={cat.category_name}
                            sx={{ width: 40, height: 40, mb: 1 }}
                          />
                        )}
                        <Typography variant="subtitle1" fontWeight="600" noWrap>
                          {cat.category_name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))
              ) : (
                <Typography
                  textAlign="center"
                  color="text.secondary"
                  width="100%"
                >
                  No categories found.
                </Typography>
              )}
            </Box>
          )}
        </>
      ) : (
        <BbpsBillers
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      )}
    </>
  );
};

export default Bbps;
