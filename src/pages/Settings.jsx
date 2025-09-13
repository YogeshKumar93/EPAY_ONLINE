// import React, { useState } from "react";
// import { Box, Tabs, Tab } from "@mui/material";
// import Templates from "./Templates";
// import CommissionRule from "./CommissionRule";
// import Layouts from "./Layouts";
// import Logs from "./Logs";
// import WebHooks from "./WebHooks";
// import Plans from "./Plans";
// import Notification from "../components/Notification/Notification";


// const TabPanel = ({ children, value, index }) => {
//   return (
//     <div role="tabpanel" hidden={value !== index}>
//       {value === index && <Box sx={{  }}>{children}</Box>}
//     </div>
//   );
// };

// export const Settings = () => {
//   const [tab, setTab] = useState(0);

//   const handleChange = (event, newValue) => {
//     setTab(newValue);
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       {/* Tab Header */}
//       <Tabs
//         value={tab}
//         onChange={handleChange}
//         variant="fullWidth"
//         textColor="primary"
//         indicatorColor="primary"
//         sx={{ borderBottom: 1, borderColor: "divider" }}
//       >
//         <Tab label="Template" />
//         <Tab label="Comm Rules" />
//         {/* <Tab label="Layout" /> */}
//         <Tab label="WebHooks" />
//         <Tab label="Logs" />
//         <Tab label="Plans" />
//         <Tab label="Notifications" />
       
//       </Tabs>

//       <TabPanel value={tab} index={0}>
//         <Templates />
//       </TabPanel>
//       <TabPanel value={tab} index={1}>
//         <CommissionRule />
//       </TabPanel>
//       <TabPanel value={tab} index={2}>
//         <WebHooks />
//       </TabPanel>
//       <TabPanel value={tab} index={3}>
//         <Logs />
//       </TabPanel>
//       <TabPanel value={tab} index={4}>
//         <Plans />
//       </TabPanel>
//       <TabPanel value={tab} index={5}>
//         <Notification />
//       </TabPanel>
    
//     </Box>
//   );
// };
import React from "react";
import CommonTabs from "../components/common/CommonTabs";
import Templates from "./Templates";
import CommissionRule from "./CommissionRule";
import Layouts from "./Layouts";
import Logs from "./Logs";
import WebHooks from "./WebHooks";
import Plans from "./Plans";
import Notification from "../components/Notification/Notification";


// Icons
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import TrainIcon from "@mui/icons-material/Train";

export const Settings = () => {
  const tabItems = [
    { label: "Template", icon: <SwapHorizIcon />, component: <Templates /> },
    { label: "Comm Rules", icon: <ReceiptIcon />, component: <CommissionRule /> },
    { label: "WebHooks", icon: <CreditCardIcon />, component: <WebHooks /> },
    { label: "Logs", icon: <PaymentIcon />, component: <Logs /> },
    { label: "Plans", icon: <PhoneIphoneIcon />, component: <Plans /> },
    { label: "Notifications", icon: <TrainIcon />, component: <Notification /> },
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};

