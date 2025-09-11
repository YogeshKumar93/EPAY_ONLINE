import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  TextField,
  CardActionArea,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";

import BbpsBillerDetails from "./BbpsBillerDetails";

const BbpsBillers = ({ category, onBack }) => {
  const [billers, setBillers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedBillerId, setSelectedBillerId] = useState(null);

  // Fetch billers by category
  const fetchBillers = async () => {
    setLoading(true);
    try {
      const { error, response } = await apiCall("post", ApiEndpoints.BBPS_GET_BILLERS, {
        category_code: category.category_code,
        category_key: category.category_key,
      });

      if (response) {
        const data = response?.data?.records || response?.response?.data?.records || [];
        setBillers(data);
      } else if (error) {
        apiErrorToast(error?.message || "Failed to fetch billers");
      }
    } catch (err) {
      apiErrorToast(err.message || "Failed to fetch billers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) fetchBillers();
  }, [category]);

  // Filter billers by search text
  const filteredBillers = useMemo(() => {
    if (!searchText) return billers;
    return billers.filter((biller) =>
      biller.billerName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, billers]);

  // Check if biller is blocked
  const isBillerDisabled = (biller) => biller.billerStatus === "BLOCKED";

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" noWrap sx={{ flexShrink: 0 }}>
          {category?.category_name}
        </Typography>
        <TextField
          placeholder="Search billers..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="medium"
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Loading state */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Selected biller details */}
      {selectedBillerId && !loading ? (
        <BbpsBillerDetails
          billerId={selectedBillerId}
          onBack={() => setSelectedBillerId(null)}
        />
      ) : null}

      {/* Billers list */}
      {!selectedBillerId && !loading && filteredBillers.length > 0 && (
        <Box display="flex" flexWrap="wrap" gap={2.5}>
          {filteredBillers.map((biller) => (
            <Card
              key={biller.billerId}
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                width: 300,
                height: 150,
                opacity: isBillerDisabled(biller) ? 0.6 : 1,
              }}
            >
              <CardActionArea
                onClick={() => !isBillerDisabled(biller) && setSelectedBillerId(biller.billerId)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  userSelect: "text",
                }}
              >
                <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                  {biller.iconUrl && (
                    <Box
                      component="img"
                      src={biller.iconUrl}
                      alt={biller.billerName}
                      sx={{ width: 55, height: 55, objectFit: "contain", mb: 1 }}
                    />
                  )}
                  <Typography variant="subtitle2" fontWeight="600" noWrap>
                    {biller.billerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {biller.categoryName} | {biller.type}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: biller.billerStatus === "ACTIVE" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {biller.billerStatus}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}

      {/* No billers found */}
      {!selectedBillerId && !loading && filteredBillers.length === 0 && (
        <Typography color="text.secondary">No billers found for this category.</Typography>
      )}
    </Box>
  );
};

export default BbpsBillers;
