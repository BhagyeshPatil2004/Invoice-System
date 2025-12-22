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
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export default function Reports() {
  const [dateRange, setDateRange] = useState("yearly"); // Changed default to Yearly
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
        case "all":
          return true;
        default:
          return true;
      }
    };

    const filteredInvoices = invoices.filter(inv => filterDate(inv.issueDate));
    const filteredPayables = payables.filter(pay => filterDate(pay.dueDate));

    const totalRevenue = filteredInvoices
      .filter(inv => inv.status?.toLowerCase() === "paid")
      .reduce((sum, inv) => sum + inv.amount, 0);

    const totalExpenses = filteredPayables
      .filter(pay => pay.status?.toLowerCase() === "paid")
      .reduce((sum, pay) => sum + pay.billAmount, 0);

    const profit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0;

    // Chart Data Generation
    let chartData = [];

    if (dateRange === 'weekly') {
      // Last 7 Days
      chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dayLabel = d.toLocaleDateString('en', { weekday: 'short' });

        const dayRevenue = invoices
          .filter(inv => {
            const invDate = new Date(inv.issueDate);
            return invDate.getDate() === d.getDate() &&
              invDate.getMonth() === d.getMonth() &&
              invDate.getFullYear() === d.getFullYear() &&
              inv.status?.toLowerCase() === "paid";
          })
          .reduce((sum, inv) => sum + inv.amount, 0);

        const dayExpenses = payables
          .filter(pay => {
            const payDate = new Date(pay.dueDate);
            return payDate.getDate() === d.getDate() &&
              payDate.getMonth() === d.getMonth() &&
              payDate.getFullYear() === d.getFullYear() &&
              pay.status?.toLowerCase() === "paid";
          })
          .reduce((sum, pay) => sum + pay.billAmount, 0);

        return {
          name: dayLabel, // Changed key from 'month' to 'name'
          revenue: dayRevenue,
          expenses: dayExpenses,
          profit: dayRevenue - dayExpenses
        };
      });
    } else if (dateRange === 'monthly') {
      // Days of current month
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      chartData = Array.from({ length: daysInMonth }, (_, i) => {
        const dayNum = i + 1;
        const d = new Date(now.getFullYear(), now.getMonth(), dayNum);

        const dayRevenue = invoices
          .filter(inv => {
            const invDate = new Date(inv.issueDate);
            return invDate.getDate() === dayNum &&
              invDate.getMonth() === now.getMonth() &&
              invDate.getFullYear() === now.getFullYear() &&
              inv.status?.toLowerCase() === "paid";
          })
          .reduce((sum, inv) => sum + inv.amount, 0);

        const dayExpenses = payables
          .filter(pay => {
            const payDate = new Date(pay.dueDate);
            return payDate.getDate() === dayNum &&
              payDate.getMonth() === now.getMonth() &&
              payDate.getFullYear() === now.getFullYear() &&
              pay.status?.toLowerCase() === "paid";
          })
          .reduce((sum, pay) => sum + pay.billAmount, 0);

        return {
          name: `${dayNum}`, // Day number
          revenue: dayRevenue,
          expenses: dayExpenses,
          profit: dayRevenue - dayExpenses
        };
      });
    } else if (dateRange === 'quarterly') {
      // Current Quarter (3 Months)
      const quarter = Math.floor(now.getMonth() / 3);
      const startMonth = quarter * 3;

      chartData = Array.from({ length: 3 }, (_, i) => {
        const monthIndex = startMonth + i;
        const monthDate = new Date(now.getFullYear(), monthIndex, 1);
        const monthName = monthDate.toLocaleDateString('en', { month: 'short' });

        const monthRevenue = invoices
          .filter(inv => {
            const invDate = new Date(inv.issueDate);
            return invDate.getMonth() === monthIndex &&
              invDate.getFullYear() === now.getFullYear() &&
              inv.status?.toLowerCase() === "paid";
          })
          .reduce((sum, inv) => sum + inv.amount, 0);

        const monthExpenses = payables
          .filter(pay => {
            const payDate = new Date(pay.dueDate);
            return payDate.getMonth() === monthIndex &&
              payDate.getFullYear() === now.getFullYear() &&
              pay.status?.toLowerCase() === "paid";
          })
          .reduce((sum, pay) => sum + pay.billAmount, 0);

        return {
          name: monthName,
          revenue: monthRevenue,
          expenses: monthExpenses,
          profit: monthRevenue - monthExpenses
        };
      });
    } else {
      // Yearly or All (Default to 12 months of current year)
      chartData = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(now.getFullYear(), i, 1);
        const monthName = month.toLocaleDateString('en', { month: 'short' });

        const monthRevenue = invoices
          .filter(inv => {
            const invDate = new Date(inv.issueDate);
            return invDate.getMonth() === i &&
              invDate.getFullYear() === now.getFullYear() &&
              inv.status?.toLowerCase() === "paid";
          })
          .reduce((sum, inv) => sum + inv.amount, 0);

        const monthExpenses = payables
          .filter(pay => {
            const payDate = new Date(pay.dueDate);
            return payDate.getMonth() === i &&
              payDate.getFullYear() === now.getFullYear() &&
              pay.status?.toLowerCase() === "paid";
          })
          .reduce((sum, pay) => sum + pay.billAmount, 0);

        return {
          name: monthName,
          revenue: monthRevenue,
          expenses: monthExpenses,
          profit: monthRevenue - monthExpenses
        };
      });
    }

    return {
      totalRevenue,
      totalExpenses,
      profit,
      profitMargin,
      totalInvoices: filteredInvoices.length,
      totalPayables: filteredPayables.length,
      avgInvoice: filteredInvoices.length > 0 ? totalRevenue / filteredInvoices.length : 0,
      chartData
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
    // Create CSV content with detailed invoice data
    const csvContent = [
      ["Invoice ID", "Client Name", "Issue Date", "Due Date", "Amount", "Status"],
      ...invoices.map(inv => [
        inv.id,
        `"${inv.clientName}"`, // Quote to handle commas in names
        inv.issueDate,
        inv.dueDate,
        inv.amount.toFixed(2),
        inv.status
      ])
    ].map(row => row.join(",")).join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Detailed sales report exported successfully!");
  };

  const handleExportExpenses = () => {
    // Create CSV content with detailed payables data
    const csvContent = [
      ["Bill ID", "Vendor", "Category", "Bill Amount", "Paid", "Due", "Status", "Due Date"],
      ...payables.map(pay => [
        pay.id,
        `"${pay.vendorName}"`,
        pay.category,
        pay.billAmount.toFixed(2),
        pay.amountPaid.toFixed(2),
        pay.amountDue.toFixed(2),
        pay.status,
        pay.dueDate
      ])
    ].map(row => row.join(",")).join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Expenses report exported successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400 text-glow">Reports & Analytics</h1>
          <p className="text-gray-400 mt-2 text-lg">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 hover:border-primary/50 transition-colors">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="quarterly">This Quarter</SelectItem>
              <SelectItem value="yearly">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportExpenses} className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 group">
            <Download className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
            Export Expenses
          </Button>
          <Button variant="outline" onClick={handleExport} className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 group">
            <Download className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
            Export Sales
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-panel border-0 hover-glow transition-all duration-300 group">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-success/10 shrink-0 group-hover:bg-success/20 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-400">Revenue</p>
                <div className="text-2xl font-bold text-white break-all drop-shadow-md">₹{analytics.totalRevenue.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-sm text-success font-medium pl-1">From paid invoices</div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 hover-glow transition-all duration-300 group">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-danger/10 shrink-0 group-hover:bg-danger/20 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <TrendingUp className="h-6 w-6 text-danger" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-400">Expenses</p>
                <div className="text-2xl font-bold text-white break-all drop-shadow-md">₹{analytics.totalExpenses.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-sm text-danger font-medium pl-1">From paid bills</div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 hover-glow transition-all duration-300 group">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-primary/10 shrink-0 group-hover:bg-primary/20 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-400">Profit</p>
                <div className={`text-2xl font-bold break-all drop-shadow-md ${analytics.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                  ₹{analytics.profit.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-sm text-primary font-medium pl-1">Margin: {analytics.profitMargin}%</div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 hover-glow transition-all duration-300 group">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Invoices</p>
                <div className="text-2xl font-bold text-white drop-shadow-md">{analytics.totalInvoices}</div>
              </div>
            </div>
            <div className="text-sm text-primary font-medium pl-1">{analytics.totalPayables} payables</div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-black/20 backdrop-blur-md border border-white/5 p-1 h-auto rounded-xl">
          <TabsTrigger value="sales" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg py-2.5 transition-all">
            <BarChart3 className="h-4 w-4 mr-2" />
            Sales Report
          </TabsTrigger>
          <TabsTrigger value="clients" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 rounded-lg py-2.5 transition-all">
            <Users className="h-4 w-4 mr-2" />
            Client Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card className="glass-panel border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <BarChart3 className="h-5 w-5 text-primary" />
                Sales Performance
              </CardTitle>
              <CardDescription className="text-gray-400">
                Revenue trends and sales analysis for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pl-0">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-white/5" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => {
                        if (value >= 1000000000) return `₹${(value / 1000000000).toFixed(1)}B`;
                        if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
                        return `₹${value}`;
                      }}
                      width={60}
                      dx={-10}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl p-4 shadow-2xl">
                              <div className="text-sm font-bold mb-3 text-gray-200 border-b border-white/10 pb-2">{payload[0].payload.name}</div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-3 text-sm">
                                  <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_8px_hsl(var(--success))]" />
                                  <span className="text-gray-400 min-w-[60px]">Revenue:</span>
                                  <span className="font-mono font-bold text-white">₹{Number(payload[0].payload.revenue).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                                  <span className="text-gray-400 min-w-[60px]">Profit:</span>
                                  <span className="font-mono font-bold text-white">₹{Number(payload[0].payload.profit).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <div className="w-2.5 h-2.5 rounded-full bg-destructive shadow-[0_0_8px_hsl(var(--destructive))]" />
                                  <span className="text-gray-400 min-w-[60px]">Expenses:</span>
                                  <span className="font-mono font-bold text-white">₹{Number(payload[0].payload.expenses).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--success))"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorExpenses)"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorProfit)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card className="glass-panel border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Users className="h-5 w-5 text-primary" />
                Client Analytics
              </CardTitle>
              <CardDescription className="text-gray-400">
                Insights into client behavior and revenue distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 border border-white/10 rounded-xl bg-white/5">
                  <h4 className="font-semibold mb-4 text-lg">Top Revenue Sources</h4>
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
                        <div key={idx} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors group">
                          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{item.client || 'Unknown Client'}</span>
                          <span className="font-bold text-success">₹{item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    {invoices.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No client data available</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-sm text-gray-400 mb-1">Active Clients</p>
                    <p className="text-3xl font-bold text-white text-glow">
                      {new Set(invoices.map(inv => inv.clientName)).size}
                    </p>
                  </div>
                  <div className="p-5 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-sm text-gray-400 mb-1">Avg Client Value</p>
                    <p className="text-3xl font-bold text-white text-glow">
                      ₹{invoices.length > 0 ? (analytics.totalRevenue / new Set(invoices.map(inv => inv.clientName)).size).toFixed(0) : '0'}
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
