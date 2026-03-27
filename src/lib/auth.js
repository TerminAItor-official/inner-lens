import { supabase } from './supabase.js';

/** Sends a magic-link email. No password needed. */
export async function signUp(email) {
  return supabase.auth.signInWithOtp({ email });
}

/** Signs the current user out. */
export async function signOut() {
  return supabase.auth.signOut();
}

/** Returns the currently logged-in user object, or null if not authenticated. */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

/** Listens for auth state changes (SIGNED_IN, SIGNED_OUT, etc).
 *  Returns the unsubscribe function — call it in a useEffect cleanup. */
export function onAuthChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => callback(session?.user ?? null)
  );
  return () => subscription.unsubscribe();
}
