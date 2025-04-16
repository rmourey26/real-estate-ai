"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InvestmentCalculatorSchema, type InvestmentCalculatorValues } from "@/lib/schemas/investment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface InvestmentCalculatorProps {
  propertyPrice: number
  propertyType: string
  location: string
}

export function InvestmentCalculator({ propertyPrice, propertyType, location }: InvestmentCalculatorProps) {
  // Default values based on property price
  const defaultDownPayment = Math.round(propertyPrice * 0.2) // 20% down payment
  const defaultInterestRate = 6.5 // 6.5% interest rate
  const defaultLoanTerm = 30 // 30-year loan
  const defaultMonthlyRent = Math.round(propertyPrice * 0.005) // 0.5% of property price
  const defaultMonthlyExpenses = Math.round(propertyPrice * 0.002) // 0.2% of property price
  const defaultAppreciationRate = 3 // 3% annual appreciation

  const [calculationResults, setCalculationResults] = useState<any>(null)

  const form = useForm<InvestmentCalculatorValues>({
    resolver: zodResolver(InvestmentCalculatorSchema),
    defaultValues: {
      propertyPrice: propertyPrice,
      downPayment: defaultDownPayment,
      interestRate: defaultInterestRate,
      loanTerm: defaultLoanTerm,
      monthlyRent: defaultMonthlyRent,
      monthlyExpenses: defaultMonthlyExpenses,
      appreciationRate: defaultAppreciationRate,
    },
  })

  const watchDownPayment = form.watch("downPayment")
  const watchInterestRate = form.watch("interestRate")
  const watchAppreciationRate = form.watch("appreciationRate")
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)

  // Calculate loan amount
  const loanAmount = propertyPrice - watchDownPayment

  // Calculate monthly mortgage payment
  const calculateMortgage = () => {
    const monthlyInterestRate = watchInterestRate / 100 / 12
    const numberOfPayments = form.getValues("loanTerm") * 12
    const monthlyPayment =
      (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    return monthlyPayment
  }

  // Calculate ROI
  const calculateROI = () => {
    const monthlyPayment = calculateMortgage()
    const annualRent = form.getValues("monthlyRent") * 12
    const annualExpenses = form.getValues("monthlyExpenses") * 12
    const annualMortgage = monthlyPayment * 12
    const annualCashFlow = annualRent - annualExpenses - annualMortgage
    const cashOnCashROI = (annualCashFlow / watchDownPayment) * 100
    return cashOnCashROI
  }

  // Calculate cap rate
  const calculateCapRate = () => {
    const grossOperatingIncome = form.getValues("monthlyRent") * 12
    const operatingExpenses = form.getValues("monthlyExpenses") * 12
    const netOperatingIncome = grossOperatingIncome - operatingExpenses
    const capRate = (netOperatingIncome / propertyPrice) * 100
    return capRate
  }

  // Calculate cash flow
  const calculateCashFlow = () => {
    const monthlyPayment = calculateMortgage()
    const monthlyCashFlow = form.getValues("monthlyRent") - form.getValues("monthlyExpenses") - monthlyPayment
    return monthlyCashFlow
  }

  // Calculate 5-year appreciation
  const calculateAppreciation = () => {
    const fiveYearValue = propertyPrice * Math.pow(1 + watchAppreciationRate / 100, 5)
    const appreciationGain = fiveYearValue - propertyPrice
    return {
      fiveYearValue,
      appreciationGain,
      appreciationPercent: ((fiveYearValue - propertyPrice) / propertyPrice) * 100,
    }
  }

  // Handle down payment change
  const handleDownPaymentChange = (value: number) => {
    form.setValue("downPayment", value)
    setDownPaymentPercent(Math.round((value / propertyPrice) * 100))
  }

  // Handle down payment percent change
  const handleDownPaymentPercentChange = (value: number[]) => {
    const percent = value[0]
    setDownPaymentPercent(percent)
    form.setValue("downPayment", Math.round((percent / 100) * propertyPrice))
  }

  // Calculate all metrics
  const calculateAll = () => {
    const monthlyPayment = calculateMortgage()
    const cashFlow = calculateCashFlow()
    const roi = calculateROI()
    const capRate = calculateCapRate()
    const appreciation = calculateAppreciation()

    setCalculationResults({
      mortgage: {
        monthlyPayment: monthlyPayment.toFixed(2),
        totalLoanAmount: loanAmount.toFixed(2),
        totalInterestPaid: (monthlyPayment * form.getValues("loanTerm") * 12 - loanAmount).toFixed(2),
      },
      investment: {
        cashOnCashROI: roi.toFixed(2),
        capRate: capRate.toFixed(2),
        monthlyCashFlow: cashFlow.toFixed(2),
        annualCashFlow: (cashFlow * 12).toFixed(2),
      },
      appreciation: {
        fiveYearValue: appreciation.fiveYearValue.toFixed(2),
        fiveYearGain: appreciation.appreciationGain.toFixed(2),
        fiveYearGainPercentage: appreciation.appreciationPercent.toFixed(2),
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Calculator</CardTitle>
        <CardDescription>Calculate potential returns for this property</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inputs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="results" onClick={calculateAll}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="space-y-4">
            <Form {...form}>
              <div className="space-y-4">
                <div>
                  <Label>Property Price: ${propertyPrice.toLocaleString()}</Label>
                </div>

                <FormField
                  control={form.control}
                  name="downPayment"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex justify-between">
                        <FormLabel>Down Payment (${field.value.toLocaleString()})</FormLabel>
                        <span className="text-sm text-muted-foreground">{downPaymentPercent}%</span>
                      </div>
                      <Slider
                        id="downPaymentSlider"
                        min={5}
                        max={50}
                        step={1}
                        value={[downPaymentPercent]}
                        onValueChange={handleDownPaymentPercentChange}
                      />
                      <FormControl>
                        <Input
                          id="downPayment"
                          type="number"
                          {...field}
                          onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex justify-between">
                        <FormLabel>Interest Rate (%)</FormLabel>
                        <span className="text-sm text-muted-foreground">{field.value}%</span>
                      </div>
                      <Slider
                        id="interestRateSlider"
                        min={2}
                        max={10}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={(value) => form.setValue("interestRate", value[0])}
                      />
                      <FormControl>
                        <Input
                          id="interestRate"
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) => form.setValue("interestRate", Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="loanTerm"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Loan Term (Years)</FormLabel>
                      <div className="flex gap-2">
                        {[15, 20, 30].map((term) => (
                          <Button
                            key={term}
                            type="button"
                            variant={field.value === term ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => form.setValue("loanTerm", term)}
                          >
                            {term}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyRent"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Monthly Rent ($)</FormLabel>
                      <FormControl>
                        <Input
                          id="monthlyRent"
                          type="number"
                          {...field}
                          onChange={(e) => form.setValue("monthlyRent", Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyExpenses"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Monthly Expenses ($)</FormLabel>
                      <FormControl>
                        <Input
                          id="monthlyExpenses"
                          type="number"
                          {...field}
                          onChange={(e) => form.setValue("monthlyExpenses", Number(e.target.value))}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Include property taxes, insurance, HOA, maintenance, property management, etc.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appreciationRate"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex justify-between">
                        <FormLabel>Annual Appreciation Rate (%)</FormLabel>
                        <span className="text-sm text-muted-foreground">{field.value}%</span>
                      </div>
                      <Slider
                        id="appreciationRateSlider"
                        min={0}
                        max={10}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={(value) => form.setValue("appreciationRate", value[0])}
                      />
                      <FormControl>
                        <Input
                          id="appreciationRate"
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) => form.setValue("appreciationRate", Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {calculationResults ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Mortgage</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Payment</span>
                        <span className="font-semibold">${calculationResults.mortgage.monthlyPayment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Loan Amount</span>
                        <span className="font-semibold">
                          ${Number(calculationResults.mortgage.totalLoanAmount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Interest</span>
                        <span className="font-semibold">
                          ${Number(calculationResults.mortgage.totalInterestPaid).toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Cash Flow</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Cash Flow</span>
                        <span
                          className={`font-semibold ${Number(calculationResults.investment.monthlyCashFlow) >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          ${calculationResults.investment.monthlyCashFlow}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Annual Cash Flow</span>
                        <span
                          className={`font-semibold ${Number(calculationResults.investment.annualCashFlow) >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          ${calculationResults.investment.annualCashFlow}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cash on Cash ROI</span>
                        <span
                          className={`font-semibold ${Number(calculationResults.investment.cashOnCashROI) >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {calculationResults.investment.cashOnCashROI}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Appreciation (5yr)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Future Value</span>
                        <span className="font-semibold">
                          ${Number(calculationResults.appreciation.fiveYearValue).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Equity Gain</span>
                        <span className="font-semibold text-green-600">
                          ${Number(calculationResults.appreciation.fiveYearGain).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Return</span>
                        <span className="font-semibold text-green-600">
                          {calculationResults.appreciation.fiveYearGainPercentage}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Investment Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold">Initial Investment</h4>
                          <p className="text-muted-foreground">Down payment: ${watchDownPayment.toLocaleString()}</p>
                          <p className="text-muted-foreground">
                            Closing costs (est.): ${Math.round(propertyPrice * 0.03).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Monthly Income</h4>
                          <p className="text-muted-foreground">
                            Rental income: ${form.getValues("monthlyRent").toLocaleString()}
                          </p>
                          <p className="text-muted-foreground">
                            Expenses: ${form.getValues("monthlyExpenses").toLocaleString()}
                          </p>
                          <p className="text-muted-foreground">
                            Mortgage: ${calculationResults.mortgage.monthlyPayment}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold">Investment Metrics</h4>
                        <p className="text-muted-foreground">Cap Rate: {calculationResults.investment.capRate}%</p>
                        <p className="text-muted-foreground">
                          Cash on Cash Return: {calculationResults.investment.cashOnCashROI}%
                        </p>
                        <p className="text-muted-foreground">
                          5-Year Appreciation: {calculationResults.appreciation.fiveYearGainPercentage}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <Button onClick={calculateAll}>Calculate Investment Metrics</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default InvestmentCalculator
