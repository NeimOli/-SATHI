import { useEffect, useState } from "react";
import { Users, ChefHat, BookOpen, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

interface AdminStats {
  totalUsers: number;
  totalChefs: number;
  totalRecipes: number;
  totalEvents: number;
}

export function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingChefs, setPendingChefs] = useState<any[]>([]);
  const [verifiedChefs, setVerifiedChefs] = useState<any[]>([]);
  const [pendingPromotions, setPendingPromotions] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'promotions' | 'users'>('pending');

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      navigate('/login');
      return;
    }

    fetchAdminData();
  }, [user, navigate, token]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes, verifiedRes, promotionsRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/admin/restaurants/pending', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/admin/restaurants/verified', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/admin/promotion-requests', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const statsData = await statsRes.json();
      const pendingData = await pendingRes.json();
      const verifiedData = await verifiedRes.json();
      const promotionsData = await promotionsRes.json();
      const usersData = await usersRes.json();

      console.log('Admin Data Fetched:', {
        stats: statsData,
        pending: pendingData,
        verified: verifiedData,
        promotions: promotionsData,
        users: usersData
      });

      if (statsData.success) setStats(statsData.data.stats);
      if (pendingData.success) setPendingChefs(pendingData.data.restaurants);
      if (verifiedData.success) setVerifiedChefs(verifiedData.data.restaurants);
      if (promotionsData.success) setPendingPromotions(promotionsData.data.users);
      if (usersData.success) setAllUsers(usersData.data.users);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyChef = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to verify this chef/restaurant?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/restaurants/${id}/verify`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Chef verified successfully!");
        fetchAdminData();
      } else {
        alert("Verification failed: " + data.message);
      }
    } catch (error) {
      console.error('Error verifying chef:', error);
    }
  };

  const handleApprovePromotion = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to approve this user's recipe creation feature?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/promote/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Feature unlocked successfully!");
        fetchAdminData();
      } else {
        alert("Failed to approve: " + data.message);
      }
    } catch (error) {
      console.error('Error approving promotion:', error);
    }
  };

  const handleDeleteUser = async (id: string, type: 'user' | 'chef' | 'promotion' = 'user') => {
    const message = type === 'chef' 
      ? "Are you absolutely sure you want to delete this chef? This action will also delete all their recipes and events."
      : "Are you absolutely sure you want to delete this user? This action cannot be undone.";
      
    const confirmed = window.confirm(message);
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Deleted successfully!");
        fetchAdminData();
      } else {
        alert("Deletion failed: " + data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      logout();
      navigate('/login');
    }
  };

  if (!user || user.userType !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white shadow-lg p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage the platform and verify chefs</p>
          </div>
          <div className="flex gap-4 items-center">
            <Button 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={fetchAdminData}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Platform Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-6 h-6" /></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Verified Chefs</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.totalChefs || 0}</p>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><ChefHat className="w-6 h-6" /></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Recipes Shared</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.totalRecipes || 0}</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><BookOpen className="w-6 h-6" /></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Events</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.totalEvents || 0}</p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Calendar className="w-6 h-6" /></div>
            </div>
          </div>
        </section>

        {/* Chef Management */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Chef Management</h2>
            <div className="flex bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'pending' ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Chef Requests ({pendingChefs.length})
              </button>
              <button 
                onClick={() => setActiveTab('verified')}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Verified Chefs ({verifiedChefs.length})
              </button>
              <button 
                onClick={() => setActiveTab('promotions')}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'promotions' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Feature Requests ({pendingPromotions.length})
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'users' ? 'bg-slate-100 text-slate-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Food Lovers ({allUsers.length})
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500">Loading chefs...</p>
          ) : activeTab === 'pending' && pendingChefs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
              <p className="text-slate-500">There are no pending chef verifications right now.</p>
            </div>
          ) : activeTab === 'promotions' && pendingPromotions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <CheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No Pending Requests</h3>
              <p className="text-slate-500">There are no user feature unlock requests at the moment.</p>
            </div>
          ) : activeTab === 'users' && allUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No users found</h3>
              <p className="text-slate-500">There are no regular users registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeTab === 'pending' ? pendingChefs : activeTab === 'verified' ? verifiedChefs : activeTab === 'promotions' ? pendingPromotions : allUsers).map(item => (
                <div key={item._id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-slate-100 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                          {item.restaurant?.name?.charAt(0) || item.profile?.fullName?.charAt(0) || item.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{item.restaurant?.name || item.profile?.fullName || item.username}</h3>
                          <p className="text-xs text-slate-500">{item.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        activeTab === 'pending' ? 'bg-amber-100 text-amber-700' : 
                        activeTab === 'verified' ? 'bg-emerald-100 text-emerald-700' : 
                        activeTab === 'promotions' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {activeTab === 'pending' ? 'Pending Verification' : 
                         activeTab === 'verified' ? 'Verified Chef' : 
                         activeTab === 'promotions' ? 'Promotion Request' :
                         'Regular User'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      {activeTab === 'promotions' ? (
                        <>
                          <p><span className="font-semibold text-slate-700">Achievement:</span> {item.promotionMessage}</p>
                          <p><span className="font-semibold text-slate-700">Events Attended:</span> {item.stats?.eventsAttended || 0}</p>
                        </>
                      ) : activeTab === 'users' ? (
                        <>
                          <p><span className="font-semibold text-slate-700">Recipes Shared:</span> {item.stats?.recipesCount || 0}</p>
                          <p><span className="font-semibold text-slate-700">Events Attended:</span> {item.stats?.eventsAttended || 0}</p>
                          <p><span className="font-semibold text-slate-700">Joined:</span> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </>
                      ) : (
                        <>
                          <p><span className="font-semibold text-slate-700">Phone:</span> {item.restaurant?.phone || 'N/A'}</p>
                          <p><span className="font-semibold text-slate-700">Address:</span> {item.restaurant?.address || 'N/A'}</p>
                          <p><span className="font-semibold text-slate-700">Type:</span> {item.restaurant?.type || 'N/A'}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 flex gap-3">
                    {activeTab === 'pending' && (
                      <Button 
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleVerifyChef(item._id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                      </Button>
                    )}
                    {activeTab === 'promotions' && (
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleApprovePromotion(item._id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Unlock Feature
                      </Button>
                    )}
                    {activeTab !== 'verified' && activeTab !== 'users' ? (
                      <Button 
                        variant="outline" 
                        className="flex-1 text-red-600 hover:bg-red-50 border-red-200"
                        onClick={() => handleDeleteUser(item._id, activeTab === 'promotions' ? 'promotion' : 'chef')}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> {activeTab === 'promotions' ? 'Reject' : 'Delete'}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="flex-1 text-red-600 hover:bg-red-50 border-red-200"
                        onClick={() => handleDeleteUser(item._id, activeTab === 'verified' ? 'chef' : 'user')}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) }
        </section>
      </div>
    </div>
  );
}
