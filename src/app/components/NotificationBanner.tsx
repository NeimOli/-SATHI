import { useState, useEffect } from "react";
import { X, Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";



export function NotificationBanner() {
  const [visible, setVisible] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState<any[]>([]);
  const [currentNotification, setCurrentNotification] = useState<any>(null);

  useEffect(() => {
    const fetchLatestActivity = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/recipes?limit=5&sortBy=createdAt&sortOrder=desc");
        const data = await res.json();
        
        if (res.ok && data?.data?.recipes && data.data.recipes.length > 0) {
          const mapped = data.data.recipes.map((recipe: any, index: number) => ({
            id: recipe._id,
            icon: index % 2 === 0 ? Heart : Star,
            color: index % 3 === 0 ? "from-rose-500 to-pink-500" : 
                   index % 3 === 1 ? "from-amber-500 to-orange-500" : 
                   "from-purple-500 to-pink-500",
            message: `${recipe.author?.profile?.fullName || recipe.author?.username || 'A cook'} just shared a new recipe: ${recipe.title}!`,
            link: `/recipe/${recipe._id}`,
            linkText: "Check it out"
          }));
          
          setActiveNotifications(mapped);
          setCurrentNotification(mapped[0]);
          
          // Show notification after 3 seconds
          setTimeout(() => setVisible(true), 3000);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchLatestActivity();
  }, []);

  useEffect(() => {
    if (visible && activeNotifications.length > 1) {
      // Rotate through notifications every 10 seconds
      const interval = setInterval(() => {
        setCurrentNotification((prev: any) => {
          const currentIndex = activeNotifications.findIndex(n => n.id === prev.id);
          const nextIndex = (currentIndex + 1) % activeNotifications.length;
          return activeNotifications[nextIndex];
        });
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [visible, activeNotifications]);

  if (!currentNotification) return null;

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
