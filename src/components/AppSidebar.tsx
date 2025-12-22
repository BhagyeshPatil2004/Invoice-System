import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Users, FileText, Receipt, DollarSign, Settings, Calendar, Bell, Package, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { NotificationDialog } from "@/components/NotificationDialog";
import { useData } from "@/contexts/DataContext";
import { supabase } from "@/supabaseClient";
import { isWithinInterval, addDays, parseISO } from "date-fns";
const mainMenuItems = [
  {
    title: "Clients",
    url: "/",
    icon: Users,
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FileText,
  },
  {
    title: "Quotations",
    url: "/quotations",
    icon: Receipt,
  },
];

const financialMenuItems = [
  {
    title: "Payables",
    url: "/payables",
    icon: DollarSign,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: Calendar,
  },
];
export function AppSidebar() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { invoices, payables } = useData();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Calculate notification count
  const today = new Date();
  const nextWeek = addDays(today, 7);

  const parseDate = (dateStr: string) => {
    try {
      return parseISO(dateStr);
    } catch {
      return new Date(dateStr);
    }
  };

  const notificationCount =
    invoices.filter(invoice => {
      if (invoice.status === "paid") return false;
      try {
        const dueDate = parseDate(invoice.dueDate);
        // Check if due within next week OR overdue
        return isWithinInterval(dueDate, { start: today, end: nextWeek }) || dueDate < today;
      } catch {
        return false;
      }
    }).length +
    payables.filter(payable => {
      if (payable.status === "paid" || payable.amountDue === 0) return false;
      try {
        const dueDate = parseDate(payable.dueDate);
        // Check if due within next week OR overdue
        return isWithinInterval(dueDate, { start: today, end: nextWeek }) || dueDate < today;
      } catch {
        return false;
      }
    }).length;

  const getNavClass = (isActive: boolean) => {
    const base =
      "group relative flex items-center gap-4 rounded-full px-4 py-3 text-sm transition-all duration-200 w-full border border-transparent";
    const inactive =
      "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/5";
    const active =
      "text-white bg-gradient-to-r from-primary/80 to-primary shadow-lg shadow-primary/30 border-white/15";
    return `${base} ${isActive ? active : inactive}`;
  };

  const getIconClass = (isActive: boolean) =>
    `h-5 w-5 transition-colors ${isActive ? "text-white" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"}`;

  return <Sidebar collapsible="icon" className="border-r border-white/5 bg-black/40 backdrop-blur-xl transition-all duration-300">
    <div className="p-4 mb-2">
      <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md shadow-lg">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <Receipt className="h-5 w-5 text-white" />
        </div>
        {!isCollapsed && <div className="transition-opacity duration-300">
          <h2 className="font-bold text-white text-lg tracking-tight">InvoicePro</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Financial Suite</p>
        </div>}
      </div>
    </div>

    <SidebarContent className="bg-transparent px-3">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-2">
            {mainMenuItems.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="hover:bg-transparent">
                  <NavLink to={item.url} end>
                    {({ isActive }) => (
                      <div className={`
                        group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 w-full
                        ${isActive
                          ? 'bg-primary/20 text-white shadow-[0_0_20px_rgba(168,85,247,0.25)] border border-primary/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
                        }
                      `}>
                        <div className={`p-1.5 rounded-lg transition-colors duration-300 ${isActive ? 'bg-primary text-white shadow-[0_0_10px_rgba(168,85,247,0.6)]' : 'text-gray-400 group-hover:text-white'}`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        {!isCollapsed && (
                          <span className={`${isActive ? "text-glow" : ""} transition-all duration-300`}>{item.title}</span>
                        )}
                        {isActive && !isCollapsed && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))] animate-pulse" />
                        )}
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <div className="px-4 py-2">
          {!isCollapsed && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Finance</p>}
        </div>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-2">
            {financialMenuItems.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="hover:bg-transparent">
                  <NavLink to={item.url} end>
                    {({ isActive }) => (
                      <div className={`
                        group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 w-full
                        ${isActive
                          ? 'bg-primary/20 text-white shadow-[0_0_20px_rgba(168,85,247,0.25)] border border-primary/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
                        }
                      `}>
                        <div className={`p-1.5 rounded-lg transition-colors duration-300 ${isActive ? 'bg-primary text-white shadow-[0_0_10px_rgba(168,85,247,0.6)]' : 'text-gray-400 group-hover:text-white'}`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        {!isCollapsed && (
                          <span className={`${isActive ? "text-glow" : ""} transition-all duration-300`}>{item.title}</span>
                        )}
                        {isActive && !isCollapsed && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))] animate-pulse" />
                        )}
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="hover:bg-transparent">
                <NavLink to="/settings" end>
                  {({ isActive }) => (
                    <div className={`
                        group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 w-full
                        ${isActive
                        ? 'bg-primary/20 text-white shadow-[0_0_20px_rgba(168,85,247,0.25)] border border-primary/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
                      }
                      `}>
                      <div className={`p-1.5 rounded-lg transition-colors duration-300 ${isActive ? 'bg-primary text-white shadow-[0_0_10px_rgba(168,85,247,0.6)]' : 'text-gray-400 group-hover:text-white'}`}>
                        <Settings className="h-4 w-4" />
                      </div>
                      {!isCollapsed && (
                        <span className={`${isActive ? "text-glow" : ""} transition-all duration-300`}>Settings</span>
                      )}
                    </div>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    {/* Notifications Section at Bottom */}
    <div className="mt-auto p-4 border-t border-white/5">
      <div className="bg-white/5 border border-white/5 rounded-2xl p-2 backdrop-blur-md shadow-lg">
        <button
          onClick={() => setNotificationOpen(true)}
          className="flex items-center gap-3 w-full hover:bg-white/5 p-2.5 rounded-xl transition-all duration-300 group"
        >
          <div className="relative p-1.5 rounded-lg bg-black/40 group-hover:bg-primary/20 transition-colors">
            <Bell className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-danger rounded-full animate-pulse border border-black shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
            )}
          </div>
          {!isCollapsed && <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">Notifications</p>
            <p className="text-[10px] text-gray-500 group-hover:text-primary transition-colors">
              {notificationCount > 0 ? `${notificationCount} new alerts` : 'All caught up'}
            </p>
          </div>}
        </button>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
          }}
          className="flex items-center gap-3 w-full hover:bg-danger/10 p-2.5 rounded-xl transition-all duration-300 group text-left mt-1"
        >
          <div className="p-1.5 rounded-lg bg-black/40 group-hover:bg-danger/20 transition-colors">
            <LogOut className="h-4 w-4 text-gray-400 group-hover:text-danger pointer-events-none" />
          </div>
          {!isCollapsed && <div>
            <p className="text-sm font-medium text-gray-200 group-hover:text-danger transition-colors">Log Out</p>
          </div>}
        </button>
      </div>
    </div>

    <NotificationDialog open={notificationOpen} onOpenChange={setNotificationOpen} />
  </Sidebar>;
}