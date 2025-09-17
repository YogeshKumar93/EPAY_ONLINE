
import CommonTabs from "../components/common/CommonTabs";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Layouts from "./Layouts";
import Navs from "./Navs";

export const SelectLayout = () => {
  const tabItems = [
    { label: "Color Layout", icon: <SwapHorizIcon />, component: <Layouts /> },
    { label: "Side Layout", icon: <ReceiptIcon />, component: <Navs /> },

  ];

  return <CommonTabs tabs={tabItems} defaultTab={0} />;
};
