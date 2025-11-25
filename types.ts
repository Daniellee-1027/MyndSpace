
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ROOM = 'ROOM',
}

export enum Subject {
  CS = 'Computer Science',
  MATH = 'Mathematics',
  LIT = 'Literature',
  PHYSICS = 'Physics',
  BIOLOGY = 'Biology',
  ECON = 'Economics',
  GENERAL = 'General Focus',
  ART = 'Art & Design'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarSeed: string;
  isPremium: boolean;
  bio: string;
  locationFlag: string;
  gender: string;
  age: number;
  studyDuration: string;
  friendsCount: number;
  socialLinks: { platform: string; url: string }[];
  interests: string[];
}

export interface Friend {
  id: string;
  name: string;
  avatarSeed: string;
  status: 'Online' | 'Offline' | 'In Room';
  lastSeen?: string;
}

export interface FriendRequest {
  id: string;
  name: string;
  avatarSeed: string;
  timestamp: string;
  mutualFriends: number;
}

export interface FriendActivity {
  id: string;
  name: string;
  subject: Subject;
  status: 'Deep Focus' | 'Taking a Break' | 'Just Started';
  duration: number; // minutes
  avatarSeed: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  hoursThisMonth: number;
  rank: number;
  avatarSeed: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isAi?: boolean;
}

export interface Scene {
  id: string;
  name: string;
  imageUrl: string;
  icon: string; // FontAwesome class
  color: string; // Icon color
}

export interface StudyRoomListing {
  id: string;
  hostName: string;
  hostAvatar: string; // Initial or URL
  topic: string;
  subject: Subject;
  gradeLevel: string; // e.g. "Sophomore", "Year 2", "Masters"
  participants: number;
  maxParticipants: number;
  tags: string[];
}

export interface RoomConfig {
  roomDetails: StudyRoomListing;
  sceneId: string;
  isMicOn: boolean;
  isVideoOn: boolean;
}

export interface StudySpot {
  id: string;
  name: string;
  capacity: number; // Percentage 0-100
  status: 'Quiet' | 'Moderate' | 'Busy' | 'Full';
}
