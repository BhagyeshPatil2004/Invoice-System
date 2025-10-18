import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DataProvider } from "@/contexts/DataContext";
import { InvoiceSettingsProvider } from "@/contexts/InvoiceSettingsContext";
import Layout from "./components/Layout";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import Quotations from "./pages/Quotations";
import Receivables from "./pages/Receivables";
import Payables from "./pages/Payables";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <TooltipProvider>
        <DataProvider>
          <InvoiceSettingsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <Layout>
              <Clients />
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
              <Settings />
            </Layout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
          </InvoiceSettingsProvider>
        </DataProvider>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
