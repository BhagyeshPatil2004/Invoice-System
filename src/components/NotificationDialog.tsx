import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, DollarSign } from "lucide-react";
import { format, isWithinInterval, addDays } from "date-fns";

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data - replace with actual data from your state management
const mockReceivables = [
  { id: 1, clientName: "Acme Corp", amount: 5000, dueDate: new Date(2025, 9, 20), status: "pending" },
  { id: 2, clientName: "Tech Solutions", amount: 3500, dueDate: new Date(2025, 9, 25), status: "pending" },
  { id: 3, clientName: "Design Studio", amount: 2000, dueDate: new Date(2025, 9, 30), status: "pending" },
];

const mockPayables = [
  { id: 1, vendorName: "Office Supplies Co", amount: 1500, dueDate: new Date(2025, 9, 22), status: "pending" },
  { id: 2, vendorName: "Cloud Services", amount: 800, dueDate: new Date(2025, 9, 28), status: "pending" },
];

export function NotificationDialog({ open, onOpenChange }: NotificationDialogProps) {
  const today = new Date();
  const next30Days = addDays(today, 30);

  // Filter for upcoming items (within next 30 days)
  const upcomingReceivables = mockReceivables.filter(item => 
    isWithinInterval(item.dueDate, { start: today, end: next30Days })
  );

  const upcomingPayables = mockPayables.filter(item => 
    isWithinInterval(item.dueDate, { start: today, end: next30Days })
  );

  const isOverdue = (date: Date) => date < today;
  const isDueSoon = (date: Date) => {
    const threeDays = addDays(today, 3);
    return date >= today && date <= threeDays;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Upcoming due dates for your receivables and payables
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
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
