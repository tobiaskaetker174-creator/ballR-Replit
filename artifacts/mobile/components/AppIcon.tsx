import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, {
  Circle,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
} from "react-native-svg";

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

type RenderIconProps = Omit<IconProps, "name">;

const DEFAULT_COLOR = "#FFFFFF";
const STROKE_WIDTH = 1.9;

function IconFrame({
  size = 24,
  color = DEFAULT_COLOR,
  style,
  children,
}: React.PropsWithChildren<RenderIconProps>) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <g
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {children}
      </g>
    </Svg>
  );
}

function SearchIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Circle cx="11" cy="11" r="5.5" />
      <Line x1="15.3" y1="15.3" x2="20" y2="20" />
    </IconFrame>
  );
}

function CalendarIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Rect x="4" y="5" width="16" height="15" rx="3" />
      <Line x1="4" y1="9" x2="20" y2="9" />
      <Line x1="8" y1="3" x2="8" y2="7" />
      <Line x1="16" y1="3" x2="16" y2="7" />
      <Line x1="9" y1="13" x2="9" y2="13" />
      <Line x1="12" y1="13" x2="12" y2="13" />
      <Line x1="15" y1="13" x2="15" y2="13" />
      <Line x1="9" y1="16" x2="9" y2="16" />
      <Line x1="12" y1="16" x2="12" y2="16" />
      <Line x1="15" y1="16" x2="15" y2="16" />
    </IconFrame>
  );
}

function TrophyIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M7 5h10v2.2a5 5 0 0 1-3.5 4.8V13h2.3a2 2 0 0 0 2-1.6l.7-3.4H19a2 2 0 0 0 2-2V5h-3" />
      <Path d="M5 5H2v1a2 2 0 0 0 2 2h.5l.7 3.4A2 2 0 0 0 7.2 13H9.5v-1H9a5 5 0 0 1-4-4.8V5Z" />
      <Path d="M9 13h6v3H9z" />
      <Path d="M8 19h8" />
    </IconFrame>
  );
}

function UserIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Circle cx="12" cy="8.5" r="3" />
      <Path d="M5 20c1.3-3.4 4.1-5 7-5s5.7 1.6 7 5" />
    </IconFrame>
  );
}

function FootballIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Circle cx="12" cy="12" r="8.5" />
      <Path d="M12 7.4 9.6 9l.9 2.8h2.9l.9-2.8L12 7.4Z" />
      <Path d="m8.2 10.4-1.9 1.6.8 2.7h2.7l.8-2.7-2.4-1.6Z" />
      <Path d="m15.8 10.4-2.4 1.6.8 2.7h2.7l.8-2.7-1.9-1.6Z" />
      <Path d="m10.5 16.6 1.5 2.1 1.5-2.1" />
    </IconFrame>
  );
}

function MailIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Rect x="4" y="6" width="16" height="12" rx="2.2" />
      <Polyline points="5.5,8.5 12,13 18.5,8.5" />
    </IconFrame>
  );
}

function LockIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Rect x="5" y="11" width="14" height="9" rx="2" />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </IconFrame>
  );
}

function BellIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M8 16h8l-1-1.8V11a3 3 0 0 0-6 0v3.2L8 16Z" />
      <Path d="M10.5 18a1.5 1.5 0 0 0 3 0" />
    </IconFrame>
  );
}

function ChevronDownIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Polyline points="6 9 12 15 18 9" />
    </IconFrame>
  );
}

function ChevronLeftIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Polyline points="14 6 8 12 14 18" />
    </IconFrame>
  );
}

function ChevronRightIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Polyline points="10 6 16 12 10 18" />
    </IconFrame>
  );
}

function ArrowLeftIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Line x1="19" y1="12" x2="5" y2="12" />
      <Polyline points="11 6 5 12 11 18" />
    </IconFrame>
  );
}

function ArrowRightIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Polyline points="13 6 19 12 13 18" />
    </IconFrame>
  );
}

function MapPinIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M12 21s5-4.2 5-9a5 5 0 0 0-10 0c0 4.8 5 9 5 9Z" />
      <Circle cx="12" cy="12" r="1.8" />
    </IconFrame>
  );
}

function ClockIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Circle cx="12" cy="12" r="8.5" />
      <Line x1="12" y1="8" x2="12" y2="12.5" />
      <Line x1="12" y1="12" x2="15.5" y2="13.8" />
    </IconFrame>
  );
}

function UsersIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Circle cx="9" cy="9" r="2.5" />
      <Circle cx="16.5" cy="10.5" r="2" />
      <Path d="M4.8 19c.9-2.7 3-4 5.7-4s4.8 1.3 5.7 4" />
      <Path d="M13.8 19c.6-1.7 1.8-2.6 3.4-3" />
    </IconFrame>
  );
}

function ChatBubbleIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M5 6h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H11l-4.5 4v-4H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
    </IconFrame>
  );
}

function StarIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Polygon points="12,4 14.8,9.2 20.5,9.6 16.2,13.2 17.6,19 12,15.9 6.4,19 7.8,13.2 3.5,9.6 9.2,9.2" />
    </IconFrame>
  );
}

function PlusIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5" y1="12" x2="19" y2="12" />
    </IconFrame>
  );
}

function SettingsIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Circle cx="12" cy="12" r="2.7" />
      <Circle cx="12" cy="12" r="7" />
      <Line x1="12" y1="2.8" x2="12" y2="5" />
      <Line x1="12" y1="19" x2="12" y2="21.2" />
      <Line x1="2.8" y1="12" x2="5" y2="12" />
      <Line x1="19" y1="12" x2="21.2" y2="12" />
      <Line x1="5.1" y1="5.1" x2="6.7" y2="6.7" />
      <Line x1="17.3" y1="17.3" x2="18.9" y2="18.9" />
      <Line x1="17.3" y1="6.7" x2="18.9" y2="5.1" />
      <Line x1="5.1" y1="18.9" x2="6.7" y2="17.3" />
    </IconFrame>
  );
}

function ShieldIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M12 3 19 6v5c0 4.8-3 8.7-7 10-4-1.3-7-5.2-7-10V6l7-3Z" />
      <Path d="M9.2 12.2 11 14l3.8-4" />
    </IconFrame>
  );
}

function InfoIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Circle cx="12" cy="12" r="8.5" />
      <Line x1="12" y1="11" x2="12" y2="16" />
      <Circle cx="12" cy="8" r="0.8" fill={props.color ?? DEFAULT_COLOR} stroke="none" />
    </IconFrame>
  );
}

function CameraIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Rect x="4" y="7" width="16" height="11" rx="2.2" />
      <Path d="M9 7l1.2-2h3.6L15 7" />
      <Circle cx="12" cy="12.5" r="3.2" />
    </IconFrame>
  );
}

function EditIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M4 20h4l10-10a2 2 0 0 0 0-2.8l-.2-.2a2 2 0 0 0-2.8 0L5.2 18.8 4 20Z" />
      <Line x1="13" y1="7" x2="17" y2="11" />
    </IconFrame>
  );
}

function LogoutIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M10 17v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v2" />
      <Line x1="3" y1="12" x2="14" y2="12" />
      <Polyline points="9 8 5 12 9 16" />
    </IconFrame>
  );
}

function BarChartIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Line x1="4" y1="20" x2="20" y2="20" />
      <Rect x="6" y="12" width="3" height="8" rx="1" />
      <Rect x="11" y="8" width="3" height="12" rx="1" />
      <Rect x="16" y="5" width="3" height="15" rx="1" />
    </IconFrame>
  );
}

function HeartIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M12 20s-6-4-8.2-7.2A5.2 5.2 0 0 1 12 6a5.2 5.2 0 0 1 8.2 6.8C18 16 12 20 12 20Z" />
    </IconFrame>
  );
}

function ShareIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Circle cx="18" cy="5.5" r="2" />
      <Circle cx="6" cy="12" r="2" />
      <Circle cx="18" cy="18.5" r="2" />
      <Line x1="7.7" y1="11.2" x2="16.4" y2="7" />
      <Line x1="7.7" y1="12.8" x2="16.4" y2="17" />
    </IconFrame>
  );
}

function MapIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Polyline points="4.5,7 9,5 15,7 19.5,5 19.5,17 15,19 9,17 4.5,19 4.5,7" />
      <Line x1="9" y1="5" x2="9" y2="17" />
      <Line x1="15" y1="7" x2="15" y2="19" />
    </IconFrame>
  );
}

function CarIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M5 14h14l-1.2-4a2 2 0 0 0-1.9-1.4H8.1A2 2 0 0 0 6.2 10L5 14Z" />
      <Circle cx="8" cy="16.5" r="1.5" />
      <Circle cx="16" cy="16.5" r="1.5" />
      <Line x1="6" y1="14" x2="18" y2="14" />
    </IconFrame>
  );
}

function FlagIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Line x1="6" y1="4" x2="6" y2="20" />
      <Path d="M6 5h8l-1.5 3L14 11H6V5Z" />
    </IconFrame>
  );
}

function CloseIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Line x1="6" y1="6" x2="18" y2="18" />
      <Line x1="18" y1="6" x2="6" y2="18" />
    </IconFrame>
  );
}

function CheckIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Polyline points="5.5,12.5 10,17 18.5,7.5" />
    </IconFrame>
  );
}

function SparklesIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M12 4l1.5 4.2L18 9.5l-4.5 1.3L12 15l-1.5-4.2L6 9.5l4.5-1.3L12 4Z" />
      <Path d="M18.5 13.5l.8 2.2 2.2.7-2.2.7-.8 2.2-.8-2.2-2.2-.7 2.2-.7.8-2.2Z" />
    </IconFrame>
  );
}

function FlameIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M13.5 4s1 3-.5 5c-.8 1.2-2.2 1.8-2.2 3.5 0 1.8 1.4 3.2 3.2 3.2 2.5 0 4-1.9 4-4.5 0-2.7-1.9-5.3-4.5-7.2Z" />
      <Path d="M10 9.5c-1.8 1.5-3 3.2-3 5.4a5 5 0 0 0 10 0" />
    </IconFrame>
  );
}

function WalletIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Rect x="4" y="7" width="16" height="10" rx="2" />
      <Path d="M15 12h5v4h-5a2 2 0 0 1 0-4Z" />
      <Circle cx="16.8" cy="14" r="0.7" fill={props.color ?? DEFAULT_COLOR} stroke="none" />
    </IconFrame>
  );
}

function FilterIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M4 6h16l-6 6v5l-4 1v-6L4 6Z" />
    </IconFrame>
  );
}

function NavigationIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Path d="M12 4l6 16-6-3-6 3 6-16Z" />
      <Line x1="12" y1="9" x2="12" y2="13.5" />
    </IconFrame>
  );
}

function PlusCircleIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Circle cx="12" cy="12" r="8.5" />
      <Line x1="12" y1="8" x2="12" y2="16" />
      <Line x1="8" y1="12" x2="16" y2="12" />
    </IconFrame>
  );
}

function DefaultIcon(props: RenderIconProps) {
  return (
    <IconFrame {...props}>
      <Circle cx="12" cy="12" r="8.5" />
      <Line x1="8.5" y1="12" x2="15.5" y2="12" />
      <Line x1="12" y1="8.5" x2="12" y2="15.5" />
    </IconFrame>
  );
}

function resolveIcon(name: string, props: Omit<IconProps, "name">) {
  const key = name.toLowerCase();

  if (key.includes("search") || key.includes("magnify")) return <SearchIcon {...props} />;
  if (key.includes("calendar")) return <CalendarIcon {...props} />;
  if (key.includes("trophy") || key.includes("award")) return <TrophyIcon {...props} />;
  if (key.includes("person") || key.includes("user")) return <UserIcon {...props} />;
  if (key.includes("football") || key.includes("soccer") || key.includes("ball")) return <FootballIcon {...props} />;
  if (key.includes("mail") || key.includes("envelope")) return <MailIcon {...props} />;
  if (key.includes("lock")) return <LockIcon {...props} />;
  if (key.includes("bell") || key.includes("notification")) return <BellIcon {...props} />;
  if (key.includes("chevron") && key.includes("down")) return <ChevronDownIcon {...props} />;
  if (key.includes("chevron") && key.includes("left")) return <ChevronLeftIcon {...props} />;
  if (key.includes("chevron") && key.includes("right")) return <ChevronRightIcon {...props} />;
  if (key.includes("arrow") && key.includes("back")) return <ArrowLeftIcon {...props} />;
  if (key.includes("arrow") && key.includes("right")) return <ArrowRightIcon {...props} />;
  if (key.includes("location") || key.includes("pin") || key.includes("place")) return <MapPinIcon {...props} />;
  if (key.includes("time") || key.includes("clock") || key.includes("hourglass")) return <ClockIcon {...props} />;
  if (key.includes("people") || key.includes("group") || key.includes("team") || key.includes("users")) return <UsersIcon {...props} />;
  if (key.includes("chat") || key.includes("message") || key.includes("bubble")) return <ChatBubbleIcon {...props} />;
  if (key.includes("star")) return <StarIcon {...props} />;
  if (key.includes("add") || key.includes("plus")) return <PlusIcon {...props} />;
  if (key.includes("settings") || key.includes("gear")) return <SettingsIcon {...props} />;
  if (key.includes("shield")) return <ShieldIcon {...props} />;
  if (key.includes("info") || key.includes("alert")) return <InfoIcon {...props} />;
  if (key.includes("camera")) return <CameraIcon {...props} />;
  if (key.includes("edit") || key.includes("pen")) return <EditIcon {...props} />;
  if (key.includes("logout") || key.includes("log-out") || key.includes("sign-out")) return <LogoutIcon {...props} />;
  if (key.includes("bar") || key.includes("chart") || key.includes("analytics")) return <BarChartIcon {...props} />;
  if (key.includes("heart")) return <HeartIcon {...props} />;
  if (key.includes("share")) return <ShareIcon {...props} />;
  if (key.includes("map")) return <MapIcon {...props} />;
  if (key.includes("car")) return <CarIcon {...props} />;
  if (key.includes("flag")) return <FlagIcon {...props} />;
  if (key.includes("close") || key === "x") return <CloseIcon {...props} />;
  if (key.includes("check")) return <CheckIcon {...props} />;
  if (key.includes("spark") || key.includes("light")) return <SparklesIcon {...props} />;
  if (key.includes("flash") || key.includes("bolt") || key.includes("lightning")) return <FlameIcon {...props} />;
  if (key.includes("wallet") || key.includes("cash")) return <WalletIcon {...props} />;
  if (key.includes("filter")) return <FilterIcon {...props} />;
  if (key.includes("navigation") || key.includes("compass")) return <NavigationIcon {...props} />;
  if (key.includes("plus-circle") || key.includes("add-circle")) return <PlusCircleIcon {...props} />;

  return <DefaultIcon {...props} />;
}

function IconShim({ name, ...props }: IconProps) {
  return resolveIcon(name, props);
}

export const Ionicons = IconShim;
export const Feather = IconShim;
export const MaterialCommunityIcons = IconShim;
