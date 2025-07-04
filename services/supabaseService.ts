import { supabase } from '../lib/supabase';
import type { CharacterSheet, Trope, UserProfile } from '../types';

export const createUserProfile = async (email: string): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .insert([{ id: user.id, email }])
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }

  return data;
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

export const saveCharacterSheet = async (characterSheet: CharacterSheet): Promise<CharacterSheet | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const sheetData = {
    user_id: user.id,
    context: characterSheet.context,
    academics: characterSheet.academics,
    familial_notes: characterSheet.familialNotes,
    social_notes: characterSheet.socialNotes,
    passion_notes: characterSheet.passionNotes,
  };

  const { data, error } = await supabase
    .from('character_sheets')
    .insert([sheetData])
    .select()
    .single();

  if (error) {
    console.error('Error saving character sheet:', error);
    return null;
  }

  return {
    ...characterSheet,
    id: data.id,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const updateCharacterSheet = async (characterSheet: CharacterSheet): Promise<CharacterSheet | null> => {
  if (!characterSheet.id) return null;

  const updateData = {
    context: characterSheet.context,
    academics: characterSheet.academics,
    familial_notes: characterSheet.familialNotes,
    social_notes: characterSheet.socialNotes,
    passion_notes: characterSheet.passionNotes,
  };

  const { data, error } = await supabase
    .from('character_sheets')
    .update(updateData)
    .eq('id', characterSheet.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating character sheet:', error);
    return null;
  }

  return {
    ...characterSheet,
    updated_at: data.updated_at,
  };
};

export const getCharacterSheet = async (): Promise<CharacterSheet | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('character_sheets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching character sheet:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    context: data.context,
    academics: data.academics,
    familialNotes: data.familial_notes,
    socialNotes: data.social_notes,
    passionNotes: data.passion_notes,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const saveTropes = async (tropes: Trope[], characterSheetId: string): Promise<Trope[]> => {
  const tropeData = tropes.map(trope => ({
    character_sheet_id: characterSheetId,
    name: trope.name,
    description: trope.description,
  }));

  const { data, error } = await supabase
    .from('tropes')
    .insert(tropeData)
    .select();

  if (error) {
    console.error('Error saving tropes:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    character_sheet_id: item.character_sheet_id,
    name: item.name,
    description: item.description,
    created_at: item.created_at,
  }));
};

export const getTropes = async (characterSheetId: string): Promise<Trope[]> => {
  const { data, error } = await supabase
    .from('tropes')
    .select('*')
    .eq('character_sheet_id', characterSheetId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching tropes:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    character_sheet_id: item.character_sheet_id,
    name: item.name,
    description: item.description,
    created_at: item.created_at,
  }));
};