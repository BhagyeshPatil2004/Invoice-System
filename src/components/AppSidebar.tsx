import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Receipt, 
  DollarSign, 
  Settings,
  TrendingUp,
  Calendar,
  User
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Quotations", url: "/quotations", icon: Receipt },
];

const financialMenuItems = [
  { title: "Receivables", url: "/receivables", icon: TrendingUp },
  { title: "Payables", url: "/payables", icon: DollarSign },
  { title: "Reports", url: "/reports", icon: Calendar },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isCollapsed = state === "collapsed";
  
  // Active Menu Item styling - prominent and clear
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-[hsl(var(--sidebar-accent))] text-white font-semibold border-l-4 border-primary shadow-sm" 
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground transition-colors";

  return (
    <Sidebar collapsible="icon">
      <NavLink to="/settings" className="block p-4 border-b border-sidebar-border hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-sidebar-foreground">John Doe</h2>
              <p className="text-xs text-sidebar-foreground/70">View Profile</p>
            </div>
          )}
        </div>
      </NavLink>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
            Financial
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financialMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" end className={getNavClass}>
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}