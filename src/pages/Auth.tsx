import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { FileText } from "lucide-react";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Account created! You can now sign in.",
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "Successfully signed in",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-600/20 rounded-full blur-[120px] animate-blob filter mix-blend-multiply opacity-70"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000 filter mix-blend-multiply opacity-70"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] bg-pink-600/20 rounded-full blur-[120px] animate-blob animation-delay-4000 filter mix-blend-multiply opacity-70"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl animate-fade-in glass-panel border-white/10 relative z-10 bg-black/40 backdrop-blur-xl">
        <CardHeader className="space-y-3 text-center relative">
          <Button
            variant="ghost"
            className="absolute left-0 top-0 text-gray-400 hover:text-white"
            onClick={() => navigate("/")}
          >
            ← Home
          </Button>
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-glow">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-lg text-gray-400">
            {isSignUp
              ? "Sign up to start managing your invoices"
              : "Sign in to your account to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-primary/20 h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-primary/20 h-11"
                required
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-primary/20 h-11"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full hover-scale h-11 text-lg font-medium bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-primary/20 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
            </Button>

            <div className="text-center text-sm pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-purple-300 hover:underline font-medium transition-colors"
                disabled={loading}
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
