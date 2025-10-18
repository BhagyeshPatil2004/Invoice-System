import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, DollarSign } from "lucide-react";
import { format, isWithinInterval, addDays, parseISO } from "date-fns";
import { useData } from "@/contexts/DataContext";

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDialog({ open, onOpenChange }: NotificationDialogProps) {
  const { invoices, payables } = useData();
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

  // Filter for upcoming pending invoices (within next 7 days)
  const upcomingReceivables = invoices.filter(invoice => {
    if (invoice.status === 'paid') return false; // Exclude paid invoices
    try {
      const dueDate = parseDate(invoice.dueDate);
      return isWithinInterval(dueDate, { start: today, end: nextWeek });
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

  // Filter for upcoming pending payables (within next 7 days)
  const upcomingPayables = payables.filter(payable => {
    if (payable.status === 'paid' || payable.amountDue === 0) return false; // Exclude fully paid
    try {
      const dueDate = parseDate(payable.dueDate);
      return isWithinInterval(dueDate, { start: today, end: nextWeek });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Due dates within the next 7 days
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 overflow-y-auto"  style={{ maxHeight: "calc(85vh - 120px)" }}>
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
