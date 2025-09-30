import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreate: (client: any) => void;
  onClientUpdate?: (client: any) => void;
  editClient?: any;
}

export default function ClientDialog({ open, onOpenChange, onClientCreate, onClientUpdate, editClient }: ClientDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");
  const { toast } = useToast();

  const isEditMode = !!editClient;

  useEffect(() => {
    if (editClient) {
      setName(editClient.name || "");
      setEmail(editClient.email || "");
      setPhone(editClient.phone || "");
      setCompany(editClient.company || "");
      setAddress(editClient.address || "");
      setGstin(editClient.gstin || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setAddress("");
      setGstin("");
    }
  }, [editClient, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode && editClient) {
      const updatedClient = {
        ...editClient,
        name,
        email,
        phone,
        company,
        address,
        gstin,
      };

      onClientUpdate?.(updatedClient);
      
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
    } else {
      const newClient = {
        id: `CLT-${Date.now()}`,
        name,
        email,
        phone,
        company,
        address,
        gstin,
        status: "active",
        totalAmount: 0,
        outstanding: 0,
        totalInvoices: 0,
        lastInvoice: "N/A",
        createdAt: new Date().toISOString().split('T')[0],
      };

      onClientCreate(newClient);
      
      toast({
        title: "Success",
        description: "Client created successfully",
      });
    }

    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setAddress("");
    setGstin("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Client" : "Create New Client"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update client information" : "Add a new client to your system"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter client name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstin">GSTIN</Label>
            <Input
              id="gstin"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="GST Identification Number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter client address"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditMode ? "Update Client" : "Create Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
