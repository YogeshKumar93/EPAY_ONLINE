import React from "react";
import CommonTabs from "../components/common/CommonTabs";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt"; // DTH
import Prepaid from "../components/UI/rechange and bill/Prepaid";
import Postpaid from "../components/UI/rechange and bill/Postpaid";
import Dth from "../components/UI/rechange and bill/Dth";

export const Recharge = () => {
  const tabItems = [
    { label: "Mobile", icon: <PhoneIphoneIcon />, component: <Prepaid /> },
    { label: "DTH", icon: <SatelliteAltIcon />, component: <Dth /> },
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
