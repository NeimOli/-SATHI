import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Heart, BookOpen, Users, Star } from "lucide-react";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-xl">
              <Heart className="size-8 text-white" fill="white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Welcome to Bhansa Sathi!</DialogTitle>
              <DialogDescription className="text-base">
                Your warm and friendly cooking companion
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-gray-700">
            We're so happy you're here! Bhansa Sathi is a community where home cooks 
            share their favorite recipes and food lovers discover delicious new dishes. 
            Think of it as your kitchen companion - always ready to inspire, help, and 
            connect you with others who love good food.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="size-5 text-orange-600" />
                <h3 className="font-semibold text-orange-900">Discover Recipes</h3>
              </div>
              <p className="text-sm text-gray-700">
                Browse through a collection of home-style recipes shared by passionate 
                cooks. Save your favorites to try later!
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="size-5 text-amber-600" />
                <h3 className="font-semibold text-amber-900">Share Your Love</h3>
              </div>
              <p className="text-sm text-gray-700">
                Have a family recipe that everyone loves? Share it with the community 
                and spread the joy of good cooking!
              </p>
            </div>

            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
              <div className="flex items-center gap-2 mb-2">
                <Users className="size-5 text-rose-600" />
                <h3 className="font-semibold text-rose-900">Connect & Engage</h3>
              </div>
              <p className="text-sm text-gray-700">
                Leave comments, share cooking tips, and connect with fellow food 
                enthusiasts. Let's build a supportive community together!
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Star className="size-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Get Inspired</h3>
              </div>
              <p className="text-sm text-gray-700">
                Check out our Recipe of the Week and Cook Spotlight features for 
                daily inspiration and new ideas!
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-6 rounded-xl border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              A Few Friendly Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>
                  <strong>Be encouraging:</strong> Every cook started somewhere! 
                  Share kind words and helpful feedback.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>
                  <strong>Share your story:</strong> What makes your recipe special? 
                  Add personal touches and memories!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>
                  <strong>Ask questions:</strong> Curious about an ingredient or technique? 
                  Don't hesitate to ask in the comments!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>
                  <strong>Celebrate together:</strong> Made a recipe and loved it? 
                  Let the cook know - it makes their day!
                </span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Ready to start your delicious journey? Let's cook something amazing together!
            </p>
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg"
            >
              Let's Get Started!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
