import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

type Mode = "login" | "register";

export default function Login() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/");
    },
    onError: (e) => setError(e.message),
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/");
    },
    onError: (e) => setError(e.message),
  });

  const isPending = loginMutation.isPending || registerMutation.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "login") {
      loginMutation.mutate({ email, password });
    } else {
      registerMutation.mutate({ name, email, password });
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2C2416] mb-4">
            <BookOpen className="w-6 h-6 text-[#F5F0E8]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#2C2416] tracking-tight">
            Claude Writer
          </h1>
          <p className="text-sm text-[#7A6A52] mt-1">
            Your personal writing dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8DFD0] p-8">
          {/* Tab switcher */}
          <div className="flex rounded-lg bg-[#F5F0E8] p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(null); }}
              className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${
                mode === "login"
                  ? "bg-white text-[#2C2416] shadow-sm"
                  : "text-[#7A6A52] hover:text-[#2C2416]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(null); }}
              className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${
                mode === "register"
                  ? "bg-white text-[#2C2416] shadow-sm"
                  : "text-[#7A6A52] hover:text-[#2C2416]"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-[#2C2416]">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-[#E8DFD0] focus-visible:ring-[#C4A882] bg-[#FDFAF6]"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-[#2C2416]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#E8DFD0] focus-visible:ring-[#C4A882] bg-[#FDFAF6]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-[#2C2416]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={mode === "register" ? "At least 6 characters" : "Your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === "register" ? 6 : 1}
                className="border-[#E8DFD0] focus-visible:ring-[#C4A882] bg-[#FDFAF6]"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#2C2416] hover:bg-[#3D3120] text-[#F5F0E8] font-medium mt-2"
            >
              {isPending
                ? mode === "login" ? "Signing in..." : "Creating account..."
                : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-[#7A6A52] mt-6">
          A private space for your stories and characters.
        </p>
      </div>
    </div>
  );
}
