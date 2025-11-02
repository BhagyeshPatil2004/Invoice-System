import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Users, FileText, Receipt, DollarSign, Settings, TrendingUp, Calendar, Bell } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { NotificationDialog } from "@/components/NotificationDialog";
import { useData } from "@/contexts/DataContext";
import { isWithinInterval, addDays, parseISO } from "date-fns";
const mainMenuItems = [{
  title: "Clients",
  url: "/",
  icon: Users
}, {
  title: "Invoices",
  url: "/invoices",
  icon: FileText
}, {
  title: "Quotations",
  url: "/quotations",
  icon: Receipt
}];
const financialMenuItems = [{
  title: "Payables",
  url: "/payables",
  icon: DollarSign
}, {
  title: "Reports",
  url: "/reports",
  icon: Calendar
}];
export function AppSidebar() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { invoices, payables } = useData();
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
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
      if (invoice.status === 'paid') return false;
      try {
        const dueDate = parseDate(invoice.dueDate);
        return isWithinInterval(dueDate, { start: today, end: nextWeek });
      } catch {
        return false;
      }
    }).length +
    payables.filter(payable => {
      if (payable.status === 'paid' || payable.amountDue === 0) return false;
      try {
        const dueDate = parseDate(payable.dueDate);
        return isWithinInterval(dueDate, { start: today, end: nextWeek });
      } catch {
        return false;
      }
    }).length;

  // Active Menu Item styling - prominent and clear
  const getNavClass = ({
    isActive
  }: {
    isActive: boolean;
  }) => isActive ? "bg-[hsl(var(--sidebar-accent))] text-white font-semibold border-l-4 border-primary shadow-sm" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground transition-colors";
  return <Sidebar collapsible="icon">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Receipt className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && <div>
              <h2 className="font-bold text-sidebar-foreground">InvoicePro</h2>
              <p className="text-xs text-sidebar-foreground/70">Financial Management</p>
            </div>}
        </div>
      </div>

      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {financialMenuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
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

      {/* Notifications Section at Bottom */}
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <button 
          onClick={() => setNotificationOpen(true)}
          className="flex items-center gap-3 w-full hover:bg-sidebar-accent/30 p-2 rounded-lg transition-colors"
        >
          <div className="relative">
            <Bell className="h-5 w-5 text-sidebar-foreground" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-danger rounded-full"></span>
            )}
          </div>
          {!isCollapsed && <div className="flex-1 text-left">
              <p className="text-sm font-medium text-sidebar-foreground">Notifications</p>
              <p className="text-xs text-sidebar-foreground/70">
                {notificationCount > 0 ? `${notificationCount} due within 7 days` : 'No upcoming dues'}
              </p>
            </div>}
        </button>
      </div>

      <NotificationDialog open={notificationOpen} onOpenChange={setNotificationOpen} />
    </Sidebar>;
}