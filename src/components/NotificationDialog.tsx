import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, DollarSign, Mail } from "lucide-react";
import { format, isWithinInterval, addDays, parseISO } from "date-fns";
import { useData } from "@/contexts/DataContext";
import { supabase } from "@/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDialog({ open, onOpenChange }: NotificationDialogProps) {
  const { invoices, payables, clients } = useData();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const today = new Date();
  const nextWeek = addDays(today, 7); // Changed from 30 to 7 days (1 week)

  // Parse date string to Date object
  const parseDate = (dateStr: string) => {
    try {
      // Handle format like "2025-10-20" or "Oct 20, 2025"
      return parseISO(dateStr);
    } catch {
      return new Date(dateStr);
    }
  };

  // Filter for upcoming pending invoices (within next 7 days OR overdue)
  const upcomingReceivables = invoices.filter(invoice => {
    if (invoice.status === 'paid') return false; // Exclude paid invoices
    try {
      const dueDate = parseDate(invoice.dueDate);
      return isWithinInterval(dueDate, { start: today, end: nextWeek }) || dueDate < today;
    } catch {
      return false;
    }
  }).map(invoice => ({
    id: invoice.id,
    clientName: invoice.clientName,
    amount: invoice.amount,
    dueDate: parseDate(invoice.dueDate),
    status: invoice.status
  }));

  // Filter for upcoming pending payables (within next 7 days OR overdue)
  const upcomingPayables = payables.filter(payable => {
    if (payable.status === 'paid' || payable.amountDue === 0) return false; // Exclude fully paid
    try {
      const dueDate = parseDate(payable.dueDate);
      return isWithinInterval(dueDate, { start: today, end: nextWeek }) || dueDate < today;
    } catch {
      return false;
    }
  }).map(payable => ({
    id: payable.id,
    vendorName: payable.vendorName,
    amount: payable.amountDue,
    dueDate: parseDate(payable.dueDate),
    status: payable.status
  }));

  const isOverdue = (date: Date) => date < today;
  const isDueSoon = (date: Date) => {
    const threeDays = addDays(today, 3);
    return date >= today && date <= threeDays;
  };

  const handleSendAllReminders = async () => {
    setIsSending(true);
    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (const invoice of upcomingReceivables) {
      try {
        // Find client email
        const client = clients.find(c => c.name === invoice.clientName);
        if (!client?.email) {
          failCount++;
          errors.push(`${invoice.clientName}: No email found`);
          continue;
        }

        // Get the full invoice object
        const fullInvoice = invoices.find(inv => inv.id === invoice.id);
        if (!fullInvoice) {
          failCount++;
          continue;
        }

        // Call Supabase Edge Function
        const { error } = await supabase.functions.invoke('send-email', {
          body: {
            clientEmail: client.email,
            invoiceNumber: fullInvoice.id,
            amount: fullInvoice.amount,
            dueDate: format(invoice.dueDate, "MMM dd, yyyy"),
            clientName: invoice.clientName,
          },
        });

        if (error) {
          failCount++;
          errors.push(`${invoice.clientName}: ${error.message}`);
        } else {
          successCount++;
        }
      } catch (error: any) {
        failCount++;
        errors.push(`${invoice.clientName}: ${error.message || 'Unknown error'}`);
      }
    }

    setIsSending(false);

    // Show results
    if (successCount > 0) {
      toast({
        title: "Reminders Sent",
        description: `Successfully sent ${successCount} email reminder(s)${failCount > 0 ? `. ${failCount} failed.` : '.'}`,
      });
    }

    if (failCount > 0 && successCount === 0) {
      toast({
        title: "Failed to Send",
        description: `Could not send any reminders. ${errors[0] || 'Check console for details.'}`,
        variant: "destructive",
      });
    }

    if (errors.length > 0) {
      console.error("Email errors:", errors);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Overdue or due within the next 7 days
          </DialogDescription>
        </DialogHeader>

        {/* Send All Button - Below Header */}
        {upcomingReceivables.length > 0 && (
          <div className="px-6 pb-4">
            <Button
              onClick={handleSendAllReminders}
              disabled={isSending}
              className="w-full gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 backdrop-blur-sm text-primary hover:text-primary transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="h-4 w-4" />
              {isSending ? "Sending..." : "Send All Reminders"}
            </Button>
          </div>
        )}

        <ScrollArea className="flex-1 pr-4 overflow-y-auto" style={{ maxHeight: "calc(85vh - 180px)" }}>
          <div className="space-y-6">
            {/* Receivables Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold text-lg">Customer Payments Due</h3>
                <Badge variant="secondary">{upcomingReceivables.length}</Badge>
              </div>

              {upcomingReceivables.length === 0 ? (
                <p className="text-sm text-muted-foreground pl-7">No upcoming receivables</p>
              ) : (
                <div className="space-y-3 pl-7">
                  {upcomingReceivables.map(item => (
                    <div key={item.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium">{item.clientName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Due: {format(item.dueDate, "MMM dd, yyyy")}
                          </p>
                          {isOverdue(item.dueDate) && (
                            <Badge variant="destructive" className="text-xs">Overdue</Badge>
                          )}
                          {!isOverdue(item.dueDate) && isDueSoon(item.dueDate) && (
                            <Badge variant="default" className="text-xs bg-orange-500">Due Soon</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">₹{item.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payables Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-lg">Your Payments Due</h3>
                <Badge variant="secondary">{upcomingPayables.length}</Badge>
              </div>

              {upcomingPayables.length === 0 ? (
                <p className="text-sm text-muted-foreground pl-7">No upcoming payables</p>
              ) : (
                <div className="space-y-3 pl-7">
                  {upcomingPayables.map(item => (
                    <div key={item.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium">{item.vendorName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Due: {format(item.dueDate, "MMM dd, yyyy")}
                          </p>
                          {isOverdue(item.dueDate) && (
                            <Badge variant="destructive" className="text-xs">Overdue</Badge>
                          )}
                          {!isOverdue(item.dueDate) && isDueSoon(item.dueDate) && (
                            <Badge variant="default" className="text-xs bg-orange-500">Due Soon</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">₹{item.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
