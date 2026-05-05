import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAppState } from "@/contexts/AppContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAppState();
  const [role, setRole] = useState<"Citizen" | "Admin">("Citizen");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const ok = login(role, password);
    if (!ok) {
      toast({
        title: "Invalid password",
        description: `Please enter a valid ${role} password.`,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Login successful", description: `Signed in as ${role}.` });
    navigate(role === "Admin" ? "/" : "/submit", { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-8 bg-muted/20">
      <Card className="w-full max-w-md border-sidebar-primary/20">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 text-sidebar-primary">
            <Shield className="h-6 w-6" />
            <CardTitle className="text-xl">GovSense Login</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">Choose your role and sign in with password.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={role === "Citizen" ? "default" : "outline"}
                onClick={() => setRole("Citizen")}
              >
                Citizen
              </Button>
              <Button
                type="button"
                variant={role === "Admin" ? "default" : "outline"}
                onClick={() => setRole("Admin")}
              >
                Admin
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder={`Enter ${role} password`}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleLogin();
              }}
            />
          </div>

          <Button type="button" className="w-full" onClick={handleLogin} disabled={!password.trim()}>
            Login as {role}
          </Button>

          <div className="text-xs text-muted-foreground rounded-md bg-muted p-3">
            <p>Demo credentials:</p>
            <p>Citizen: citizen@123</p>
            <p>Admin: admin@123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
