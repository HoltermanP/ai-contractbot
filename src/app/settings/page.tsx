"use client";

import { useState } from "react";
// import { useSession } from "next-auth/react"; // Uitgeschakeld
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Save,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
} from "lucide-react";

export default function SettingsPage() {
  // Mock session data
  const session = {
    user: {
      name: "Demo Gebruiker",
      email: "demo@contractbot.nl",
      image: undefined as string | undefined,
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({
    analytics: true,
    errorReporting: true,
    dataSharing: false,
  });

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : session?.user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Instellingen</h1>
          <p className="text-slate-400">
            Beheer je account, voorkeuren en privacy instellingen
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-400" />
                  Profiel Instellingen
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Update je persoonlijke informatie en profielfoto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 border-4 border-white/10">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{session?.user?.name || "Gebruiker"}</h3>
                    <p className="text-slate-400">{session?.user?.email}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Foto wijzigen
                      </Button>
                      <Button variant="ghost" size="sm">
                        Verwijderen
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Personal Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">Voornaam</Label>
                    <Input
                      id="firstName"
                      defaultValue={session?.user?.name?.split(" ")[0] || ""}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">Achternaam</Label>
                    <Input
                      id="lastName"
                      defaultValue={session?.user?.name?.split(" ").slice(1).join(" ") || ""}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-white">E-mailadres</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={session?.user?.email || ""}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Vertel iets over jezelf..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 min-h-20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="h-5 w-5 text-green-400" />
                  Beveiliging
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Beheer je wachtwoord en beveiligingsinstellingen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-white">Huidig wachtwoord</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white">Nieuw wachtwoord</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Bevestig wachtwoord</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Tweestaps authenticatie</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm text-white">2FA inschakelen</div>
                      <div className="text-xs text-slate-400">Extra beveiliging voor je account</div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-400" />
                  Voorkeuren
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Pas de applicatie aan naar jouw wensen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Taal & Regio</h4>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-white">Taal</Label>
                    <select
                      id="language"
                      className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white"
                      defaultValue="nl"
                    >
                      <option value="nl">Nederlands</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Interface</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm text-white">Donkere modus</div>
                        <div className="text-xs text-slate-400">Altijd ingeschakeld voor optimaal gebruik</div>
                      </div>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                        Actief
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm text-white">Compacte weergave</div>
                        <div className="text-xs text-slate-400">Minder witruimte in de interface</div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-400" />
                  Notificaties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-white">E-mail notificaties</span>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-white">Push notificaties</span>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, push: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-white">Marketing updates</span>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, marketing: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm text-white">Analytics</div>
                    <div className="text-xs text-slate-400">Gebruik gegevens voor verbetering</div>
                  </div>
                  <Switch
                    checked={privacy.analytics}
                    onCheckedChange={(checked) =>
                      setPrivacy(prev => ({ ...prev, analytics: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm text-white">Fout rapportage</div>
                    <div className="text-xs text-slate-400">Automatische bug rapporten</div>
                  </div>
                  <Switch
                    checked={privacy.errorReporting}
                    onCheckedChange={(checked) =>
                      setPrivacy(prev => ({ ...prev, errorReporting: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm text-white">Gegevens delen</div>
                    <div className="text-xs text-slate-400">Anonieme gegevens met partners</div>
                  </div>
                  <Switch
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) =>
                      setPrivacy(prev => ({ ...prev, dataSharing: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                  <Save className="h-4 w-4 mr-2" />
                  Wijzigingen Opslaan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
