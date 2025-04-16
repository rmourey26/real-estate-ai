import { createClient } from "./client"

// Subscribe to realtime changes on a table
export function subscribeToTable(
  tableName: string,
  callback: (payload: any) => void,
  options?: {
    event?: "INSERT" | "UPDATE" | "DELETE" | "*"
    filter?: string
    filterValues?: any[]
  },
) {
  const supabase = createClient()

  const channel = supabase
    .channel(`table-changes-${tableName}`)
    .on(
      "postgres_changes",
      {
        event: options?.event || "*",
        schema: "public",
        table: tableName,
        ...(options?.filter ? { filter: options.filter, filterValues: options.filterValues } : {}),
      },
      (payload) => {
        callback(payload)
      },
    )
    .subscribe()

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel)
    },
  }
}

// Subscribe to a specific row in a table
export function subscribeToRow(
  tableName: string,
  rowId: string,
  callback: (payload: any) => void,
  options?: {
    event?: "UPDATE" | "DELETE" | "*"
  },
) {
  return subscribeToTable(tableName, callback, {
    event: options?.event || "*",
    filter: `id=eq.${rowId}`,
  })
}
