import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Mail, Phone, Users, Activity } from "lucide-react";
import ClientDialog from "@/components/ClientDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { subMonths, format, startOfMonth, endOfMonth, isBefore } from "date-fns";

// Helper to calculate score for a specific historical date
const calculateHistoricalScore = (clientName: string, invoices: any[], referenceDate: Date) => {
  // Normalize names for comparison
  const normalizedClientName = clientName.toLowerCase().trim();

  // Only consider invoices issued ON or BEFORE the reference date
  const clientInvoices = invoices.filter(inv => {
    const isMatch = inv.clientName?.toLowerCase().trim() === normalizedClientName || inv.clientId === clientName;
    const issuedBeforeRef = new Date(inv.issueDate) <= referenceDate;
    return isMatch && issuedBeforeRef;
  });

  if (clientInvoices.length === 0) return 10;

  let score = 10;

  // 1. Penalties for overdue invoices (relative to referenceDate)
  clientInvoices.forEach(inv => {
    const dueDate = new Date(inv.dueDate);
    const isPendingAtRefDate = (inv.status?.toLowerCase() === 'pending') || (inv.paymentDate && new Date(inv.paymentDate) > referenceDate);
    const isOverdueAtRefDate = isPendingAtRefDate && dueDate < referenceDate;

    if (isOverdueAtRefDate) {
      const daysOverdue = Math.floor((referenceDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysOverdue > 30) score -= 4;
      else if (daysOverdue > 7) score -= 2;
      else score -= 1;
    }
  });

  // 2. Penalties for historical late payments (paid before referenceDate)
  const paidInvoices = clientInvoices
    .filter(inv => inv.status?.toLowerCase() === 'paid' && inv.paymentDate && new Date(inv.paymentDate) <= referenceDate)
    .slice(0, 5); // Take recent ones

  paidInvoices.forEach(inv => {
    const dueDate = new Date(inv.dueDate);
    const paymentDate = new Date(inv.paymentDate);
    const dueDateBuffer = new Date(dueDate);
    dueDateBuffer.setDate(dueDateBuffer.getDate() + 1);

    if (paymentDate > dueDateBuffer) {
      const daysLate = Math.floor((paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLate > 7) score -= 1;
      else score -= 0.5;
    }
  });

  return Math.max(1, Math.min(10, score));
};

const HistoryGraph = ({ clientName, invoices }: { clientName: string, invoices: any[] }) => {
  const data = [];
  const today = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = subMonths(today, i);
    // Calculate score as of the END of that month
    const refDate = i === 0 ? today : endOfMonth(date);
    const score = calculateHistoricalScore(clientName, invoices, refDate);

    data.push({
      name: format(date, 'MMM'),
      score: score,
      date: refDate.toISOString()
    });
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 10]}
          hide
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
          itemStyle={{ color: "#fff" }}
          labelStyle={{ display: "none" }}
          formatter={(value: number) => [`${value}/10`, "Health Score"]}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: "#10b981", strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default function Clients() {
  const { invoices, clients, setClients } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editClient, setEditClient] = useState<any>(null);
  const { toast } = useToast();

  const handleClientCreate = (newClient: any) => {
    setClients([...clients, newClient]);
  };

  const handleClientUpdate = (updatedClient: any) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    setEditClient(null);
  };

  const handleViewDetails = (client: any) => {
    setSelectedClient(client);
    setViewDetailsOpen(true);
  };

  const handleEditClient = (client: any) => {
    setEditClient(client);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (client: any) => {
    setSelectedClient(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedClient) {
      // Delete from Supabase
      const { error } = await supabase.from('clients').delete().eq('id', selectedClient.id);

      if (error) {
        toast({
          title: "Delete Failed",
          description: "Could not delete client from database.",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setClients(clients.filter(c => c.id !== selectedClient.id));
      toast({
        title: "Client Deleted",
        description: "Client has been successfully removed",
      });
      setDeleteDialogOpen(false);
      setSelectedClient(null);
    }
  };

  const calculateHealthScore = (clientName: string) => {
    // Normalize names for comparison
    const normalizedClientName = clientName.toLowerCase().trim();

    const clientInvoices = invoices.filter(inv =>
      inv.clientName?.toLowerCase().trim() === normalizedClientName ||
      inv.clientId === clientName // Fallback to ID if available
    );

    if (clientInvoices.length === 0) return 10; // New client starts perfect

    let score = 10;
    const now = new Date();

    // 1. Penalties for currently overdue invoices
    clientInvoices.forEach(inv => {
      const dueDate = new Date(inv.dueDate);
      // Case insensitive status check
      const isPending = inv.status?.toLowerCase() === 'pending';
      const isOverdue = isPending && dueDate < now;

      if (isOverdue) {
        const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysOverdue > 30) score -= 4; // Heavy penalty for very late
        else if (daysOverdue > 7) score -= 2; // Medium penalty
        else score -= 1; // Light penalty
      }
    });

    // 2. Penalties for historical late payments (Last 5 paid invoices)
    const paidInvoices = clientInvoices
      .filter(inv => inv.status?.toLowerCase() === 'paid' && inv.paymentDate)
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
      .slice(0, 5);

    paidInvoices.forEach(inv => {
      const dueDate = new Date(inv.dueDate);
      const paymentDate = new Date(inv.paymentDate);

      // Add buffer of 1 day for payment processing
      const dueDateBuffer = new Date(dueDate);
      dueDateBuffer.setDate(dueDateBuffer.getDate() + 1);

      if (paymentDate > dueDateBuffer) {
        const daysLate = Math.floor((paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLate > 7) score -= 1; // Historical penalty
        else score -= 0.5; // Minor historical penalty
      }
    });

    return Math.max(1, Math.min(10, score));
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-success/10 text-success hover:bg-success/20";
    if (score >= 5) return "bg-warning/10 text-warning hover:bg-warning/20";
    return "bg-destructive/10 text-destructive hover:bg-destructive/20";
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to count total invoices for a client (case-insensitive)
  const getClientInvoicesCount = (clientName: string) => {
    const normalizedName = clientName.toLowerCase().trim();
    return invoices.filter(inv =>
      inv.clientName?.toLowerCase().trim() === normalizedName
    ).length;
  };

  // Helper to get last invoice date
  const getLastInvoiceDate = (clientName: string) => {
    const normalizedName = clientName.toLowerCase().trim();
    const clientInvoices = invoices.filter(inv =>
      inv.clientName?.toLowerCase().trim() === normalizedName
    ).sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    return clientInvoices.length > 0 ? clientInvoices[0].issueDate : "N/A";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <ClientDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditClient(null);
        }}
        onClientCreate={handleClientCreate}
        onClientUpdate={handleClientUpdate}
        editClient={editClient}
      />
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your client relationships and contact information
          </p>
        </div>
        <Button className="hover-scale" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="glass-panel border-0 bg-transparent">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Client Directory</CardTitle>
          <CardDescription className="text-gray-400">
            Search and manage all your business clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search clients by name, email, or company..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Total Clients: <span className="font-semibold text-foreground">{clients.length}</span>
            </div>
          </div>

          {/* Clients Table */}
          <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold whitespace-nowrap">Client</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">Contact</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">Invoices</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">Health Score</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => {
                  const score = calculateHealthScore(client.name);
                  return (
                    <TableRow key={client.id} className="hover:bg-white/5 transition-colors border-white/5">
                      <TableCell className="whitespace-nowrap">
                        <div>
                          <div className="font-medium text-foreground">{client.name}</div>
                          <div className="text-sm text-muted-foreground">{client.company}</div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-foreground">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{client.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="font-medium">{getClientInvoicesCount(client.name)}</div>
                        <div className="text-sm text-muted-foreground">
                          Last: {getLastInvoiceDate(client.name)}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge className={`${getScoreColor(score)} border-0`}>
                          <Activity className="w-3 h-3 mr-1" />
                          {score}/10
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewDetails(client)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClient(client)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClick(client)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No clients found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>


      {/* View Details Dialog */}
      <AlertDialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Client Details</AlertDialogTitle>
            <AlertDialogDescription>
              Complete information about {selectedClient?.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedClient && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client Name</p>
                <p className="text-base text-foreground">{selectedClient.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company</p>
                <p className="text-base text-foreground">{selectedClient.company || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base text-foreground">{selectedClient.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-base text-foreground">{selectedClient.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">GSTIN</p>
                <p className="text-base text-foreground">{selectedClient.gstin || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                <Badge className={`${getScoreColor(calculateHealthScore(selectedClient.name))} border-0 mt-1`}>
                  {calculateHealthScore(selectedClient.name)}/10
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                <p className="text-base text-foreground">{selectedClient.totalInvoices}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-base text-foreground">₹{selectedClient.totalAmount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                <p className="text-base text-warning">₹{selectedClient.outstanding?.toLocaleString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-base text-foreground">{selectedClient.address || "N/A"}</p>
              </div>

              <div className="col-span-2 mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Health Score Trend (Last 6 Months)</p>
                <div className="h-[200px] w-full bg-card/50 rounded-lg p-2 border border-border/50">
                  <HistoryGraph clientName={selectedClient.name} invoices={invoices} />
                </div>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedClient?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}