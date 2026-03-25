import { Outlet, useLocation } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useState, useEffect } from "react";
import { WelcomeDialog } from "../components/WelcomeDialog";

export function Root() {
  const [showWelcome, setShowWelcome] = useState(false);
  const location = useLocation();
  const hideChrome = location.pathname === "/create";

  useEffect(() => {
    // Show welcome dialog for first-time visitors
    const hasVisited = localStorage.getItem('bhansa-sathi-visited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('bhansa-sathi-visited', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {!hideChrome && <Header />}
      
      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {!hideChrome && <Footer />}

      {/* Welcome Dialog */}
      <WelcomeDialog 
        open={showWelcome}
        onOpenChange={setShowWelcome}
      />
    </div>
  );
}