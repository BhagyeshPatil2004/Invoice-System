import { createContext, useContext, useState, ReactNode } from "react";

export type InvoiceTheme = "classic" | "modern" | "minimal";

interface InvoiceSettings {
  theme: InvoiceTheme;
  companyName: string;
  primaryColor: string;
  accentColor: string;
}

interface InvoiceSettingsContextType {
  settings: InvoiceSettings;
  updateSettings: (newSettings: Partial<InvoiceSettings>) => void;
}

const InvoiceSettingsContext = createContext<InvoiceSettingsContextType | undefined>(undefined);

export function InvoiceSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<InvoiceSettings>({
    theme: "classic",
    companyName: "Your Company Name",
    primaryColor: "#d4c5b9",
    accentColor: "#2c2c2c",
  });

  const updateSettings = (newSettings: Partial<InvoiceSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <InvoiceSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </InvoiceSettingsContext.Provider>
  );
}

export function useInvoiceSettings() {
  const context = useContext(InvoiceSettingsContext);
  if (!context) {
    throw new Error("useInvoiceSettings must be used within InvoiceSettingsProvider");
  }
  return context;
}
