import { useState, useMemo } from "react";
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, FileText, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export default function Reports() {
  const [dateRange, setDateRange] = useState("monthly");
  const { invoices, payables } = useData();

  // Calculate analytics
  const analytics = useMemo(() => {
    const now = new Date();
    const filterDate = (date: string) => {
      const itemDate = new Date(date);
      switch (dateRange) {
        case "weekly":
          return now.getTime() - itemDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
        case "monthly":
          return now.getMonth() === itemDate.getMonth() && now.getFullYear() === itemDate.getFullYear();
        case "quarterly":
          const quarter = Math.floor(now.getMonth() / 3);
          const itemQuarter = Math.floor(itemDate.getMonth() / 3);
          return quarter === itemQuarter && now.getFullYear() === itemDate.getFullYear();
        case "yearly":
          return now.getFullYear() === itemDate.getFullYear();
        default:
          return true;
      }
    };

    const filteredInvoices = invoices.filter(inv => filterDate(inv.issueDate));
    const filteredPayables = payables.filter(pay => filterDate(pay.dueDate));

    const totalRevenue = filteredInvoices
      .filter(inv => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.amount, 0);

    const totalExpenses = filteredPayables
      .filter(pay => pay.status === "paid")
      .reduce((sum, pay) => sum + pay.billAmount, 0);

    const profit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0;

    // Monthly data for charts
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(now.getFullYear(), i, 1);
      const monthName = month.toLocaleDateString('en', { month: 'short' });
      
      const monthRevenue = invoices
        .filter(inv => {
          const invDate = new Date(inv.issueDate);
          return invDate.getMonth() === i && 
                 invDate.getFullYear() === now.getFullYear() &&
                 inv.status === "paid";
        })
        .reduce((sum, inv) => sum + inv.amount, 0);

      const monthExpenses = payables
        .filter(pay => {
          const payDate = new Date(pay.dueDate);
          return payDate.getMonth() === i && 
                 payDate.getFullYear() === now.getFullYear() &&
                 pay.status === "paid";
        })
        .reduce((sum, pay) => sum + pay.billAmount, 0);

      return {
        month: monthName,
        revenue: monthRevenue,
        expenses: monthExpenses,
        profit: monthRevenue - monthExpenses
      };
    });

    return {
      totalRevenue,
      totalExpenses,
      profit,
      profitMargin,
      totalInvoices: filteredInvoices.length,
      totalPayables: filteredPayables.length,
      avgInvoice: filteredInvoices.length > 0 ? totalRevenue / filteredInvoices.length : 0,
      monthlyData
    };
  }, [invoices, payables, dateRange]);

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--success))",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(var(--destructive))",
    },
    profit: {
      label: "Profit",
      color: "hsl(var(--primary))",
    },
  };

  const handleExport = () => {
    // Create CSV content
    const csvContent = [
      ["Month", "Revenue", "Expenses", "Profit"],
      ...analytics.monthlyData.map(row => [
        row.month,
        row.revenue.toFixed(2),
        row.expenses.toFixed(2),
        row.profit.toFixed(2)
      ])
    ].map(row => row.join(",")).join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Report exported successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="quarterly">This Quarter</SelectItem>
              <SelectItem value="yearly">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10 shrink-0">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <div className="text-2xl font-bold text-foreground break-all">₹{analytics.totalRevenue.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-sm text-success">From paid invoices</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-destructive/10 shrink-0">
                <TrendingUp className="h-5 w-5 text-destructive" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">Expenses</p>
                <div className="text-2xl font-bold text-foreground break-all">₹{analytics.totalExpenses.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-sm text-destructive">From paid bills</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">Profit</p>
                <div className={`text-2xl font-bold break-all ${analytics.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  ₹{analytics.profit.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-sm text-primary">Margin: {analytics.profitMargin}%</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoices</p>
                <div className="text-2xl font-bold text-foreground">{analytics.totalInvoices}</div>
              </div>
            </div>
            <div className="text-sm text-primary">{analytics.totalPayables} payables</div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="expenses">Expenses Report</TabsTrigger>
          <TabsTrigger value="clients">Client Report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sales Performance
              </CardTitle>
              <CardDescription>
                Revenue trends and sales analysis for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <BarChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" name="Revenue" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>

               <div className="grid grid-cols-3 gap-4 mt-6">
                 <div className="p-4 border border-border rounded-lg">
                   <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                   <p className="text-2xl font-bold text-foreground">₹{analytics.totalRevenue.toFixed(2)}</p>
                 </div>
                 <div className="p-4 border border-border rounded-lg">
                   <p className="text-sm text-muted-foreground mb-1">Average Invoice</p>
                   <p className="text-2xl font-bold text-foreground">₹{analytics.avgInvoice.toFixed(2)}</p>
                 </div>
                 <div className="p-4 border border-border rounded-lg">
                   <p className="text-sm text-muted-foreground mb-1">Total Invoices</p>
                   <p className="text-2xl font-bold text-success">{analytics.totalInvoices}</p>
                 </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Expense Analysis
              </CardTitle>
              <CardDescription>
                Track and analyze your business expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <BarChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" name="Expenses" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-foreground">₹{analytics.totalExpenses.toFixed(2)}</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Payables</p>
                  <p className="text-2xl font-bold text-destructive">{analytics.totalPayables}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Analytics
              </CardTitle>
              <CardDescription>
                Insights into client behavior and revenue distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 border border-border rounded-lg">
                  <h4 className="font-semibold mb-4">Top Revenue Sources</h4>
                  <div className="space-y-3">
                    {invoices
                      .reduce((acc: any[], inv) => {
                        const existing = acc.find(item => item.client === inv.clientName);
                        if (existing && inv.status === "paid") {
                          existing.total += inv.amount;
                        } else if (inv.status === "paid") {
                          acc.push({ client: inv.clientName, total: inv.amount });
                        }
                        return acc;
                      }, [])
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 5)
                      .map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm">{item.client || 'Unknown Client'}</span>
                          <span className="font-semibold">₹{item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    {invoices.length === 0 && (
                      <p className="text-sm text-muted-foreground">No client data available</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Active Clients</p>
                    <p className="text-2xl font-bold text-foreground">
                      {new Set(invoices.map(inv => inv.clientName)).size}
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Avg Client Value</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{invoices.length > 0 ? (analytics.totalRevenue / new Set(invoices.map(inv => inv.clientName)).size).toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
