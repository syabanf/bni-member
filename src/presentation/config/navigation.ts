import type { IconName } from "./icon-map";

export interface NavLeaf {
  label: string;
  href: string;
  iconName: IconName;
  badge?: number;
}

export interface NavItem {
  label: string;
  iconName: IconName;
  href?: string;
  children?: NavLeaf[];
  badge?: number;
}

export const navigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    iconName: "LayoutDashboard",
  },
  {
    label: "Payment",
    iconName: "CreditCard",
    children: [
      { label: "Outstanding Payment", href: "/payments/outstanding", iconName: "CreditCard" },
      { label: "Awaiting Payment", href: "/payments/awaiting", iconName: "Clock" },
      { label: "Renewal", href: "/payments/renewal", iconName: "RefreshCw" },
      { label: "Overdue Payment", href: "/payments/overdue", iconName: "AlertTriangle", badge: 7 },
    ],
  },
  {
    label: "Member Data",
    iconName: "Users",
    children: [
      { label: "All Member", href: "/members", iconName: "UserCheck" },
      { label: "New Member", href: "/members/new", iconName: "UserPlus" },
      { label: "Need Renewal", href: "/members/renewal", iconName: "Timer" },
      { label: "Ex-Member", href: "/members/ex", iconName: "UserMinus" },
    ],
  },
  {
    label: "Subscription Data",
    href: "/subscriptions",
    iconName: "FileText",
  },
  {
    label: "Data Integration",
    iconName: "Link2",
    children: [
      { label: "Export / Import", href: "/integration/import", iconName: "FileText" },
      { label: "Paper.id", href: "/integration/paper-id", iconName: "Database" },
      { label: "Lark (Feishu)", href: "/integration/lark", iconName: "Link2" },
    ],
  },
  {
    label: "Setting",
    iconName: "Settings",
    children: [
      { label: "Master Data", href: "/settings/master-data", iconName: "Database" },
    ],
  },
];

/** Resolve the page title for a pathname from the navigation tree. */
export function getPageTitle(pathname: string): string {
  for (const item of navigation) {
    if (item.href === pathname) return item.label;
    const leaf = item.children?.find((c) => c.href === pathname);
    if (leaf) return leaf.label;
  }
  return "Dashboard";
}
