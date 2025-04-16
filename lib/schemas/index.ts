// Re-export all schemas for easier imports
export * from "./auth"
export * from "./property"
export * from "./user"
export * from "./market"
export * from "./investment"
export * from "./api"

// Export a common validation error handler
export const handleZodError = (error: any) => {
  if (error.issues) {
    return {
      success: false,
      error: "Validation error",
      details: error.format(),
    }
  }
  return {
    success: false,
    error: "An unexpected error occurred",
  }
}
