import { useEffect, useState, useMemo, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
  Pagination,
  Grid,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { apiCall } from "../../api/apiClient";
import ApiEndpoints from "../../api/ApiEndpoints";
import { apiErrorToast } from "../../utils/ToastUtil";
import BbpsBillerDetails from "../../pages/BbpsBillerDetails";
import AuthContext from "../../contexts/AuthContext";

const CreditCardBbps = ({ category, onBack }) => {
  const [billers, setBillers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedBillerId, setSelectedBillerId] = useState(null);
  const [selectedBillerIdImage, setSelectedBillerIdImage] = useState(null);
  const [selectedBiller, setSelectedBiller] = useState(null);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const is_layout = user?.is_layout;

  // ✅ Fetch billers by category key and pagination
  const fetchBillers = async (pageNo = 1) => {
    setLoading(true);
    try {
      const payload = {
        category_key: "C15", // ✅ Always send C15
        page: pageNo, // ✅ If your API supports pagination
      };

      const { response, error } = await apiCall(
        "POST",
        ApiEndpoints.BBPS_GET_BILLERS,
        payload
      );

      if (response) {
        console.log("Fetched billers:", response.data.records);

        const records = response?.data?.records || [];
        const metaInfo = response?.data?.meta || null;

        setBillers(records);
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
    fetchBillers(1);
  }, []); // Remove dependency for initial load

  // ✅ Filter billers by search text
  const filteredBillers = useMemo(() => {
    if (!searchText) return billers;
    return billers.filter((biller) =>
      biller.billerName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, billers]);

  // ✅ Check if biller is disabled
  const isBillerDisabled = (biller) => biller.billerStatus === "BLOCKED";

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <IconButton onClick={onBack}>{/* <ArrowBackIcon /> */}</IconButton>

        <Typography
          variant="h5"
          fontWeight="bold"
          noWrap
          sx={{ flexShrink: 0 }}
        >
          {category?.category_name || "Credit Card Billers"}
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

      {/* Loader */}
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
          category={category}
          biller={selectedBiller}
        />
      ) : null}

      {/* Billers list */}
      {!selectedBillerId && !loading && filteredBillers.length > 0 && (
        <>
          <Grid container spacing={2.5} justifyContent="center">
            {filteredBillers.map((biller) => (
              <Grid
                item
                key={biller.billerId}
                xs={6}
                sm={4}
                md={2.4}
                lg={2.4}
                xl={2.4}
              >
                <Card
                  sx={{
                    borderRadius: is_layout === 2 ? 2 : 3,
                    boxShadow: 3,
                    width: is_layout === 2 ? 180 : 305,
                    height: is_layout === 2 ? 110 : 160,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: isBillerDisabled(biller)
                      ? "not-allowed"
                      : "pointer",
                    opacity: isBillerDisabled(biller) ? 0.6 : 1,
                    transition: "all 0.25s ease",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-3px)",
                    },
                  }}
                  onClick={() => {
                    if (!isBillerDisabled(biller)) {
                      setSelectedBillerId(biller.billerId);
                      setSelectedBiller(biller);
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
                    {/* 
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          biller.billerStatus === "ACTIVE" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {biller.billerStatus}
                    </Typography> */}

                    <Typography
                      fontWeight="600"
                      sx={{
                        width: is_layout === 2 ? 160 : 285, // slightly smaller than Card width
                        textOverflow: "ellipsis",
                        overflow: "hidden",

                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      {biller.billerName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
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
        <Typography color="text.secondary" align="center" mt={4}>
          No billers found for this category.
        </Typography>
      )}
    </Box>
  );
};

export default CreditCardBbps;
