"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    role: "STARTUP",
    bio: "",
    location: "",
    website: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      // Redirect to correct dashboard
      router.push(`/dashboard/${formData.role.toLowerCase().replace('_', '-')}`);
      router.refresh(); // Refresh session to get new role
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Complete your profile</CardTitle>
          <CardDescription>
            Step {step} of 2 - Let&apos;s set up your StartTohKr experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
            
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>I am joining as a...</Label>
                  <Select value={formData.role} onValueChange={(v) => handleChange("role", v || "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STARTUP">Startup / Founder</SelectItem>
                      <SelectItem value="GOVERNMENT">Government Department</SelectItem>
                      <SelectItem value="INVESTOR">Investor</SelectItem>
                      <SelectItem value="INDUSTRY_PARTNER">Industry Partner</SelectItem>
                      <SelectItem value="MENTOR">Mentor</SelectItem>
                      <SelectItem value="EVALUATOR">Evaluator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / Description</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about yourself or your organization..."
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    placeholder="e.g. New Delhi, India"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL (Optional)</Label>
                  <Input 
                    id="website" 
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            
            <div className="flex gap-2 pt-4">
              {step === 2 && (
                <Button type="button" variant="outline" className="flex-1" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {step === 1 ? "Next" : (isLoading ? "Saving..." : "Complete Setup")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
