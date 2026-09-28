"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Building2, Globe, Mail, MapPin, Award, CheckCircle2, Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getCurrentProfile, updateProfile } from "@/server/actions/profile";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  
  const [profileData, setProfileData] = useState({
    name: "", role: "STARTUP", bio: "", location: "", website: "", email: "", industry: ""
  });

  const loadProfile = async () => {
    try {
      const p = await getCurrentProfile();
      setCurrentProfile(p);
      if (p) {
        setProfileData({
          name: p.name || "",
          role: p.role || "STARTUP",
          bio: p.bio || p.profile?.bio || "",
          location: p.location || p.profile?.location || "",
          website: p.profile?.website || "",
          email: p.email || "",
          industry: p.profile?.industry || ""
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      loadProfile();
    }
  }, [session?.user?.id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        industry: profileData.industry
      });
      await loadProfile();
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentProfile) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Header */}
      <Card className="overflow-hidden border-none shadow-md">
        <div className="h-32 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <CardContent className="relative pt-0">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <Avatar className="w-24 h-24 border-4 border-background shadow-sm">
              <AvatarImage src={currentProfile.image || ""} />
              <AvatarFallback className="text-2xl">{currentProfile.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(false)} variant="ghost">Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {!isEditing ? (
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {currentProfile.name}
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </h1>
                <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{currentProfile.role}</Badge>
                  {currentProfile.profile?.industry && <span>• {currentProfile.profile.industry}</span>}
                </p>
                <p className="mt-4 max-w-2xl text-foreground/90 leading-relaxed">
                  {currentProfile.bio || currentProfile.profile?.bio || "No bio added yet."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 max-w-2xl">
                <div className="grid gap-2">
                  <Label>Full Name</Label>
                  <Input value={profileData.name} onChange={e => setProfileData(p => ({...p, name: e.target.value}))} />
                </div>
                <div className="grid gap-2">
                  <Label>Bio</Label>
                  <Textarea 
                    value={profileData.bio} 
                    onChange={e => setProfileData(p => ({...p, bio: e.target.value}))} 
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-4 border-t">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {isEditing ? (
                  <Input className="h-8 w-40 text-sm" value={profileData.location} onChange={e => setProfileData(p => ({...p, location: e.target.value}))} placeholder="Location" />
                ) : (
                  <span>{currentProfile.location || currentProfile.profile?.location || "Unknown"}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span>{currentProfile.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                {isEditing ? (
                  <Input className="h-8 w-48 text-sm" value={profileData.website} onChange={e => setProfileData(p => ({...p, website: e.target.value}))} placeholder="https://" />
                ) : (
                  currentProfile.profile?.website ? (
                    <a href={currentProfile.profile.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      {currentProfile.profile.website}
                    </a>
                  ) : "No website"
                )}
              </div>
            </div>
            
            <div className="flex gap-6 pt-2">
              <div className="flex flex-col">
                <span className="font-semibold text-lg">{currentProfile._count?.followers || 0}</span>
                <span className="text-xs text-muted-foreground">Followers</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg">{currentProfile._count?.following || 0}</span>
                <span className="text-xs text-muted-foreground">Following</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="about">About & Details</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <Award className="w-12 h-12 mb-4 text-muted/50" />
              <p>No recent activity to show.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Role</h4>
                  <p className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-muted-foreground"/> {currentProfile.role}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Industry Focus</h4>
                  <p className="flex items-center gap-2"><Building2 className="w-4 h-4 text-muted-foreground"/> {currentProfile.profile?.industry || "Not specified"}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Skills & Technologies</h4>
                  <div className="flex gap-2 flex-wrap">
                    {currentProfile.skills?.length > 0 ? currentProfile.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    )) : (
                      <p className="text-sm text-muted-foreground">No skills added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Remove the unused Badge import or component logic if it exists at the top. Let's make sure Badge is imported! */}
    </div>
  );
}

function Badge({ children, variant, className }: any) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variant === 'secondary' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'} ${className}`}>
      {children}
    </span>
  );
}