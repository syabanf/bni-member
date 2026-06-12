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

export interface NavSection {
  title?: string;
  items: NavItem[];
  /** Only visible to National Admin. */
  adminOnly?: boolean;
}

export const navigation: NavSection[] = [
  {
    items: [{ label: "Dashboard", href: "/", iconName: "LayoutDashboard" }],
  },
  {
    title: "Pembayaran",
    items: [
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
    ],
  },
  {
    title: "Keanggotaan",
    items: [
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
      { label: "Subscription Data", href: "/subscriptions", iconName: "FileText" },
      { label: "Referral", href: "/membership/referrals", iconName: "Share2" },
      { label: "Visitor", href: "/membership/visitors", iconName: "DoorOpen" },
      { label: "Performa", href: "/membership/performance", iconName: "Trophy" },
    ],
  },
  {
    title: "Master Data",
    adminOnly: true,
    items: [
      { label: "Kota", href: "/master-data/cities", iconName: "MapPin" },
      { label: "Chapter", href: "/master-data/chapters", iconName: "Building2" },
    ],
  },
  {
    title: "Integrasi",
    adminOnly: true,
    items: [
      {
        label: "Data Integration",
        iconName: "Link2",
        children: [
          { label: "Export / Import", href: "/integration/import", iconName: "FileText" },
          { label: "Paper.id", href: "/integration/paper-id", iconName: "Database" },
          { label: "Lark (Feishu)", href: "/integration/lark", iconName: "Link2" },
        ],
      },
    ],
  },
];

/** Resolve the page title for a pathname from the navigation tree. */
export function getPageTitle(pathname: string): string {
  for (const section of navigation) {
    for (const item of section.items) {
      if (item.href === pathname) return item.label;
      const leaf = item.children?.find((c) => c.href === pathname);
      if (leaf) return leaf.label;
    }
  }
  return "Dashboard";
}
