import { Calendar, Home, Inbox, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


// Input: Menu item configuration
// Output: Rendered menu item with optional submenu
interface MenuItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  subItems?: SubMenuItem[]
}

interface SubMenuItem {
  title: string
  url: string
}

// Menu items configuration
const items: MenuItem[] = [
  {
    title: "Home",
    url: "#home",
    icon: Home,
  },
  {
    title: "About",
    url: "#about",
    icon: Inbox,
  },
  {
    title: "Projects",
    url: "#projects",
    icon: Calendar,
    subItems: [
      { title: "EmailEssence", url: "#projects-emailessence" },
      { title: "ReverbXR", url: "#projects-reverbxr" },
      { title: "WhatNext", url: "#projects-whatnext" },
    ],
  },
  {
    title: "Contact",
    url: "#contact",
    icon: Settings,
  },
]

// Input: Menu item and its subitems
// Output: Rendered menu item with nested structure
const renderMenuItem = (item: MenuItem) => (
  <SidebarMenuItem key={item.title}>
    {item.subItems ? (
      <Collapsible className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            {item.title === "Projects" && <SidebarMenuBadge>{item.subItems.length}</SidebarMenuBadge>}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenu className="ml-4">
            {item.subItems.map((subItem) => (
              <SidebarMenuItem key={subItem.title}>
                <SidebarMenuButton asChild>
                  <a href={subItem.url}>
                    <span>{subItem.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </Collapsible>
    ) : (
      <SidebarMenuButton asChild>
        <a href={item.url}>
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    )}
  </SidebarMenuItem>
)

export function AppSidebar() {
  return (
    <Sidebar side="left" variant="inset">
      <SidebarInset>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(renderMenuItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarInset>
    </Sidebar>
  )
} 