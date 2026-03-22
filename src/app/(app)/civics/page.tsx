"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModerationHubPage from "@/app/(app)/moderation/page";
import GovernanceHubPage from "@/app/(app)/governance/page";

export default function CivicsMobilePage() {
  return (
    <div className="space-y-6 lg:hidden">
      <div className="mb-4">
        <h1 className="font-sans font-bold text-3xl tracking-tight text-ink">Civics</h1>
        <p className="font-sans text-sm text-slate mt-1">
          Participate in moderation juries and network governance.
        </p>
      </div>

      <Tabs defaultValue="moderation" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6 bg-surface border border-paper-dark p-1 rounded-lg">
          <TabsTrigger value="moderation" className="font-medium text-sm rounded-md data-[state=active]:bg-paper data-[state=active]:shadow-sm">Moderation</TabsTrigger>
          <TabsTrigger value="governance" className="font-medium text-sm rounded-md data-[state=active]:bg-paper data-[state=active]:shadow-sm">Governance</TabsTrigger>
        </TabsList>
        <TabsContent value="moderation" className="mt-0">
          <ModerationHubPage />
        </TabsContent>
        <TabsContent value="governance" className="mt-0">
          <GovernanceHubPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
