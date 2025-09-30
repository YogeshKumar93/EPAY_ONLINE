import React from "react";

// Icons
// import DescriptionIcon from "@mui/icons-material/Description"; // Template
// import RuleIcon from "@mui/icons-material/Rule"; // Comm Rules
import Dmt2 from "../../../pages/Dmt2";
import Dmt from "../../../pages/Dmt";
import CommonTabs from "../../common/CommonTabs";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export const MoneyTransfer = () => {
  const tabItems = [
    {
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "80px", // gives proper width
            justifyContent: "flex-start", // align consistently
          }}
        >
          <CurrencyRupeeIcon fontSize="small" />
          <span>Airtel Dmt</span>
        </div>
      ),
      component: <Dmt />,
    },
    // {
    //   label: (
    //     <div
    //       style={{
    //         display: "flex",
    //         alignItems: "center",
    //         gap: "12px",
    //         minWidth: "80px", // same width for consistency
    //         justifyContent: "flex-start",
    //       }}
    //     >
    //       <CurrencyRupeeIcon fontSize="small" />
    //       <span>Fino Dmt</span>
    //     </div>
    //   ),
    //   component: <Dmt2 />,
    // },
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
