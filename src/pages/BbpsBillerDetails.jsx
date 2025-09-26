import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";
import Loader from "../components/common/Loader";
import CommonMpinModal from "../components/common/CommonMpinModal";

const BbpsBillerDetails = ({
  billerId,
  onBack,
  selectedBillerIdImage,
  category,
  biller,
}) => {
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [billerDetails, setBillerDetails] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [fetchingBill, setFetchingBill] = useState(false);
  const [billData, setBillData] = useState(null);
  const [payingBill, setPayingBill] = useState(false);
  const [mpinModalOpen, setMpinModalOpen] = useState(false);
  const handleSendClick = () => {
    setMpinModalOpen(true);
  };

  const { location } = useContext(AuthContext);

  const authCtx = useContext(AuthContext);
  const ip = authCtx?.ip;

  // Fetch biller details
  const fetchBillerDetails = async () => {
    setDetailsLoading(true);
    try {
      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.BBPS_GET_BILLERS_DETAILS,
        { biller_id: billerId }
      );

      if (response) {
        const details =
          // response?.data?.response?.data?.parameters[0] ||
          response?.data?.response?.data;
        setBillerDetails(details);

        const params = details?.parameters || [];
        const initialValues = {};
        params.forEach((p) => {
          initialValues[p.name] = "";
        });
        setInputValues(initialValues);
      } else if (error) {
        apiErrorToast(error?.message || "Failed to fetch biller details");
      }
    } catch (err) {
      apiErrorToast(err.message || "Failed to fetch biller details");
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (billerId) fetchBillerDetails();
  }, [billerId]);

  const handleChange = (name, value) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch Bill
  const handleFetchBill = async () => {
    setFetchingBill(true);
    try {
      const payload = {
        biller_id: billerId,
        ...inputValues,
        ip: ip || "0.0.0.0",
        latitude: location?.lat || "",
        longitude: location?.long || "",
      };

      const { error, response } = await apiCall(
        "post",
        ApiEndpoints.BBPS_FETCH_BILL,
        payload
      );

      if (response) {
        const billInfo = response?.data || response;
        setBillData(billInfo);
      } else if (error) {
        apiErrorToast(error?.message || "Failed to fetch bill");
      }
    } catch (err) {
      apiErrorToast(err.message || "Failed to fetch bill");
    } finally {
      setFetchingBill(false);
    }
  };

  const handlePayBill = async (mpin) => {
      const payload = {
      billerId: billerId,
      biller_name: billerDetails?.billerInfo?.name,
      cat: billerDetails?.category?.key,
      pf: "web",
      latitude: location?.lat,
      longitude: location?.long,
      enquiryReferenceId: billData?.enquiryReferenceId || "",
      amount: billData?.BillAmount || inputValues?.amount,
      mpin,
    };
    // dynamic params (param1, param2, etc.)
    if (billerDetails?.parameters?.length > 0) {
      billerDetails.parameters.forEach((param) => {
        payload[param.name] = inputValues[param.name];
      });
    }
  
    setPayingBill(true);
    try {
      const { response, error } = await apiCall(
        "post",
        ApiEndpoints.BBPS_PAY_BILL,
        payload
      );
      if (response) {
        okSuccessToast(response.data.message);
        getRecentData();
        refreshUser();
      } else {
        apiErrorToast(error?.message || "Payment failed");
      }
    } catch (err) {
      apiErrorToast(err.message || "Payment failed");
    } finally {
      setPayingBill(false);
      setMpinModalOpen(false);
    }
  };

  if (detailsLoading)
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress size={40} />
        <Typography mt={2} variant="body1" color="text.secondary">
          Loading biller details...
        </Typography>
      </Box>
    );

  if (!billerDetails)
    return (
      <Typography mt={4} textAlign="center" color="text.secondary">
        No details found.
      </Typography>
    );

  const { parameters } = billerDetails;

  return (
    <>
      <Loader loading={payingBill} />
      <Box
        maxWidth="1200px"
        mx="auto"
        px={{ xs: 1.5, sm: 3, md: 1.5 }}
        py={{ xs: 2, sm: 4, md: 0 }}
      >
        {/* Back Button + Header */}
        <Box display="flex" alignItems="center" mb={1} gap={2}>
          <IconButton
            onClick={onBack}
            sx={{
              bgcolor: "#f3f4f6",
              "&:hover": { bgcolor: "#e5e7eb" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          {/* 
        {selectedBillerIdImage && (
          <Box
            component="img"
            src={selectedBillerIdImage}
            alt={billerDetails?.billerInfo?.name || "Biller"}
            sx={{
              width: 55,
              height: 55,
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        )} */}

          {/* <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1rem", sm: "1.25rem" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {billerDetails?.billerInfo?.name || "Biller"}
        </Typography> */}
        </Box>

        {/* Cards Layout */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // stack on mobile, row on md+
            gap: { xs: 2, md: 3 },
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {/* BILLER INPUT CARD */}
          <Card
            sx={{
              flex: { xs: "1 1 auto", md: "0 0 40%" },
              minWidth: { xs: "100%", sm: 300 },
              borderRadius: 3,
              boxShadow: "0 4px 16px rgba(178,176,176,0.08)",
              background: "linear-gradient(135deg, #fefefe 0%, #f4f8f8 100%)",
              border: "1px solid #e2e8f0",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  background: "#f2efff", // light blue background
                }}
              >
                {selectedBillerIdImage && (
                  <Box
                    component="img"
                    src={selectedBillerIdImage}
                    alt={billerDetails?.billerInfo?.name || "Biller"}
                    sx={{
                      width: 55,
                      height: 55,
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                )}

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="#000"
                  sx={{ fontSize: { xs: "1.1rem", sm: "1.3rem" } }}
                >
                  {billerDetails?.billerInfo?.name || "Biller"}
                </Typography>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box display="flex" flexDirection="column" gap={2}>
                {parameters?.map((param, idx) => (
                  <TextField
                    key={idx}
                    fullWidth
                    label={param.desc}
                    variant="outlined"
                    size="medium"
                    value={inputValues[param.name] || ""}
                    onChange={(e) => handleChange(param.name, e.target.value)}
                    inputProps={{
                      minLength: param.minLength,
                      maxLength: param.maxLength,
                      pattern: param.regex,
                      required: param.mandatory === 1,
                    }}
                  />
                ))}
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 4,
                  borderRadius: 2,
                  py: { xs: 1, sm: 1.4 },
                  fontWeight: "bold",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  background: " #fff",
                  color: "#2275b7",
                  boxShadow: "0 4px 12px rgba(79,70,229,0.25)",
                  "&:hover": {
                    background: "#2275b7",
                    color: "#fff",
                  },
                }}
                onClick={handleFetchBill}
                disabled={fetchingBill}
              >
                {fetchingBill ? "Fetching Bill..." : "Fetch Bill"}
              </Button>
            </CardContent>
          </Card>

          {/* BILL DETAILS CARD */}
          <Card
            sx={{
              flex: { xs: "1 1 auto", md: "0 0 60%" }, // fill remaining space
              minWidth: { xs: "100%", sm: 300 },
              borderRadius: 3,
              boxShadow: "0 4px 16px rgba(170,169,169,0.08)",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                {/* {selectedBillerIdImage && (
                  <Box
                    component="img"
                    src={selectedBillerIdImage}
                    alt={billerDetails?.billerInfo?.name || "Biller"}
                    sx={{
                      width: 50,
                      height: 50,
                      objectFit: "contain",
                      borderRadius: "8px",
                      bgcolor: "#f9fafb",
                      p: 0.5,
                    }}
                  />
                )} */}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {/* {billerDetails?.billerInfo?.name || "Biller"} */}
                  Bill Details
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  { label: "Customer Name", value: billData?.CustomerName },
                  { label: "Bill Number", value: billData?.BillNumber },
                  { label: "Bill Period", value: billData?.BillPeriod },
                  { label: "Bill Date", value: billData?.BillDate },
                  { label: "Due Date", value: billData?.BillDueDate },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "40% 60%" },
                      alignItems: "center",
                      gap: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      }}
                    >
                      {item.label} :
                    </Typography>
                    <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                      {item.value || "-"}
                    </Typography>
                  </Box>
                ))}

                {/* Editable Amount Field */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "40% 60%" },
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                  >
                    Amount :
                  </Typography>
                  <TextField
                    size="small"
                    variant="outlined"
                    value={billData?.BillAmount || ""}
                    onChange={(e) =>
                      setBillData((prev) => ({
                        ...prev,
                        BillAmount: e.target.value,
                      }))
                    }
                    InputProps={{
                      startAdornment: (
                        <Typography sx={{ mr: 0.5 }}>₹</Typography>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontWeight: "bold",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        color: "error.main",
                      },
                    }}
                  />
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 4,
                  borderRadius: 2,
                  py: { xs: 1, sm: 1.4 },
                  fontWeight: "bold",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  background: "#fff",
                  color: "#2275b7",
                  boxShadow: "0 4px 12px rgba(79,70,229,0.25)",
                  "&:hover": {
                    background: " #2275b7",
                    color: "#fff",
                  },
                }}
                onClick={handleSendClick}
                disabled={payingBill}
              >
                {payingBill ? "Processing Payment..." : "Pay Bill"}
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <CommonMpinModal
        open={mpinModalOpen}
        setOpen={setMpinModalOpen}
        title="Enter MPIN to Confirm Delete"
        mPinCallBack={handlePayBill}
      />
    </>
  );
};

export default BbpsBillerDetails;
