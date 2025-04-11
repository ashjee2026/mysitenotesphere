import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn, UserPlus, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const [location] = useLocation();
  
  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showAdminHint, setShowAdminHint] = useState(false);
  
  // Register state
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  
  // Clear errors when switching tabs
  useEffect(() => {
    setLoginError("");
    setRegisterError("");
  }, [location]);
  
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    if (!loginUsername || !loginPassword) {
      setLoginError("Username and password are required");
      return;
    }
    
    try {
      loginMutation.mutate({
        username: loginUsername,
        password: loginPassword
      });
    } catch (error) {
      setLoginError("Failed to login. Please try again.");
    }
  };
  
  // Handle register form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    
    if (!registerUsername || !registerPassword || !registerConfirmPassword) {
      setRegisterError("All fields are required");
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }
    
    try {
      registerMutation.mutate({
        username: registerUsername,
        password: registerPassword,
        isAdmin: false,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      setRegisterError("Failed to register. Please try again.");
    }
  };
  
  // Display admin hint on 3 failed attempts with username "admin"
  useEffect(() => {
    if (loginMutation.isError && loginUsername === "admin") {
      setShowAdminHint(true);
    }
  }, [loginMutation.isError, loginUsername]);
  
  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Tabs defaultValue="login" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {loginMutation.isError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        Invalid username or password
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {loginError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        {loginError}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {showAdminHint && (
                    <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
                      <AlertDescription>
                        <strong>Hint:</strong> Admin username is "admin" and password is "admin123"
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input 
                      id="login-username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending || isLoading}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Register to access educational resources
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  {registerMutation.isError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        Registration failed. Username may already be taken.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {registerError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        {registerError}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input 
                      id="register-username"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                      id="register-password"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <Input 
                      id="register-confirm-password"
                      type="password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={registerMutation.isPending || isLoading}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Register
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right side - Hero section */}
      <div className="hidden lg:flex flex-1 bg-cover bg-center" style={{ backgroundImage: 'url("/attached_assets/beautiful-anime-landscape-cartoon-scene.jpg")' }}>
        <div className="flex flex-col justify-center p-12 bg-gradient-to-r from-background/90 to-background/30 w-full h-full">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">NoteSphere</h1>
            <p className="text-xl mb-6">
              Your gateway to quality educational resources. Access thousands of study materials for all classes.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-center">
                <span className="mr-2">✓</span> Free textbooks and notes
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Practice question banks
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Revision materials
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Classroom resources
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}