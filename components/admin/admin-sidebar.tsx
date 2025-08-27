import {
  ChartNoAxesGantt,
  ClipboardList,
  Users2,
  FileText,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";
import UIControls from "../ui-controls";
import { UserBox } from "./users-box";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "overview",
    url: "/dashboard",
    icon: ChartNoAxesGantt,
  },
  {
    title: "applications",
    url: "/dashboard/applications",
    icon: ClipboardList,
  },
  {
    title: "members",
    url: "/dashboard/members",
    icon: Users2,
  },
];

export function AdminSidebar() {
  const tSidebar = useTranslations("dashboardSidebar");
  const tShared = useTranslations("shared");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <Sidebar side={isRTL ? "right" : "left"}>
      <SidebarHeader>
        <SidebarGroupLabel>{tShared("protothon")}</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{tSidebar(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex justify-between items-center">
        <UIControls />
        <UserBox />
      </SidebarFooter>
    </Sidebar>
  );
}
