import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AppLayout from "@/layouts/app-layout";
import HomePage from "@/pages/home";
import ClassPage from "@/pages/class-page";
import SubjectPage from "@/pages/subject-page";
import AdminIndex from "@/pages/admin/index";
import BookManagement from "@/pages/admin/book-management";
import ClassManagement from "@/pages/admin/class-management";
import { useState, useEffect } from "react";

// Auth context
import { createContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  username: null,
  login: async () => {},
  logout: async () => {},
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/class/:id" component={ClassPage} />
      <Route path="/subject/:id" component={SubjectPage} />
      <Route path="/admin" component={AdminIndex} />
      <Route path="/admin/books" component={BookManagement} />
      <Route path="/admin/classes" component={ClassManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already authenticated
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setIsAdmin(data.isAdmin);
          setUsername(data.username);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setIsAuthenticated(true);
      setIsAdmin(data.isAdmin);
      setUsername(data.username);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUsername(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          isAdmin,
          username,
          login,
          logout,
        }}
      >
        <AppLayout>
          <Router />
        </AppLayout>
      </AuthContext.Provider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
