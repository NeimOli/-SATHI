import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";

export function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      if (data.success) {
        setEvents(data.data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-emerald-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Food Events</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Find the best culinary experiences, workshops, and tastings happening around you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <div className="flex gap-4">
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option>All Categories</option>
              <option>Workshop</option>
              <option>Tasting</option>
              <option>Festival</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading amazing events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No upcoming events found. Check back later!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {event.images?.[0]?.url ? (
                    <img src={event.images[0].url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-emerald-800 bg-emerald-50">
                      <Calendar className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-sm font-medium opacity-70">Event Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-700">
                    {event.category.toUpperCase()}
                  </div>
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-lg text-center shadow-lg">
                    <p className="text-xs uppercase font-bold">{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
                    <p className="text-lg font-bold leading-none">{new Date(event.date).getDate()}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-3 mt-0.5 text-emerald-600" />
                      <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                    </div>
                    <div className="flex items-start text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-3 mt-0.5 text-emerald-600" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-3 text-emerald-600" />
                      <span>{event.currentAttendees} / {event.maxAttendees} Attending</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Price</span>
                      <span className="font-bold text-emerald-700">
                        {event.price === 0 ? "Free" : `$${event.price}`}
                      </span>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm">
                      <Ticket className="w-4 h-4 mr-2" /> Book Ticket
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
