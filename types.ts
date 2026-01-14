
export interface CoupleDetails {
  brideName: string;
  brideFather: string;
  brideMother: string;
  brideImage?: string;
  groomName: string;
  groomFather: string;
  groomMother: string;
  groomImage?: string;
}

export interface EventDetails {
  date: string;
  time: string;
  locationName: string;
  address: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
}

export interface MusicConfig {
  url: string;
  title: string;
  isAutoPlay: boolean;
}

export interface InvitationData {
  couple: CoupleDetails;
  event: EventDetails;
  story: string;
  theme: 'classic' | 'modern' | 'rustic' | 'floral';
  music: MusicConfig;
}

export interface RsvpEntry {
  id: string;
  name: string;
  attendance: 'yes' | 'no';
  guests: number;
  message: string;
  timestamp: number;
}

export interface Template {
  id: string;
  name: string;
  price: number;
  category: string;
  previewUrl: string;
  sales: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended';
  plan: 'basic' | 'premium' | 'pro';
  invitationsCreated: number;
  joinDate: string;
}
