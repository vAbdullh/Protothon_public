import { ClipboardList, Users2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

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
} from "@/components/shadcn/sidebar"
import UIControls from "../ui-controls"
import { UserBox } from "./users-box"

// Menu items.
const items = [
  {
    title: 'applications',
    url: "/dashboard",
    icon: ClipboardList,
  },
  {
    title: 'members',
    url: "/dashboard/members",
    icon: Users2,
  },
]

export function AdminSidebar() {
  const tSidebar = useTranslations("dashboardSidebar")
  const tShared = useTranslations("shared")
  const locale = useLocale()
  const isRTL = locale === 'ar'
  
  return (
    <Sidebar side={isRTL ? 'right' : 'left'}>
      <SidebarHeader>
        <SidebarGroupLabel>{tShared('protothon')}</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{tSidebar(item.title)}</span>
                    </a>
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
  )
}
