import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Mail, Phone, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

// Mock data for demonstration
const clients = [
  {
    id: 1,
    name: "Acme Corporation",
    email: "billing@acme.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
    totalInvoices: 12,
    totalAmount: 25600,
    outstanding: 4500,
    status: "active",
    lastInvoice: "2024-01-15"
  },
  {
    id: 2,
    name: "TechStart Inc",
    email: "finance@techstart.io", 
    phone: "+1 (555) 987-6543",
    company: "TechStart Inc",
    totalInvoices: 8,
    totalAmount: 18900,
    outstanding: 0,
    status: "active",
    lastInvoice: "2024-01-10"
  },
  {
    id: 3,
    name: "Digital Agency Pro",
    email: "accounts@digitalagency.com",
    phone: "+1 (555) 456-7890",
    company: "Digital Agency",
    totalInvoices: 15,
    totalAmount: 42300,
    outstanding: 8750,
    status: "active",
    lastInvoice: "2024-01-18"
  },
  {
    id: 4,
    name: "Creative Studio Ltd",
    email: "billing@creative.studio",
    phone: "+1 (555) 321-0987",
    company: "Creative Studio",
    totalInvoices: 5,
    totalAmount: 12400,
    outstanding: 0,
    status: "inactive",
    lastInvoice: "2023-12-20"
  }
];

const getStatusBadge = (status: string) => {
  return status === "active" 
    ? "bg-success/10 text-success border-success/20"
    : "bg-muted text-muted-foreground border-border";
};

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your client relationships and contact information
          </p>
        </div>
        <Button className="hover-scale">
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
                  <TableHead className="font-semibold">Total Amount</TableHead>
                  <TableHead className="font-semibold">Outstanding</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
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
                    <TableCell>
                      <div className="font-medium text-foreground">
                        ${client.totalAmount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${
                        client.outstanding > 0 ? 'text-warning' : 'text-success'
                      }`}>
                        ${client.outstanding.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(client.status)}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-danger">
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
            <div className="text-2xl font-bold text-foreground">{clients.length}</div>
            <p className="text-sm text-muted-foreground">Total Clients</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              {clients.filter(c => c.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active Clients</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              ${clients.reduce((sum, client) => sum + client.outstanding, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Outstanding</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}