import { createContext, useContext, useState, ReactNode } from "react";

interface DataContextType {
  invoices: any[];
  setInvoices: (invoices: any[]) => void;
  payables: any[];
  setPayables: (payables: any[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payables, setPayables] = useState<any[]>([]);

  return (
    <DataContext.Provider value={{ invoices, setInvoices, payables, setPayables }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
