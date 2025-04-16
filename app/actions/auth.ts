"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { LoginFormSchema, SignupFormSchema } from "@/lib/schemas/auth"
import { revalidatePath } from "next/cache"

export async function login(formData: unknown) {
  try {
    // Validate form data
    const result = LoginFormSchema.safeParse(formData)

    if (!result.success) {
      return { error: "Invalid form data", details: result.error.format() }
    }

    const { email, password } = result.data

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/", "layout")
    redirect("/dashboard")
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function signup(formData: unknown) {
  try {
    // Validate form data
    const result = SignupFormSchema.safeParse(formData)

    if (!result.success) {
      return { error: "Invalid form data", details: result.error.format() }
    }

    const { email, password, fullName } = result.data

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Keep the original function for backward compatibility
export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return redirect("/dashboard")
}

// Keep the original function for backward compatibility
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// Implement both signout and signOut for backward compatibility
export async function signout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}

// Export signOut to fix the deployment error
export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect("/login")
}
