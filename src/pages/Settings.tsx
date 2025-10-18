import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Building, Phone, Save, Edit, X, Palette, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useInvoiceSettings, InvoiceTheme } from "@/contexts/InvoiceSettingsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export default function Settings() {
  const { toast } = useToast();
  const { settings, updateSettings } = useInvoiceSettings();
  
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Inc.",
    phone: "+1 (555) 123-4567"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempDetails, setTempDetails] = useState(userDetails);
  
  const [tempInvoiceSettings, setTempInvoiceSettings] = useState(settings);
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
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

  const handleInvoiceEdit = () => {
    setTempInvoiceSettings(settings);
    setIsEditingInvoice(true);
  };

  const handleInvoiceCancel = () => {
    setTempInvoiceSettings(settings);
    setIsEditingInvoice(false);
  };

  const handleInvoiceSave = () => {
    updateSettings(tempInvoiceSettings);
    setIsEditingInvoice(false);
    toast({
      title: "Invoice Template Updated",
      description: "Your invoice template preferences have been saved."
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

      {/* Invoice Template Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Invoice Template Settings</CardTitle>
                <CardDescription>Customize your invoice appearance and branding</CardDescription>
              </div>
            </div>
            {!isEditingInvoice && (
              <Button onClick={handleInvoiceEdit} variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base">
                <Building className="h-4 w-4 text-muted-foreground" />
                Company Name
              </Label>
              {isEditingInvoice ? (
                <Input
                  value={tempInvoiceSettings.companyName}
                  onChange={(e) => setTempInvoiceSettings({ ...tempInvoiceSettings, companyName: e.target.value })}
                  className="bg-background"
                />
              ) : (
                <p className="text-sm font-medium p-3 rounded-md bg-card border">{settings.companyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4 text-muted-foreground" />
                Invoice Theme
              </Label>
              {isEditingInvoice ? (
                <Select
                  value={tempInvoiceSettings.theme}
                  onValueChange={(value: InvoiceTheme) => setTempInvoiceSettings({ ...tempInvoiceSettings, theme: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm font-medium p-3 rounded-md bg-card border capitalize">{settings.theme}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4 text-muted-foreground" />
                Primary Color
              </Label>
              {isEditingInvoice ? (
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={tempInvoiceSettings.primaryColor}
                    onChange={(e) => setTempInvoiceSettings({ ...tempInvoiceSettings, primaryColor: e.target.value })}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    value={tempInvoiceSettings.primaryColor}
                    onChange={(e) => setTempInvoiceSettings({ ...tempInvoiceSettings, primaryColor: e.target.value })}
                    className="bg-background"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-md bg-card border">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: settings.primaryColor }}
                  ></div>
                  <span className="text-sm font-medium">{settings.primaryColor}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4 text-muted-foreground" />
                Accent Color
              </Label>
              {isEditingInvoice ? (
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={tempInvoiceSettings.accentColor}
                    onChange={(e) => setTempInvoiceSettings({ ...tempInvoiceSettings, accentColor: e.target.value })}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    value={tempInvoiceSettings.accentColor}
                    onChange={(e) => setTempInvoiceSettings({ ...tempInvoiceSettings, accentColor: e.target.value })}
                    className="bg-background"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-md bg-card border">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: settings.accentColor }}
                  ></div>
                  <span className="text-sm font-medium">{settings.accentColor}</span>
                </div>
              )}
            </div>
          </div>

          {/* Theme Preview */}
          <div className="space-y-2">
            <Label className="text-base">Theme Preview</Label>
            <div className="grid grid-cols-3 gap-4">
              {(['classic', 'modern', 'minimal'] as InvoiceTheme[]).map((theme) => (
                <div
                  key={theme}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    (isEditingInvoice ? tempInvoiceSettings.theme : settings.theme) === theme
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => isEditingInvoice && setTempInvoiceSettings({ ...tempInvoiceSettings, theme })}
                >
                  <div className="aspect-[3/4] bg-muted rounded flex items-center justify-center mb-2">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-center capitalize">{theme}</p>
                </div>
              ))}
            </div>
          </div>

          {isEditingInvoice && (
            <>
              <Separator />
              <div className="flex justify-end gap-2">
                <Button onClick={handleInvoiceCancel} variant="outline" className="gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleInvoiceSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Template
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>;
}