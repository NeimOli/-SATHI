import { useState, useEffect } from "react";
import { X, Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

const notifications = [
  {
    id: 1,
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    message: "Sita Sharma just shared a new recipe you'll love!",
    link: "/recipe/1",
    linkText: "Check it out"
  },
  {
    id: 2,
    icon: Star,
    color: "from-amber-500 to-orange-500",
    message: "Your saved recipe 'Dal Bhat' is being made by 5 people today!",
    link: "/recipe/5",
    linkText: "View recipe"
  },
  {
    id: 3,
    icon: Heart,
    color: "from-purple-500 to-pink-500",
    message: "Ramesh Gurung commented on your recipe!",
    link: "/recipes",
    linkText: "See comment"
  }
];

export function NotificationBanner() {
  const [visible, setVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(notifications[0]);

  useEffect(() => {
    // Show notification after 3 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (visible) {
      // Rotate through notifications every 10 seconds
      const interval = setInterval(() => {
        setCurrentNotification(prev => {
          const currentIndex = notifications.findIndex(n => n.id === prev.id);
          const nextIndex = (currentIndex + 1) % notifications.length;
          return notifications[nextIndex];
        });
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [visible]);

  const Icon = currentNotification.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div className={`bg-gradient-to-r ${currentNotification.color} text-white rounded-xl shadow-2xl p-4 backdrop-blur-sm`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-white/20 p-2 rounded-lg">
                <Icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-2">
                  {currentNotification.message}
                </p>
                <Link 
                  to={currentNotification.link}
                  className="text-xs font-semibold underline hover:no-underline"
                  onClick={() => setVisible(false)}
                >
                  {currentNotification.linkText} →
                </Link>
              </div>
              <button
                onClick={() => setVisible(false)}
                className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
