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
  Grid,
} from "@mui/material";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";
import SearchIcon from "@mui/icons-material/Search";
import { Tooltip } from "@mui/material";
import BbpsBillers from "./BbpsBillers";
import AuthContext from "../contexts/AuthContext";
import { useToast } from "../utils/ToastContext";
import OutletDmt1 from "./OutletDnt1";
import CommonLoader from "../components/common/CommonLoader";
import BillPaymentsBillers from "./BillPaymentsBillers";

const BillPayments = () => {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDmt1Modal, setOpenDmt1Modal] = useState(false);

  const { showToast } = useToast();
  // const { authUser, location } = useContext(AuthContext);
  const instId = user?.instId;
  console.log("The instId in user is", instId);
  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    const { error, response } = await apiCall(
      "post",
      ApiEndpoints.BILL_PAYMENTS_CATEGORIES
    );

    if (response) {
      const data = response?.data || response?.response?.data || [];
      setCategories(data);
      setFiltered(data);
    } else if (error) {
      showToast(error?.message || "Failed to fetch categories");
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
    <Box>
      <CommonLoader loading={loading} />
      {!instId ? (
        <Box
          textAlign="center"
          mt={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <Typography variant="h6" color="text.secondary">
            You need to complete Outlet Registration to use DMT1.
          </Typography>
          <button
            onClick={() => setOpenDmt1Modal(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Register Outlet
          </button>

          <OutletDmt1
            open={openDmt1Modal}
            handleClose={() => setOpenDmt1Modal(false)}
            onSuccess={() => {
              setOpenDmt1Modal(false);
              window.location.reload(); // Or refresh instId via context if dynamic
            }}
          />
        </Box>
      ) : (
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
                <Grid container spacing={2.2}>
                  {filtered.length > 0 ? (
                    filtered.map((cat) => (
                      <Grid
                        item
                        key={cat.id}
                        xs={12}
                        sm={6}
                        md={2}
                        lg={2}
                        xl={3}
                      >
                        <Card
                          sx={{
                            borderRadius: 3,
                            boxShadow: 3,
                            width: 212,
                            height: 120,
                            cursor: "pointer",
                            transition: "all 0.3s ease", // smooth transition
                            "&:hover": {
                              boxShadow: 6,
                              border: "2px solid #6c4bc7", // purple border on hover
                            },
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
                              <Typography
                                variant="subtitle1"
                                fontWeight="600"
                                wrap
                              >
                                {cat.category_name}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography textAlign="center" color="text.secondary">
                        No categories found.
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                // <Box display="flex" flexWrap="wrap" gap={2.8}>
                //   {filtered.length > 0 ? (
                //     filtered.map((cat) => (
                //       <Card
                //         key={cat.id}
                //         sx={{
                //           borderRadius: 3,
                //           boxShadow: 3,
                //           "&:hover": { boxShadow: 6 },
                //           width: 240,
                //           height: 120,
                //           cursor: "pointer",
                //         }}
                //       >
                //         <CardActionArea
                //           sx={{ height: "100%" }}
                //           onClick={() => setSelectedCategory(cat)}
                //         >
                //           <CardContent
                //             sx={{
                //               textAlign: "center",
                //               display: "flex",
                //               flexDirection: "column",
                //               alignItems: "center",
                //               justifyContent: "center",
                //               height: "100%",
                //             }}
                //           >
                //             {(cat.icon_url || cat.icon) && (
                //               <Box
                //                 component="img"
                //                 src={cat.icon_url || cat.icon}
                //                 alt={cat.category_name}
                //                 sx={{ width: 40, height: 40, mb: 1 }}
                //               />
                //             )}
                //             <Typography variant="subtitle1" fontWeight="600" Wrap>
                //               {cat.category_name}
                //             </Typography>
                //           </CardContent>
                //         </CardActionArea>
                //       </Card>
                //     ))
                //   ) : (
                //     <Typography textAlign="center" color="text.secondary" width="100%">
                //       No categories found.
                //     </Typography>
                //   )}
                // </Box>
              )}
            </>
          ) : (
            <BbpsBillers
              type="billpayments"
              category={selectedCategory}
              onBack={() => setSelectedCategory(null)}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default BillPayments;
