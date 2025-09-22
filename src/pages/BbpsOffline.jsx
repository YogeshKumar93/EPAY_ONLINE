import React from "react";
import CommonTabs from "../components/common/CommonTabs";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt"; // DTH
import RouterIcon from "@mui/icons-material/Router"; // Broadband
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation"; // Gas
import OpacityIcon from "@mui/icons-material/Opacity"; // Water
import SecurityIcon from "@mui/icons-material/Security"; // Insurance
import PhoneIcon from "@mui/icons-material/Phone"; // Landline
import Prepaid from "../components/UI/rechange and bill/Prepaid";
import Postpaid from "../components/UI/rechange and bill/Postpaid";
import Dth from "../components/UI/rechange and bill/Dth";

export const BbpsOffline = () => {
  const tabItems = [
    { label: "Postpaid", icon: <PhoneIphoneIcon />, component: <Postpaid /> },
    {
      label: "Electricity",
      icon: <ElectricBoltIcon />,
      component: <Postpaid />,
    },
    { label: "Broadband", icon: <RouterIcon />, component: <Postpaid /> },
    { label: "Gas", icon: <LocalGasStationIcon />, component: <Postpaid /> },
    { label: "Water", icon: <OpacityIcon />, component: <Postpaid /> },
    { label: "Insurance", icon: <SecurityIcon />, component: <Postpaid /> },
    { label: "Landline", icon: <PhoneIcon />, component: <Postpaid /> },
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
