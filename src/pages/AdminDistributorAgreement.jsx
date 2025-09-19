import React, { useContext, useRef } from "react";
import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import {
  Box,
  FormControl,
  TextField,
  Button,
  Tooltip,
  Checkbox,
  Typography,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
 
import DownloadIcon from "@mui/icons-material/Download";
import html2pdf from "html2pdf.js";
import PinInput from "react-pin-input";
 
// import { impsDirectorsign } from "../iconsImports";
import ImpsGuruSignature from "../assets/Images/ImpsGuruSign.jpeg";
 
 
import { useLocation } from "react-router-dom";
import { datemonthYear, ddmmyy, myDateDDMMTT, myDateDDMMyy } from "../utils/DateUtils";
import axios from "axios";
import ApiEndpoints from "../api/ApiEndpoints";
import AuthContext from "../contexts/AuthContext";
 
import ModalHeader from "../components/common/ModalHeader";
import ModalFooter from "../components/common/ModalFooter";
import { apiCall } from "../api/apiClient";

// Define the PDF document component
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    lineHeight: 1.5,
   
  },
  section: {
    marginBottom: 10,
  },
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  image: {
    width: 160,
  },
  stamp_image: {
    width: 200,
    marginLeft: -15,
  },
  bigtext: {
    fontSize: 200,
    letterSpacing: 0.4,
    lineHeight: 1.2,
  },
  text: {
    fontSize: 11,
    letterSpacing: 0.4,
    marginBottom: 30,
    lineHeight: 1.5,
    textAlign: "justify",
    wordWrap: "break-word",
    
  },
});

