import {
  FaUsers,
  FaProductHunt,
  FaChartLine,
  FaUserShield,
  FaStar,
  FaTruck,
  FaUserFriends,
  FaBox,
  FaGlobe,
  FaImage,
  FaBoxOpen,
  FaNewspaper,
  FaImages,
  FaFilePdf,
} from "react-icons/fa";
import { FaOpencart, FaLeaf, FaSeedling } from "react-icons/fa6"; // Added FaSeedling/FaLeaf
import { BiCategory } from "react-icons/bi";
import { IoPricetagOutline, IoSettings } from "react-icons/io5";
import { CgWebsite } from "react-icons/cg";
import {
  GiPlantRoots,
  GiPlantWatering,
  GiWheat,
  GiFarmer,
} from "react-icons/gi"; // Added GiFarmer
import {
  MdSupportAgent,
  MdPayment,
  MdOutlineAppShortcut,
  MdHistory,
  MdStore,
  MdPending,
  MdLocalShipping,
  MdDone,
  MdCancel,
  MdCategory,
} from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { WiDaySunny } from "react-icons/wi";

export const menuConfig = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: AiOutlineProduct,
  },
  {
    label: "Users",
    icon: FaUsers,
    subItems: [
      { label: "Customers", path: "/customers", icon: FaUserFriends },
      { label: "Sellers", path: "/sellers", icon: MdStore },
      { label: "Farmers", path: "/farmers", icon: GiFarmer }, // Added Farmers here
      { label: "Delivery Partners", path: "/delivery", icon: FaTruck },
    ],
  },

  {
    label: "Products",
    icon: FaProductHunt,
    subItems: [
      { label: "All Products", path: "/products", icon: FaBoxOpen },
      { label: "Deleted Products", path: "/deletedproducts", icon: MdCategory },
    ],
  },

  {
    label: "Agri Products",
    path: "/agri-products",
    icon: GiWheat,
  },

  // Added Farmer Products here
  {
    label: "Farmer Products",
    path: "/farmer-products",
    icon: FaLeaf,
  },

  {
    label: "Orders",
    icon: FaOpencart,
    subItems: [
      {
        label: "In Progress",
        path: "/orders?status=in-progress",
        icon: MdPending,
      },
      {
        label: "Shipped",
        path: "/orders?status=shipped",
        icon: MdLocalShipping,
      },
      { label: "Completed", path: "/orders?status=completed", icon: MdDone },
      { label: "Cancelled", path: "/orders?status=cancelled", icon: MdCancel },
    ],
  },
  { label: "Reviews", path: "/review", icon: FaStar },
  { label: "Categories", path: "/categories", icon: BiCategory },
  { label: "Market Rates", path: "/market-rates", icon: FaChartLine },
  { label: "Weather Settings", path: "/weather-settings", icon: WiDaySunny },
  {
    label: "Websites",
    icon: CgWebsite,
    subItems: [
      { label: "Banners", path: "/websites-banners", icon: FaImage },
      { label: "Blogs / News", path: "/websites-blogs", icon: FaNewspaper },
      { label: "Media Gallery", path: "/websites-media", icon: FaImages },
      { label: "Pages", path: "/websites-pages", icon: FaGlobe },
    ],
  },
  { label: "Offers", path: "/offers", icon: IoPricetagOutline },
  {
    label: "Catalogues",
    path: "/catalogues",
    icon: FaFilePdf,
  },
  {
    label: "Admins",
    path: "/admins",
    icon: FaUserShield,
  },
  { label: "Tickets / Support", path: "/support", icon: MdSupportAgent },
  { label: "Refer & Earn", path: "/refer-earn", icon: MdOutlineAppShortcut },
  { label: "Payments", path: "/payment", icon: MdPayment },
  { label: "Activity Log", path: "/activity-log", icon: MdHistory },
  { label: "Settings", path: "/settings", icon: IoSettings },
];
