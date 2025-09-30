import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import Quotations from "./pages/Quotations";
import Receivables from "./pages/Receivables";
import Payables from "./pages/Payables";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/clients" element={
            <Layout>
              <Clients />
            </Layout>
          } />
          <Route path="/invoices" element={
            <Layout>
              <Invoices />
            </Layout>
          } />
          <Route path="/quotations" element={
            <Layout>
              <Quotations />
            </Layout>
          } />
          <Route path="/receivables" element={
            <Layout>
              <Receivables />
            </Layout>
          } />
          <Route path="/payables" element={
            <Layout>
              <Payables />
            </Layout>
          } />
          <Route path="/reports" element={
            <Layout>
              <Reports />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Settings page coming soon...</p>
              </div>
            </Layout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
