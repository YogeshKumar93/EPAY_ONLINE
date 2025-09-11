import { useEffect, useState } from "react";
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

import BbpsBillers from "./BbpsBillers";

const Bbps = () => {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

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
        categories.filter((c) =>
          c.category_name?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, categories]);

  return (
    <Box>
      {!selectedCategory ? (
        <>
         <Box display="flex" alignItems="center" gap={4} sx={{ mb: 2 }}>
  {/* Page Title */}
  <Typography variant="h5" fontWeight="bold">
    BBPS Categories
  </Typography>

  {/* Search Bar with Icon */}
  <TextField
    placeholder="Search categories..."
    variant="outlined"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    size="medium"
    sx={{ width: "81%" }} // adjust as needed
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
  />
</Box>


          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
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
                <Typography textAlign="center" color="text.secondary" width="100%">
                  No categories found.
                </Typography>
              )}
            </Box>
          )}
        </>
      ) : (
        // ✅ Show Billers when category selected
        <BbpsBillers category={selectedCategory} onBack={() => setSelectedCategory(null)} />
      )}
    </Box>
  );
};

export default Bbps;
