import { createClient } from "./client"

// Upload a file to Supabase Storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: { isPublic?: boolean; metadata?: Record<string, string> },
) {
  const supabase = createClient()

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
    ...(options?.metadata ? { metadata: options.metadata } : {}),
  })

  if (error) {
    console.error("Error uploading file:", error)
    throw error
  }

  // Return the URL if the file is public
  if (options?.isPublic) {
    return getPublicUrl(bucket, path)
  }

  return data.path
}

// Get a public URL for a file
export function getPublicUrl(bucket: string, path: string) {
  const supabase = createClient()
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

// Get a signed URL for private files
export async function getSignedUrl(bucket: string, path: string, expiresIn = 60) {
  const supabase = createClient()

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

  if (error) {
    console.error("Error creating signed URL:", error)
    throw error
  }

  return data.signedUrl
}

// Delete a file
export async function deleteFile(bucket: string, path: string) {
  const supabase = createClient()

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    console.error("Error deleting file:", error)
    throw error
  }

  return true
}
