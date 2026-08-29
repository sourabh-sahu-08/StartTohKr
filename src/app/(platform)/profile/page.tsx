"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Building2, Globe, Mail, MapPin, Award, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "Aarav Tech",
    role: session?.user?.role || "STARTUP",
    bio: "Building next-generation AI solutions for agricultural sustainability.",
    location: "Bangalore, India",
    website: "https://aarav.tech",
    email: session?.user?.email || "founder@aarav.tech"
  });

  const handleSave = () => {
    setIsSaving(true);
    // Mock save delay
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="overflow-hidden border-none shadow-md">
        <div className="h-32 bg-primary/10 w-full" />
        <CardContent className="relative pt-0 pb-6 px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 sm:-mt-16 mb-4">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background shadow-sm">
              <AvatarFallback className="text-2xl">{profileData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 mb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold">{profileData.name}</h1>
                {profileData.role === 'STARTUP' && (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
              </div>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {profileData.role}
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto mb-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </div>

          {!isEditing ? (
            <div className="space-y-6 mt-6">
              <p className="text-base">{profileData.bio}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profileData.location}</div>
                <div className="flex items-center gap-1"><Globe className="w-4 h-4" /> <a href={profileData.website} className="hover:underline text-primary">{profileData.website.replace('https://', '')}</a></div>
                <div className="flex items-center gap-1"><Mail className="w-4 h-4" /> {profileData.email}</div>
              </div>

              <div className="flex gap-6 border-t pt-6">
                <div>
                  <span className="font-bold text-lg">142</span>
                  <span className="text-muted-foreground text-sm ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-lg">38</span>
                  <span className="text-muted-foreground text-sm ml-1">Following</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio / Mission</Label>
                <Textarea id="bio" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} rows={3} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={profileData.website} onChange={e => setProfileData({...profileData, website: e.target.value})} />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="passport" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger value="passport" className="data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-6 py-3">Innovation Passport</TabsTrigger>
          <TabsTrigger value="portfolio" className="data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-6 py-3">Portfolio & Pilots</TabsTrigger>
        </TabsList>
        
        <TabsContent value="passport" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Verified Credentials
              </CardTitle>
              <CardDescription>Badges and verifications earned on StartTohKr.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> KYC Verified
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Briefcase className="w-4 h-4" /> Completed 1+ Govt Pilot
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Core Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Artificial Intelligence', 'Machine Learning', 'Computer Vision', 'IoT Sensors', 'Predictive Analytics'].map(tech => (
                  <span key={tech} className="border px-3 py-1 rounded-md text-sm">{tech}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Pilots</CardTitle>
              <CardDescription>Government and industry pilots currently underway.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">Crop Health Monitoring Pilot</h3>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">In Progress</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Partner: Ministry of Agriculture</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">65% Complete</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}