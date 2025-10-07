import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Moon, Sun, User, Mail, Building, Phone, Save, Edit, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Inc.",
    phone: "+1 (555) 123-4567",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempDetails, setTempDetails] = useState(userDetails);

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
      description: "Your settings have been updated successfully.",
    });
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Theme Settings */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize your interface theme</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
              <div className="space-y-1">
                <Label htmlFor="theme-toggle" className="text-base font-medium">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  {theme === "dark" ? "Currently using dark theme" : "Currently using light theme"}
                </p>
              </div>
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
              </div>
              {!isEditing && (
                <Button onClick={handleEdit} variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    value={tempDetails.name}
                    onChange={(e) => setTempDetails({ ...tempDetails, name: e.target.value })}
                    className="bg-background"
                  />
                ) : (
                  <p className="text-sm font-medium p-2 rounded-md bg-muted">{userDetails.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={tempDetails.email}
                    onChange={(e) => setTempDetails({ ...tempDetails, email: e.target.value })}
                    className="bg-background"
                  />
                ) : (
                  <p className="text-sm font-medium p-2 rounded-md bg-muted">{userDetails.email}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Manage your company details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  Company Name
                </Label>
                {isEditing ? (
                  <Input
                    value={tempDetails.company}
                    onChange={(e) => setTempDetails({ ...tempDetails, company: e.target.value })}
                    className="bg-background"
                  />
                ) : (
                  <p className="text-sm font-medium p-2 rounded-md bg-muted">{userDetails.company}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={tempDetails.phone}
                    onChange={(e) => setTempDetails({ ...tempDetails, phone: e.target.value })}
                    className="bg-background"
                  />
                ) : (
                  <p className="text-sm font-medium p-2 rounded-md bg-muted">{userDetails.phone}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <>
                <Separator className="my-6" />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
