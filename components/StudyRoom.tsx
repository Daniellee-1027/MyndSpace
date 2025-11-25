import React, { useState, useEffect, useRef } from 'react';
import { RoomConfig, Scene, ChatMessage, Subject } from '../types';
import { SCENES, MOCK_USER_PROFILE } from '../constants';
import Button from './Button';
import { generateTutorResponse } from '../services/geminiService';

interface StudyRoomProps {
  config: RoomConfig;
  onLeave: () => void;
  onOpenProfile: () => void;
}

const StudyRoom: React.FC<StudyRoomProps> = ({ config, onLeave, onOpenProfile }) => {
  const [currentScene, setCurrentScene] = useState<Scene>(SCENES.find(s => s.id === config.sceneId) || SCENES[0]);
  
  // Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // Public Chat States
  const [publicMessages, setPublicMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: 'p1', senderName: 'Megan Pfeffer', text: 'I swear i get bored easily. This keeps me entertained...', timestamp: new Date() },
    { id: '2', senderId: 'p2', senderName: 'Pedro Wilderman', text: 'I like this space better 😋', timestamp: new Date() },
  ]);
  const [publicInputText, setPublicInputText] = useState('');

  // AV States
  const [isVideoActive, setIsVideoActive] = useState(config.isVideoOn);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraSize, setCameraSize] = useState<number>(1); // 1 = normal, 2 = large
  
  // Widget States
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // New Interactive Modal States
  const [showSearch, setShowSearch] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [showBackgroundGallery, setShowBackgroundGallery] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Waiting / Focus State
  const [isWaiting, setIsWaiting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const publicMessagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Initial Welcome Message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        senderId: 'system',
        senderName: 'System',
        text: `Welcome to MyndSpace. I am your AI Tutor for ${config.roomDetails.subject}. How can I help?`,
        timestamp: new Date(),
        isAi: true
      }
    ]);
  }, []);

  // Initialize Camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isVideoActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.log("Camera permission denied", err));
    } else {
        if(videoRef.current) videoRef.current.srcObject = null;
    }
    return () => { stream?.getTracks().forEach(track => track.stop()); };
  }, [isVideoActive]);

  // Timer Logic
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
        timerRef.current = window.setInterval(() => {
            setTimerSeconds(prev => prev - 1);
        }, 1000);
    } else if (timerSeconds === 0) {
        setIsTimerRunning(false);
        // Play alarm sound mock
    }
    return () => { if(timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning, timerSeconds]);

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { publicMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [publicMessages]);

  const handleAiSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), senderId: 'user', senderName: 'You', text: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsAiThinking(true);

    const aiResponseText = await generateTutorResponse([...messages, userMsg], config.roomDetails.subject);
    
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      senderId: 'ai',
      senderName: 'MyndAI',
      text: aiResponseText,
      timestamp: new Date(),
      isAi: true
    }]);
    setIsAiThinking(false);
  };

  const handlePublicSendMessage = () => {
    if (!publicInputText.trim()) return;
    setPublicMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: 'You',
        text: publicInputText,
        timestamp: new Date()
    }]);
    setPublicInputText('');
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCameraResize = (delta: number) => {
      setCameraSize(prev => {
          const newState = prev + delta;
          if (newState < 0) return 0; // Hidden
          if (newState > 2) return 2; // Max size
          return newState;
      });
  };

  const handleStartSession = () => {
    setIsWaiting(true);
    // Simulate finding match
    setTimeout(() => {
        setIsWaiting(false);
        // Maybe trigger a toast or notification here
    }, 4000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div 
      className="relative w-full h-screen bg-cover bg-center overflow-hidden font-sans transition-all duration-1000"
      style={{ backgroundImage: `url(${currentScene.imageUrl})` }}
    >
      {/* ---------------- OVERLAYS ---------------- */}
      
      {/* 0. Waiting Overlay */}
      {isWaiting && (
        <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in-up">
           <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <i className="fa-solid fa-brain text-indigo-400 text-3xl animate-pulse"></i>
              </div>
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">Matching Study Partners...</h2>
           <p className="text-slate-400">Finding peers focused on {config.roomDetails.subject}</p>
           <button onClick={() => setIsWaiting(false)} className="mt-8 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-white/10 transition-colors">
              Cancel
           </button>
        </div>
      )}

      {/* 1. Timer Widget */}
      {showTimer && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl z-50 w-64 text-center animate-fade-in-down">
              <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400 text-sm font-medium"><i className="fa-solid fa-clock mr-2"></i>Pomodoro</span>
                  <button onClick={() => setShowTimer(false)} className="text-slate-500 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
              </div>
              <div className="text-5xl font-mono font-bold text-white mb-6 tracking-wider">
                  {formatTime(timerSeconds)}
              </div>
              <div className="flex justify-center gap-3">
                  <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${isTimerRunning ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-green-500 hover:bg-green-400'}`}>
                      <i className={`fa-solid ${isTimerRunning ? 'fa-pause' : 'fa-play'}`}></i>
                  </button>
                  <button onClick={() => { setIsTimerRunning(false); setTimerSeconds(1500); }} className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-colors">
                      <i className="fa-solid fa-rotate-left"></i>
                  </button>
              </div>
          </div>
      )}

      {/* 2. Music Widget */}
      {showMusic && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 ml-72 bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl z-50 w-72 animate-fade-in-down">
              <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400 text-sm font-medium"><i className="fa-solid fa-music mr-2"></i>Lofi Radio</span>
                  <button onClick={() => setShowMusic(false)} className="text-slate-500 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg ${isPlayingMusic ? 'animate-pulse' : ''}`}>
                     <i className="fa-solid fa-headphones text-2xl text-white"></i>
                  </div>
                  <div>
                      <div className="text-white font-medium">Chill Hop Beats</div>
                      <div className="text-xs text-slate-400">Lofi Girl</div>
                  </div>
              </div>
              <div className="h-1 bg-slate-700 rounded-full mb-4 overflow-hidden">
                  <div className={`h-full bg-indigo-500 transition-all duration-1000 ${isPlayingMusic ? 'w-2/3' : 'w-1/3'}`}></div>
              </div>
              <div className="flex justify-between items-center text-xl text-slate-300 px-2">
                  <button className="hover:text-white"><i className="fa-solid fa-backward-step"></i></button>
                  <button onClick={() => setIsPlayingMusic(!isPlayingMusic)} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
                      <i className={`fa-solid ${isPlayingMusic ? 'fa-pause' : 'fa-play'}`}></i>
                  </button>
                  <button className="hover:text-white"><i className="fa-solid fa-forward-step"></i></button>
              </div>
          </div>
      )}

      {/* 3. Settings Modal */}
      {showSettings && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
              <div className="bg-slate-900 p-6 rounded-2xl border border-white/10 w-96 shadow-2xl animate-fade-in-up">
                  <h2 className="text-xl font-bold text-white mb-4">Room Settings</h2>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center">
                          <span className="text-slate-300">Allow Notifications</span>
                          <div className="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-slate-300">Background Blur</span>
                           <div className="w-10 h-6 bg-slate-700 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-slate-300">Ambient Sound Volume</span>
                          <input type="range" className="w-24 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer" />
                      </div>
                  </div>
                  <button onClick={() => setShowSettings(false)} className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors">Close</button>
              </div>
          </div>
      )}

      {/* 4. Search Modal */}
      {showSearch && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-slate-900 w-[500px] rounded-2xl border border-white/10 shadow-2xl animate-fade-in-up overflow-hidden">
             <div className="p-4 border-b border-white/10 flex items-center gap-3">
               <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
               <input 
                  type="text" 
                  autoFocus
                  placeholder="Search for resources, definitions, or study notes..."
                  className="bg-transparent border-none outline-none text-white w-full placeholder-slate-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
               <button onClick={() => setShowSearch(false)}><i className="fa-solid fa-xmark text-slate-400 hover:text-white"></i></button>
             </div>
             <div className="p-4 min-h-[200px] text-slate-400 text-center flex flex-col items-center justify-center">
                {searchQuery ? (
                  <>
                    <p>Searching for "{searchQuery}"...</p>
                    <div className="mt-4 w-6 h-6 border-2 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-lightbulb text-4xl mb-3 opacity-20"></i>
                    <p className="text-sm">Type to search across MyndSpace resources.</p>
                  </>
                )}
             </div>
          </div>
        </div>
      )}

      {/* 5. Files Modal */}
      {showFiles && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-slate-900 w-[600px] h-[400px] rounded-2xl border border-white/10 shadow-2xl animate-fade-in-up flex flex-col">
             <div className="p-4 border-b border-white/10 flex justify-between items-center">
               <h3 className="font-bold text-white">Room Resources</h3>
               <button onClick={() => setShowFiles(false)}><i className="fa-solid fa-xmark text-slate-400 hover:text-white"></i></button>
             </div>
             <div className="flex-1 p-6 grid grid-cols-4 gap-4 overflow-y-auto">
                <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 border border-white/5 border-dashed cursor-pointer hover:bg-white/10 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform"><i className="fa-solid fa-plus text-slate-400"></i></div>
                  <span className="text-xs text-slate-400">Upload</span>
                </div>
                {[1,2,3].map(i => (
                   <div key={i} className="bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 border border-white/5 hover:border-indigo-500/50 transition-colors cursor-pointer relative group">
                      <i className="fa-solid fa-file-pdf text-3xl text-red-400"></i>
                      <span className="text-xs text-slate-300 text-center truncate w-full">Calculus_Notes_Ch{i}.pdf</span>
                      <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"><i className="fa-solid fa-download"></i></button>
                   </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* 6. Background Gallery Modal */}
      {showBackgroundGallery && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center">
           <div className="w-[800px] max-h-[80vh] bg-slate-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col animate-fade-in-up">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-white">Select Environment</h2>
                 <button onClick={() => setShowBackgroundGallery(false)} className="text-slate-400 hover:text-white"><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>
              <div className="p-6 overflow-y-auto grid grid-cols-3 gap-4">
                 {SCENES.map(scene => (
                    <div 
                      key={scene.id} 
                      onClick={() => { setCurrentScene(scene); setShowBackgroundGallery(false); }}
                      className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer group border-2 transition-all ${currentScene.id === scene.id ? 'border-indigo-500 shadow-xl shadow-indigo-500/20' : 'border-transparent opacity-80 hover:opacity-100'}`}
                    >
                       <img src={scene.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={scene.name} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                          <span className="text-white font-medium text-sm flex items-center gap-2">
                             <i className={`fa-solid ${scene.icon} text-xs`}></i> {scene.name}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}


      {/* ---------------- UI LAYOUT ---------------- */}
      
      {/* 1. Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 flex justify-between items-center px-6 z-50 transition-transform duration-500">
        
        {/* Left: Logo & Room Controls */}
        <div className="flex items-center gap-4">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 text-white shadow-lg">
             <div className="w-5 h-5 bg-indigo-500 rounded flex items-center justify-center"><i className="fa-solid fa-layer-group text-[10px]"></i></div>
             <span className="font-bold tracking-tight">MyndSpace</span>
          </div>
          
          <div className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3 text-white shadow-lg">
             <i className="fa-solid fa-video text-xs text-slate-300"></i>
             <span className="text-sm font-medium">My Room</span>
             <button 
                onClick={handleStartSession}
                className="bg-red-500 hover:bg-red-600 px-3 py-0.5 rounded text-xs font-bold transition-colors shadow-red-500/20"
             >
                Start
             </button>
          </div>

          <div className="flex gap-1">
            <button onClick={() => handleCameraResize(-1)} className="w-8 h-8 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/10 flex items-center justify-center transition-colors"><i className="fa-solid fa-minus text-xs"></i></button>
            <button onClick={() => handleCameraResize(1)} className="w-8 h-8 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/10 flex items-center justify-center transition-colors"><i className="fa-solid fa-plus text-xs"></i></button>
          </div>
        </div>

        {/* Center: Location Tag */}
        <div 
          onClick={() => setShowBackgroundGallery(true)}
          className="absolute left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/5 flex items-center gap-2 text-slate-200 text-sm shadow-xl hover:bg-black/60 cursor-pointer transition-colors"
        >
             <i className="fa-solid fa-location-dot text-white"></i>
             <span>{currentScene.name}, Virtual</span>
        </div>

        {/* Right: Controls & User */}
        <div className="flex items-center gap-3">
             <div className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-yellow-400 text-sm font-bold flex items-center gap-2 cursor-pointer hover:bg-black/70 transition-colors">
                <i className="fa-solid fa-crown text-xs"></i> Premium
             </div>
             
             <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md border border-white/10 p-1 rounded-lg">
                <div className="relative w-8 h-8 cursor-pointer hover:opacity-80" onClick={onOpenProfile}>
                     <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-white"><i className="fa-solid fa-user-plus text-xs"></i></div>
                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold border border-black">2</div>
                </div>
             </div>

             <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md border border-white/10 p-1 rounded-lg text-white">
                 <button className="w-8 h-8 hover:bg-white/10 rounded flex items-center justify-center transition-colors"><i className="fa-solid fa-share text-sm"></i></button>
                 <button className="w-8 h-8 hover:bg-white/10 rounded flex items-center justify-center transition-colors"><i className="fa-solid fa-expand text-sm"></i></button>
             </div>

             <div className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-white text-sm font-bold flex items-center gap-2">
                <i className="fa-solid fa-fire text-orange-500"></i> 6
             </div>

             <div 
                className="w-9 h-9 bg-[#e8e48b] rounded-lg overflow-hidden border-2 border-white/20 cursor-pointer hover:border-white transition-colors"
                onClick={onOpenProfile}
             >
                <img src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${MOCK_USER_PROFILE.avatarSeed}`} alt="Me" />
             </div>
        </div>
      </div>

      {/* 2. Floating AI Assistant (Left) */}
      <div className="absolute top-24 left-6 bottom-32 w-80 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden z-40 transition-all duration-300">
         {/* Header */}
         <div className="p-3 border-b border-white/10 flex justify-between items-center bg-black/20">
            <span className="text-slate-200 text-sm font-medium flex items-center gap-2">
                Mynd AI Tutor
            </span>
            <div className="flex gap-2 text-slate-400">
                <i className="fa-solid fa-minus text-xs cursor-pointer hover:text-white"></i>
            </div>
         </div>

         {/* Chat Content */}
         <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.senderId === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.isAi ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                        {msg.isAi ? <i className="fa-solid fa-robot text-xs text-white"></i> : <span className="text-xs text-white">Me</span>}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.isAi ? 'bg-slate-800/80 text-slate-200 border border-white/5' : 'bg-indigo-600 text-white'}`}>
                        {msg.text}
                        {msg.isAi && <div className="mt-2 text-[10px] text-indigo-300 flex items-center gap-1"><i className="fa-solid fa-bolt text-[8px]"></i> 25 tokens used</div>}
                    </div>
                </div>
            ))}
            {isAiThinking && (
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center"><i className="fa-solid fa-robot text-xs text-white"></i></div>
                    <div className="bg-slate-800/80 rounded-2xl px-4 py-3 border border-white/5">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* Bottom Actions */}
         <div className="p-4 pt-0">
             <div className="flex gap-2 mb-3">
                 <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-white/5 transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-rotate-right"></i> Regenerate response
                 </button>
             </div>
             <div className="relative">
                 <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiSendMessage(); } }}
                    placeholder="Ask something..."
                    className="w-full bg-slate-800/80 border border-slate-600/50 rounded-xl p-3 pr-10 text-sm text-white resize-none h-12 focus:ring-1 focus:ring-indigo-500 outline-none scrollbar-hide"
                 />
                 <button 
                    onClick={handleAiSendMessage}
                    disabled={!inputText.trim()}
                    className="absolute right-2 bottom-2 bg-red-500 hover:bg-red-400 text-white text-xs px-3 py-1 rounded transition-colors"
                 >
                    Ask
                 </button>
             </div>
         </div>
      </div>

      {/* 3. Floating Public Chat (Right) */}
      <div className="absolute top-24 right-6 bottom-32 w-80 bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl flex flex-col z-30 transition-all duration-300">
          <div className="p-3 border-b border-white/10 flex justify-between items-center bg-black/20 rounded-t-2xl">
              <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
                  <i className="fa-solid fa-circle-info text-slate-400"></i>
                  Public chat ({config.roomDetails.participants})
              </div>
              <i className="fa-solid fa-xmark text-slate-400 cursor-pointer hover:text-white"></i>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-hide">
             {publicMessages.map((msg) => (
                 <div key={msg.id} className="flex gap-3">
                     <div className="w-8 h-8 rounded bg-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                         <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${msg.senderName}`} alt="avatar" />
                     </div>
                     <div>
                         <div className="flex items-baseline gap-2 mb-0.5">
                             <span className={`text-xs font-bold ${msg.senderId === 'me' ? 'text-red-400' : 'text-slate-300'}`}>{msg.senderName}</span>
                             <span className="text-[10px] text-slate-500">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         </div>
                         <p className="text-sm text-slate-200 leading-snug">{msg.text}</p>
                     </div>
                 </div>
             ))}
             <div ref={publicMessagesEndRef} />
          </div>

          <div className="p-3 bg-black/20 rounded-b-2xl border-t border-white/10">
              <div className="relative">
                  <input 
                    type="text" 
                    value={publicInputText}
                    onChange={(e) => setPublicInputText(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') handlePublicSendMessage() }}
                    placeholder="Type a message to send"
                    className="w-full bg-slate-800 border-none rounded-lg py-3 px-4 text-sm text-white placeholder-slate-500 focus:ring-0"
                  />
                  <button onClick={handlePublicSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      <i className="fa-solid fa-paper-plane"></i>
                  </button>
              </div>
          </div>
      </div>

      {/* 4. Bottom Dock (Controls) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-3 z-50 transition-transform duration-500">
          
          {/* User Video Bubble */}
          <button 
            onClick={() => setIsVideoActive(!isVideoActive)}
            className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 shadow-xl ${isVideoActive ? 'bg-black border-slate-700' : 'bg-black/80 border-red-500/50 text-red-500 hover:bg-red-500/20'}`}
          >
             {isVideoActive ? (
                <div className="relative w-full h-full overflow-hidden rounded-xl">
                   <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                </div>
             ) : (
                <i className="fa-solid fa-video-slash text-xl"></i>
             )}
          </button>
          
          {/* Main Control Pill */}
          <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl px-4 py-2 flex items-center gap-1 shadow-2xl h-14">
              
              {/* Search & Image */}
              <div className="flex gap-1 mr-2">
                 <button 
                    onClick={() => setShowSearch(!showSearch)}
                    className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors group relative"
                 >
                    <i className="fa-solid fa-magnifying-glass text-lg"></i>
                    <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Search</span>
                 </button>
                 <button 
                    onClick={() => setShowBackgroundGallery(!showBackgroundGallery)}
                    className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors group relative"
                 >
                    <i className="fa-regular fa-image text-lg"></i>
                     <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Background</span>
                 </button>
              </div>
              
              <div className="w-px h-8 bg-white/10 mx-1"></div>

              {/* Scene Switchers (Central Group) */}
              <div className="flex gap-1 mx-2">
                {SCENES.slice(0, 5).map(scene => (
                    <button 
                        key={scene.id}
                        onClick={() => setCurrentScene(scene)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${currentScene.id === scene.id ? 'bg-slate-700 text-white shadow-lg ring-1 ring-white/20' : 'hover:bg-white/10 text-slate-400 hover:text-white hover:scale-105'}`}
                    >
                        <i className={`fa-solid ${scene.icon} text-lg ${currentScene.id === scene.id ? scene.color : ''}`}></i>
                         <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{scene.name}</span>
                    </button>
                ))}
              </div>

              <div className="w-px h-8 bg-white/10 mx-1"></div>

              {/* Tools Group */}
              <div className="flex gap-1 ml-2">
                <button 
                    onClick={() => setShowTimer(!showTimer)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors group relative ${showTimer ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}
                >
                    <i className="fa-solid fa-stopwatch text-lg"></i>
                    <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Timer</span>
                </button>
                <button 
                    onClick={() => setShowMusic(!showMusic)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors group relative ${showMusic ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}
                >
                    <i className="fa-solid fa-music text-lg"></i>
                    <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Music</span>
                </button>
                <button 
                    onClick={() => setShowFiles(!showFiles)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors group relative ${showFiles ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}
                >
                    <i className="fa-regular fa-folder text-lg"></i>
                     <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Files</span>
                </button>
                <button 
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors group relative ${isScreenSharing ? 'bg-green-500/20 text-green-400' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}
                >
                    <i className="fa-solid fa-laptop text-lg"></i>
                     <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{isScreenSharing ? 'Stop Share' : 'Screen Share'}</span>
                </button>
                <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors group relative ${showSettings ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}
                >
                    <i className="fa-solid fa-sliders text-lg"></i>
                     <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Settings</span>
                </button>
                <button 
                    onClick={handleRefresh}
                    className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors group relative"
                >
                    <i className={`fa-solid fa-rotate text-lg ${isRefreshing ? 'animate-spin' : ''}`}></i>
                     <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Refresh</span>
                </button>
              </div>
              
              {/* Exit Button */}
              <div className="ml-2 pl-2 border-l border-white/10">
                   <button 
                    onClick={onLeave}
                    className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all group relative" 
                  >
                    <i className="fa-solid fa-door-open text-lg"></i>
                     <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Leave</span>
                  </button>
              </div>
          </div>
      </div>

      {/* Floating Camera Preview (Resized via Top Bar) */}
      {isVideoActive && cameraSize > 1 && (
          <div className="absolute bottom-24 left-6 w-64 h-48 bg-black rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl z-40 animate-fade-in-up">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
              <div className="absolute top-2 right-2 bg-black/50 px-2 rounded text-xs text-white">You</div>
          </div>
      )}
    </div>
  );
};

export default StudyRoom;