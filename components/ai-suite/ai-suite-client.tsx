"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIModelsList } from "@/components/ai-suite/ai-models-list"
import { AIAgentsList } from "@/components/ai-suite/ai-agents-list"
import { AIWorkflowsList } from "@/components/ai-suite/ai-workflows-list"
import { AIChat } from "@/components/ai-suite/ai-chat"
import { AICodeGenerator } from "@/components/ai-suite/ai-code-generator"
import { AISupplyChainOptimizer } from "@/components/ai-suite/ai-supply-chain-optimizer"
import type { AIModel } from "@/lib/types/database"
import { Code, MessageSquare, Bot, ListChecks, Package, Sparkles } from "lucide-react"

interface AISuiteClientProps {
  user: any
  aiModels: AIModel[]
  aiAgents: any[]
  workflows: any[]
}

export function AISuiteClient({ user, aiModels, aiAgents, workflows }: AISuiteClientProps) {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="relative">
          <div className="hidden sm:flex space-x-2">
            <TabsTrigger value="chat" className="xs:text:xs text-sm">
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="code" className="xs:text-xs md:text-sm">
              Code Generator
            </TabsTrigger>
            <TabsTrigger value="supply-chain" className="xs:text-xs md:text-sm">
              Supply Chain
            </TabsTrigger>
            <TabsTrigger value="models" className="xs:text-xs md:text-sm">
              AI Models
            </TabsTrigger>
            <TabsTrigger value="agents" className="xs:text-xs md:text-sm">
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="workflows" className="xs:text-xs md:text-sm">
              Workflows
            </TabsTrigger>
          </div>
          <div className="sm:hidden flex justify-between items-center">
            <TabsTrigger value="chat" className="flex flex-col items-center justify-center">
              <MessageSquare className="h-5 w-5" />
              <span className="text-[0.7rem]">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex flex-col items-center justify-center">
              <Code className="h-5 w-5" />
              <span className="text-[0.7rem]">Code</span>
            </TabsTrigger>
            <TabsTrigger value="supply-chain" className="flex flex-col items-center justify-center">
              <Package className="h-5 w-5" />
              <span className="text-[0.7rem]">Supply Chain</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex flex-col items-center justify-center">
              <Sparkles className="h-5 w-5" />
              <span className="text-[0.7rem]">Models</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex flex-col items-center justify-center">
              <Bot className="h-5 w-5" />
              <span className="text-[0.7rem]">Agents</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex flex-col items-center justify-center">
              <ListChecks className="h-5 w-5" />
              <span className="text-[0.7rem]">Workflows</span>
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="chat" className="py-4">
          <AIChat user={user} aiModels={aiModels} />
        </TabsContent>

        <TabsContent value="code" className="py-4">
          <AICodeGenerator user={user} aiModels={aiModels} />
        </TabsContent>

        <TabsContent value="supply-chain" className="py-4">
          <AISupplyChainOptimizer user={user} aiModels={aiModels} />
        </TabsContent>

        <TabsContent value="models" className="py-4">
          <AIModelsList models={aiModels} />
        </TabsContent>

        <TabsContent value="agents" className="py-4">
          <AIAgentsList agents={aiAgents} user={user} aiModels={aiModels} />
        </TabsContent>

        <TabsContent value="workflows" className="py-4">
          <AIWorkflowsList workflows={workflows} user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
