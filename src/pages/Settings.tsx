import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Building, Phone, Save, Edit, X, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useData } from "@/contexts/DataContext";
export default function Settings() {
  const { toast } = useToast();
  const { bankDetails, setBankDetails } = useData();
  
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Inc.",
    phone: "+1 (555) 123-4567"
  });
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
    setIsEditing(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully."
    });
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
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Profile Information</h2>
              <p className="text-sm text-muted-foreground">Update your personal details</p>
            </div>
          </div>
          {!isEditing && <Button onClick={handleEdit} variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </Label>
            {isEditing ? <Input value={tempDetails.name} onChange={e => setTempDetails({
            ...tempDetails,
            name: e.target.value
          })} className="bg-background" /> : <p className="text-sm font-medium p-3 rounded-md bg-card border">{userDetails.name}</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Address
            </Label>
            {isEditing ? <Input type="email" value={tempDetails.email} onChange={e => setTempDetails({
            ...tempDetails,
            email: e.target.value
          })} className="bg-background" /> : <p className="text-sm font-medium p-3 rounded-md bg-card border">{userDetails.email}</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <Building className="h-4 w-4 text-muted-foreground" />
              Company Name
            </Label>
            {isEditing ? <Input value={tempDetails.company} onChange={e => setTempDetails({
            ...tempDetails,
            company: e.target.value
          })} className="bg-background" /> : <p className="text-sm font-medium p-3 rounded-md bg-card border">{userDetails.company}</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone Number
            </Label>
            {isEditing ? <Input type="tel" value={tempDetails.phone} onChange={e => setTempDetails({
            ...tempDetails,
            phone: e.target.value
          })} className="bg-background" /> : <p className="text-sm font-medium p-3 rounded-md bg-card border">{userDetails.phone}</p>}
          </div>
        </div>

        {isEditing && <>
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
          </>}
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Bank Details</h2>
              <p className="text-sm text-muted-foreground">These details will be automatically added to all invoices</p>
            </div>
          </div>
          {!isBankEditing && <Button onClick={handleBankEdit} variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-base">Bank Name</Label>
            {isBankEditing ? <Input 
              value={tempBankDetails.bankName} 
              onChange={e => setTempBankDetails({
                ...tempBankDetails,
                bankName: e.target.value
              })} 
              className="bg-background" 
              placeholder="e.g., HDFC Bank"
            /> : <p className="text-sm font-medium p-3 rounded-md bg-card border">{bankDetails.bankName || "Not set"}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-base">Account Name</Label>
            {isBankEditing ? <Input 
              value={tempBankDetails.accountName} 
              onChange={e => setTempBankDetails({
                ...tempBankDetails,
                accountName: e.target.value
              })} 
              className="bg-background"
              placeholder="e.g., John Doe"
            /> : <p className="text-sm font-medium p-3 rounded-md bg-card border">{bankDetails.accountName || "Not set"}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-base">Account Number</Label>
            {isBankEditing ? <Input 
              value={tempBankDetails.accountNumber} 
              onChange={e => setTempBankDetails({
                ...tempBankDetails,
                accountNumber: e.target.value
              })} 
              className="bg-background"
              placeholder="e.g., 1234567890"
            /> : <p className="text-sm font-medium p-3 rounded-md bg-card border">{bankDetails.accountNumber || "Not set"}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-base">IFSC Code</Label>
            {isBankEditing ? <Input 
              value={tempBankDetails.ifscCode} 
              onChange={e => setTempBankDetails({
                ...tempBankDetails,
                ifscCode: e.target.value
              })} 
              className="bg-background"
              placeholder="e.g., HDFC0001234"
            /> : <p className="text-sm font-medium p-3 rounded-md bg-card border">{bankDetails.ifscCode || "Not set"}</p>}
          </div>
        </div>

        {isBankEditing && <>
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
          </>}
      </div>
    </div>;
}