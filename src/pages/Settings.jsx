import React from "react";
import CommonTabs from "../components/common/CommonTabs";
import Templates from "./Templates";
import CommissionRule from "./CommissionRule";
import Layouts from "./Layouts";
import Logs from "./Logs";

import Plans from "./Plans";
import Notification from "../components/Notification/Notification";
import EventNoteIcon from '@mui/icons-material/EventNote';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import LinkIcon from "@mui/icons-material/Link";

// Icons
import DescriptionIcon from "@mui/icons-material/Description"; // Template
import RuleIcon from "@mui/icons-material/Rule"; // Comm Rules
import HttpIcon from "@mui/icons-material/Http"; // WebHooks
import ListAltIcon from "@mui/icons-material/ListAlt"; // Logs
import AssignmentIcon from "@mui/icons-material/Assignment"; // Plans
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"; // Notifications
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import News from "./News";
import Purposes from "./Purposes";
import WebHooks from "./WebHooks";


export const Settings = () => {
  const tabItems = [
    { label: "Template", icon: <DescriptionIcon />, component: <Templates /> },
    { label: "Comm Rules", icon: <RuleIcon />, component: <CommissionRule /> },
    // { label: "WebHooks", icon: <HttpIcon />, component: <WebHooks /> },
    { label: "Logs", icon: <ListAltIcon />, component: <Logs /> },
    { label: "Plans", icon: <EventNoteIcon/>, component: <Plans /> },
    { label: "News", icon: <EmojiObjectsIcon />, component: <News /> },
    { label: "Purposes", icon: <StarBorderIcon />, component: <Purposes /> },
    {
      label: "Notifications",
      icon: <NotificationsActiveIcon />,
      component: <Notification />,
    },
    { label: "Color Layout", icon: <SwapHorizIcon />, component: <Layouts /> },
       {
    label: "WebHooks",
    icon: <LinkIcon />,       // changed icon
    content: <WebHooks />,
  },
  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
