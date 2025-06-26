"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { propertySchema, type PropertySchema } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function PropertyForm() {
  const form = useForm<PropertySchema>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
    },
  })

  async function onSubmit(values: PropertySchema) {
    // Implement form submission logic here
    console.log("Form values:", values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add other form fields here */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
