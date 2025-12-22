import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Building, Phone, Save, Edit, X, CreditCard, MapPin, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useData } from "@/contexts/DataContext";

export default function Settings() {
  const { toast } = useToast();
  const { bankDetails, setBankDetails, userProfile, setUserProfile } = useData();

  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Inc.",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, Country",
    logo: ""
  });

  // Update local state when userProfile changes (e.g. on initial load)
  useEffect(() => {
    if (userProfile) {
      setUserDetails(userProfile);
    }
  }, [userProfile]);

  const [isEditing, setIsEditing] = useState(false);
  const [tempDetails, setTempDetails] = useState(userDetails);

  const [isBankEditing, setIsBankEditing] = useState(false);
  const [tempBankDetails, setTempBankDetails] = useState(bankDetails);

  const handleEdit = () => {
    setTempDetails(userDetails);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempDetails(userDetails);
    setIsEditing(false);
  };

  const handleSave = () => {
    setUserDetails(tempDetails);
    setUserProfile(tempDetails);
    setIsEditing(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully."
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) { // 500KB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 500KB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempDetails({ ...tempDetails, logo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBankEdit = () => {
    setTempBankDetails(bankDetails);
    setIsBankEditing(true);
  };

  const handleBankCancel = () => {
    setTempBankDetails(bankDetails);
    setIsBankEditing(false);
  };

  const handleBankSave = () => {
    setBankDetails(tempBankDetails);
    setIsBankEditing(false);
    toast({
      title: "Bank details saved",
      description: "Your bank details will now be automatically added to all invoices."
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Profile Information</h2>
              <p className="text-sm text-muted-foreground">Update your personal details</p>
            </div>
          </div>
          {!isEditing && (
            <Button onClick={handleEdit} variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Logo Upload */}
          <div className="md:col-span-2 space-y-2">
            <Label className="flex items-center gap-2 text-base">
              Company Logo
            </Label>
            <div className="flex items-center gap-4">
              {(tempDetails as any).logo || (userDetails as any).logo ? (
                <img
                  src={(isEditing ? (tempDetails as any).logo : (userDetails as any).logo)}
                  alt="Company Logo"
                  className="h-16 w-16 object-contain border rounded-md"
                />
              ) : (
                <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">
                  No Logo
                </div>
              )}

              {isEditing && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full max-w-xs"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </Label>
            {isEditing ? (
              <Input
                value={tempDetails.name}
                onChange={e => setTempDetails({ ...tempDetails, name: e.target.value })}
                className="bg-background"
              />
            ) : (
              <p className="text-sm font-medium p-3 rounded-md bg-card border">{userDetails.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Address
            </Label>
            {isEditing ? (
              <Input
                type="email"
                value={tempDetails.email}
                onChange={e => setTempDetails({ ...tempDetails, email: e.target.value })}
                className="bg-background"
              />
            ) : (
              <p className="text-sm font-medium p-3 rounded-md bg-card border">{userDetails.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <Building className="h-4 w-4 text-muted-foreground" />
              Company Name
            </Label>
            {isEditing ? (
              <Input
                value={tempDetails.company}
                onChange={e => setTempDetails({ ...tempDetails, company: e.target.value })}
                className="bg-background"
              />
            ) : (
              <p className="text-sm font-medium p-3 rounded-md bg-card border">{userDetails.company}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                type="tel"
                value={tempDetails.phone}
                onChange={e => setTempDetails({ ...tempDetails, phone: e.target.value })}
                className="bg-background"
              />
            ) : (
              <p className="text-sm font-medium p-3 rounded-md bg-card border">{userDetails.phone}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Address
            </Label>
            {isEditing ? (
              <Input
                value={tempDetails.address}
                onChange={e => setTempDetails({ ...tempDetails, address: e.target.value })}
                className="bg-background"
              />
            ) : (
              <p className="text-sm font-medium p-3 rounded-md bg-card border">{userDetails.address || "Not set"}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <>
            <Separator />
            <div className="flex justify-end gap-2">
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Bank Details Section */}
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Bank Details</h2>
              <p className="text-sm text-muted-foreground">These details will be automatically added to all invoices</p>
            </div>
          </div>
          {!isBankEditing && (
            <Button onClick={handleBankEdit} variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-base">Bank Name</Label>
            {isBankEditing ? (
              <Input
                value={tempBankDetails.bankName}
                onChange={e => setTempBankDetails({ ...tempBankDetails, bankName: e.target.value })}
                className="bg-background"
                placeholder="e.g., HDFC Bank"
              />
            ) : (
              <p className="text-sm font-medium p-3 rounded-md bg-card border">{bankDetails.bankName || "Not set"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-base">Account Name</Label>
            {isBankEditing ? (
              <Input
                value={tempBankDetails.accountName}
                onChange={e => setTempBankDetails({ ...tempBankDetails, accountName: e.target.value })}
                className="bg-background"
                placeholder="e.g., John Doe"
              />
            ) : (
              <p className="text-sm font-medium p-3 rounded-md bg-card border">{bankDetails.accountName || "Not set"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-base">Account Number</Label>
            {isBankEditing ? (
              <Input
                value={tempBankDetails.accountNumber}
                onChange={e => setTempBankDetails({ ...tempBankDetails, accountNumber: e.target.value })}
                className="bg-background"
                placeholder="e.g., 1234567890"
              />
            ) : (
              <p className="text-sm font-medium p-3 rounded-md bg-card border">{bankDetails.accountNumber || "Not set"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-base">IFSC Code</Label>
            {isBankEditing ? (
              <Input
                value={tempBankDetails.ifscCode}
                onChange={e => setTempBankDetails({ ...tempBankDetails, ifscCode: e.target.value })}
                className="bg-background"
                placeholder="e.g., HDFC0001234"
              />
            ) : (
              <p className="text-sm font-medium p-3 rounded-md bg-card border">{bankDetails.ifscCode || "Not set"}</p>
            )}
          </div>
        </div>

        {isBankEditing && (
          <>
            <Separator />
            <div className="flex justify-end gap-2">
              <Button onClick={handleBankCancel} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleBankSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Data Management Section */}
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Save className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Data Management</h2>
            <p className="text-sm text-muted-foreground">Backup and restore your application data</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Backup */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <div>
              <h3 className="font-medium mb-1">Backup Data</h3>
              <p className="text-sm text-muted-foreground">Download a copy of all your data (Invoices, Clients, Settings) to your device.</p>
            </div>
            <Button onClick={() => {
              const data = {
                invoices: localStorage.getItem('invoices'),
                clients: localStorage.getItem('clients'),
                products: localStorage.getItem('products'),
                userProfile: localStorage.getItem('userProfile'),
                bankDetails: localStorage.getItem('bankDetails'),
                invoiceSettings: localStorage.getItem('invoiceSettings')
              };

              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `invoice-backup-${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);

              toast({
                title: "Backup Created",
                description: "Your data has been downloaded successfully."
              });
            }} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Download Backup
            </Button>
          </div>

          {/* Restore */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <div>
              <h3 className="font-medium mb-1">Restore Data</h3>
              <p className="text-sm text-muted-foreground">Restore your data from a backup file. <span className="text-danger font-bold uppercase tracking-wide drop-shadow-sm">Warning: This will overwrite current data.</span></p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".json"
                className="cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const data = JSON.parse(event.target?.result as string);

                      // Validate structure (basic check)
                      if (!data.invoices && !data.clients) {
                        throw new Error("Invalid backup file");
                      }

                      // Restore data
                      if (data.invoices) localStorage.setItem('invoices', data.invoices);
                      if (data.clients) localStorage.setItem('clients', data.clients);
                      if (data.products) localStorage.setItem('products', data.products);
                      if (data.userProfile) localStorage.setItem('userProfile', data.userProfile);
                      if (data.bankDetails) localStorage.setItem('bankDetails', data.bankDetails);
                      if (data.invoiceSettings) localStorage.setItem('invoiceSettings', data.invoiceSettings);

                      toast({
                        title: "Restore Successful",
                        description: "Data restored. Reloading application...",
                      });

                      setTimeout(() => window.location.reload(), 1500);

                    } catch (error) {
                      toast({
                        title: "Restore Failed",
                        description: "Invalid backup file or corrupted data.",
                        variant: "destructive"
                      });
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </div>
          </div>
        </div>

        {/* Cloud Migration Section */}
        <div className="rounded-lg border bg-card p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Save className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Cloud Migration</h2>
              <p className="text-sm text-muted-foreground">Upload your local data to Supabase (One-time)</p>
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground">
              If you just connected to Supabase and your dashboard is empty, click this to upload your existing local data.
            </p>
            <Button onClick={async () => {
              try {
                const { supabase } = await import("@/supabaseClient");

                // Safety Check: See if data already exists to prevent duplication
                const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true });
                if (count && count > 0) {
                  const confirm = window.confirm("It looks like you already have data in the cloud. Uploading again will create duplicates. Are you sure?");
                  if (!confirm) return;
                }


                // 1. Clients
                const clients = JSON.parse(localStorage.getItem('clients') || '[]');
                if (clients.length > 0) {
                  const sanitizedClients = clients.map((c: any) => ({
                    name: c.name,
                    email: c.email || '',
                    company: c.company || '',
                    phone: c.phone || '',
                    address: c.address || '',
                    "totalInvoices": c.totalInvoices || 0,
                    "lastInvoice": c.lastInvoice || ''
                  }));
                  // UPSERT based on 'name' to verify no dupes
                  const { error } = await supabase.from('clients').upsert(sanitizedClients, { onConflict: 'name' });
                  if (error) throw error;
                }

                // 2. Invoices
                const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
                if (invoices.length > 0) {
                  const sanitizedInvoices = invoices.map((inv: any, index: number) => ({
                    "invoiceNumber": inv.invoiceNumber || `INV-OLD-${index + 1}`,
                    "issueDate": inv.issueDate || new Date().toISOString().split('T')[0],
                    "dueDate": inv.dueDate || new Date().toISOString().split('T')[0],
                    "clientName": inv.clientName || 'Unknown Client',
                    "clientId": inv.clientId || null,
                    amount: inv.amount || 0,
                    status: inv.status || 'draft',
                    items: inv.items || [],
                    "paymentDate": inv.paymentDate || null
                  }));
                  // UPSERT based on 'invoiceNumber'
                  const { error } = await supabase.from('invoices').upsert(sanitizedInvoices, { onConflict: 'invoiceNumber' });
                  if (error) throw error;
                }

                // 3. Products
                const products = JSON.parse(localStorage.getItem('products') || '[]');
                if (products.length > 0) {
                  const sanitizedProducts = products.map((p: any) => ({
                    name: p.name,
                    description: p.description || '',
                    price: p.price || 0
                  }));
                  // Use UPSERT if we had a unique name, but products typically don't fail here. 
                  // We'll stick to insert for products or add onConflict if we had a constraint.
                  // Let's assume name is unique for products too.
                  const { error } = await supabase.from('products').upsert(sanitizedProducts, { onConflict: 'name' });
                  if (error) throw error;
                }


                // 4. Settings
                const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const bank = JSON.parse(localStorage.getItem('bankDetails') || '{}');

                const { data } = await supabase.from('settings').select('id').single();
                if (data) {
                  await supabase.from('settings').update({
                    user_profile: profile,
                    bank_details: bank
                  }).eq('id', data.id);
                } else {
                  await supabase.from('settings').insert({
                    user_profile: profile,
                    bank_details: bank
                  });
                }

                toast({
                  title: "Migration Complete",
                  description: "Your local data has been uploaded to Supabase. Refresh the page to see it."
                });

                setTimeout(() => window.location.reload(), 2000);

              } catch (e: any) {
                console.error(e);
                toast({
                  title: "Migration Failed",
                  description: e.message || "Unknown error",
                  variant: "destructive"
                });
              }
            }} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              Upload Local Data to Cloud
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}