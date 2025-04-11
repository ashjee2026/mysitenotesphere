import { useState, useContext } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AuthContext } from "@/App";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [location] = useLocation();
  const { isAuthenticated, isAdmin, username, login, logout } = useContext(AuthContext);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data.username, data.password);
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      });
      setIsLoginOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            id="sidebar-toggle" 
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={onToggleSidebar}
          >
            <i className="fas fa-bars text-gray-700"></i>
          </button>
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-1 rounded-md">
                <i className="fas fa-book-open"></i>
              </div>
              <span className="font-bold text-xl text-primary">NoteSphere</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-4 ml-4">
            <Link href="/">
              <span className={`text-gray-700 hover:text-primary px-2 py-1 rounded-md cursor-pointer ${location === '/' ? 'font-medium text-primary' : ''}`}>
                Home
              </span>
            </Link>
            <Link href="/about">
              <span className={`text-gray-700 hover:text-primary px-2 py-1 rounded-md cursor-pointer ${location === '/about' ? 'font-medium text-primary' : ''}`}>
                About
              </span>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <span className={`text-gray-700 hover:text-primary px-2 py-1 rounded-md cursor-pointer ${location.startsWith('/admin') ? 'font-medium text-primary' : ''}`}>
                  Admin
                </span>
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Input 
              type="text" 
              placeholder="Search resources..." 
              className="w-64 pl-10 pr-4 py-2"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100" title="Notifications">
              <i className="fas fa-bell text-gray-700"></i>
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white" title={username || "User"}>
                  <span className="text-sm font-medium">{username?.substring(0, 2).toUpperCase() || "U"}</span>
                </button>
                <div className="hidden md:block">
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button>Login</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Login to NoteSphere</DialogTitle>
                    <DialogDescription>
                      Enter your credentials to access your account.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="admin" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting ? "Logging in..." : "Login"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
