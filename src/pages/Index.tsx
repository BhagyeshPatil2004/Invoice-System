import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, FileText, ShoppingCart, TrendingUp } from "lucide-react";
import { useMemo } from "react";

const Index = () => {
  const { invoices, payables } = useData();

  const analytics = useMemo(() => {
    const totalRevenue = invoices
      .filter((inv) => inv.status === "Paid")
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    const totalExpenses = payables
      .filter((pay) => pay.status === "Paid")
      .reduce((sum, pay) => sum + (pay.totalAmount || 0), 0);

    const profit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    const pendingInvoices = invoices.filter((inv) => inv.status === "Pending").length;
    const overdueInvoices = invoices.filter((inv) => inv.status === "Overdue").length;

    return {
      totalRevenue,
      totalExpenses,
      profit,
      profitMargin,
      pendingInvoices,
      overdueInvoices,
      totalInvoices: invoices.length,
      totalPayables: payables.length,
    };
  }, [invoices, payables]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business analytics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">From {analytics.totalInvoices} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">From {analytics.totalPayables} bills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.profit)}</div>
            <div className="flex items-center text-xs mt-1">
              {analytics.profitMargin >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">{analytics.profitMargin.toFixed(1)}% margin</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{Math.abs(analytics.profitMargin).toFixed(1)}% margin</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pendingInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.overdueInvoices > 0 && `${analytics.overdueInvoices} overdue`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
