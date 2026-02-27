import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Users, FileText, Receipt, DollarSign, Settings, Calendar, Bell, Package, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { NotificationDialog } from "@/components/NotificationDialog";
import { useData } from "@/contexts/DataContext";
import { supabase } from "@/supabaseClient";
import { isWithinInterval, addDays, parseISO } from "date-fns";

const mainMenuItems = [
  {
    title: "Clients",
    url: "/dashboard",
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
  const navigate = useNavigate();
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

  return <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#0B0B15] backdrop-blur-xl transition-all duration-300">
    <div className="p-4 mb-2">
      <div className="flex items-center gap-3 p-4 rounded-3xl bg-gradient-to-br from-purple-900/40 via-[#0f0f11] to-[#0f0f11] border border-purple-500/20 backdrop-blur-md shadow-2xl group overflow-hidden relative">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

        {/* Logo/Icon */}
        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-violet-500 p-[1px] shadow-[0_0_20px_rgba(139,92,246,0.5)]">
          <div className="w-full h-full rounded-2xl bg-[#0f0f11] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/20 blur-md" />
            <Receipt className="h-6 w-6 text-white relative z-10" />
          </div>
        </div>

        {!isCollapsed && <div className="transition-opacity duration-300 z-10">
          <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-purple-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Lumina</h2>
        </div>}
      </div>
    </div>

    <SidebarContent className="bg-transparent px-3 py-2 scrollbar-none">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1.5">
            {mainMenuItems.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="hover:bg-transparent">
                  <NavLink to={item.url} end>
                    {({ isActive }) => (
                      <div
                        className={`
                          relative flex items-center gap-3
                          h-[44px] px-4 w-full
                          rounded-full
                          transition-colors duration-200
                          ${isActive
                            ? "text-white"
                            : "text-gray-400 hover:text-white"
                          }
                        `}
                      >
                        {/* ACTIVE BACKGROUND */}
                        <div
                          className={`
                            pointer-events-none absolute inset-0 rounded-full
                            transition-opacity duration-200
                            ${isActive ? "opacity-100" : "opacity-0"
                            }
                          `}
                          style={{
                            background: `
                              radial-gradient(
                                120% 120% at 15% 50%,
                                rgba(124,58,237,0.35) 0%,
                                rgba(26,20,38,0.95) 45%,
                                rgba(10,10,15,1) 100%
                              )
                            `,
                            boxShadow: `
                              0 0 0 1px rgba(124,58,237,0.25),
                              0 12px 30px rgba(124,58,237,0.15)
                            `,
                          }}
                        />

                        {/* ICON */}
                        <item.icon
                          className={`
                            relative z-10 h-5 w-5
                            ${isActive ? "text-violet-300" : "text-gray-500"
                            }
                          `}
                        />

                        {/* LABEL */}
                        {!isCollapsed && (
                          <span className="relative z-10 text-sm font-medium">
                            {item.title}
                          </span>
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
        {/* Finance Header Removed as requested */}
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1.5">
            {financialMenuItems.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="hover:bg-transparent">
                  <NavLink to={item.url} end>
                    {({ isActive }) => (
                      <div
                        className={`
                          relative flex items-center gap-3
                          h-[44px] px-4 w-full
                          rounded-full
                          transition-colors duration-200
                          ${isActive
                            ? "text-white"
                            : "text-gray-400 hover:text-white"
                          }
                        `}
                      >
                        {/* ACTIVE BACKGROUND */}
                        <div
                          className={`
                            pointer-events-none absolute inset-0 rounded-full
                            transition-opacity duration-200
                            ${isActive ? "opacity-100" : "opacity-0"
                            }
                          `}
                          style={{
                            background: `
                              radial-gradient(
                                120% 120% at 15% 50%,
                                rgba(124,58,237,0.35) 0%,
                                rgba(26,20,38,0.95) 45%,
                                rgba(10,10,15,1) 100%
                              )
                            `,
                            boxShadow: `
                              0 0 0 1px rgba(124,58,237,0.25),
                              0 12px 30px rgba(124,58,237,0.15)
                            `,
                          }}
                        />

                        {/* ICON */}
                        <item.icon
                          className={`
                            relative z-10 h-5 w-5
                            ${isActive ? "text-violet-300" : "text-gray-500"
                            }
                          `}
                        />

                        {/* LABEL */}
                        {!isCollapsed && (
                          <span className="relative z-10 text-sm font-medium">
                            {item.title}
                          </span>
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
          <SidebarMenu className="space-y-1.5 mt-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="hover:bg-transparent">
                <NavLink to="/settings" end>
                  {({ isActive }) => (
                    <div
                      className={`
                          relative flex items-center gap-3
                          h-[44px] px-4 w-full
                          rounded-full
                          transition-colors duration-200
                          ${isActive
                          ? "text-white"
                          : "text-gray-400 hover:text-white"
                        }
                        `}
                    >
                      {/* ACTIVE BACKGROUND */}
                      <div
                        className={`
                            pointer-events-none absolute inset-0 rounded-full
                            transition-opacity duration-200
                            ${isActive ? "opacity-100" : "opacity-0"
                          }
                          `}
                        style={{
                          background: `
                              radial-gradient(
                                120% 120% at 15% 50%,
                                rgba(124,58,237,0.35) 0%,
                                rgba(26,20,38,0.95) 45%,
                                rgba(10,10,15,1) 100%
                              )
                            `,
                          boxShadow: `
                              0 0 0 1px rgba(124,58,237,0.25),
                              0 12px 30px rgba(124,58,237,0.15)
                            `,
                        }}
                      />

                      {/* ICON */}
                      <Settings
                        className={`
                            relative z-10 h-5 w-5
                            ${isActive ? "text-violet-300" : "text-gray-500"
                          }
                          `}
                      />

                      {/* LABEL */}
                      {!isCollapsed && (
                        <span className="relative z-10 text-sm font-medium">
                          Settings
                        </span>
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
      <div className="bg-[#0f0f11] border border-white/5 rounded-3xl p-3 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <button
          onClick={() => setNotificationOpen(true)}
          className="relative z-10 flex items-center gap-3 w-full hover:bg-white/5 p-2 rounded-2xl transition-all duration-300 group/btn mb-1"
        >
          <div className="relative p-2 rounded-xl bg-black/50 group-hover/btn:bg-primary/20 transition-colors border border-white/5">
            <Bell className="h-5 w-5 text-gray-400 group-hover/btn:text-white transition-colors" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-danger rounded-full animate-pulse border-2 border-[#0f0f11] shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
            )}
          </div>
          {!isCollapsed && <div className="flex-1 text-left">
            <p className="text-sm font-bold text-white group-hover/btn:text-primary transition-colors">Notifications</p>
            <p className="text-[10px] text-gray-500 font-medium">
              {notificationCount > 0 ? `${notificationCount} new alerts` : 'No new alerts'}
            </p>
          </div>}
        </button>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/");
          }}
          className="relative z-10 flex items-center gap-3 w-full hover:bg-danger/10 p-2 rounded-2xl transition-all duration-300 group/btn text-left"
        >
          <div className="p-2 rounded-xl bg-black/50 group-hover/btn:bg-danger/20 transition-colors border border-white/5">
            <LogOut className="h-5 w-5 text-gray-400 group-hover/btn:text-danger pointer-events-none" />
          </div>
          {!isCollapsed && <div>
            <p className="text-sm font-bold text-gray-300 group-hover/btn:text-white transition-colors">Log Out</p>
          </div>}
        </button>
      </div>
    </div>

    <NotificationDialog open={notificationOpen} onOpenChange={setNotificationOpen} />
  </Sidebar>;
}