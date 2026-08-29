"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, MapPin, Building2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("startups");

  const handleConnect = () => {
    toast.success("Connection request sent! You will be notified when they accept.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Discover Innovation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Search the entire ecosystem for startups, investors, mentors, and government departments.
        </p>
        
        <div className="max-w-3xl mx-auto flex gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for technologies, companies, or people..." 
              className="pl-12 h-12 text-lg rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="lg" className="h-12 rounded-full px-8">Search</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl mx-auto">
          <TabsTrigger value="startups">Startups</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
          <TabsTrigger value="government">Government</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
        </TabsList>
        
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold capitalize">Trending {activeTab}</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>

          <TabsContent value="startups" className="mt-0 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start gap-4">
                  <Avatar className="w-12 h-12 border">
                    <AvatarFallback>S{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">EcoTech Innovations</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> Bangalore, India
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    Developing AI-driven waste management systems for smart cities. Looking for Series A funding and municipal pilots.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Cleantech</Badge>
                    <Badge variant="secondary">AI</Badge>
                    <Badge variant="secondary">Smart City</Badge>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/10 p-4">
                  <Button className="w-full" variant="outline" onClick={handleConnect}>Connect</Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="investors" className="mt-0 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start gap-4">
                  <Avatar className="w-12 h-12 border">
                    <AvatarFallback>V{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Global Ventures</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Building2 className="h-3 w-3" /> Seed, Series A
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Actively investing in climate-tech, health-tech, and AI infrastructure startups across South Asia.
                  </p>
                </CardContent>
                <CardFooter className="border-t bg-muted/10 p-4">
                  <Button className="w-full" onClick={handleConnect}>Pitch Idea</Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="government" className="mt-0 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-full text-center p-12 border border-dashed rounded-lg text-muted-foreground">
              Search for government departments to view their active challenges.
            </div>
          </TabsContent>
          
          <TabsContent value="mentors" className="mt-0 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-full text-center p-12 border border-dashed rounded-lg text-muted-foreground">
              Search for industry experts willing to provide mentorship.
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}