const AdminDistributorAgreement = () => {
  const [open, setOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [checked, setChecked] = useState(false);
  const [request, setRequest] = useState(false);
  const [aadhaar, setAadhaar] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpRefrance, setOtpRefrance] = useState("");
  const [message, setMessage] = useState("");
  const [showForPDF, setShowForPDF] = useState(false);
  const [date, setDate] = useState();
  const [otp, setOtp] = useState("");
  const [aadhaarError, setAadhaarError] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const location = useLocation();
  const [ip, setIp] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    // Fetch the IP address
    const fetchIp = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setIp(response.data.ip);
      } catch (error) {
        console.error("Error fetching the IP address:", error);
      }
    };

    fetchIp();

    // Detect if the user is on a phone
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android|iPad|iPhone|iPod/.test(userAgent.toLowerCase())) {
      setIsPhone(true);
    }
  }, []);
  const queryParams = new URLSearchParams(location.search);

  const stateData = {
    name: queryParams.get("name"),
    role: queryParams.get("role"),
    state: queryParams.get("state"),
    establishment: queryParams.get("establishment"),
    username: queryParams.get("username"),
    name: queryParams.get("name"),
    rowData: queryParams.get("rowData"),
    ip: queryParams.get("ip"),
    pan: queryParams.get("pan"),
    type: queryParams.get("type"),
  };
  if (!stateData.rowData) {
    console.warn("rowData is not present in the URL query parameters.");
  }
  const contentRef = useRef();
  useEffect(() => {
    if (!stateData?.rowData) return; // Ensure stateData.rowData is available

    apiCall(
      ApiEndpoints.AGEMENT_DATE,
      { id: stateData.rowData },
      setRequest,
      (res) => {
        setDate(res.data.data.created_at);
        setMessage(
          `This agreement  is electronically transmitted on ${ddmmyy(
            date
          )} from IP address ${ip}. and verified by (${
            stateData?.establishment
          }/${stateData?.name}) having PAN NO ${stateData?.pan} `
        );
        setChecked(true); // Update the state with the date
      },
      (err) => {
        console.error("Error fetching date:", err); // Handle errors
      }
    );
  }, [stateData?.rowData]); // Empty
  const handleDownload = () => {
    setShowForPDF(true);

    setTimeout(() => {
      document.getElementById("downloadButton").classList.add("hide-in-pdf");

      const element = contentRef.current;
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: "Distributor_Agreement.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 3, letterRendering: true, useCORS: true },
        jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
      };

      html2pdf()
        .set(options)
        .from(element)
        .save()
        .finally(() => {
          setShowForPDF(false);
          document
            .getElementById("downloadButton")
            .classList.remove("hide-in-pdf");
        });
    }, 500);
  };

  const getCurrentDateTime = () => {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year} `;
  };

  useEffect(() => {
    setCurrentDateTime(getCurrentDateTime());

    const interval = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function handleChange(e) {
    setChecked(!checked);
    setOpen(!checked);
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: "40%",
    boxShadow: 24,
    fontFamily: "Poppins",
    height: "max-content",
    overflowY: "scroll",
    p: 2,
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAadhaarError("");
    setOtpError("");

    // Aadhaar validation
    if (aadhaar.length !== 12) {
      setAadhaarError("Enter Valid Aadhaar Number");
      return;
    }

    // Helper function to get stateData's location
    const getLocation = (e) =>
      new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error)
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });

    try {
      // Retrieve stateData's location
      const { latitude, longitude } = await getLocation();

      // Send Aadhaar and location data (no OTP required)
      postJsonData(
        ApiEndpoints.SEND_OTP_Okyc, // You might want to rename the API endpoint if OTP is not being sent
        { aadhaarNumber: aadhaar, latitude, longitude },
        setRequest,
        (res) => {
          setOtpRefrance(res?.data?.data?.otpReferenceID);
          setIsOtpSent(true); // Set OTP sent status to true
        },
        (err) => {
          console.error("Error submitting Aadhaar", err);
          setAadhaarError("Error submitting Aadhaar. Please try again.");
        }
      );
    } catch (error) {
      console.error("Error fetching location:", error);
      setAadhaarError("Unable to fetch location. Please try again.");
    }
  };
  const verifyOTP = async (e) => {
    e.preventDefault();
    setOtpError("");
    const getLocation = () =>
      new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error)
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });
    if (!isOtpSent) {
      // If OTP is not sent, validate Aadhaar number
      if (aadhaar.length !== 12) {
        setAadhaarError("Enter Valid Aadhaar Number");
        return;
      }
      // Proceed with OTP sending if Aadhaar is valid
      try {
        const { latitude, longitude } = await getLocation();

        postJsonData(
          ApiEndpoints.SEND_OTP_Okyc,
          { aadhaarNumber: aadhaar, latitude, longitude },
          setRequest,
          (res) => {
            setOtpRefrance(res?.data?.data?.otpReferenceID);
            setIsOtpSent(true); // Set OTP sent status
          },
          (err) => {
            console.error("Error sending OTP", err);
            setOtpError("Error sending OTP. Please try again.");
          }
        );
      } catch (error) {
        console.error("Error fetching location:", error);
        setOtpError("Unable to fetch location. Please try again.");
      }
    } else {
      // OTP verification block
      if (otp.length === 6) {
        try {
          const { latitude, longitude } = await getLocation();

          // Verify OTP
          postJsonData(
            ApiEndpoints.VERIFY_OTP_OKYC,
            { otp, otpReferenceID: otpRefrance, latitude, longitude },
            setRequest,
            (res) => {
              setMessage(
                             `This agreement  is electronically transmitted on ${ddmmyy(
                               date
                             )} from IP address ${ip}. and verified by (${
                               user?.establishment
                             }/${user?.name}) having PAN NO ${user?.pan} `
                           );
              setChecked(true);
              handleDownload();

              handleClose();
            },
            (err) => {
              console.error("Error verifying OTP", err);
              setOtpError("Invalid OTP. Please try again.");
            }
          );
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      } else {
        setOtpError("Enter a valid OTP.");
      }
    }
  };

  const handleCloseModel = () => {
    setAadhaar("");
    setOtp("");
    setIsOtpSent(false);
    setChecked(false);
    setOpen(false);
  };
  const handleClose = () => {
    setAadhaar("");
    setOtp("");
    setIsOtpSent(false);
    setOpen(false);
  };
  return (
    <>
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
          marginLeft: 270,
          
        
        }}
      >
        <Page size="A4" style={styles.page}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
              marginTop: "20px",
              
            }}
          >
            <h1
              style={{
                alignItems: "center",
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "24px",
                flexGrow: 1,
              }}
            >
              DISTRIBUTOR AGREEMENT
            </h1>

            <Tooltip title="Download as PDF" arrow>
              <Button
                id="downloadButton"
                onClick={handleDownload}
                style={{
                  minWidth: "auto",
                  padding: 8,
                  mb: 1,
                  // backgroundColor: "black",
                }}
              >
                <DownloadIcon style={{ color: "black" }} />
              </Button>
            </Tooltip>
          </div>

          <p
            style={{
              fontStyle: "italic",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            This Agreement is made as of this Between:
          </p>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            <strong>Mobifast Solutions Pvt. Ltd.</strong>, a company
            incorporated under The Companies Act, 2013, having its registered
            office at  Plot No. 8, Pocket 6, Sector 22, Rohini, Delhi, 110086
          </p>

          <p style={{ marginBottom: "30px", marginLeft: "20px" }}>
            <strong>
              {stateData.establishment} ,{stateData.id} , {stateData.name},{" "}
              {stateData.username}
            </strong>{" "}
            (Hereinafter referred to as "DISTRIBUTOR", which expression shall
            unless repugnant to the context or meaning thereof, include their
            successors and permitted assigns) of the SECOND PART.
          </p>

          <p>
            The ImpsGuru and the Distributor are herein collectively referred to
            as the “Parties” and individually as a “Party.”
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            WHEREAS
          </h2>

          <ul style={{ paddingLeft: "40px", marginBottom: "30px" }}>
            <li style={{ marginBottom: "15px" }}>
              <strong>A.</strong> ImpsGuru is a technology-based company
              engaged, inter alia, provides the software/platform services in
              the business of the Fintech industry and caters to a number of
              services like Domestic Money Transfer, Aadhaar Enabled Payment
              System, Utility Bill payments, Recharge, Travel, and many more.
            </li>
            <li style={{ marginBottom: "15px" }}>
              <strong>B.</strong> ImpsGuru proposes to appoint Distributor(s) in
              various cities and regions of India for the purpose of managing
              retailers to be appointed by ImpsGuru in such cities and regions
              and to perform various services offered by ImpsGuru. Such
              Distributor may be referred to as Master Distributor (MD) or
              Distributor (DI).
            </li>
            <li style={{ marginBottom: "15px" }}>
              <strong>C.</strong> The Distributor wishes to be appointed as the
              Distributor in the ImpsGuru-designated regional territory
              (hereinafter referred to as "Territory") on the terms & conditions
              contained in this Distributor Agreement. The Parties agree and
              undertake to abide by the terms and conditions of this Agreement.
            </li>
          </ul>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            1. APPOINTMENT OF THE DISTRIBUTOR
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Subject to the terms and conditions contained in this Distributor
            Agreement, ImpsGuru hereby appoints the Distributor as the
            Distributor of ImpsGuru on a non-exclusive basis for the Territory
            to provide the services mentioned in Annexure-I (hereinafter
            referred to as "Services"), and the Distributor hereby agrees to
            provide the Services.
          </p>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor may describe themselves as ImpsGuru’s authorized
            distributor, but must not hold themselves out as being entitled to
            bind ImpsGuru in any way.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            2. COMMENCEMENT TERM AND RENEWAL
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall commence business in accordance with this
            Agreement within 15 days from the signing date. The Agreement is
            valid for 9 years unless terminated in accordance with clause 13.
            Upon expiry and subject to satisfactory performance, the Agreement
            may be renewed at ImpsGuru’s discretion.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            3. PROVISION OF SERVICES
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            During the Term, the Distributor shall render to ImpsGuru services
            as defined in Annexure-I. ImpsGuru reserves the right to modify,
            alter, and amend the list of Services at any time, and the
            Distributor shall be bound by all such modifications and amendments.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            4. BUSINESS PLAN AND RETAILERS
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Parties shall mutually agree upon a Business Plan in relation to
            sourcing retailers. The Distributor agrees to introduce retailers
            per the agreed Business Plan. If unable to meet these numbers,
            ImpsGuru may appoint additional Distributors or terminate this
            Agreement.
          </p>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor acknowledges responsibility for credit transactions
            with retailers within the Territory, and ImpsGuru shall not be
            liable for any disputes arising from these transactions.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            5. PAYMENT AND COMMISSION
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall deposit a sum of INR [……….../=] [……..in
            words……...] with the ImpsGuru on or before the effective date. The
            deposit shall be non-interest bearing and shall be refunded at the
            time of termination of the Distributor Agreement in accordance with
            the provision defined in clause 14 (Consequences of Termination) of
            this Distributor Agreement.
          </p>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor acknowledges that the ImpsGuru may reject the
            deposit at its sole discretion on or before the effective date.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            In addition to the deposit, the Distributor shall maintain and
            deposit with the ImpsGuru, working capital to the extent of INR
            [……….../=] [……..in words……...], which shall also be
            non-interest-bearing. The working capital shall be utilized to
            provide credit to the retailers appointed by the ImpsGuru in the
            Territory, and who (retailers) are managed by the Distributor.
          </p>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Distributor agrees and acknowledges that the ImpsGuru shall not be
            responsible or liable in any manner whatsoever for the sources of
            such deposits and/or working capital, and it is the sole
            responsibility of the Distributor to ensure that the sources of such
            deposits and/or working capital are legitimate and are in accordance
            with the law of India.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            All the amount due to ImpsGuru under this Distributor Agreement,
            including the deposit and working capital and/or platform fee, shall
            be deposited in accordance with the instructions provided in
            Annexure-II. Distributor agrees and acknowledges that the ImpsGuru
            may, by prior written notice of two business days, modify any of the
            details mentioned in Annexure-II and the Distributor shall be bound
            by all such modifications.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Distributor acknowledges and agrees that ImpsGuru strictly prohibits
            any third-party deposits in any bank accounts via any mode
            whatsoever. In the event that Distributor or its Retailer indulges
            in any such transaction(s) knowingly or unknowingly, the Distributor
            authorizes ImpsGuru to freeze its account immediately.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Distributor shall be entitled to the commission, discount or service
            fee, or such other remuneration referred in the Services, as may be
            specified by the ImpsGuru, from time to time and published on
            ImpsGuru’s portal. All the amounts paid by way of the commission
            shall be exclusive to all applicable taxes, including goods and
            service tax, surcharge, cess etc., by whatsoever name called, and
            such taxes will be subject to the deduction of tax at source, if
            applicable; ImpsGuru shall debit the account of the Distributor to
            the extent of such taxes.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The commission shall accrue to the Distributor only on receipt and
            realization of full payment by the ImpsGuru of all dues from the
            retailers who are managed by the Distributor.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The commission so accrued shall be paid to the Distributor on a
            monthly basis by way of bank transfer or additional credit in the
            working capital.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Payments made to the Distributor shall be subject to such
            withholding as prescribed under the applicable law, subject to the
            aforesaid, ImpsGuru assumes no responsibility for the tax compliance
            of the Distributor.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor agrees that payments made to the Distributor shall
            be subject to the deduction of chargeback/ complaint against the
            AEPS transactions, Payment Gateway transactions and / or QR code
            transactions or any deposit or withdrawal transaction any other
            transactions whatsoever.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor agrees and authorizes ImpsGuru to impose cash
            deposit bank charges which shall be subject to deduction from the
            payments made to the Distributor.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            All costs and expenses for travelling, promotional activities and
            other similar out-of-pocket expenses incurred in the performance of
            the Services shall be borne by the Distributor.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Distributor agrees and acknowledges that in case of any deviation
            with respect to the use of key salt, it shall be solely liable and
            responsible; and in such event, ImpsGuru is authorized to
            immediately deactivate the account of Distributor without any prior
            notice. ImpsGuru shall not be held responsible for any consequences
            that arise out of any unauthorized use of its platform in any
            manner.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor agrees and authorizes ImpsGuru to freeze its account
            or account of its Retailer in the event ImpsGuru receives any
            complaint from any relevant statutory or non-statutory authority or
            any government department or agency. The Distributor further agrees
            and authorizes ImpsGuru to withdraw the disputed amount along with
            the anticipated penalty from the such frozen account.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Distributor agrees and acknowledges that all the sales/ receipts of
            the distributor regarding the ImpsGuru shall be immediately Deposit
            or transfer of the funds into the designated Bank Accounts of the
            ImpsGuru and shall get limit from the Company/ ImpsGuru thereafter.
            The Distributor shall ensure that the working limit in the portal by
            ImpsGuru against the cash deposit or funds transfer is made
            available to the distributor immediately. The Distributor shall
            inform to the Company/ ImpsGuru in predefined format, if the
            distributor fails to inform the same within seven calendar days the
            amount will be forfeit by the Company/ ImpsGuru. Distributor may
            deposit such cash self or via its employee or agent or any
            authorized person into the designated Bank Accounts of the ImpsGuru.
          </p>
        </Page>
        <Page size="A4" style={styles.page}>
          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            6. OPERATIONS OF THE DISTRIBUTOR
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall operate and provide the Services from its
            independent offices equipped with the necessary infrastructure and
            workforce required to provide the Services. The Distributor shall
            provide a prior written intimation of any changes in the location of
            such office to ImpsGuru.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            ImpsGuru may, at its discretion, provide advice to the Distributor
            in relation to exteriors and interiors of the Distributor’s office,
            investment information technology systems, basic accounting and
            business procedure etc. The Distributor shall be bound by such
            advice of ImpsGuru.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            7. MARKET INTELLIGENCE
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall develop adequate and relevant market
            intelligence in relation to the Territory and shall inform ImpsGuru
            from time to time about the activities of other persons/companies
            engaged in a similar business.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            8. EMPLOYEES OF DISTRIBUTOR
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall engage the minimum number of personnel as
            specified by the ImpsGuru and such other additional personnel as may
            be required to effectively provide the Services. The Distributor
            shall ensure that all personnel employed in the provision of the
            Services shall be adequately trained and shall comply with the Term
            of this Distributor Agreement. The Distributor agrees and
            acknowledges that it shall do proper due diligence and background
            check of all such personnel.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall be liable and responsible for any data theft
            or misuse of any data related to clients of ImpsGuru from its
            office.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor agrees and acknowledges that ImpsGuru will not have
            any obligations, liability or responsibility whatsoever to supervise
            or manage the Distributor's employees, agents or independent
            contractors.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            9. INTELLECTUAL PROPERTY
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            ImpsGuru hereby grants the Distributor a limited, non-exclusive,
            non-transferable, non-assignable and royalty- free license to use
            the Software for the purpose of providing the Services as
            contemplated under this Distributor Agreement, which may be revoked
            by ImpsGuru at its sole discretion.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor is expressly prohibited from distributing,
            sub-licensing, assigning, transferring or otherwise the Software, or
            other technical documentation pertaining thereto, or any portions
            thereof in any form to any person.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor may utilize any third-party software other than the
            Software provided by ImpsGuru,only with prior permission from
            ImpsGuru.Further,the Distributor shall ensure that the third-party
            software is validly licenced and installed.
          </p>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The ImpsGuru shall retain all the rights over all the intellectual
            property, including the Software, its name and logo and all the
            rights in relation to the promotion and marketing materials. The
            Distributor hereby acknowledges that (a) the execution of this
            Distributor Agreement does not amount to any transfer to it of any
            intellectual property rights held by the ImpsGuru prior to the
            execution of this Distributor Agreement, nor does this Distributor
            Agreement in any way limit the ImpsGuru’s rights over its
            intellectual property, including the right to licence to others and,
            (b) any and all goodwill arising from the Distributor’s use of the
            intellectual property shall be exclusive ofImpsGuru without any
            compensation to anyone.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall not use the Software of the ImpsGuru in any
            manner whatsoever without the written permission of the ImpsGuru.
          </p>
        </Page>
        <Page size="A4" style={styles.page}>
          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            10. CONFIDENTIALITY
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Parties undertake to retain in confidence the terms of this
            Distributor Agreement and all other non-public information,
            technology, materials, and know-how of the other party disclosed to
            or acquired by the receiving party pursuant to or in connection with
            this Distributor Agreement that is either designated as proprietary
            or confidential or by the nature of the circumstances surrounding
            disclosure, ought in good faith to be treated as proprietary or
            confidential information, provided that each party may disclose the
            terms and conditions of this Distributor Agreement to its immediate
            legal and financial consultants in the ordinary course of its
            business.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            That Distributor agrees and acknowledges that the ImpsGuru has a
            responsibility to its customers to keep customer information
            strictly confidential. The Distributor agrees and acknowledges to
            keep all information related to customers strictly confidential that
            the Distributor is in the possession, or gains access to or become
            aware of during the course of rendering the services under this
            Distributor Agreement.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The provision of clause 10 shall survive the expiry of termination
            of this Distributor Agreement.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            11. COMPETITION AND SOLICIT
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor agrees and undertakes that during the Term of
            Distributor Agreement and for a period of one year thereafter, it
            shall not, directly, through its employees, affiliates or relatives
            or in a firm where the Distributor or any relative or nominee of the
            Distributor is a partner or in any company where the Distributor or
            any relative or nominee of the Distributor is a director or
            shareholder, 1.) be appointed as a Distributor for any other person
            or legal entity which is carrying on a business similar or in
            competition with any business carried by ImpsGuru at the relevant
            time, whether in India or abroad, or 2.) engage in any business that
            is similar to or in competition with any business carried on by the
            ImpsGuru at the relevant time.
          </p>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor agrees and undertakes that during the Term of
            Distributor Agreement and for a period of one year thereafter, it
            shall not, directly, through its employees, affiliates or relatives
            or in a firm where the Distributor or any relative or nominee of the
            Distributor is a partner or in any company where the Distributor or
            any relative or nominee of the Distributor is a director or
            shareholder, 1.) be appointed as a Distributor for any other person
            or legal entity which is carrying on a business similar or in
            competition with any business carried by ImpsGuru at the relevant
            time, whether in India or abroad, or 2.) engage in any business that
            is similar to or in competition with any business carried on by the
            ImpsGuru at the relevant time.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            During the Term of this Distributor Agreement, the Distributor shall
            not either directly or indirectly, solicit, cause in any part or
            knowingly encourage any existing or potential clients or customers
            of ImpsGuru to cease doing business or not to do business, in whole
            or in part of with ImpsGuru, or solicit, cause in any part or
            knowingly encourage any existing or potential clients or customers
            of ImpsGuru to do business with any person other then ImpsGuru, or
            associate with any prospective clients or customers while they
            continue to be clients or customers of ImpsGuru.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            12. EXCLUSIVITY
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall only market and promote Services of ImpsGuru,
            as authorized by the ImpsGuru.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            13. TERMINATION OF AGREEMENT
          </h2>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            ImpsGuru may terminate this Distributor Agreement of the Distributor
            with immediate effect, if
          </p>
          <ul style={{ paddingLeft: "40px", marginBottom: "30px" }}>
            <li style={{ marginBottom: "15px" }}>
              a. In the opinion of ImpsGuru, the Distributor is not a fit person
              to perform Services under the provision of this Distributor
              Agreement.
            </li>
            <li style={{ marginBottom: "15px" }}>
              b. The Distributor fails to deposit the proceeds of sales/receipts
              made by the Distributor or its retailers to ImpsGuru on a daily
              and perpetual basis.
            </li>
            <li style={{ marginBottom: "15px" }}>
              c. The Distributor becomes the subject of a voluntary petition in
              bankruptcy or any voluntary proceedings relating to insolvency,
              liquidation, or composition for the benefit of creditors.
            </li>
            <li style={{ marginBottom: "15px" }}>
              d. The Distributor fails to comply with directions issued by
              ImpsGuru under the provision of this Distributor Agreement.
            </li>
          </ul>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Notwithstanding anything to the contrary herein, ImpsGuru may
            terminate this Distributor Agreement without notice.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Distributor may terminate this Distributor Agreement with written
            notice of 60 (sixty) days to ImpsGuru.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            14. CONSEQUENCE OF TERMINATION
          </h2>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Upon termination of this Distributor Agreement for any reason as
            stated in clause 13 above, the Distributor shall
          </p>
          <ul style={{ paddingLeft: "40px", marginBottom: "30px" }}>
            <li style={{ marginBottom: "15px" }}>
              a. Immediately discontinue and cease to use the trademark, logo,
              other intellectual property, and Software provided by ImpsGuru,
              and shall immediately hand over all copies or documents of such
              intellectual property to ImpsGuru.
            </li>
            <li style={{ marginBottom: "15px" }}>
              b. Immediately return to ImpsGuru all confidential information,
              originals, and copies of any and all materials provided to the
              Distributor under this Distributor Agreement or in the course of
              provision of the services.
            </li>
            <li style={{ marginBottom: "15px" }}>
              c. Immediately provide remote access to ImpsGuru to disable any
              Software that ImpsGuru has installed with the Distributor.
            </li>
            <li style={{ marginBottom: "15px" }}>
              d. Immediately remove all signboards, banners, and glowboards of
              ImpsGuru from its offices, along with any materials indicating an
              association with ImpsGuru.
            </li>
            <li style={{ marginBottom: "15px" }}>
              e. Immediately cease to promote, market, or advertise ImpsGuru or
              its products/services.
            </li>
            <li style={{ marginBottom: "15px" }}>
              f. Immediately clear all dues within a period of 7 days from the
              date of termination.
            </li>
          </ul>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            15. INDEMINITY
          </h2>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall indemnify itself and hold the ImpsGuru and all
            its financial partner, affiliates, officers, directors, employees,
            successors and assignees harmless against all customer claims,
            actions, demands, litigations, suits, proceedings and against all
            losses,expenses, costs, damages,charges, penalties etc., due to any
            wilful negligence, fraud, breach of applicable laws or breach of any
            terms of this Distributor Agreement directly, attributable to the
            Distributor.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Notwithstanding anything contained in this Distributor Agreement,
            ImpsGuru shall not be liable to the Distributor for any incidental,
            indirect, consequential or damages of any kind or of loss of revenue
            or business opportunities.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Distributor shall ensure that the ImpsGuru platform or services are
            not used for money laun-dering and it is in compliance with
            Anti-Money Laundering laws, including but not to Prevention of Money
            Laundering Act, 2002 and the rules and regulations made under it.{" "}
          </p>
          <ul style={{ paddingLeft: "40px", marginBottom: "30px" }}>
            <li style={{ marginBottom: "15px" }}>
              Distributor undertakes that the Distributor will neither allow nor
              entertain requests for the transfer of money and/or any
              transaction through the use of the ImpsGuru Platform or services
              for the following:
            </li>
            <li style={{ marginBottom: "15px" }}>
              (a) Any form of drugs; and/or
            </li>
            <li style={{ marginBottom: "15px" }}>(b) Arms; and/or</li>
            <li style={{ marginBottom: "15px" }}>
              (c) Terrorist activities; and/or
            </li>
            <li style={{ marginBottom: "15px" }}>
              (d) Money laundering; and/or
            </li>
            <li style={{ marginBottom: "15px" }}>(e) Counterfeiting; and/or</li>
            <li style={{ marginBottom: "15px" }}>
              (f) Cross-border transactions; and/or
            </li>
            <li style={{ marginBottom: "15px" }}>
              (g) Where the purpose of transfer is for illegal activities;
              and/or
            </li>
            <li style={{ marginBottom: "15px" }}>
              (h) Any article/object/material prohibited by the Government of
              India.
            </li>
          </ul>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Distributor undertakes that Distributor shall not indulge /use the
            technology platform of ImpsGuru for the following:{" "}
          </p>
          <ul style={{ paddingLeft: "40px", marginBottom: "30px" }}>
            <li style={{ marginBottom: "15px" }}>
              Distributor shall not engage in any of the following practices:
            </li>
            <li style={{ marginBottom: "15px" }}>
              (a) Breaking a single transaction into multiple transactions with
              a view to earn more commission by having more transactions;
            </li>
            <li style={{ marginBottom: "15px" }}>
              (b) Indulging in financial transactions resulting in
              round-tripping of funds;
            </li>
            <li style={{ marginBottom: "15px" }}>
              (c) Selling Customer information (including contact information)
              to third parties;
            </li>
            <li style={{ marginBottom: "15px" }}>
              (d) Making any additional copies (digital or physical) of any
              Customer form, documents, photographs, or devices, whether used or
              unused.
            </li>
            <li style={{ marginBottom: "15px", fontStyle: "italic" }}>
              This clause shall survive the termination of this Distributor
              Agreement.
            </li>
          </ul>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            This clause shall survive the termination of this Distributor
            Agreement and shall remain valid for the claims or disputes which
            arose as a result of or pertaining to the duration hereof.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            16. RELATIONSHIP BETWEEN THE PARTIES{" "}
          </h2>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Services rendered by the Distributor under this Distributor
            Agreement shall be provided as an independent contractor to
            ImpsGuru, and nothing in this Distributor Agreement creates or shall
            be deemed to create the relationship of partners, joint venture,
            employees or principle-agent between the Parties.
          </p>
        </Page>
        <Page size="A4" style={styles.page}>
          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            17. RECORDS AND AUDIT{" "}
          </h2>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall maintain all statutory books as may be
            required from time to time to be maintained under the all applicable
            laws.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall permit the ImpsGuru, to enter into and inspect
            all books of accounts, record and materials in relation to the
            business operations related to this Distributor Agreement during
            normal business hours.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall ensure that KYC details/minimum details (as
            applicable) provided by the Customers be verified and carry out
            proper due diligence in the manner as instructed by the company in
            this regard. The Distributor shall be solely responsible for the
            verification process of KYC details/minimum details of the Customers
            and the Distributor/Aggregator hereby agrees that it shall be liable
            to indemnify the company in case of any losses or claims or
            penalties arising out of defective KYC verification process of the
            Customers for any transaction or any process regarding the platform
            or services of the company/ ImpsGuru.{" "}
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            During the Term and at any time within sixty days after the
            termination of this Distributor Agreement, ImpsGuru, through its
            employees, representatives or agents, may, at its expense, carry out
            an audit to determine whether the audit has properly completed its
            obligations under this Distributor Agreement.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            18. AMENDMENT
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            No changes, alterations, modifications or additions to this
            Distributor Agreement shall be valid unless made in writing and
            properly executed by Parties hereto, however the changes,
            alterations, modifications or additions in agreement is binding to
            both parties if such changes etc shall be available on the platform
            of the company/ ImpsGuru.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            19. ASSIGNMENT
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor shall not assign, sub-let, or subcontract any of its
            obligations under this Distributor Agreement to any third party
            unless it obtains prior written permission/consent from the
            ImpsGuru. In any event, any assignment or transfer shall not operate
            to relieve the assigning party of any of its obligations hereunder,
            nor will any such assignment impose any obligation on the assignee
            except in the case of express written assumption by the assignee.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            No such assignment under this clause shall relieve the Distributor
            of any obligations or liabilities incurred prior to the assignment
            unless mutually agreed to in writing.
          </p>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            This Agreement shall be construed in accordance with the applicable
            laws in India.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            20. COMMUNICATION
          </h2>
          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor hereby agrees that being a ImpsGuru Distributor,
            ImpsGuru may communicate include communications including but not
            limited to voice, email, SMS, digital video, and / or any mode of
            innovative communication method, as deemed fit and proper by the
            company/ ImpsGuru.
          </p>

          <h2
            style={{
              marginTop: "40px",
              marginBottom: "10px",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            21. LITIGATION
          </h2>

          <p style={{ marginBottom: "20px", marginLeft: "20px" }}>
            The Distributor hereby agrees that being a ImpsGuru Distributor,
            ImpsGuru may communicate include communications including but not
            limited to voice, email, SMS, digital video, and / or any mode of
            innovative communication method, as deemed fit and proper by the
            company/ ImpsGuru.{" "}
          </p>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "30px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                    textAlign: "left",
                    backgroundColor: "#f4f4f4",
                    fontWeight: "bold",
                  }}
                >
                  For and on behalf of:
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                    textAlign: "left",
                    backgroundColor: "#f4f4f4",
                    fontWeight: "bold",
                  }}
                >
                  For and on behalf of:
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                    verticalAlign: "top",
                  }}
                >
               Mobifast Solutions Pvt. Ltd.
                </td>

                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 12px",
                  }}
                >
                  Shop Name :{stateData.establishment}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                  }}
                >
                  Authorised Signatory -Preeti
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                  }}
                >
                  Authorised Signatory - {stateData.name}
                </td>
              </tr>
              <tr>
                {/* <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                  }}
                >
                  Name:Preeti
                </td>
                <td
                  style={{ 
                    border: "1px solid #000",
                    padding: "12px 20px",
                  }}
                >
                  Name: 
                </td> */}
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                  }}
                >
                  Designation: Director
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "12px 20px",
                  }}
                >
                  Designation: {stateData.role}
                </td>
              </tr>
            </tbody>
          </table>
          <br />
            <Box>
                  <Typography variant="body1">Signature :</Typography>
                  <Box
                    component="img"
                    src={ImpsGuruSignature}
                    alt="Director's Signature"
                    sx={{
                      width: 100, // Adjust width as needed
                      height: 50, // Adjust height as needed
                      // border: "1px solid #ccc", // Optional: Add a border
                      // borderRadius: "4px", // Optional: Add rounded corners
                    }}
                  />
                </Box>
          <h5
            style={{
              marginTop: "15px",
            }}
          >
            Date:{currentDateTime}
          </h5>
          <h5
            style={{
              marginTop: "5px",
            }}
          >
            Place: {stateData.state}
          </h5>

          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
                color="primary"
                sx={{ transform: "scale(1.2)" }}
              />
            }
            label={
              <Typography
                sx={{ fontSize: "1rem", color: "#333", fontWeight: "500" }}
              >
                I accept
              </Typography>
            }
            sx={{ marginLeft: "8px" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            {stateData.name}
            <Text>Authorised Signatory</Text>
          </div>
          {(showForPDF || message) && (
            <>
              <Typography
                style={{
                  fontSize: "1rem",
                  // color:
                  //   message ==
                  //   `This agreement  is electronically transmitted on ${myDateDDMMTT(
                  //     date
                  //   )} from IP address ${stateData.ip}. and verified by (${
                  //     stateData?.establishment
                  //   }/${stateData?.name}) having PAN NO ${stateData?.pan} `
                  //     ? "green"
                  //     : "red",
                  color: stateData.type === "ret_dd" ? "green" : "red",
                  // color: "green",
                  fontWeight: "bold",
                  marginTop: "8px",
                }}
              >
       
                {message}
              </Typography>
              {message ===
              `This agreement  is electronically transmitted on ${myDateDDMMTT(
                date
              )} from IP address ${ip}. and verified by (${
                stateData?.establishment
              }/${stateData?.name}) having PAN NO ${stateData?.pan} ` ? (
                <Typography
                  style={{
                    fontSize: "1rem",
                    color: "black",
                    fontWeight: "bold",
                    marginTop: "8px",
                  }}
                >
                  date is: {myDateDDMMTT(date) || "Your have not sign Agrement"}
                </Typography>
              ) : (
                ""
              )}
            </>
          )}

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                width: 400,
                padding: 2,
                margin: "auto",
                mt: "20vh",
                borderRadius: "8px",
                boxShadow: 24,
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <ModalHeader
                title="Distributor Agreement"
                handleClose={handleCloseModel}
              />

              <Box sx={{ flexGrow: 1, mt: 2 }}>
                {!isOtpSent && (
                  <div>
                    <TextField
                      label="Aadhaar Number"
                      name="aadhaar"
                      value={aadhaar}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={(e) => setAadhaar(e.target.value)}
                      placeholder="Enter your Aadhaar number"
                      inputProps={{ maxLength: 12 }}
                      sx={{ marginBottom: 2, mt: 2 }}
                    />
                    {aadhaarError && (
                      <FormHelperText error>{aadhaarError}</FormHelperText> // Show error message below Aadhaar field
                    )}
                  </div>
                )}

                <div>
                  {isOtpSent && (
                    <div>
                      <Typography sx={{ mb: 1, ml: 1 }}>Enter Otp</Typography>
                      <PinInput
                        value={otp}
                        onChange={setOtp}
                        length={6}
                        autoComplete="off"
                        focus
                        required
                        type="password"
                        sx={{ marginBottom: 2, mt: 2 }}
                      />
                      {otpError && (
                        <FormHelperText error>{otpError}</FormHelperText> // Show error message below OTP field
                      )}
                    </div>
                  )}
                </div>
              </Box>
              {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isOtpSent ? !otp : !aadhaar}
                  sx={{ mr: 1, mt: 1 }}
                >
                  Submit
                </Button>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  sx={{ mr: 1, mt: 1 }}
                >
                  Cancel
                </Button> */}

              <ModalFooter
                btn={"submit"}
                // onClick={!isOtpSent ? handleSubmit : verifyOTP}
                style={{
                  backgroundColor:
                    (isOtpSent && otp.length === 6) ||
                    (!isOtpSent && aadhaar.length === 12)
                      ? "#3f51b5"
                      : "#ddd",
                  cursor:
                    (isOtpSent && otp.length === 6) ||
                    (!isOtpSent && aadhaar.length === 12)
                      ? "pointer"
                      : "not-allowed",
                }}
              />
            </Box>
          </Modal>
        </Page>
      </div>
    </>
  );
};

export default AdminDistributorAgreement;