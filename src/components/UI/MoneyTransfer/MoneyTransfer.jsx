import React from "react";

// Icons
import DescriptionIcon from "@mui/icons-material/Description"; // Template
import RuleIcon from "@mui/icons-material/Rule"; // Comm Rules
import Dmt2 from "../../../pages/Dmt2";
import Dmt from "../../../pages/Dmt";
import CommonTabs from "../../common/CommonTabs";

export const MoneyTransfer = () => {
  const tabItems = [
    { label: "Dmt1", icon: <DescriptionIcon />, component: <Dmt /> },
    { label: "Dmt2", icon: <RuleIcon />, component: <Dmt2 /> },
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
