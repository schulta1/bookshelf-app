/**
 * Supabase Storage Service
 * 
 * Manages book data using Supabase backend.
 * Each user has their own private collection.
 */

import { supabase } from './supabase-client';

// Convert camelCase to snake_case for database
function toSnakeCase(obj) {
  const result = {
    title: obj.title,
    author: obj.author,
    cover_url: obj.coverUrl || obj.cover_url || '',
    status: obj.status,
    rating: obj.rating,
    review: obj.review || '',
    finished_at: obj.finishedAt || obj.finished_at || null,
  };
  
  if (obj.id) {
    result.id = obj.id;
  }
  
  return result;
}

// Convert snake_case to camelCase for app
function toCamelCase(obj) {
  return {
    id: obj.id,
    title: obj.title,
    author: obj.author,
    coverUrl: obj.cover_url || '',
    status: obj.status,
    rating: obj.rating,
    review: obj.review || '',
    createdAt: obj.created_at,
    updatedAt: obj.updated_at,
    finishedAt: obj.finished_at,
  };
}

export async function getAllBooks() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('No authenticated user');
    return [];
  }

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  return data.map(toCamelCase);
}

export async function addBook(book) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('No authenticated user');
  }
  
  const bookData = {
    ...toSnakeCase(book),
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('books')
    .insert([bookData])
    .select()
    .single();

  if (error) {
    console.error('Error adding book:', error);
    throw error;
  }

  return toCamelCase(data);
}

export async function updateBook(bookId, updates) {
  const updateData = toSnakeCase(updates);
  
  const { data, error } = await supabase
    .from('books')
    .update(updateData)
    .eq('id', bookId)
    .select()
    .single();

  if (error) {
    console.error('Error updating book:', error);
    throw error;
  }

  return toCamelCase(data);
}

export async function deleteBook(bookId) {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', bookId);

  if (error) {
    console.error('Error deleting book:', error);
    return false;
  }

  return true;
}

export async function getBooksByStatus(status) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  return data.map(toCamelCase);
}

export function subscribeToBooks(callback) {
  const channel = supabase
    .channel('books_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'books' 
      }, 
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function clearAllBooks() {
  console.warn('clearAllBooks not implemented for Supabase');
  return false;
}

export function exportBooks() {
  console.warn('exportBooks not implemented for Supabase');
  return '[]';
}

export function importBooks(jsonString) {
  console.warn('importBooks not implemented for Supabase');
  return false;
}