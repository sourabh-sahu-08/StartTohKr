"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, FileText, ExternalLink } from "lucide-react";

export default function ScalingHubPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Scaling Hub</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Procurement-ready solutions that have successfully completed government pilots. Replicate these proven models in your department.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col hover:shadow-md transition-shadow border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="default" className="bg-green-600 hover:bg-green-700">Procurement Ready</Badge>
                <Badge variant="outline">Smart City</Badge>
              </div>
              <CardTitle className="text-xl">AI Waste Management Matrix</CardTitle>
              <CardDescription>by EcoTech Innovations</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground">
                Successfully completed a 6-month pilot with the Pune Municipal Corporation resulting in a 40% increase in routing efficiency for waste collection trucks.
              </p>
              
              <div className="bg-muted rounded-md p-3 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pilot Results</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-bold text-green-600">40%</span>
                    <p className="text-xs text-muted-foreground">Efficiency Inc.</p>
                  </div>
                  <div>
                    <span className="font-bold text-green-600">$200k</span>
                    <p className="text-xs text-muted-foreground">Cost Saved</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-4 flex gap-2">
              <Button className="w-full" onClick={() => toast.success("Replication request submitted to procurement team.")}>
                <Rocket className="w-4 h-4 mr-2" /> Replicate
              </Button>
              <Button variant="outline" size="icon" onClick={() => toast.info("Viewing case study...")}>
                <FileText className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}