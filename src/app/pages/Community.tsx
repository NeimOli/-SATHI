import { useEffect, useState, useRef } from "react";
import { Users, Plus, Send, ArrowLeft, MessageSquare, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";

export function Community() {
  const { user, token } = useAuth();
  
  const [groups, setGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const [newMessage, setNewMessage] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = user ? (user as any).id || (user as any)._id : null;

  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
      const res = await fetch("http://localhost:5000/api/community/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data?.data?.groups) {
        setGroups(data.data.groups);
        // If a group was selected, update it
        if (selectedGroup) {
          const updated = data.data.groups.find((g: any) => g._id === selectedGroup._id);
          if (updated) setSelectedGroup(updated);
        }
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchMessages = async (groupId: string) => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`http://localhost:5000/api/community/groups/${groupId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data?.data?.messages) {
        setMessages(data.data.messages);
        scrollToBottom();
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGroups();
    }
  }, [token]);

  useEffect(() => {
    if (selectedGroup && selectedGroup.members?.includes(userId)) {
      fetchMessages(selectedGroup._id);
    } else {
      setMessages([]);
    }
  }, [selectedGroup, userId, token]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupDescription.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/community/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newGroupName, description: newGroupDescription }),
      });
      
      const data = await res.json();
      if (res.ok && data?.data?.group) {
        setIsCreatingGroup(false);
        setNewGroupName("");
        setNewGroupDescription("");
        await fetchGroups();
        setSelectedGroup(data.data.group);
      }
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  const handleJoinGroup = async () => {
    if (!selectedGroup) return;
    try {
      const res = await fetch(`http://localhost:5000/api/community/groups/${selectedGroup._id}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        await fetchGroups(); // This will also update selectedGroup through fetchGroups logic
      }
    } catch (err) {
      console.error("Error joining group:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedGroup) return;

    try {
      const res = await fetch(`http://localhost:5000/api/community/groups/${selectedGroup._id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });
      
      if (res.ok) {
        setNewMessage("");
        fetchMessages(selectedGroup._id); // Reload messages
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login to Access Community</h1>
      </div>
    );
  }

  const isMember = selectedGroup?.members?.includes(userId);

  return (
    <div className="h-screen max-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex overflow-hidden">
      
      {/* Sidebar: Groups List */}
      <div className={`${selectedGroup ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 bg-white border-r border-orange-100 shadow-sm z-10`}>
        <div className="p-4 border-b border-orange-50 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-500" />
              Communities
            </h2>
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
              onClick={() => setIsCreatingGroup(!isCreatingGroup)}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search groups..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-orange-200">
          {isCreatingGroup && (
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 mb-4 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Create New Group</h3>
              <form onSubmit={handleCreateGroup} className="space-y-3">
                <input
                  type="text"
                  placeholder="Group Name"
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  autoFocus
                />
                <textarea
                  placeholder="What is this group about?"
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  rows={2}
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreatingGroup(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                    Create
                  </Button>
                </div>
              </form>
            </div>
          )}

          {loadingGroups ? (
            <p className="text-center text-gray-400 py-8 text-sm">Loading groups...</p>
          ) : groups.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-gray-500 text-sm">No communities found. Be the first to create one!</p>
            </div>
          ) : (
            groups.map((group) => {
              const amMember = group.members?.includes(userId);
              const isSelected = selectedGroup?._id === group._id;
              
              return (
                <div 
                  key={group._id} 
                  onClick={() => setSelectedGroup(group)}
                  className={`cursor-pointer p-4 rounded-xl transition-all border ${
                    isSelected 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-md transform scale-[1.02]' 
                      : 'bg-white hover:bg-orange-50 border-transparent hover:border-orange-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold truncate pr-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {group.name}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${
                      isSelected ? 'bg-white/20 text-white' : amMember ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {group.members?.length || 0} members
                    </span>
                  </div>
                  <p className={`text-xs line-clamp-2 ${isSelected ? 'text-orange-100' : 'text-gray-500'}`}>
                    {group.description}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Area: Chat / Detail View */}
      <div className={`${!selectedGroup ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-[#faf9f7] relative`}>
        {!selectedGroup ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gradient-to-br from-gray-50 to-orange-50/30">
            <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-orange-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Community</h3>
            <p className="max-w-md">Choose a group from the sidebar to start chatting, sharing recipes, and exploring with fellow food lovers.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 bg-white border-b border-orange-100 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden -ml-2 mr-1 text-gray-500" 
                  onClick={() => setSelectedGroup(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedGroup.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Created by {selectedGroup.creator?.username || selectedGroup.creator?.profile?.fullName || 'Unknown'} • {selectedGroup.members?.length || 0} members
                  </p>
                </div>
              </div>
              
              {!isMember && (
                <Button 
                  onClick={handleJoinGroup}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md rounded-full px-6 transition-transform hover:scale-105"
                >
                  Join Group
                </Button>
              )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {!isMember ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">You haven't joined yet</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Join "{selectedGroup.name}" to view messages, share your recipes, and interact with the community.
                  </p>
                  <Button 
                    onClick={handleJoinGroup}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 rounded-full px-8 w-full"
                  >
                    Join Now
                  </Button>
                </div>
              ) : loadingMessages ? (
                <div className="flex justify-center py-10">
                  <div className="animate-pulse flex space-x-2">
                    <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 text-gray-200 mb-3" />
                  <p>No messages yet.</p>
                  <p className="text-sm">Be the first to say hello!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMine = msg.author?._id === userId;
                  // Simple logic to show date divider if it's a new day, skipped here for brevity
                  
                  return (
                    <div key={msg._id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} mb-4`}>
                      <span className="text-[10px] text-gray-400 mb-1 px-1">
                        {isMine ? 'You' : msg.author?.profile?.fullName || msg.author?.username} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <div 
                        className={`max-w-[75%] md:max-w-[65%] px-4 py-2.5 rounded-2xl ${
                          isMine 
                            ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-tr-sm shadow-md shadow-orange-500/20' 
                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        
                        {msg.recipeId && (
                          <div className={`mt-3 p-2 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                            isMine ? 'bg-white/20 border-white/30 hover:bg-white/30' : 'bg-orange-50/50 border-orange-100 hover:bg-orange-50'
                          }`}>
                            <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                              {msg.recipeId.images?.[0]?.url ? (
                                <img src={msg.recipeId.images[0].url} alt={msg.recipeId.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-orange-200" />
                              )}
                            </div>
                            <div>
                              <p className={`text-xs font-semibold line-clamp-1 ${isMine ? 'text-white' : 'text-gray-900'}`}>
                                {msg.recipeId.title}
                              </p>
                              <p className={`text-[10px] ${isMine ? 'text-white/80' : 'text-gray-500'}`}>Shared Recipe</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {isMember && (
              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-3xl p-1 shadow-inner focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-300 transition-all">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full bg-transparent px-4 py-3 max-h-32 text-sm focus:outline-none resize-none scrollbar-thin overflow-y-auto"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="shrink-0 h-10 w-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white m-1 transition-transform active:scale-95"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </Button>
                </form>
                <div className="flex justify-between items-center mt-2 px-4">
                  <span className="text-[10px] text-gray-400">Press Enter to send, Shift+Enter for new line</span>
                  {/* Future enhancement: Button to attach recipe here */}
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
