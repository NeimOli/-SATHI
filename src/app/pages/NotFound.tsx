import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home, BookOpen } from "lucide-react";

export function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-9xl font-bold text-orange-200 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Oops! Recipe Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Looks like this recipe isn't in our kitchen yet. Let's get you back to 
          exploring delicious dishes!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700">
              <Home className="size-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/recipes">
            <Button variant="outline">
              <BookOpen className="size-4 mr-2" />
              Browse Recipes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
