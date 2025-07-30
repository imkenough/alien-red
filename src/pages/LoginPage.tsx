import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Successful",
        description: "You have been successfully logged in.",
      });
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-card p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-muted-foreground text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-background text-foreground border-border"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-muted-foreground text-sm font-bold mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 leading-tight focus:outline-none focus:shadow-outline bg-background text-foreground border-border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 pr-3 flex items-center text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-destructive-foreground text-xs italic mb-4">
              {error}
            </p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
            <a
              href="/register"
              className="inline-block align-baseline font-bold text-sm text-primary hover:text-primary/90 dark:text-primary dark:hover:text-primary/90"
            >
              Don't have an account? Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
