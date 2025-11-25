import React, { useState } from 'react';
import { Subject, StudyRoomListing } from '../types';
import { AVAILABLE_SUBJECTS, SCENES } from '../constants';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (room: StudyRoomListing) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState<Subject>(Subject.GENERAL);
  const [maxParticipants, setMaxParticipants] = useState(6);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRoom: StudyRoomListing = {
      id: Date.now().toString(),
      hostName: 'Dolores McClure',
      hostAvatar: 'DM',
      topic: topic || 'Study Session',
      subject: subject,
      gradeLevel: 'Junior',
      participants: 1,
      maxParticipants: maxParticipants,
      tags: ['New']
    };

    onCreate(newRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Create Study Room</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Room Topic</label>
            <input 
              type="text" 
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Late Night Calculus, Reading Silence..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Subject</label>
            <select 
              value={subject}
              onChange={e => setSubject(e.target.value as Subject)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
            >
              {AVAILABLE_SUBJECTS.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-400 mb-1">Room Capacity: {maxParticipants}</label>
             <input 
              type="range" 
              min="2" 
              max="20" 
              value={maxParticipants}
              onChange={e => setMaxParticipants(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
             />
             <div className="flex justify-between text-xs text-slate-500 mt-1">
               <span>2</span>
               <span>20</span>
             </div>
          </div>

          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
               Cancel
             </button>
             <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition-colors">
               Create & Join
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;