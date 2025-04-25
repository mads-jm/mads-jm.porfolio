import { Calendar, Home, Inbox, Music, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

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
import {
  Sheet,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet"


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
    subItems: [
      { title: "Contact", url: "#home" },
    ],
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
    title: "Music",
    url: "#projects-whatnext",
    icon: Music,
  },
]

// Input: Menu item and its subitems
// Output: Rendered menu item with nested structure
const renderMenuItem = (item: MenuItem, isMobile: boolean) => (
  <SidebarMenuItem key={item.title}>
    {item.subItems ? (
      <Collapsible className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            {!isMobile && item.title === "Projects" && <SidebarMenuBadge>{item.subItems.length}</SidebarMenuBadge>}
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-6 left-4 z-[9999] p-2 rounded-md bg-background border border-border shadow-md"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      )}

      {/* Mobile Menu Sheet */}
      {isMobile && (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <div className="h-full flex flex-col justify-center">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-2">
                      {items.map(item => renderMenuItem(item, true))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </div>
            <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar side="left">
          <SidebarInset>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map(item => renderMenuItem(item, false))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </SidebarInset>
        </Sidebar>
      )}
    </>
  )
} 