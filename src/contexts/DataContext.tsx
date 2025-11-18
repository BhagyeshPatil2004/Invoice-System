import { createContext, useContext, useState, ReactNode } from "react";

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
}

interface DataContextType {
  invoices: any[];
  setInvoices: (invoices: any[]) => void;
  payables: any[];
  setPayables: (payables: any[]) => void;
  bankDetails: BankDetails;
  setBankDetails: (details: BankDetails) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payables, setPayables] = useState<any[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails>(() => {
    const saved = localStorage.getItem('bankDetails');
    return saved ? JSON.parse(saved) : {
      bankName: "",
      accountName: "",
      accountNumber: "",
      ifscCode: ""
    };
  });

  const updateBankDetails = (details: BankDetails) => {
    setBankDetails(details);
    localStorage.setItem('bankDetails', JSON.stringify(details));
  };

  return (
    <DataContext.Provider value={{ 
      invoices, 
      setInvoices, 
      payables, 
      setPayables, 
      bankDetails, 
      setBankDetails: updateBankDetails 
    }}>
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
