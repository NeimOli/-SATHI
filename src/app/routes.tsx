import { createBrowserRouter } from "react-router";
import { Navigate } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { RecipeDetail } from "./pages/RecipeDetail";
import { Recipes } from "./pages/Recipes";
import { Profile } from "./pages/Profile";
import { CreateRecipe } from "./pages/CreateRecipe";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { RegisterChoice } from "./pages/RegisterChoice";
import { RegisterRestaurant } from "./pages/RegisterRestaurant";
import { UserDashboard } from "./pages/UserDashboard";
import { RestaurantDashboard } from "./pages/RestaurantDashboard";
import { ChefDashboard } from "./pages/ChefDashboard";
import { NotFound } from "./pages/NotFound";
import { Community } from "./pages/Community";
import { Events } from "./pages/Events";
import { AdminDashboard } from "./pages/AdminDashboard";
import { useAuth } from "./contexts/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ children, requiredUserType }: { children: React.ReactNode; requiredUserType?: 'user' | 'restaurant' | 'admin' }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent animate-spin rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredUserType && user.userType !== requiredUserType) {
    if (user.userType === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.userType === 'restaurant') return <Navigate to="/chef-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "recipes", Component: Recipes },
      { path: "recipe/:id", Component: RecipeDetail },
      { path: "profile/:id", Component: Profile },
      { 
        path: "create", 
        element: (
          <ProtectedRoute requiredUserType="restaurant">
            <CreateRecipe />
          </ProtectedRoute>
        )
      },
      { 
        path: "restaurant-dashboard", 
        element: (
          <ProtectedRoute requiredUserType="restaurant">
            <RestaurantDashboard />
          </ProtectedRoute>
        )
      },
      { path: "events", Component: Events },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requiredUserType="user">
        <UserDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/chef-dashboard", 
    element: (
      <ProtectedRoute requiredUserType="restaurant">
        <ChefDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/community",
    element: (
      <ProtectedRoute requiredUserType="user">
        <Community />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute requiredUserType="admin">
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register-choice",
    Component: RegisterChoice,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/register/restaurant",
    Component: RegisterRestaurant,
  },
]);
