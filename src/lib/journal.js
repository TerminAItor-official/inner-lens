import { supabase } from './supabase.js';

/**
 * Insert a new journal entry. Returns { data: row, error }.
 * The returned row includes the generated `id` — store it if you
 * want to update the reflection_text later.
 */
export async function saveJournalEntry({
  userId,
  entryText,
  philosopher,
  questionText,
  reflectionText = null,
  streakCount = 0,
}) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id:         userId,
      entry_text:      entryText,
      philosopher,
      question_text:   questionText,
      reflection_text: reflectionText,
      streak_count:    streakCount,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Update only the reflection_text on an existing entry.
 * Returns { data: row, error }.
 */
export async function updateReflection(entryId, reflectionText) {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({ reflection_text: reflectionText })
    .eq('id', entryId)
    .select()
    .single();

  return { data, error };
}

/**
 * Fetch all entries for a user, newest first.
 * Returns { data: rows[], error }.
 */
export async function getJournalEntries(userId) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: data ?? [], error };
}
