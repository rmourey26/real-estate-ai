"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

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

  // State for calculator inputs
  const [downPayment, setDownPayment] = useState(defaultDownPayment)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [interestRate, setInterestRate] = useState(defaultInterestRate)
  const [loanTerm, setLoanTerm] = useState(defaultLoanTerm)
  const [monthlyRent, setMonthlyRent] = useState(defaultMonthlyRent)
  const [monthlyExpenses, setMonthlyExpenses] = useState(defaultMonthlyExpenses)
  const [appreciationRate, setAppreciationRate] = useState(defaultAppreciationRate)
  const [calculationResults, setCalculationResults] = useState<any>(null)

  // Calculate loan amount
  const loanAmount = propertyPrice - downPayment

  // Calculate monthly mortgage payment
  const calculateMortgage = () => {
    const monthlyInterestRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    const monthlyPayment =
      (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    return monthlyPayment
  }

  // Calculate ROI
  const calculateROI = () => {
    const monthlyPayment = calculateMortgage()
    const annualRent = monthlyRent * 12
    const annualExpenses = monthlyExpenses * 12
    const annualMortgage = monthlyPayment * 12
    const annualCashFlow = annualRent - annualExpenses - annualMortgage
    const cashOnCashROI = (annualCashFlow / downPayment) * 100
    return cashOnCashROI
  }

  // Calculate cap rate
  const calculateCapRate = () => {
    const grossOperatingIncome = monthlyRent * 12
    const operatingExpenses = monthlyExpenses * 12
    const netOperatingIncome = grossOperatingIncome - operatingExpenses
    const capRate = (netOperatingIncome / propertyPrice) * 100
    return capRate
  }

  // Calculate cash flow
  const calculateCashFlow = () => {
    const monthlyPayment = calculateMortgage()
    const monthlyCashFlow = monthlyRent - monthlyExpenses - monthlyPayment
    return monthlyCashFlow
  }

  // Calculate 5-year appreciation
  const calculateAppreciation = () => {
    const fiveYearValue = propertyPrice * Math.pow(1 + appreciationRate / 100, 5)
    const appreciationGain = fiveYearValue - propertyPrice
    return {
      fiveYearValue,
      appreciationGain,
      appreciationPercent: ((fiveYearValue - propertyPrice) / propertyPrice) * 100,
    }
  }

  // Handle down payment change
  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value)
    setDownPaymentPercent(Math.round((value / propertyPrice) * 100))
  }

  // Handle down payment percent change
  const handleDownPaymentPercentChange = (value: number[]) => {
    const percent = value[0]
    setDownPaymentPercent(percent)
    setDownPayment(Math.round((percent / 100) * propertyPrice))
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
        totalInterestPaid: (monthlyPayment * loanTerm * 12 - loanAmount).toFixed(2),
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
            <div className="space-y-4">
              <div>
                <Label>Property Price: ${propertyPrice.toLocaleString()}</Label>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="downPayment">Down Payment (${downPayment.toLocaleString()})</Label>
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
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <span className="text-sm text-muted-foreground">{interestRate}%</span>
                </div>
                <Slider
                  id="interestRateSlider"
                  min={2}
                  max={10}
                  step={0.1}
                  value={[interestRate]}
                  onValueChange={(value) => setInterestRate(value[0])}
                />
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <div className="flex gap-2">
                  {[15, 20, 30].map((term) => (
                    <Button
                      key={term}
                      type="button"
                      variant={loanTerm === term ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setLoanTerm(term)}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyExpenses">Monthly Expenses ($)</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Include property taxes, insurance, HOA, maintenance, property management, etc.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="appreciationRate">Annual Appreciation Rate (%)</Label>
                  <span className="text-sm text-muted-foreground">{appreciationRate}%</span>
                </div>
                <Slider
                  id="appreciationRateSlider"
                  min={0}
                  max={10}
                  step={0.1}
                  value={[appreciationRate]}
                  onValueChange={(value) => setAppreciationRate(value[0])}
                />
                <Input
                  id="appreciationRate"
                  type="number"
                  step="0.1"
                  value={appreciationRate}
                  onChange={(e) => setAppreciationRate(Number(e.target.value))}
                />
              </div>
            </div>
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
                          <p className="text-muted-foreground">Down payment: ${downPayment.toLocaleString()}</p>
                          <p className="text-muted-foreground">
                            Closing costs (est.): ${Math.round(propertyPrice * 0.03).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Monthly Income</h4>
                          <p className="text-muted-foreground">Rental income: ${monthlyRent.toLocaleString()}</p>
                          <p className="text-muted-foreground">Expenses: ${monthlyExpenses.toLocaleString()}</p>
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
