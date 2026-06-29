"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  username: string;
  bio: string;
  avatar_url: string;
  is_admin: boolean;
  follower_count: number;
  following_count: number;
}

interface AppContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  followedUsers: Set<string>;
  loading: boolean;
  toggleFollow: (userId: string) => Promise<void>;
  isFollowing: (userId: string) => boolean;
  signInWithGitHub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  }, [supabase]);

  const fetchFollowing = useCallback(async (userId: string) => {
    const { data } = await supabase.from('follows').select('following_id').eq('follower_id', userId);
    if (data) setFollowedUsers(new Set(data.map((f: { following_id: string }) => f.following_id)));
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchFollowing(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchFollowing(session.user.id);
      } else {
        setProfile(null);
        setFollowedUsers(new Set());
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, fetchFollowing, supabase]);

  const toggleFollow = useCallback(async (userId: string) => {
    if (!user) return;
    const action = followedUsers.has(userId) ? 'unfollow' : 'follow';
    await fetch('/api/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_id: userId, action }),
    });
    setFollowedUsers(prev => {
      const next = new Set(prev);
      action === 'follow' ? next.add(userId) : next.delete(userId);
      return next;
    });
  }, [user, followedUsers]);

  const isFollowing = useCallback((userId: string) => followedUsers.has(userId), [followedUsers]);

  const signInWithGitHub = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  return (
    <AppContext.Provider value={{ user, session, profile, followedUsers, loading, toggleFollow, isFollowing, signInWithGitHub, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
