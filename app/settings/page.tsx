'use client';

import { useAuth } from '@/components/auth-provider';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Github,
    Moon,
    Sun,
    Monitor,
    Mail,
    Trash2,
    Download,
    LogOut,
    ExternalLink,
    CheckCircle,
    AlertTriangle,
    Eye,
    EyeOff
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { signOut } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const { user, isAuthenticated } = useAuth();
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Settings state
    const [settings, setSettings] = useState({
        // Notifications
        emailNotifications: true,
        resumeUpdates: true,
        atsAlerts: true,
        marketingEmails: false,

        // Privacy
        profileVisible: true,
        showGithubStats: true,
        shareAnalytics: false,

        // Preferences
        autoSave: true,
        showTips: true,
        compactMode: false,
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        toast({
            title: "Setting Updated",
            description: "Your preferences have been saved.",
        });
    };

    const handleExportData = () => {
        toast({
            title: "Export Started",
            description: "Your data export is being prepared. You'll receive an email when it's ready.",
        });
    };

    const handleDeleteAccount = () => {
        if (deleteConfirmText === 'DELETE') {
            toast({
                title: "Account Deletion Requested",
                description: "Your account deletion request has been submitted. This process may take up to 30 days.",
                variant: "destructive",
            });
            setShowDeleteConfirm(false);
            setDeleteConfirmText('');
        }
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background py-8 mt-16">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Settings className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Manage your account settings, preferences, and privacy options
                        </p>
                    </div>

                    {/* Settings Tabs */}
                    <Tabs defaultValue="appearance" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                            <TabsTrigger value="appearance" className="flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                <span className="hidden sm:inline">Appearance</span>
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                <span className="hidden sm:inline">Notifications</span>
                            </TabsTrigger>
                            <TabsTrigger value="privacy" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <span className="hidden sm:inline">Privacy</span>
                            </TabsTrigger>
                            <TabsTrigger value="account" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">Account</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Appearance Tab */}
                        <TabsContent value="appearance" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="h-5 w-5 text-primary" />
                                        Theme Settings
                                    </CardTitle>
                                    <CardDescription>
                                        Customize how Resumify looks on your device
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <button
                                            onClick={() => setTheme('light')}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === 'light'
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <Sun className="h-8 w-8 text-yellow-500" />
                                            <span className="font-medium">Light</span>
                                            {theme === 'light' && <CheckCircle className="h-4 w-4 text-primary" />}
                                        </button>

                                        <button
                                            onClick={() => setTheme('dark')}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === 'dark'
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <Moon className="h-8 w-8 text-indigo-400" />
                                            <span className="font-medium">Dark</span>
                                            {theme === 'dark' && <CheckCircle className="h-4 w-4 text-primary" />}
                                        </button>

                                        <button
                                            onClick={() => setTheme('system')}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === 'system'
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <Monitor className="h-8 w-8 text-muted-foreground" />
                                            <span className="font-medium">System</span>
                                            {theme === 'system' && <CheckCircle className="h-4 w-4 text-primary" />}
                                        </button>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Compact Mode</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Use a more compact UI with reduced spacing
                                                </p>
                                            </div>
                                            <Switch
                                                checked={settings.compactMode}
                                                onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Show Tips</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Display helpful tips and suggestions throughout the app
                                                </p>
                                            </div>
                                            <Switch
                                                checked={settings.showTips}
                                                onCheckedChange={(checked) => handleSettingChange('showTips', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Auto-Save</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Automatically save your work as you make changes
                                                </p>
                                            </div>
                                            <Switch
                                                checked={settings.autoSave}
                                                onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Notifications Tab */}
                        <TabsContent value="notifications" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5 text-primary" />
                                        Email Notifications
                                    </CardTitle>
                                    <CardDescription>
                                        Manage which emails you receive from Resumify
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Email Notifications</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receive important account notifications via email
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.emailNotifications}
                                            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Resume Updates</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Get notified when your resumes are viewed or downloaded
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.resumeUpdates}
                                            onCheckedChange={(checked) => handleSettingChange('resumeUpdates', checked)}
                                            disabled={!settings.emailNotifications}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">ATS Score Alerts</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receive tips to improve your ATS score
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.atsAlerts}
                                            onCheckedChange={(checked) => handleSettingChange('atsAlerts', checked)}
                                            disabled={!settings.emailNotifications}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Marketing Emails</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receive tips, product updates, and promotions
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.marketingEmails}
                                            onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                                            disabled={!settings.emailNotifications}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Privacy Tab */}
                        <TabsContent value="privacy" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-primary" />
                                        Privacy Settings
                                    </CardTitle>
                                    <CardDescription>
                                        Control your privacy and data sharing preferences
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base flex items-center gap-2">
                                                Profile Visibility
                                                {settings.profileVisible ? (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Allow others to view your public portfolio
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.profileVisible}
                                            onCheckedChange={(checked) => handleSettingChange('profileVisible', checked)}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Show GitHub Stats</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Display your GitHub statistics on your portfolio
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.showGithubStats}
                                            onCheckedChange={(checked) => handleSettingChange('showGithubStats', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Share Analytics</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Help improve Resumify by sharing anonymous usage data
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.shareAnalytics}
                                            onCheckedChange={(checked) => handleSettingChange('shareAnalytics', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Download className="h-5 w-5 text-primary" />
                                        Data Export
                                    </CardTitle>
                                    <CardDescription>
                                        Download a copy of all your Resumify data
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Request a copy of your data including resumes, settings, and account information.
                                        You'll receive an email with a download link when your export is ready.
                                    </p>
                                    <Button variant="outline" onClick={handleExportData}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export My Data
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Account Tab */}
                        <TabsContent value="account" className="space-y-6">
                            {/* Connected Accounts */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Github className="h-5 w-5 text-primary" />
                                        Connected Accounts
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your connected third-party accounts
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg">
                                                <Github className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">GitHub</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {user?.email || 'Connected'}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-green-600 border-green-600">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Connected
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Google</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Not connected
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Connect
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Sign Out */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <LogOut className="h-5 w-5 text-primary" />
                                        Session
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your current session
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" onClick={handleSignOut}>
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Danger Zone */}
                            <Card className="border-destructive/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-destructive">
                                        <AlertTriangle className="h-5 w-5" />
                                        Danger Zone
                                    </CardTitle>
                                    <CardDescription>
                                        Irreversible and destructive actions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {!showDeleteConfirm ? (
                                        <Button
                                            variant="destructive"
                                            onClick={() => setShowDeleteConfirm(true)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Account
                                        </Button>
                                    ) : (
                                        <div className="space-y-4 p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                                            <p className="text-sm text-destructive font-medium">
                                                Are you sure you want to delete your account? This action is irreversible.
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Type <strong>DELETE</strong> to confirm:
                                            </p>
                                            <Input
                                                value={deleteConfirmText}
                                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                                placeholder="Type DELETE to confirm"
                                                className="max-w-xs"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleDeleteAccount}
                                                    disabled={deleteConfirmText !== 'DELETE'}
                                                >
                                                    Confirm Delete
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowDeleteConfirm(false);
                                                        setDeleteConfirmText('');
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </ProtectedRoute>
    );
}
