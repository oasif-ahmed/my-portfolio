"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Code2, MapPin, FolderKanban, Award } from "lucide-react";
import { SkillsManager } from "@/components/dashboard/skills-manager";
import { JourneyManager } from "@/components/dashboard/journey-manager";
import { ProjectsManager } from "@/components/dashboard/projects-manager";
import { CertificatesManager } from "@/components/dashboard/certificates-manager";

type Tab = "skills" | "journey" | "projects" | "certificates";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "skills", label: "Skills", icon: Code2 },
  { key: "journey", label: "Journey", icon: MapPin },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "certificates", label: "Certificates", icon: Award },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("projects");

  return (
    <main className="min-h-screen relative">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-xl hover:bg-foreground/5 text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-sm text-muted/60">Manage your portfolio content</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 glass rounded-2xl w-fit border border-border/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                  isActive ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="dashboard-tab"
                    className="absolute inset-0 bg-foreground/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={16} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "skills" && <SkillsManager />}
            {activeTab === "journey" && <JourneyManager />}
            {activeTab === "projects" && <ProjectsManager />}
            {activeTab === "certificates" && <CertificatesManager />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
