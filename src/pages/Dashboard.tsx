import { TrendingUp, DollarSign, Users, AlertCircle, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const metrics = [
  {
    title: "Total Revenue",
    value: "$124,500",
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
    description: "This month",
    color: "success"
  },
  {
    title: "Outstanding",
    value: "$28,750",
    change: "-5.2%",
    trend: "down", 
    icon: AlertCircle,
    description: "Pending payments",
    color: "warning"
  },
  {
    title: "Total Clients",
    value: "142",
    change: "+8.1%",
    trend: "up",
    icon: Users,
    description: "Active clients",
    color: "primary"
  },
  {
    title: "This Month",
    value: "$45,250",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
    description: "Current revenue",
    color: "success"
  }
];

const recentInvoices = [
  { id: "INV-001", client: "Acme Corp", amount: "$2,500", status: "paid", dueDate: "2024-01-15" },
  { id: "INV-002", client: "TechStart Inc", amount: "$1,750", status: "pending", dueDate: "2024-01-20" },
  { id: "INV-003", client: "Digital Agency", amount: "$3,200", status: "overdue", dueDate: "2024-01-10" },
  { id: "INV-004", client: "Creative Studio", amount: "$890", status: "draft", dueDate: "2024-01-25" },
];

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

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Invoices
            </CardTitle>
            <CardDescription>
              Latest invoice activity and status updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{invoice.client}</p>
                      <p className="text-sm text-muted-foreground">{invoice.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{invoice.amount}</p>
                    <Badge className={getStatusBadge(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/invoices">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Invoice
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/clients">
                  <Users className="h-4 w-4 mr-2" />
                  Add New Client
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/reports">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Reports
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/receivables">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Record Payment
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}