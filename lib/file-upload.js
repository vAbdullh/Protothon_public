// lib/file-upload.js
import { supabase } from './supabaseClient';

/**
 * Upload a file to Supabase storage bucket
 * @param {File} file - The file to upload
 * @param {string} bucketName - The bucket name (default: 'attachments_bucket')
 * @returns {Promise<{success: boolean, url?: string, fileName?: string, filePath?: string, error?: string}>}
 */
export async function uploadFileToSupabase(file, bucketName = 'attachments_bucket') {
  try {
    // Validate file
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Generate unique file name to avoid conflicts
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    const filePath = `applications/${fileName}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message };
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      fileName: file.name,
      filePath: filePath
    };
  } catch (error) {
    console.error('Error in file upload:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @returns {string|null} Error message or null if valid
 */
export function validateFile(file) {
  if (!file) {
    return 'No file selected';
  }

  // Check file type (PDF only)
  if (file.type !== 'application/pdf') {
    return 'Only PDF files are allowed';
  }

  // Check file size (100MB max)
  const maxSize = 100 * 1024 * 1024; // 100MB in bytes
  if (file.size > maxSize) {
    return 'File size must be less than 100MB';
  }

  return null; // File is valid
}