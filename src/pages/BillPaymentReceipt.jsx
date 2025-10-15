import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const BillPaymentReceipt = ({
  receiptData,
  onClose,
  billerDetails,
  inputValues,
}) => {
  const {
    status,
    message,
    data: {
      transactionId,
      amount,
      operator,
      data: { param1, order_id, providerId },
    },
  } = receiptData;

  // Format date and time
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Download receipt as PDF
  const handleDownload = () => {
    // Implement PDF download functionality
    console.log("Downloading receipt...");
  };

  // Share receipt
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Payment Receipt",
        text: `Payment of ₹${amount} to ${operator} completed successfully. Transaction ID: ${transactionId}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Payment Receipt\nAmount: ₹${amount}\nOperator: ${operator}\nTransaction ID: ${transactionId}`
      );
      alert("Receipt details copied to clipboard!");
    }
  };

  // Print receipt
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box
      sx={{
        maxWidth: "500px",
        margin: "auto",
        p: 3,
        backgroundColor: "white",
      }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Success Header */}
          <Box textAlign="center" mb={3}>
            <CheckCircleIcon
              sx={{
                fontSize: 64,
                color: "success.main",
                mb: 2,
              }}
            />
            {/* <Typography
              variant="h5"
              fontWeight="bold"
              color="success.main"
              gutterBottom
            >
              Payment Successful!
            </Typography> */}
            <Typography
              variant="body1"
              color="text.secondary"
              fontWeight="bold"
            >
              {message || "Your payment has been processed successfully"}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Transaction Details */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#6C4BC7" }}
            >
              Transaction Details
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Amount */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                }}
              >
                <Typography fontWeight="bold">Amount Paid</Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  ₹{amount}
                </Typography>
              </Box>

              {/* Order ID */}
              <DetailRow label="Order ID" value={order_id} />

              {/* Operator */}
              <DetailRow label="Operator" value={operator} />

              {/* Customer Number */}
              <DetailRow label="Customer Number" value={param1} />

              {/* Provider ID */}
              {/* <DetailRow label="Provider ID" value={providerId} /> */}

              {/* Biller Info */}
              {billerDetails && (
                <DetailRow
                  label="Biller"
                  value={billerDetails.billerInfo?.name}
                />
              )}

              {/* Date & Time */}
              <DetailRow label="Date" value={currentDate} />
              <DetailRow label="Time" value={currentTime} />

              {/* Additional parameters from input */}
              {inputValues &&
                Object.entries(inputValues).map(([key, value]) => (
                  <DetailRow
                    key={key}
                    label={key.replace(/([A-Z])/g, " $1").toUpperCase()}
                    value={value}
                  />
                ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <IconButton
              onClick={handleDownload}
              sx={{
                backgroundColor: "#f0f0f0",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <DownloadIcon />
            </IconButton>

            {/* <IconButton
              onClick={handleShare}
              sx={{
                backgroundColor: "#f0f0f0",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <ShareIcon />
            </IconButton> */}

            <IconButton
              onClick={handlePrint}
              sx={{
                backgroundColor: "#f0f0f0",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <PrintIcon />
            </IconButton>
          </Box>

          {/* Close Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={onClose}
            sx={{
              mt: 3,
              borderRadius: 2,
              py: 1.5,
              fontWeight: "bold",
              backgroundColor: "#6C4BC7",
              "&:hover": {
                backgroundColor: "#5a3cb0",
              },
            }}
          >
            Done
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

// Reusable detail row component
const DetailRow = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight="medium">
      {value || "-"}
    </Typography>
  </Box>
);

export default BillPaymentReceipt;
