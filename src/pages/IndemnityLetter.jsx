import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Tooltip,
  Button,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AuthContext from "../store/AuthContext";
import PrintIcon from "@mui/icons-material/Print";  // Import Print Icon

import { numberToWord } from "../utils/FormattingUtils";
import { useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { mobile } from "../iconsImports";
import ApiEndpoints, { BASE_URL } from "../network/ApiEndPoints";
import axios from "axios";
import { get } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";
import { dateToTime1, ddmmyy } from "../utils/DateUtils";
const styles = StyleSheet.create({
  page: {
    padding: 30, // Consistent padding around the page
    fontSize: 12,
    lineHeight: 1.5,
    overflow: "hidden", // Prevents content from spilling out
  },
  section: {
    marginBottom: 20, // Increased spacing for better separation
  },
  viewer: {
    width: "100vw", // Use the full viewport width
    height: "100vh", // Use the full viewport height
    overflow: "auto", // Allows scrolling for larger content
  },
  image: {
    width: "100%", // Ensure images scale correctly
    maxWidth: 160, // Limit maximum width for consistency
    objectFit: "contain", // Prevent distortion
  },
  stamp_image: {
    width: 200,
    marginLeft: 0, // Center align for consistency
  },
  bigtext: {
    fontSize: 20, // Reduced to avoid cutting large text
    letterSpacing: 0.4,
    lineHeight: 1.4, // Improved readability
  },
  text: {
    fontSize: 11,
    letterSpacing: 0.4,
    marginBottom: 20, // Adjust spacing between paragraphs
    lineHeight: 1.5,
    textAlign: "justify",
    wordWrap: "break-word", // Ensures words break properly
  },
});

const IndemnityLetter = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const location = useLocation();
  const contentRef = useRef();
  const { amount } = location.state || {};
  const [showForPDF, setShowForPDF] = useState(false);
  const { referenceId } = location.state || {};
  const { bank } = location.state || {};
  const { mode } = location.state || {};
  const { name } = location.name || {};
   const [userDetails, setUserDetails] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
  const { dateValue } = location.state || {};
    const [bcDropdown, setBcDropDown] = useState("");
      const [userRequest, setUserRequest] = useState(false);
 const [kycImages, setKycImages] = useState({});
 const getuser = () => {
  get(
    ApiEndpoints.GET_USER_BY_ID,
    query,
    setUserRequest,
    (res) => {
      if (res && res.data && res.data) {
        setUserDetails(res?.data?.data);
        setBcDropDown(res?.data?.data.type);
        // setOpen(true);
      } else setUserDetails();
    },
    (error) => {
      apiErrorToast(error);
    }
  );
};
  const token = authCtx.token;
 
  const getImage = async (fileName) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/${ApiEndpoints.GET_FILES}`,
        { fileName },
        { responseType: "blob", headers: headers }
      );

      const imageUrl = URL.createObjectURL(new Blob([response.data]));
      return imageUrl;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };
  React.useEffect(() => {
    getuser();
  }, []); // Run only on component mount
  
  React.useEffect(() => {
    if (userDetails.kyc_images) {
      const parsedImages = JSON.parse(userDetails.kyc_images);
      setKycImages(parsedImages);
  
      // Fetch image after setting kycImages
      if (parsedImages["signature"]) {
        fetchImage("signature", parsedImages);
      }
    }
  }, [userDetails.kyc_images]); // Triggered when `kyc_images` updates
  
  const fetchImage = async (filename, images) => {
    const fileName = images ? images[filename] : kycImages[filename];
    if (!fileName) return;
  
    const url = await getImage(fileName);
    if (url) {
      setImageUrl(url);
    }
  };

 
  // Function to get current date and time
  const getCurrentDateTime = () => {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, "0") : "12"; // The hour '0' should be '12'

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  const queryParams = new URLSearchParams(location.search);
  const stateData = {
    
    amount: queryParams.get("amount"),
    referenceId: queryParams.get("referenceId"),
    bank: queryParams.get("bank"),
    mobile:queryParams.get("mobile"),
    id:queryParams.get("id"),
    user_id:queryParams.get("user_id"),
    name: queryParams.get("name"),
    mode: queryParams.get("mode"),
    dateValue: queryParams.get("dateValue"),
    remark: queryParams.get("remark"),
    txn_id: queryParams.get("txn_id"),
    transactionid:queryParams.get("transactionid"),
    date:queryParams.get("date"),

    
   
  };
  const query = `id=${stateData.user_id}`;
  React.useEffect(() => {
    getuser()
    fetchImage("signature")
    }, [userDetails.kyc_images]);
    useEffect(() => {
      if (userDetails.kyc_images) {
        setKycImages(JSON.parse(userDetails.kyc_images));
      } 
    }, [userDetails.kyc_images]);


  const downloadButtonRef = useRef();

  const handleDownload = () => {
    setShowForPDF(true);

    setTimeout(() => {
      if (downloadButtonRef.current) {
        downloadButtonRef.current.classList.add("hide-in-pdf");
      }

      const element = contentRef.current;
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: "Indemnity_Letter.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
      };

      html2pdf()
        .set(options)
        .from(element)
        .save()
        .finally(() => {
          setShowForPDF(false);

          if (downloadButtonRef.current) {
            downloadButtonRef.current.classList.remove("hide-in-pdf");
          }
        });
    }, 500);
  };

  const handleSubmit = () => {
    // Handle the form submission logic here
    console.log("Indemnity Letter Submitted");
  };

  const handlePrint = () => {
    window.print();
  };
  return (
    <div
      ref={contentRef}
      style={{
        padding: "20px",
        flexGrow: 1,
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        maxWidth: "800px",
        margin: "0 auto",
        color: "#333",
        textAlign: "justify",
        overflowWrap: "break-word",
        wordWrap: "break-word",
        whiteSpace: "normal",
      }}
    >
      <Box
        sx={{
          padding: "2rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        <div
          className="page"
          style={{
            pageBreakAfter: "always",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Typography variant="h5" align="center">
              INDEMNITY LETTER / BOND
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>

            <Tooltip title="Download as PDF" arrow>
              <Button
                ref={downloadButtonRef}
                id="downloadButton"
                onClick={handleDownload}
                sx={{
                  minWidth: "auto",
                  padding: 1,
                  marginLeft: 2,
                }}
              >
                <DownloadIcon style={{ color: "black" }} />
              </Button>
            </Tooltip>
            <Tooltip title="Print" arrow>
                <Button
                  onClick={handlePrint}
                  sx={{
                    minWidth: "auto",
                    padding: 1,
                    marginLeft: 2,
                  }}
                >
                  <PrintIcon style={{ color: "black" }} />
                </Button>
              </Tooltip>
              </Box>
          </Box>

          <Typography
            variant="body1"
            align="left"
            sx={{ marginBottom: "1rem" }}
          >
          {ddmmyy(stateData.date)} {dateToTime1(stateData.date)}
          </Typography>

          <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
            <strong>From:</strong>
          </Typography>

          <TableContainer component={Paper} sx={{ marginBottom: "2rem" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{ fontWeight: "bold" }}
                  >
                    Merchant/Agent Information
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Merchant/Agent Name</strong>
                  </TableCell>
                  <TableCell>{stateData.name||user?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>BC Agent Id</strong>
                  </TableCell>
                  <TableCell>{stateData.id||user?.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Registered Mobile Number</strong>
                  </TableCell>
                  <TableCell>{stateData?.mobile||user?.username }</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>PAN Number</strong>
                  </TableCell>
                  <TableCell>{"Not found in user"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Request No.</strong>
                  </TableCell>
                  <TableCell>{stateData.txn_id||stateData.transactionid}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Amount</strong>
                  </TableCell>
                  <TableCell>{stateData.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Amount (In Words)</strong>
                  </TableCell>
                  <TableCell>{numberToWord(stateData.amount)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Bank Account</strong>
                  </TableCell>
                  <TableCell>{stateData.bank || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Deposit Date</strong>
                  </TableCell>
                  <TableCell>{stateData.dateValue}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Payment Type</strong>
                  </TableCell>
                  <TableCell>{stateData.mode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Remark</strong>
                  </TableCell>
                  <TableCell>{stateData.remark}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="page">
          <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
            To,
            <br />
            The Board of Directors,
            <br />
            Dillipay Technologies Limited,
            <br />
            Plot No 5, Second Floor, Pocket 5,
            <br />
            Sector 24, Rohini, Delhi-110085
          </Typography>

          <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
            Dear Sir/Madam,
            <br />
            I, {user?.establishment}, as a Merchant/Agent/Distributor/Super
            Distributor hereby undertake and explicitly agree to indemnify
            Dillipay Technologies Limited towards the following points:
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Condition</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    Dillipay Technologies Limited is providing us with a
                    platform as an enabler through which we can
                    transfer/receive/top up the money through various methods
                    like UPI/IMPS/RTGS/Cash/Payment Gateway etc from one person
                    to another(P2P and P2M) against a separate consideration.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    I am wholly and solely responsible for the collection of
                    KYC/ meeting the Statutory/legal requirements and other
                    mandatory documents from the sender or receiver or both and
                    also the reasons of such transactions.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    I am responsible and abide to provide the KYC and other
                    mandatory documents and reasons of each and every
                    transaction with end customers to the Dillipay Technologies
                    Limited at Dillipay Technologies Limited discretion.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    I am wholly and solely responsible for those transactions
                    which were wrongly debited or credited by me to another
                    party or any incorrect entry/entries while using the
                    platform.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    After obtaining a proper understanding of the transaction
                    patterns of this Company, I am giving my consent to use this
                    platform with all the terms and conditions as provided by
                    Dillipay, assuring that every sender or receiver or both
                    only after giving their full consent will use this platform
                    for transfer/receive/topup the money through various methods
                    like CASH/UPI/IMPS/NEFT/RTGS/Payment Gateway etc.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
            Thanking you
          </Typography>
          {imageUrl&&
            <img src={imageUrl} alt="signature" style={{ width: '100px', height: '60px' }} />}
          <Typography variant="body1">
            {stateData?.name}
            <br />
            (Merchant's/Agent's/Distributor's/Super Distributor's Name)
            <br />
            Seal and Signature
          </Typography>

          <Typography variant="body1">
            Time stamp:  {ddmmyy(stateData.date)} {dateToTime1(stateData.date)}
          </Typography>
        </div>
      </Box>
    </div>
  );
};

export default IndemnityLetter;
