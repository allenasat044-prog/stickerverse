export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  createdAt: string;
  isAdmin?: boolean;
}

export interface Sticker {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  downloadCount: number;
  uploaderId: string;
  createdAt: string;
  category: string;
}

export const CATEGORIES = ["Anime", "Gaming", "Memes", "Cute", "Nature", "Abstract", "Pop Culture", "Sports"];

export const mockUsers: User[] = [
  { id: "u1", username: "pixel_witch", email: "pw@mail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pixel_witch", bio: "Digital artist & sticker obsessive 🎨", followerCount: 4821, followingCount: 312, createdAt: "2024-01-15" },
  { id: "u2", username: "neon_kitsune", email: "nk@mail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=neon_kitsune", bio: "Making the internet cuter one sticker at a time 🦊", followerCount: 9203, followingCount: 145, createdAt: "2023-11-02" },
  { id: "u3", username: "glitch_sama", email: "gs@mail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=glitch_sama", bio: "Glitch art & chaos energy ⚡", followerCount: 2100, followingCount: 890, createdAt: "2024-03-08" },
  { id: "u4", username: "sakura_drops", email: "sd@mail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sakura_drops", bio: "Soft art for soft hearts 🌸", followerCount: 6540, followingCount: 203, createdAt: "2023-09-20" },
  { id: "u5", username: "SHANKS", email: "shanks@mail.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SHANKS", bio: "Builder & creator 🚀", followerCount: 120, followingCount: 88, createdAt: "2025-01-01", isAdmin: true },
];

export const mockStickers: Sticker[] = [
  { id: "s1", title: "Cyber Neko", description: "A cyberpunk cat sticker with neon vibes", imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=s1&backgroundColor=0f0f1a", tags: ["anime", "cat", "cyberpunk", "neon"], downloadCount: 8421, uploaderId: "u2", createdAt: "2025-05-10", category: "Anime" },
  { id: "s2", title: "Pixel Dragon", description: "Retro pixel art dragon breathing fire", imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=s2&backgroundColor=1a0f2e", tags: ["pixel", "dragon", "retro", "gaming"], downloadCount: 6203, uploaderId: "u1", createdAt: "2025-05-15", category: "Gaming" },
  { id: "s3", title: "Glitch Ghost", description: "Spooky ghost with glitch effect", imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=s3&backgroundColor=0a1628", tags: ["ghost", "glitch", "spooky"], downloadCount: 4892, uploaderId: "u3", createdAt: "2025-05-18", category: "Abstract" },
  { id: "s4", title: "Sakura Panda", description: "A cute panda surrounded by cherry blossoms", imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=s4&backgroundColor=1f0a2e", tags: ["panda", "cute", "sakura", "kawaii"], downloadCount: 11230, uploaderId: "u4", createdAt: "2025-04-22", category: "Cute" },
  { id: "s5", title: "Neon Fox", description: "Electric neon fox running through the night", imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=s5&backgroundColor=0f1a0f", tags: ["fox", "neon", "night", "anime"], downloadCount: 7654, uploaderId: "u2", createdAt: "2025-05-01", category: "Anime" },
  { id: "s6", title: "Meme Lord", description: "The classic meme face pack", imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=s6&backgroundColor=1a1a0a", tags: ["meme", "funny", "classic"], downloadCount: 19832, uploaderId: "u1", createdAt: "2025-03-15", category: "Memes" },
  { id: "s7", title: "Space Corgi", description: "Adorable corgi floating in space", imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=s7&backgroundColor=050520", tags: ["corgi", "space", "cute", "dog"], downloadCount: 5421, uploaderId: "u4", createdAt: "2025-05-20", category: "Cute" },
  { id: "s8", title: "Glitch Wave", description: "Abstract glitch wave art piece", imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=s8&backgroundColor=1a0505", tags: ["glitch", "wave", "abstract", "art"], downloadCount: 3201, uploaderId: "u3", createdAt: "2025-05-22", category: "Abstract" },
  { id: "s9", title: "Retro Controller", description: "Classic game controller pixel art", imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=s9&backgroundColor=0a0a1a", tags: ["gaming", "retro", "pixel", "controller"], downloadCount: 9100, uploaderId: "u1", createdAt: "2025-04-10", category: "Gaming" },
  { id: "s10", title: "Moon Bunny", description: "Bunny sitting on a crescent moon", imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=s10&backgroundColor=05051a", tags: ["bunny", "moon", "cute", "night"], downloadCount: 6780, uploaderId: "u4", createdAt: "2025-05-05", category: "Cute" },
  { id: "s11", title: "Fire Skull", description: "Edgy flaming skull for the bold ones", imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=s11&backgroundColor=1a0500", tags: ["skull", "fire", "edgy", "dark"], downloadCount: 4300, uploaderId: "u3", createdAt: "2025-04-28", category: "Abstract" },
  { id: "s12", title: "Kawaii Ramen", description: "Cute ramen bowl with happy face", imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=s12&backgroundColor=1a0f05", tags: ["ramen", "kawaii", "food", "cute"], downloadCount: 8900, uploaderId: "u2", createdAt: "2025-05-12", category: "Cute" },
];

export const getUploaderForSticker = (sticker: Sticker): User => {
  return mockUsers.find(u => u.id === sticker.uploaderId) || mockUsers[0];
};

export const getStickersForUser = (userId: string): Sticker[] => {
  return mockStickers.filter(s => s.uploaderId === userId);
};
