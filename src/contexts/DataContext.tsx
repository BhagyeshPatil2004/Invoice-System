import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/supabaseClient";

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
}

interface DataContextType {
  user: any;
  session: any;
  invoices: any[];
  setInvoices: (invoices: any[]) => void;
  payables: any[];
  setPayables: (payables: any[]) => void;
  quotations: any[];
  setQuotations: (quotations: any[]) => void;
  bankDetails: BankDetails;
  setBankDetails: (details: BankDetails) => void;
  clients: any[];
  setClients: (clients: any[]) => void;
  products: any[];
  setProducts: (products: any[]) => void;
  userProfile: any;
  setUserProfile: (profile: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  const [invoices, setInvoices] = useState<any[]>([]);
  const [payables, setPayables] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifscCode: ""
  });
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>({
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Inc.",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, Country"
  });

  // Fetch all data from Supabase on mount
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data when session exists
  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        // Clear data on logout
        setClients([]);
        setInvoices([]);
        setProducts([]);
        setPayables([]);
        setQuotations([]);
        return;
      }

      // Clients
      const { data: clientsData } = await supabase.from('clients').select('*');
      if (clientsData) setClients(clientsData);

      // Invoices
      const { data: invoicesData } = await supabase.from('invoices').select('*').order('issueDate', { ascending: false });
      if (invoicesData) setInvoices(invoicesData);

      // Products
      const { data: productsData } = await supabase.from('products').select('*');
      if (productsData) setProducts(productsData);

      // Settings (Profile & Bank)
      const { data: settingsData } = await supabase.from('settings').select('*').single();
      if (settingsData) {
        if (settingsData.user_profile) setUserProfile(settingsData.user_profile);
        if (settingsData.bank_details) setBankDetails(settingsData.bank_details);
      }

      // Payables
      const { data: payablesData, error: payablesError } = await supabase.from('payables').select('*');
      if (payablesError) {
        console.error('Error fetching payables:', payablesError);
      }
      if (payablesData) {
        setPayables(payablesData);
      }

      // Quotations
      const { data: quotationsData, error: quotationsError } = await supabase.from('quotations').select('*');
      if (quotationsError) {
        console.error('Error fetching quotations:', quotationsError);
      }
      if (quotationsData) {
        setQuotations(quotationsData);
      }
    };

    fetchData();
  }, [session]);

  return (
    <DataContext.Provider value={{
      user,
      session,
      invoices,
      setInvoices,
      payables,
      setPayables,
      quotations,
      setQuotations,
      bankDetails,
      setBankDetails: async (details) => {
        setBankDetails(details);
        // Upsert Settings
        const { data } = await supabase.from('settings').select('id').single();
        if (data) {
          await supabase.from('settings').update({ bank_details: details }).eq('id', data.id);
        } else {
          await supabase.from('settings').insert({ bank_details: details });
        }
      },
      clients,
      setClients,
      products,
      setProducts,
      userProfile,
      setUserProfile: async (profile) => {
        setUserProfile(profile);
        const { data } = await supabase.from('settings').select('id').single();
        if (data) {
          await supabase.from('settings').update({ user_profile: profile }).eq('id', data.id);
        } else {
          await supabase.from('settings').insert({ user_profile: profile });
        }
      },
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
