
import React, { useState } from 'react';
import { Subject, StudyRoomListing } from '../types';
import { AVAILABLE_SUBJECTS, MOCK_ROOMS, MOCK_LEADERBOARD, MOCK_FRIENDS, MOCK_USER_PROFILE, MOCK_CAMPUS_SPOTS } from '../constants';
import Button from './Button';
import CreateRoomModal from './CreateRoomModal';

interface DashboardProps {
  onJoinRoom: (room: StudyRoomListing) => void;
  onOpenProfile: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onJoinRoom, onOpenProfile }) => {
  const [filterSubject, setFilterSubject] = useState<Subject | 'All'>('All');
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  const filteredRooms = filterSubject === 'All' 
    ? MOCK_ROOMS 
    : MOCK_ROOMS.filter(r => r.subject === filterSubject);

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white font-sans overflow-x-hidden relative selection:bg-indigo-500/30">
      
      {/* --- Premium Background Layers --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-800/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]"></div>
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal 
        isOpen={showCreateRoom} 
        onClose={() => setShowCreateRoom(false)}
        onCreate={onJoinRoom}
      />

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fa-solid fa-layer-group text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">MyndSpace</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
                variant="secondary" 
                className="text-sm py-1.5 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all" 
                icon="fa-plus" 
                label="Create Room" 
                onClick={() => setShowCreateRoom(true)}
            />
            <div 
                className="w-9 h-9 rounded-full bg-[#e8e48b] overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-colors cursor-pointer ring-2 ring-white/5"
                onClick={onOpenProfile}
            >
               <img src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${MOCK_USER_PROFILE.avatarSeed}`} alt="User" />
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        
        {/* Left: Main Content (Room List) */}
        <div className="flex-1">
          
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Study Rooms</h1>
              <p className="text-slate-400">Join a virtual space, match with peers, and focus.</p>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              <button 
                onClick={() => setFilterSubject('All')}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${filterSubject === 'All' ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'}`}
              >
                All Subjects
              </button>
              {AVAILABLE_SUBJECTS.slice(0, 4).map(sub => (
                <button 
                  key={sub}
                  onClick={() => setFilterSubject(sub)}
                  className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${filterSubject === sub ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'}`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div key={room.id} className="group bg-[#18181b]/60 hover:bg-[#18181b]/80 border border-white/5 backdrop-blur-md rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-500/20 relative overflow-hidden">
                
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                {/* Header */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner ring-2 ring-white/5">
                      {room.hostAvatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{room.hostName}</div>
                      <div className="text-xs text-slate-500">{room.gradeLevel}</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-black/40 text-xs font-mono text-slate-400 flex items-center gap-1 border border-white/5">
                    <i className="fa-solid fa-user-group text-[10px]"></i>
                    {room.participants}/{room.maxParticipants}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-300 transition-colors">{room.topic}</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[10px] px-2 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded font-medium">
                        {room.subject}
                    </span>
                    {room.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-1 bg-white/5 text-slate-400 rounded border border-white/5">
                        {tag}
                        </span>
                    ))}
                    </div>

                    {/* Footer Action */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex -space-x-2">
                        {[...Array(Math.min(3, room.participants))].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border border-slate-900"></div>
                        ))}
                        {room.participants > 3 && <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-[8px] text-slate-400">+{room.participants - 3}</div>}
                    </div>
                    <button 
                        onClick={() => onJoinRoom(room)}
                        className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-white/5"
                    >
                        Join Room
                    </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Activity & Leaderboard */}
        <div className="w-full md:w-80 space-y-6">
            
            {/* Campus Spots Live Widget */}
            <div className="bg-[#18181b]/40 rounded-2xl p-5 border border-white/5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-200">Campus Spots Live</h3>
                    <div className="flex items-center gap-1 text-xs text-green-400">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live
                    </div>
                </div>
                <div className="space-y-4">
                    {MOCK_CAMPUS_SPOTS.map(spot => (
                        <div key={spot.id} className="group">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-300">{spot.name}</span>
                                <span className={`font-medium ${
                                    spot.capacity > 80 ? 'text-red-400' : 
                                    spot.capacity > 50 ? 'text-yellow-400' : 'text-green-400'
                                }`}>{spot.capacity}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                         spot.capacity > 80 ? 'bg-red-500' : 
                                         spot.capacity > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`} 
                                    style={{ width: `${spot.capacity}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Friends Online */}
             <div className="bg-[#18181b]/40 rounded-2xl p-5 border border-white/5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-200">Friends Online</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {MOCK_FRIENDS.length} active
                    </div>
                </div>
                <div className="space-y-4">
                    {MOCK_FRIENDS.map(friend => (
                        <div key={friend.id} className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors">
                            <div className="relative">
                                <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${friend.avatarSeed}`} className="w-10 h-10 rounded-full bg-slate-800" alt={friend.name} />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#18181b] ${friend.status === 'Deep Focus' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{friend.name}</div>
                                <div className="text-xs text-slate-400">{friend.status} • {friend.duration}m</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-[#18181b]/40 rounded-2xl p-5 border border-white/5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-200">Monthly Top 5</h3>
                    <i className="fa-solid fa-trophy text-yellow-500"></i>
                </div>
                <div className="space-y-3">
                    {MOCK_LEADERBOARD.map((entry) => (
                        <div key={entry.id} className="flex items-center gap-3 group hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                            <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded shadow-lg ${entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-yellow-500/20' : entry.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-black' : entry.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white' : 'text-slate-500 bg-white/5'}`}>
                                {entry.rank}
                            </div>
                            <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${entry.avatarSeed}`} className="w-8 h-8 rounded-full bg-slate-800" alt={entry.name} />
                            <div className="flex-1">
                                <div className="text-sm font-medium text-slate-200">{entry.name}</div>
                            </div>
                            <div className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                                {entry.hoursThisMonth}h
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Promo */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/80 to-purple-900/80 p-6 border border-white/10 group cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-indigo-900/20">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors"></div>
                <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white mb-2">Stuck on a problem?</h3>
                    <p className="text-indigo-100 text-sm mb-4">Your personal AI Tutor is available in every room.</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg text-xs font-mono text-white backdrop-blur-md border border-white/10 group-hover:bg-white/30 transition-colors">
                        <i className="fa-solid fa-robot"></i>
                        Powered by Gemini
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
