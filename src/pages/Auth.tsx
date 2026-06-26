import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created! You're signed in.");
        navigate("/members");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/members");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
      <div className="container mx-auto px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md bg-card border rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-3">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">
              {mode === "signup" ? "Join Maggie's Reading Club" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              {mode === "signup"
                ? "Create your free account to start your 7-day trial."
                : "Sign in to access your library."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="fullName">Your Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Parent's name" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? (
              <>Already have an account?{" "}
                <button onClick={() => setMode("signin")} className="text-primary hover:underline font-medium">Sign in</button>
              </>
            ) : (
              <>New here?{" "}
                <button onClick={() => setMode("signup")} className="text-primary hover:underline font-medium">Create account</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
