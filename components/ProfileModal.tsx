import React, { useState } from 'react';
import { MOCK_USER_PROFILE, MOCK_FRIEND_LIST, MOCK_FRIEND_REQUESTS } from '../constants';
import { UserProfile, Friend, FriendRequest } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'Profile' | 'Friends' | 'Requests'>('Profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for edits
  const [profileData, setProfileData] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [friends, setFriends] = useState<Friend[]>(MOCK_FRIEND_LIST);
  const [requests, setRequests] = useState<FriendRequest[]>(MOCK_FRIEND_REQUESTS);

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In a real app, this would make an API call
  };

  const handleAcceptRequest = (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    // Add logic to move to friends list
  };

  const handleDeclineRequest = (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1a1a] w-[800px] h-[550px] rounded-2xl flex overflow-hidden shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="w-[300px] bg-[#121212] p-8 flex flex-col items-center relative border-r border-white/5">
          <div className="relative mb-4">
            <div className="w-32 h-32 bg-[#e8e48b] rounded-xl flex items-center justify-center overflow-hidden border-4 border-[#1a1a1a] shadow-xl group cursor-pointer">
               <img src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profileData.avatarSeed}`} alt="Avatar" className="w-24 h-24 group-hover:scale-110 transition-transform duration-300" />
               {isEditing && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                   <i className="fa-solid fa-camera text-white text-xl"></i>
                 </div>
               )}
            </div>
            <div className="absolute bottom-2 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#121212]"></div>
          </div>

          {isEditing ? (
            <input 
              type="text" 
              value={profileData.name} 
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              className="bg-[#222] border border-white/10 rounded px-2 py-1 text-white text-center font-bold mb-2 w-full focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          ) : (
            <h2 className="text-xl font-bold text-white mb-2 text-center">{profileData.name}</h2>
          )}
          
          {profileData.isPremium && (
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full mb-6 tracking-wider shadow-lg shadow-yellow-500/20">
              <i className="fa-solid fa-crown mr-1"></i> PREMIUM
            </div>
          )}

          {isEditing ? (
            <textarea 
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              className="bg-[#222] border border-white/10 rounded p-2 text-xs text-slate-300 w-full mb-6 h-24 resize-none focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          ) : (
            <p className="text-sm text-slate-300 text-center mb-6 leading-relaxed line-clamp-4">
              {profileData.bio}
            </p>
          )}

          <div className="w-full space-y-2 text-sm text-slate-400 mt-auto">
             <div className="flex justify-between">
                <span>Female • {profileData.age}y</span>
             </div>
             <div className="pt-4 border-t border-white/5">
                <span className="block text-white font-medium mb-1">Study Duration</span>
                <span className="text-slate-200">{profileData.studyDuration}</span>
             </div>
          </div>
          
          <button 
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            className={`mt-6 w-full py-2 rounded-lg text-sm font-medium transition-colors ${isEditing ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-[#333] hover:bg-[#444] text-white'}`}
          >
            {isEditing ? 'Save Changes' : 'Edit profile'}
          </button>
        </div>

        {/* Right Column: Details & Tabs */}
        <div className="flex-1 flex flex-col bg-[#1a1a1a]">
           {/* Header / Tabs */}
           <div className="flex justify-between items-center px-6 pt-6 pb-2 border-b border-white/5">
              <div className="flex gap-6 text-sm font-medium">
                 <button 
                    onClick={() => setActiveTab('Profile')}
                    className={`pb-2 relative transition-colors ${activeTab === 'Profile' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                    Profile
                    {activeTab === 'Profile' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 animate-fade-in-up"></div>}
                 </button>
                 <button 
                    onClick={() => setActiveTab('Friends')}
                    className={`pb-2 relative transition-colors ${activeTab === 'Friends' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                    Friends ({friends.length})
                    {activeTab === 'Friends' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 animate-fade-in-up"></div>}
                 </button>
                 <button 
                    onClick={() => setActiveTab('Requests')}
                    className={`pb-2 relative transition-colors ${activeTab === 'Requests' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                    Requests
                    {requests.length > 0 && <span className="ml-1 w-1.5 h-1.5 bg-red-500 rounded-full inline-block mb-1"></span>}
                    {activeTab === 'Requests' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 animate-fade-in-up"></div>}
                 </button>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                 <i className="fa-solid fa-xmark text-lg"></i>
              </button>
           </div>

           {/* Content */}
           <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1 relative">
              
              {activeTab === 'Profile' && (
                <div className="space-y-8 animate-fade-in-up">
                  {/* About Section */}
                  <div className="group">
                     <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-slate-400">About</h3>
                        {!isEditing && <i className="fa-solid fa-pen text-xs text-slate-600 group-hover:text-slate-400 cursor-pointer" onClick={() => setIsEditing(true)}></i>}
                     </div>
                     <p className="text-slate-300 text-sm leading-relaxed">
                        {profileData.bio}
                     </p>
                  </div>

                  {/* Social Media */}
                  <div className="group">
                     <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-slate-400">Social media</h3>
                        {!isEditing && <i className="fa-solid fa-plus text-xs text-slate-600 group-hover:text-slate-400 cursor-pointer"></i>}
                     </div>
                     <div className="space-y-2">
                        {profileData.socialLinks.map(link => (
                            <div key={link.platform} className="flex items-center gap-2 text-sm text-white">
                               {link.platform === 'LinkedIn' && <i className="fa-brands fa-linkedin text-blue-500"></i>}
                               <a href={link.url} target="_blank" rel="noreferrer" className="hover:underline">{link.url}</a>
                            </div>
                        ))}
                     </div>
                  </div>

                  {/* Interests */}
                  <div className="group">
                     <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-slate-400">Interests</h3>
                        {!isEditing && <i className="fa-solid fa-plus text-xs text-slate-600 group-hover:text-slate-400 cursor-pointer"></i>}
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {profileData.interests.map((interest, idx) => (
                           <span key={interest} className="px-3 py-1 bg-[#333] rounded-full text-xs text-slate-200 border border-white/5 hover:bg-[#444] cursor-default transition-colors flex items-center gap-2">
                              {interest}
                              {isEditing && (
                                <i 
                                  className="fa-solid fa-xmark hover:text-red-400 cursor-pointer"
                                  onClick={() => setProfileData(prev => ({...prev, interests: prev.interests.filter((_, i) => i !== idx)}))}
                                ></i>
                              )}
                           </span>
                        ))}
                        <button className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-xs text-slate-400 hover:text-white transition-colors">
                           <i className="fa-solid fa-plus"></i>
                        </button>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'Friends' && (
                <div className="space-y-2 animate-fade-in-up">
                  {friends.length === 0 ? (
                    <div className="text-center text-slate-500 py-10">No friends yet</div>
                  ) : (
                    friends.map(friend => (
                      <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                             <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${friend.avatarSeed}`} className="w-10 h-10 rounded-full bg-slate-700" alt={friend.name} />
                             <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1a1a1a] ${friend.status === 'Online' ? 'bg-green-500' : friend.status === 'In Room' ? 'bg-indigo-500' : 'bg-slate-500'}`}></div>
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{friend.name}</div>
                            <div className="text-xs text-slate-400">{friend.status} {friend.lastSeen && `• ${friend.lastSeen}`}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-8 h-8 rounded-full bg-slate-700 hover:bg-indigo-600 text-white transition-colors flex items-center justify-center">
                            <i className="fa-solid fa-message text-xs"></i>
                          </button>
                          <button className="w-8 h-8 rounded-full bg-slate-700 hover:bg-red-600 text-white transition-colors flex items-center justify-center">
                            <i className="fa-solid fa-user-minus text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'Requests' && (
                <div className="space-y-4 animate-fade-in-up">
                  {requests.length === 0 ? (
                    <div className="text-center text-slate-500 py-10">No pending requests</div>
                  ) : (
                    requests.map(req => (
                      <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${req.avatarSeed}`} className="w-12 h-12 rounded-full bg-slate-700" alt={req.name} />
                          <div>
                            <div className="text-white font-medium text-sm">{req.name}</div>
                            <div className="text-xs text-slate-400">{req.mutualFriends} mutual friends • {req.timestamp}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAcceptRequest(req.id)}
                            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleDeclineRequest(req.id)}
                            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-bold transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

           </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileModal;