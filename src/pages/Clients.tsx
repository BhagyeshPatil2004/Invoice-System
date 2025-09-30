import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Mail, Phone, Users } from "lucide-react";
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

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);
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

  const handleDeleteConfirm = () => {
    if (selectedClient) {
      setClients(clients.filter(c => c.id !== selectedClient.id));
      toast({
        title: "Client Deleted",
        description: "Client has been successfully removed",
      });
      setDeleteDialogOpen(false);
      setSelectedClient(null);
    }
  };
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>
            Search and manage all your business clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search clients by name, email, or company..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              Filter
            </Button>
          </div>

          {/* Clients Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Invoices</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.company}</div>
                      </div>
                    </TableCell>
                    <TableCell>
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
                    <TableCell>
                      <div className="font-medium">{client.totalInvoices}</div>
                      <div className="text-sm text-muted-foreground">
                        Last: {client.lastInvoice}
                      </div>
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
                ))}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-sm text-muted-foreground">Total Clients</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">0</div>
            <p className="text-sm text-muted-foreground">Active Clients</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">₹0</div>
            <p className="text-sm text-muted-foreground">Total Outstanding</p>
          </CardContent>
        </Card>
      </div>

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