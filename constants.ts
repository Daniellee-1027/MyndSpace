
import { FriendActivity, Scene, LeaderboardEntry, Subject, StudyRoomListing, UserProfile, Friend, FriendRequest, StudySpot } from "./types";

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'u1',
  name: 'Dolores McClure Sr.',
  avatarSeed: 'Dolores', // Using DiceBear seed
  isPremium: true,
  bio: 'South korean student currently hanging out in 🇨🇳. WiFi + food + my bed = PERFECTION.',
  locationFlag: '🇨🇳',
  gender: 'Female',
  age: 23,
  studyDuration: '3 Days',
  friendsCount: 208,
  socialLinks: [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/hongboli1027/' }
  ],
  interests: ['Renewable energy', 'Biotechnology', 'Education', 'Cryptocurrency', 'Finance']
};

export const MOCK_FRIEND_LIST: Friend[] = [
  { id: 'f1', name: 'Alice Chen', avatarSeed: 'Alice', status: 'In Room' },
  { id: 'f2', name: 'Bob Smith', avatarSeed: 'Bob', status: 'Online' },
  { id: 'f3', name: 'Charlie Kim', avatarSeed: 'Charlie', status: 'Offline', lastSeen: '2h ago' },
  { id: 'f4', name: 'Diana Prince', avatarSeed: 'Diana', status: 'In Room' },
  { id: 'f5', name: 'Evan Wright', avatarSeed: 'Evan', status: 'Online' },
];

export const MOCK_FRIEND_REQUESTS: FriendRequest[] = [
  { id: 'r1', name: 'Jordan Lee', avatarSeed: 'Jordan', timestamp: '2h ago', mutualFriends: 3 },
  { id: 'r2', name: 'Casey Neistat', avatarSeed: 'Casey', timestamp: '1d ago', mutualFriends: 1 },
];

export const MOCK_FRIENDS: FriendActivity[] = [
  { id: '1', name: 'Alice Chen', subject: Subject.CS, status: 'Deep Focus', duration: 45, avatarSeed: 'Alice' },
  { id: '2', name: 'Marcus Johnson', subject: Subject.ECON, status: 'Taking a Break', duration: 120, avatarSeed: 'Marcus' },
  { id: '3', name: 'Sarah Miller', subject: Subject.LIT, status: 'Just Started', duration: 5, avatarSeed: 'Sarah' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Jennifer Wu', hoursThisMonth: 124, rank: 1, avatarSeed: 'Jennifer' },
  { id: '2', name: 'David Kim', hoursThisMonth: 112, rank: 2, avatarSeed: 'David' },
  { id: '3', name: 'Alex Thompson', hoursThisMonth: 98, rank: 3, avatarSeed: 'Alex' },
  { id: '4', name: 'Sarah Miller', hoursThisMonth: 85, rank: 4, avatarSeed: 'Sarah' },
  { id: '5', name: 'Mike Ross', hoursThisMonth: 72, rank: 5, avatarSeed: 'Mike' },
];

export const MOCK_CAMPUS_SPOTS: StudySpot[] = [
  { id: '1', name: 'Main Library - 2nd Floor', capacity: 85, status: 'Busy' },
  { id: '2', name: 'Student Union Cafe', capacity: 42, status: 'Moderate' },
  { id: '3', name: 'Engineering Hall Lounge', capacity: 15, status: 'Quiet' },
  { id: '4', name: 'Bio-Science Atrium', capacity: 65, status: 'Moderate' },
];

export const SCENES: Scene[] = [
  {
    id: 'space-station',
    name: 'Orbital View',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    icon: 'fa-user-astronaut',
    color: 'text-purple-300'
  },
  {
    id: 'beach-relax',
    name: 'Sunset Beach',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    icon: 'fa-umbrella-beach',
    color: 'text-orange-300'
  },
  {
    id: 'rainy-window',
    name: 'Rainy Cafe',
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80',
    icon: 'fa-cloud-rain',
    color: 'text-blue-300'
  },
  {
    id: 'nature-forest',
    name: 'Forest Zen',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80',
    icon: 'fa-tree',
    color: 'text-green-300'
  },
  {
    id: 'minimal-library',
    name: 'Modern Library',
    // Updated to a brighter, more distinct library image
    imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1920&q=80',
    icon: 'fa-book-open',
    color: 'text-yellow-200'
  },
  {
    id: 'lofi-night',
    name: 'Lofi Night',
    imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1920&q=80',
    icon: 'fa-moon',
    color: 'text-indigo-300'
  }
];

export const MOCK_ROOMS: StudyRoomListing[] = [
  {
    id: '101',
    hostName: 'David Kim',
    hostAvatar: 'DK',
    topic: 'Calculus II Finals Prep',
    subject: Subject.MATH,
    gradeLevel: 'Sophomore',
    participants: 12,
    maxParticipants: 15,
    tags: ['Quiet', 'Camera On']
  },
  {
    id: '102',
    hostName: 'Sarah Jenkins',
    hostAvatar: 'SJ',
    topic: 'Creative Writing Sprint',
    subject: Subject.LIT,
    gradeLevel: 'Junior',
    participants: 4,
    maxParticipants: 8,
    tags: ['Pomodoro', 'Lofi Music']
  },
  {
    id: '103',
    hostName: 'Tsinghua CS Group',
    hostAvatar: 'TS',
    topic: 'LeetCode Grinding',
    subject: Subject.CS,
    gradeLevel: 'Senior',
    participants: 28,
    maxParticipants: 30,
    tags: ['Hardcore', 'Interview Prep']
  },
  {
    id: '104',
    hostName: 'Emily & Co',
    hostAvatar: 'EC',
    topic: 'Intro to Macroeconomics',
    subject: Subject.ECON,
    gradeLevel: 'Freshman',
    participants: 1,
    maxParticipants: 5,
    tags: ['Chill', 'Tutoring']
  },
  {
    id: '105',
    hostName: 'Design Collective',
    hostAvatar: 'DC',
    topic: 'Portfolio Review',
    subject: Subject.ART,
    gradeLevel: 'Mixed',
    participants: 6,
    maxParticipants: 10,
    tags: ['Screen Share', 'Critique']
  }
];

export const AVAILABLE_SUBJECTS = Object.values(Subject);
