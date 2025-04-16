import { createClient } from "./client"

// Invoke a Supabase Edge Function
export async function invokeFunction<T = any>(
  functionName: string,
  payload?: any,
  options?: { headers?: Record<string, string> },
): Promise<T> {
  const supabase = createClient()

  // Get the current session for authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/${functionName}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    ...(options?.headers || {}),
  }

  try {
    const response = await fetch(functionUrl, {
      method: "POST",
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Function error (${response.status}): ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error invoking function ${functionName}:`, error)
    throw error
  }
}

// Alternative method using Supabase's built-in functions API
export async function invokeFunctionViaSupabase<T = any>(functionName: string, payload?: any): Promise<T> {
  const supabase = createClient()

  const { data, error } = await supabase.functions.invoke<T>(functionName, {
    body: payload,
  })

  if (error) {
    console.error(`Error invoking function ${functionName}:`, error)
    throw error
  }

  return data
}
