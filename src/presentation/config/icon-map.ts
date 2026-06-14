import type { ComponentType } from "react";
import {
  LayoutDashboard,
  CreditCard,
  Clock,
  RefreshCw,
  AlertTriangle,
  Users,
  UserCheck,
  UserPlus,
  Timer,
  UserMinus,
  FileText,
  Settings,
  Database,
  Link2,
  Send,
  MapPin,
  Building2,
  Share2,
  DoorOpen,
  Trophy,
  MessageCircle,
  BarChart3,
} from "lucide-react";

/** Icons are referenced by string name so config files stay serialisable. */
export type IconComponent = ComponentType<{ className?: string }>;

const iconMap = {
  LayoutDashboard,
  CreditCard,
  Clock,
  RefreshCw,
  AlertTriangle,
  Users,
  UserCheck,
  UserPlus,
  Timer,
  UserMinus,
  FileText,
  Settings,
  Database,
  Link2,
  Send,
  MapPin,
  Building2,
  Share2,
  DoorOpen,
  Trophy,
  MessageCircle,
  BarChart3,
} satisfies Record<string, IconComponent>;

export type IconName = keyof typeof iconMap;

export function getIcon(name: IconName): IconComponent {
  return iconMap[name];
}
