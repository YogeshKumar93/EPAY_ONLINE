import { useEffect, useState, useMemo, useContext } from "react";
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
  Pagination,
  Grid,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";

import BbpsBillerDetails from "./BbpsBillerDetails";
import AuthContext from "../contexts/AuthContext";

const BbpsBillers = ({ category, onBack }) => {
  const [billers, setBillers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedBillerId, setSelectedBillerId] = useState(null);
  const [selectedBillerIdImage, setSelectedBillerIdImage] = useState(null);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const is_layout = user?.is_layout;
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  // Fetch billers by category + pagination
  const fetchBillers = async (pageNo = 1) => {
    setLoading(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.BBPS_GET_BILLERS,
        {
          category_code: category.category_code,
          category_key: category.category_key,
          page_number: pageNo,
          // recordFrom: pageNo,
        }
      );

      if (response) {
        const data =
          response?.data?.records || response?.response?.data?.records || [];
        const metaInfo =
          response?.data?.meta || response?.response?.data?.meta || null;

        setBillers(data);
        setMeta(metaInfo);
        setPage(Number(metaInfo?.currentPage || pageNo));
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
    if (category) fetchBillers(1);
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
        <Typography
          variant="h5"
          fontWeight="bold"
          noWrap
          sx={{ flexShrink: 0 }}
        >
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
          selectedBillerIdImage={selectedBillerIdImage}
          onBack={() => setSelectedBillerId(null)}
        />
      ) : null}

      {/* Billers list */}
      {/* Billers list */}
      {!selectedBillerId && !loading && filteredBillers.length > 0 && (
        <>
          <Grid container spacing={2.5} justifyContent="center">
            {filteredBillers.map((biller) => (
              <Grid
                item
                key={biller.billerId}
                xs={2}
                sm={2}
                md={2.4}
                xl={2.4}
                lg={2}
              >
                {/* xs=6 (2 per row mobile), sm=4 (3 per row tablet), md=2.4 (5 per row desktop) */}

                <Card
                  sx={{
                    borderRadius: is_layout === 2 ? 2 : 3,
                    boxShadow: 3,
                    width: is_layout === 2 ? 180 : 305, // ✅ Compact width in layout 2
                    height: is_layout === 2 ? 110 : 160, // ✅ Compact height ensure uniform height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: isBillerDisabled(biller)
                      ? "not-allowed"
                      : "pointer",
                    opacity: isBillerDisabled(biller) ? 0.6 : 1,
                    transition: "all 0.25s ease",
                    // aspectRatio: "4 / 3", // ensures equal length & breadth
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-3px)",
                    },
                  }}
                  onClick={() => {
                    if (!isBillerDisabled(biller)) {
                      setSelectedBillerId(biller.billerId);
                      setSelectedBillerIdImage(biller.iconUrl);
                    }
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",

                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {biller.iconUrl && (
                      <Box
                        component="img"
                        src={biller.iconUrl}
                        alt={biller.billerName}
                        sx={{
                          width: is_layout === 2 ? 40 : 52,
                          height: is_layout === 2 ? 40 : 52,
                          objectFit: "contain",
                          mb: 1,
                        }}
                      />
                    )}

                    {/* Tooltip only on biller name */}
                    <Tooltip title={biller.billerName} arrow>
                      <Typography
                        variant={is_layout === 2 ? "body2" : "subtitle2"}
                        fontWeight="600"
                        Wrap
                        sx={{
                          maxWidth: "100%",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {biller.billerName}
                      </Typography>
                    </Tooltip>

                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          biller.billerStatus === "ACTIVE" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {biller.billerStatus}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {meta && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={meta.totalPages}
                page={page}
                onChange={(e, newPage) => fetchBillers(newPage)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}

      {/* No billers found */}
      {!selectedBillerId && !loading && filteredBillers.length === 0 && (
        <Typography color="text.secondary">
          No billers found for this category.
        </Typography>
      )}
    </Box>
  );
};

export default BbpsBillers;
