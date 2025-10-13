import { TrendingUp, DollarSign, Users, AlertCircle, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Empty initial state
const metrics = [
  {
    title: "Total Revenue",
    value: "₹0",
    change: "+0%",
    trend: "up",
    icon: TrendingUp,
    description: "This month",
    color: "success"
  },
  {
    title: "Outstanding",
    value: "₹0",
    change: "0%",
    trend: "down", 
    icon: AlertCircle,
    description: "Pending payments",
    color: "warning"
  },
  {
    title: "Total Clients",
    value: "0",
    change: "+0%",
    trend: "up",
    icon: Users,
    description: "Active clients",
    color: "primary"
  },
  {
    title: "This Month",
    value: "₹0",
    change: "+0%",
    trend: "up",
    icon: DollarSign,
    description: "Current revenue",
    color: "success"
  }
];

const recentInvoices: any[] = [];

const getStatusBadge = (status: string) => {
  const variants = {
    paid: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20", 
    overdue: "bg-danger/10 text-danger border-danger/20",
    draft: "bg-muted text-muted-foreground border-border"
  };
  
  return variants[status as keyof typeof variants] || variants.draft;
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your business performance
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <a href="/invoices">
                <FileText className="h-4 w-4 mr-2" />
                New Invoice
              </a>
            </Button>
            <Button asChild>
              <a href="/clients">
                <Users className="h-4 w-4 mr-2" />
                Add Client
              </a>
            </Button>
          </div>
        </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.title} className="border-border/50 shadow-sm hover:shadow-md transition-all hover-scale">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${{
                  success: "bg-success/10",
                  warning: "bg-warning/10", 
                  primary: "bg-primary/10",
                  danger: "bg-danger/10"
                }[metric.color]}`}>
                  <IconComponent className={`h-4 w-4 ${{
                    success: "text-success",
                    warning: "text-warning",
                    primary: "text-primary", 
                    danger: "text-danger"
                  }[metric.color]}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="flex items-center text-sm mt-1">
                  <span className={`font-medium ${{
                    success: "text-success",
                    warning: "text-warning",
                    primary: "text-primary",
                    danger: "text-danger"
                  }[metric.color]}`}>
                    {metric.change}
                  </span>
                  <span className="text-muted-foreground ml-1">{metric.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}