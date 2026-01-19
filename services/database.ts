
import { createClient } from '@supabase/supabase-js';
import { Place, Product, Booking } from '../types';

// Supabase Credentials
const supabaseUrl = 'https://svryzsmjdxkwunyppeqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2cnl6c21qZHhrd3VueXBwZXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MzM2NzgsImV4cCI6MjA4NDQwOTY3OH0.ZA-pLWBcKhhxML8VPwaqgEPQms4ZvspZmdbugbHLYm0';

export const supabase = createClient(supabaseUrl, supabaseKey);

const handleDbError = (context: string, error: any) => {
  if (!error) return null;
  const detailedError = {
    context,
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  };
  console.error(`[DB ERROR] ${context}:`, detailedError);
  return detailedError;
};

export const db = {
  // --- Connection Check ---
  testConnection: async () => {
    try {
      const { data, error } = await supabase.from('v_users').select('count', { count: 'exact', head: true });
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error("Connection Test Failed:", err);
      return false;
    }
  },

  // --- Places ---
  getPlaces: async (): Promise<Place[]> => {
    const { data, error } = await supabase.from('v_places').select('*');
    if (error) {
      handleDbError("Fetch Places", error);
      return [];
    }
    return data || [];
  },

  savePlaces: async (places: Place[]) => {
    const { error } = await supabase.from('v_places').upsert(places, { onConflict: 'id' });
    if (error) throw handleDbError("Save Places", error);
  },

  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('v_products').select('*');
    if (error) {
      handleDbError("Fetch Products", error);
      return [];
    }
    return data || [];
  },

  saveProducts: async (products: Product[]) => {
    const { error } = await supabase.from('v_products').upsert(products, { onConflict: 'id' });
    if (error) throw handleDbError("Save Products", error);
  },

  // --- Bookings ---
  getBookings: async (): Promise<Booking[]> => {
    const { data, error } = await supabase.from('v_bookings').select('*').order('date', { ascending: false });
    if (error) {
      handleDbError("Fetch Bookings", error);
      return [];
    }
    return data || [];
  },

  saveBooking: async (booking: Booking) => {
    const { error } = await supabase.from('v_bookings').insert([booking]);
    if (error) {
      const err = handleDbError("Save Booking", error);
      throw new Error(JSON.stringify(err));
    }
  },

  updateBooking: async (bookingId: string, updates: Partial<Booking>) => {
    const { error } = await supabase.from('v_bookings').update(updates).eq('id', bookingId);
    if (error) {
      const err = handleDbError("Update Booking", error);
      throw new Error(JSON.stringify(err));
    }
  },

  // --- Users ---
  getUsers: async (): Promise<any[]> => {
    const { data, error } = await supabase.from('v_users').select('*');
    if (error) {
      handleDbError("Fetch Users", error);
      return [];
    }
    return data || [];
  },

  saveUser: async (user: any) => {
    const dbUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      type: user.type,
      "createdAt": new Date().toISOString()
    };
    
    // Explicit Upsert
    const { error: upsertError } = await supabase.from('v_users').upsert([dbUser], { onConflict: 'id' });
    
    if (upsertError) {
      const err = handleDbError("Write User Data", upsertError);
      throw new Error(`Storage Failed: ${err?.message || 'Unknown DB Error'}`);
    }
    
    // VERIFICATION: Read back from DB immediately
    const { data: verify, error: verifyError } = await supabase
      .from('v_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (verifyError || !verify) {
      throw new Error("Verification Failed: Data was sent but could not be retrieved from Supabase. Check RLS policies.");
    }
  }
};
