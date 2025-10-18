import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface QuotationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuotationCreate: (quotation: any) => void;
}

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  taxType: 'none' | 'gst' | 'igst';
  taxRate: number;
}

export default function QuotationDialog({ open, onOpenChange, onQuotationCreate }: QuotationDialogProps) {
  const [clientName, setClientName] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, rate: 0, taxType: 'none', taxRate: 0 }
  ]);
  const { toast } = useToast();

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, rate: 0, taxType: 'none', taxRate: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.rate;
      const tax = item.taxType !== 'none' ? (itemTotal * item.taxRate) / 100 : 0;
      return sum + itemTotal + tax;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !validUntil) {
      toast({
        title: "Validation Error",
        description: "Client name and valid until date are required",
        variant: "destructive",
      });
      return;
    }

    const newQuotation = {
      id: `QUO-${Date.now()}`,
      clientName,
      description: "Quotation",
      amount: calculateTotal(),
      status: "draft",
      issueDate,
      validUntil,
      lineItems,
    };

    onQuotationCreate(newQuotation);
    
    toast({
      title: "Success",
      description: "Quotation created successfully",
    });

    // Reset form
    setClientName("");
    setIssueDate(new Date().toISOString().split('T')[0]);
    setValidUntil("");
    setLineItems([{ description: "", quantity: 1, rate: 0, taxType: 'none', taxRate: 0 }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Quotation</DialogTitle>
          <DialogDescription>Create a quotation for your client</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until *</Label>
              <Input
                id="validUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Line Items</Label>
              <Button type="button" size="sm" onClick={addLineItem}>
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
            
            {lineItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-4">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value))}
                      min="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Rate (₹)</Label>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value))}
                      min="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Tax Type</Label>
                    <Select
                      value={item.taxType}
                      onValueChange={(value: 'none' | 'gst' | 'igst') => {
                        updateLineItem(index, 'taxType', value);
                        if (value === 'none') {
                          updateLineItem(index, 'taxRate', 0);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Tax</SelectItem>
                        <SelectItem value="gst">GST</SelectItem>
                        <SelectItem value="igst">IGST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {item.taxType !== 'none' && (
                    <div className="col-span-1">
                      <Label>Tax Rate</Label>
                      <Select
                        value={item.taxRate?.toString() || "0"}
                        onValueChange={(value) => updateLineItem(index, 'taxRate', parseFloat(value) || 0)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="12">12%</SelectItem>
                          <SelectItem value="18">18%</SelectItem>
                          <SelectItem value="28">28%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(index)}
                      disabled={lineItems.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-lg font-semibold">
              Total: ₹{calculateTotal().toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Quotation</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
