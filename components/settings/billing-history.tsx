"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ExternalLink } from "lucide-react"

interface BillingHistoryProps {
  userId: string
}

// Mock billing history data
const billingHistory = [
  {
    id: "inv_001",
    date: new Date("2024-01-15"),
    description: "Professional Plan - Monthly",
    amount: 79.0,
    status: "paid" as const,
    invoiceUrl: "https://example.com/invoice/inv_001",
  },
  {
    id: "inv_002",
    date: new Date("2023-12-15"),
    description: "Professional Plan - Monthly",
    amount: 79.0,
    status: "paid" as const,
    invoiceUrl: "https://example.com/invoice/inv_002",
  },
  {
    id: "inv_003",
    date: new Date("2023-11-15"),
    description: "Professional Plan - Monthly",
    amount: 79.0,
    status: "paid" as const,
    invoiceUrl: "https://example.com/invoice/inv_003",
  },
  {
    id: "inv_004",
    date: new Date("2023-10-15"),
    description: "Starter Plan - Monthly",
    amount: 29.0,
    status: "paid" as const,
    invoiceUrl: "https://example.com/invoice/inv_004",
  },
  {
    id: "inv_005",
    date: new Date("2023-09-15"),
    description: "Starter Plan - Monthly",
    amount: 29.0,
    status: "failed" as const,
    invoiceUrl: null,
  },
]

export function BillingHistory({ userId }: BillingHistoryProps) {
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  const handleDownloadInvoice = async (invoiceId: string, invoiceUrl: string | null) => {
    if (!invoiceUrl) return

    setIsDownloading(invoiceId)
    try {
      // Mock download delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would download the invoice
      window.open(invoiceUrl, "_blank")
    } catch (error) {
      console.error("Failed to download invoice:", error)
    } finally {
      setIsDownloading(null)
    }
  }

  const getStatusBadge = (status: "paid" | "pending" | "failed") => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Paid
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const totalPaid = billingHistory.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Spent</CardDescription>
            <CardTitle className="text-2xl">${totalPaid.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Invoices</CardDescription>
            <CardTitle className="text-2xl">{billingHistory.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Failed Payments</CardDescription>
            <CardTitle className="text-2xl">
              {billingHistory.filter((item) => item.status === "failed").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Billing History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your billing history and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date.toLocaleDateString()}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>${item.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    {item.invoiceUrl && item.status === "paid" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(item.id, item.invoiceUrl)}
                        disabled={isDownloading === item.id}
                      >
                        {isDownloading === item.id ? (
                          <Download className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </>
                        )}
                      </Button>
                    )}
                    {item.status === "failed" && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Retry Payment
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
