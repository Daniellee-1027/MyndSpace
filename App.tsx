import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import StudyRoom from './components/StudyRoom';
import ProfileModal from './components/ProfileModal';
import { ViewState, StudyRoomListing, RoomConfig } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [roomConfig, setRoomConfig] = useState<RoomConfig | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const handleJoinRoom = (room: StudyRoomListing) => {
    // Default config when joining
    setRoomConfig({
      roomDetails: room,
      sceneId: 'lofi-night', // Default scene
      isMicOn: false,
      isVideoOn: false,
    });
    setCurrentView(ViewState.ROOM);
  };

  const handleLeaveRoom = () => {
    setRoomConfig(null);
    setCurrentView(ViewState.DASHBOARD);
  };

  return (
    <div className="w-full min-h-screen font-sans bg-black">
      
      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />

      {currentView === ViewState.DASHBOARD && (
        <Dashboard 
          onJoinRoom={handleJoinRoom} 
          onOpenProfile={() => setShowProfile(true)}
        />
      )}
      
      {currentView === ViewState.ROOM && roomConfig && (
        <StudyRoom 
          config={roomConfig} 
          onLeave={handleLeaveRoom}
          onOpenProfile={() => setShowProfile(true)}
        />
      )}
    </div>
  );
};

export default App;