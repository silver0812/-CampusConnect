export type Role = 'member' | 'officer';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'urgent' | 'event';
  date: string;
  author: string;
  role: Role;
  isPinned?: boolean;
  readBy: string[]; // List of user IDs who read it
}

export interface RSVPUser {
  name: string;
  avatar: string;
  role: Role;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD format
  time: string;
  location: string;
  link?: string;
  rsvps: RSVPUser[];
  organizer: string;
}

export interface Committee {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  assignee: {
    name: string;
    avatar: string;
  };
  committeeId: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderRole: Role;
  content: string;
  timestamp: string;
  committeeId: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'dues' | 'merch';
  image: string;
  stock?: number;
}

export interface CartItem {
  item: ShopItem;
  quantity: number;
}

export interface Transaction {
  id: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  date: string;
  paymentMethod: string;
  paymentId: string;
  status: 'success' | 'pending';
}
