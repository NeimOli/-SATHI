import { useState, useEffect } from "react";
import { 
  Users,
  ChefHat, 
  BookOpen, 
  MessageSquare, 
  Edit, 
  Trash2, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Card } from "../components/ui/card";
import { EditRecipeModal } from "../components/EditRecipeModal";

export function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [pendingRestaurants, setPendingRestaurants] = useState<any[]>([]);
  const [verifiedRestaurants, setVerifiedRestaurants] = useState<any[]>([]);
  const [pendingPromotions, setPendingPromotions] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allRecipes, setAllRecipes] = useState<any[]>([]);
  const [communityGroups, setCommunityGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'promotions' | 'users' | 'community' | 'recipes'>('pending');
  
  // Edit State
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (user && user.userType !== 'admin') {
      navigate('/');
    } else {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes, verifiedRes, promotionsRes, usersRes, groupsRes, recipesRes] = await Promise.all([
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
        }),
        fetch('http://localhost:5000/api/admin/community/groups', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/admin/recipes', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const [statsData, pendingData, verifiedData, promotionsData, usersData, groupsData, recipesData] = await Promise.all([
        statsRes.json(),
        pendingRes.json(),
        verifiedRes.json(),
        promotionsRes.json(),
        usersRes.json(),
        groupsRes.json(),
        recipesRes.json()
      ]);

      if (statsData.success) setStats(statsData.data.stats);
      if (pendingData.success) setPendingRestaurants(pendingData.data.restaurants);
      if (verifiedData.success) setVerifiedRestaurants(verifiedData.data.restaurants);
      if (promotionsData.success) setPendingPromotions(promotionsData.data.users);
      if (usersData.success) setAllUsers(usersData.data.users);
      if (groupsData.success) setCommunityGroups(groupsData.data.groups);
      
      if (recipesData.success) {
        setAllRecipes(recipesData.data.recipes || recipesData.data || []);
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (restaurantId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/restaurants/${restaurantId}/verify`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Restaurant verified successfully');
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Failed to verify restaurant');
    }
  };

  const handleApprovePromotion = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/promote/${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User promoted successfully');
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Failed to promote user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User deleted successfully');
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm('Delete this group and all its messages?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/community/groups/${groupId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Group deleted');
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Failed to delete group');
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Recipe deleted');
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent animate-spin rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Entering secure command center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Admin<span className="text-emerald-600">Center</span></span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user?.username}</p>
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">System Administrator</p>
              </div>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-red-600" 
                onClick={() => {
                  if (window.confirm("Are you sure you want to logout?")) {
                    logout();
                  }
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'blue' },
            { label: 'Active Chefs', value: stats?.totalChefs || 0, icon: ChefHat, color: 'emerald' },
            { label: 'Total Recipes', value: stats?.totalRecipes || 0, icon: BookOpen, color: 'orange' },
            { label: 'Groups', value: stats?.totalGroups || 0, icon: MessageSquare, color: 'purple' }
          ].map((item, idx) => (
            <Card key={idx} className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-emerald-50 text-emerald-600`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="text-2xl font-black text-slate-900">{item.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="flex overflow-x-auto border-b border-slate-100 scrollbar-hide">
            {[
              { id: 'pending', label: 'Pending Chefs', count: pendingRestaurants.length },
              { id: 'promotions', label: 'Promotions', count: pendingPromotions.length },
              { id: 'verified', label: 'All Chefs', count: verifiedRestaurants.length },
              { id: 'users', label: 'Users', count: allUsers.length },
              { id: 'recipes', label: 'Recipes', count: allRecipes.length },
              { id: 'community', label: 'Community', count: communityGroups.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-none px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'pending' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest text-left">
                    <tr>
                      <th className="px-6 py-4">Restaurant/Chef</th>
                      <th className="px-6 py-4">Applied Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingRestaurants.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">No pending verifications found.</td></tr>
                    ) : (
                      pendingRestaurants.map(chef => (
                        <tr key={chef._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden">
                                {chef.profile?.avatar && <img src={chef.profile.avatar} className="w-full h-full object-cover" />}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{chef.restaurant?.name || chef.username}</p>
                                <p className="text-xs text-slate-400">{chef.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {new Date(chef.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" onClick={() => handleVerify(chef._id)} className="bg-emerald-600 hover:bg-emerald-700 h-8 px-4 text-[11px] font-black rounded-lg">Verify</Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteUser(chef._id)} className="text-rose-600 hover:bg-rose-50 h-8 px-4 text-[11px] font-black rounded-lg">Reject</Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : activeTab === 'promotions' ? (
               <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest text-left">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Requested Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingPromotions.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-500 italic">No promotion requests.</td></tr>
                    ) : (
                      pendingPromotions.map(u => (
                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden">
                                {u.profile?.avatar && <img src={u.profile.avatar} className="w-full h-full object-cover" />}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{u.username}</p>
                                <p className="text-xs text-slate-400">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {new Date(u.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" onClick={() => handleApprovePromotion(u._id)} className="bg-emerald-600 hover:bg-emerald-700 h-8 px-4 text-[11px] font-black rounded-lg">Approve</Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : activeTab === 'verified' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest text-left">
                    <tr>
                      <th className="px-6 py-4">Chef/Restaurant</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {verifiedRestaurants.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">No verified chefs found.</td></tr>
                    ) : (
                      verifiedRestaurants.map(chef => (
                        <tr key={chef._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-100 overflow-hidden">
                                {chef.profile?.avatar && <img src={chef.profile.avatar} className="w-full h-full object-cover" />}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{chef.restaurant?.name || chef.username}</p>
                                <p className="text-xs text-slate-400">{chef.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                              Verified
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {new Date(chef.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteUser(chef._id)} className="text-rose-600 hover:bg-rose-50 h-8 px-4 text-[11px] font-black rounded-lg">Suspended</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : activeTab === 'users' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest text-left">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allUsers.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-500 italic">No users found.</td></tr>
                    ) : (
                      allUsers.map(u => (
                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-100 overflow-hidden">
                                {u.profile?.avatar && <img src={u.profile.avatar} className="w-full h-full object-cover" />}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{u.username}</p>
                                <p className="text-xs text-slate-400">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteUser(u._id)} className="text-rose-600 hover:bg-rose-50 h-8 px-4 text-[11px] font-black rounded-lg">Delete</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : activeTab === 'recipes' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest text-left">
                    <tr>
                      <th className="px-6 py-4">Recipe</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allRecipes.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">No recipes found on the platform.</td></tr>
                    ) : (
                      allRecipes.map(recipe => (
                        <tr key={recipe._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-orange-100 overflow-hidden">
                                {recipe.images?.length > 0 && <img src={recipe.images[0].url || recipe.images[0]} className="w-full h-full object-cover" />}
                              </div>
                              <span className="font-bold text-slate-900 line-clamp-1">{recipe.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {recipe.author?.profile?.fullName || recipe.author?.username || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {new Date(recipe.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedRecipeId(recipe._id);
                                  setIsEditModalOpen(true);
                                }}
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteRecipe(recipe._id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : activeTab === 'community' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest text-left">
                    <tr>
                      <th className="px-6 py-4">Group Name</th>
                      <th className="px-6 py-4">Owner</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {communityGroups.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-500 italic">No community groups found.</td></tr>
                    ) : (
                      communityGroups.map(group => (
                        <tr key={group._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{group.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{group.creator?.username || group.owner?.username}</td>
                          <td className="px-6 py-4 text-right">
                             <Button size="sm" variant="ghost" onClick={() => handleDeleteGroup(group._id)} className="text-rose-600 hover:bg-rose-50 h-8 px-4 text-[11px] font-black rounded-lg">Delete</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Use the tabs above to manage users, verified chefs, and more.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <EditRecipeModal
        recipeId={selectedRecipeId}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          fetchAdminData();
        }}
        isAdmin={true}
      />
    </div>
  );
}
