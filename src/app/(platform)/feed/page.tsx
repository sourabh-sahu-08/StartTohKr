"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, Share2, Bookmark, Send, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const INITIAL_POSTS = [
  {
    id: 1,
    author: { name: "Aarav Tech", role: "STARTUP", initials: "AT" },
    content: "We just launched our new AI-powered crop yield predictor! Looking for government agricultural departments interested in a pilot.",
    likes: 124,
    comments: 12,
    hasLiked: false,
    hasSaved: false,
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    author: { name: "Ministry of Health", role: "GOVERNMENT", initials: "MH" },
    content: "We are currently evaluating startups for the Rural Health Data Challenge. Please ensure your applications are submitted by Friday.",
    likes: 89,
    comments: 4,
    hasLiked: false,
    hasSaved: false,
    timestamp: "5 hours ago"
  },
  {
    id: 3,
    author: { name: "Global Ventures", role: "INVESTOR", initials: "GV" },
    content: "Fascinating trend in climate-tech startups this quarter. Always open to reviewing innovative carbon capture solutions.",
    likes: 210,
    comments: 34,
    hasLiked: true,
    hasSaved: true,
    timestamp: "1 day ago"
  }
];

export default function FeedPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (!newPost.trim()) {
      toast.error("Post cannot be empty.");
      return;
    }
    const post = {
      id: Date.now(),
      author: { name: "You", role: "USER", initials: "ME" },
      content: newPost,
      likes: 0,
      comments: 0,
      hasLiked: false,
      hasSaved: false,
      timestamp: "Just now"
    };
    setPosts([post, ...posts]);
    setNewPost("");
    toast.success("Post published successfully!");
  };

  const toggleLike = (postId: number) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const newStatus = !p.hasLiked;
        return { ...p, hasLiked: newStatus, likes: p.likes + (newStatus ? 1 : -1) };
      }
      return p;
    }));
  };

  const toggleSave = (postId: number) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const newStatus = !p.hasSaved;
        toast(newStatus ? "Post saved to your bookmarks." : "Post removed from bookmarks.");
        return { ...p, hasSaved: newStatus };
      }
      return p;
    }));
  };

  const handleShare = () => {
    // Mock share functionality
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleDelete = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast.info("Post deleted.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Innovation Feed</h1>

      {/* Create Post */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea 
                placeholder="Share an innovation, request a pilot, or post an update..." 
                className="resize-none"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handlePost}>
                  <Send className="mr-2 h-4 w-4" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed Tabs */}
      <Tabs defaultValue="foryou" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="foryou">For You</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>
        
        {/* Render same posts for dummy purposes, but realistically these would filter */}
        {["foryou", "trending", "following", "opportunities"].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
            {posts.length === 0 ? (
              <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
                No posts to display.
              </div>
            ) : (
              posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="flex flex-row justify-between items-start pt-6 pb-2">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarFallback>{post.author.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{post.author.name}</p>
                          <span className="text-xs text-muted-foreground border px-1.5 rounded-sm">
                            {post.author.role}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.success("Added to interests")}>
                          Add to Interests
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Post reported")}>
                          Report
                        </DropdownMenuItem>
                        {post.author.initials === "ME" && (
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(post.id)}>
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm">{post.content}</p>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t p-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`gap-2 ${post.hasLiked ? 'text-rose-500 hover:text-rose-600' : 'text-muted-foreground'}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <Heart className={`h-4 w-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={() => toast.info("Comments feature coming soon")}>
                      <MessageSquare className="h-4 w-4" />
                      {post.comments}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`gap-2 ${post.hasSaved ? 'text-primary' : 'text-muted-foreground'}`}
                      onClick={() => toggleSave(post.id)}
                    >
                      <Bookmark className={`h-4 w-4 ${post.hasSaved ? 'fill-current' : ''}`} />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}