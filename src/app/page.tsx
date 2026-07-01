"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { InteractiveTerminal } from "@/components/terminal";
import { TechMarquee } from "@/components/tech-marquee";
import { SkillsGrid } from "@/components/skills-grid";
import { Journey } from "@/components/journey";
import { GithubCalendar } from "@/components/github-calendar";
import { ProjectHoverList } from "@/components/project-hover-list";
import { AddProjectCard, AddProjectModal, CustomProject } from "@/components/add-project-modal";
import { GsapReveal, GsapParallax } from "@/components/gsap-reveal";

import { Mail, Copy, Github, Linkedin, Twitter, Phone, MessageCircle } from "lucide-react";
import { getProjects, addProject, updateProject, deleteProject } from "@/actions/projects";

const STORAGE_KEY = "portfolio-custom-projects";

const defaultProjects = [
  {
    title: "Local Chef Bazaar",
    description: "Local Chef Bazaar is a full-stack MERN marketplace that connects home chefs with local customers. Developed with a focus on security and scalability, it features role-based dashboards, Stripe payment integration, and JWT-secured routes. The platform empowers local entrepreneurs by providing them with the tools to manage a digital food business efficiently.",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "Firebase", "Framer Motion", "Tanstack Query"],
    status: "Latest",
    images: [
      "/projects/chef-1.png",
      "/projects/chef-2.png",
      "/projects/chef-3.png",
      "/projects/chef-4.png",
      "/projects/chef-5.png",
    ],
    liveLink: "https://local-chef-bazaar-client.vercel.app/",
    repoLink: "https://github.com/oasif-ahmed/local-chef-bazaar-client?tab=readme-ov-file",
    challenges: "[Please describe the challenges faced while developing Local Chef Bazaar]",
    futurePlans: "[Please describe potential improvements and future plans for Local Chef Bazaar]",
  },
  {
    title: "My Tools",
    description: "My Tools is a high-performance React-based utility dashboard designed for developers. It centralizes essential tools like JSON formatters, secure password generators, and image compressors into a single, lightning-fast SPA. Built with Vite and Tailwind CSS, the project emphasizes client-side data privacy and seamless UX through modular architecture and responsive design.",
    tags: ["React.js", "Vite", "Tailwind CSS", "Lucide React", "React Router", "LocalStorage API", "Firebase", "JWT"],
    status: "Latest",
    images: [
      "/projects/mytools-1.png",
      "/projects/mytools-2.png",
      "/projects/mytools-3.png",
      "/projects/mytools-4.png",
      "/projects/mytools-5.png",
    ],
    liveLink: "https://peoject-my-tools.vercel.app/",
    repoLink: "https://github.com/oasif-ahmed/peoject-myTools?tab=readme-ov-file",
    challenges: "[Please describe the challenges faced while developing My Tools]",
    futurePlans: "[Please describe potential improvements and future plans for My Tools]",
  },
  {
    title: "Hero.io",
    description: "Hero.io is a comprehensive, multi-page web application designed as an app marketplace and management ecosystem. The platform allows users to explore a catalog of mobile applications, view detailed analytics and user ratings for specific apps, and manage their personal installations through a dedicated dashboard.",
    tags: ["React", "Netlify", "App Marketplace", "Analytics", "Dashboard", "Full Stack"],
    status: "Latest",
    images: [
      "/projects/hero-io-4.png",
      "/projects/hero-io-1.png",
      "/projects/hero-io-2.png",
      "/projects/hero-io-3.png",
    ],
    liveLink: "https://scintillating-parfait-b3d78e.netlify.app",
    repoLink: "https://github.com/oasif-ahmed/hero-io",
    challenges: "[Please describe the challenges faced while developing Hero.io]",
    futurePlans: "[Please describe potential improvements and future plans for Hero.io]",
  },

];

export default function Home() {
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  type PendingAction = { type: "ADD" } | { type: "EDIT", project: CustomProject } | { type: "DELETE", id: string };
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [editProjectData, setEditProjectData] = useState<CustomProject | null>(null);

  const OWNER_HASH = "731840f6fb7cdf7057bddeea86c9534e894d9b4fe8a3ed875d8c65ea74009046";

  async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const handleAuthTrigger = (action: PendingAction) => {
    if (isVerified) {
      executeAction(action);
    } else {
      setPendingAction(action);
      setIsPasswordModalOpen(true);
      setPasswordInput("");
      setPasswordError(false);
    }
  };

  const executeAction = async (action: PendingAction) => {
    if (action.type === "ADD") {
      setEditProjectData(null);
      setIsAddModalOpen(true);
    } else if (action.type === "EDIT") {
      setEditProjectData(action.project);
      setIsAddModalOpen(true);
    } else if (action.type === "DELETE") {
      if (confirm("Are you sure you want to delete this project?")) {
        const { success } = await deleteProject(action.id);
        if (success) {
          setCustomProjects(customProjects.filter((p) => p.id !== action.id));
        } else {
          alert("Failed to delete project from database");
        }
      }
    }

    // Always lock the system again immediately after action is granted!
    setIsVerified(false);
  };

  const handlePasswordSubmit = async () => {
    const hashed = await hashPassword(passwordInput);
    if (hashed === OWNER_HASH) {
      setIsVerified(true);
      setIsPasswordModalOpen(false);
      setPasswordInput("");
      setPasswordError(false);
      if (pendingAction) {
        executeAction(pendingAction);
        setPendingAction(null);
      }
    } else {
      setPasswordError(true);
    }
  };

  // Load custom projects from MongoDB on mount
  useEffect(() => {
    const handleAddFromPalette = () => handleAuthTrigger({ type: "ADD" });
    const handleDBCheck = async () => {
      const dbProjects = await getProjects();
      if (dbProjects) {
        alert(`🚀 Database Status: ONLINE\n📁 Projects Found: ${dbProjects.length}`);
      } else {
        alert("⚠️ Database Status: OFFLINE or UNREACHABLE");
      }
    };

    window.addEventListener("trigger-add-project", handleAddFromPalette);
    window.addEventListener("trigger-db-check", handleDBCheck);
    return () => {
      window.removeEventListener("trigger-add-project", handleAddFromPalette);
      window.removeEventListener("trigger-db-check", handleDBCheck);
    };
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const dbProjects = await getProjects();
        if (dbProjects && dbProjects.length > 0) {
          setCustomProjects(dbProjects as CustomProject[]);
        } else {
          // If DB is empty, use defaults array, push to DB, then set state
          const initialDefaults = defaultProjects.map(p => ({
            title: p.title,
            description: p.description,
            tags: p.tags,
            status: p.status,
            images: p.images,
            liveLink: p.liveLink,
            repoLink: p.repoLink,
          }));

          const addedWithIds = [];
          for (const proj of initialDefaults) {
            const res = await addProject(proj);
            if (res.success) addedWithIds.push({ ...proj, id: res.id });
          }
          setCustomProjects(addedWithIds as CustomProject[]);
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    };
    loadProjects();
  }, []);

  const saveProject = async (project: CustomProject) => {
    const isExisting = project.id && !project.id.startsWith("custom-");
    // ^ our previous local storage mock IDs were 'custom-...'. Now we use actual MongoDB IDs.

    let updated;
    const { id, ...dataToSave } = project;

    if (isExisting) {
      // update in DB
      const res = await updateProject(id as string, dataToSave);
      if (res.success) {
        updated = customProjects.map((p) => (p.id === id ? project : p));
        setCustomProjects(updated);
      } else {
        alert("Failed to update project in DB.");
      }
    } else {
      // create new in DB
      const res = await addProject(dataToSave);
      if (res.success) {
        const fullProject = { ...dataToSave, id: res.id };
        updated = [...customProjects, fullProject];
        setCustomProjects(updated as CustomProject[]);
      } else {
        alert("Failed to add project to DB.");
      }
    }
  };


  return (
    <main className="min-h-screen relative selection:bg-foreground/10">
      <Navbar onAddProject={() => handleAuthTrigger({ type: "ADD" })} />

      <Hero />
      
      <TechMarquee />

      <SkillsGrid />

      <Journey />

      <GithubCalendar />

      {/* Projects Section */}
      <section id="work" className="py-24 overflow-hidden">
        <div className="px-6 max-w-6xl mx-auto mb-12">
          <GsapReveal>
            <div className="flex items-center gap-4">
              <span className="text-2xl opacity-50 font-mono">{">_"}</span>
              <h2 className="text-3xl font-bold tracking-tight">Recent Projects</h2>
            </div>
          </GsapReveal>
        </div>

        <GsapReveal delay={0.2}>
          <ProjectHoverList
            projects={customProjects}
            onEdit={(project) => handleAuthTrigger({ type: "EDIT", project })}
            onDelete={(id) => handleAuthTrigger({ type: "DELETE", id })}
          />
        </GsapReveal>
      </section>



      {/* Password Verification Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(12px)" }}
              className="absolute inset-0 bg-background/70"
              onClick={() => setIsPasswordModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-card w-full max-w-sm rounded-3xl relative z-10 border border-border/50 shadow-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <h3 className="text-xl font-bold tracking-tight">Verify Owner</h3>
                <p className="text-sm text-muted/60 mt-1">Enter the owner password to continue</p>
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePasswordSubmit();
                  }}
                  placeholder="Enter password..."
                  autoFocus
                  className={`w-full px-4 py-3 rounded-xl bg-foreground/[0.03] border ${passwordError ? "border-red-400/50" : "border-border"
                    } text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all text-sm text-center tracking-widest`}
                />
                {passwordError && (
                  <p className="text-xs text-red-400 mt-2 text-center">Incorrect password. Access denied.</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl border border-border text-sm font-semibold text-muted hover:text-foreground hover:bg-foreground/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 py-3 rounded-2xl bg-foreground text-background text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl"
                >
                  Verify
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={saveProject}
        initialData={editProjectData}
      />

      {/* About Section */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Left Column: Image Area */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end order-1 md:order-none">
            <GsapReveal>
              <div className="relative group w-full max-w-[280px] mx-auto md:mr-0">
                <div
                  className="relative overflow-hidden w-full flex items-center justify-center text-center"
                  style={{
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)'
                  }}
                >
                  <Image
                    src="/profile.png"
                    alt="Oasif Ahmed Rikto"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-105 scale-x-[-1]"
                  />
                </div>
              </div>
            </GsapReveal>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <GsapReveal delay={0.2}>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl">☕️</span>
                  <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
                </div>

                <p className="text-lg text-muted mb-6 leading-relaxed">
                  I’ve always been driven by a simple question: <span className="text-foreground font-semibold">How does the system work under the hood?</span> Whether it’s deconstructing a complex application or tuning a high-performance engine, I’m obsessed with the mechanics of how things run.
                </p>

                <p className="text-muted leading-relaxed mb-6">
                  As a <span className="text-foreground font-semibold">Full Stack Developer</span>, I bridge the gap between low-level logic and high-level design. I specialize in building fluid frontends with Next.js and JavaScript, while leveraging C++ and AI-driven design to optimize the core of every project. I’m a firm believer in the power of Open Source, contributing to the tools that move the web forward.
                </p>

                <p className="text-muted leading-relaxed mb-10">
                  When I’m not at my desk, you’ll find me in the world of motorsports, admiring the engineering of a fast car, or gaming to stay sharp.
                </p>

                <button className="px-8 py-3 rounded-full bg-foreground text-background font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
                  <a href='https://drive.google.com/file/d/1u1eJkYcgpB14Nss5f-SOgRH9sSQ3frOy/view?usp=drive_link' target="_blank" rel="noopener noreferrer">
                    Resume
                  </a>
                </button>
              </div>
            </GsapReveal>
          </div>
        </div>
      </section>



      {/* Contact CTA */}
      <GsapReveal>
        <section id="contact" className="py-24 px-6 max-w-4xl mx-auto">
          <div className="relative glass-card rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-foreground/5 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-foreground/5 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                Let&apos;s build something <br className="hidden md:block" /> amazing together.
              </h2>

              <p className="text-muted text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Whether you have a specific project in mind, need help navigating the complexities of modern web development, or just want to connect—my inbox is always open.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full sm:w-auto">
                <a
                  href="mailto:oasifrikto@gmail.com"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-foreground text-background font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 group"
                >
                  <Mail className="w-5 h-5 group-hover:animate-bounce" />
                  Say Hello
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("oasifrikto@gmail.com");
                    alert("Email copied to clipboard!");
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-full glass font-semibold hover:bg-foreground/5 transition-colors flex items-center justify-center gap-2 group"
                >
                  <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Copy Email
                </button>
              </div>

              {/* Social Links inside the card */}
              <div className="flex items-center gap-6 justify-center">
                <a href="https://github.com/oasif-ahmed" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass text-muted hover:text-foreground transition-all duration-300 group">
                  <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://www.linkedin.com/in/oasif-ahmed-rikto-30610b354/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass text-muted hover:text-[#0A66C2] transition-all duration-300 group">
                  <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="p-3 rounded-full glass text-muted hover:text-[#1DA1F2] transition-all duration-300 group">
                  <Twitter className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>
                <a href="tel:+8801734449965" title="Call Me" className="p-3 rounded-full glass text-muted hover:text-green-500 transition-all duration-300 group">
                  <Phone className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://wa.me/8801734449965" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="p-3 rounded-full glass text-muted hover:text-green-400 transition-all duration-300 group">
                  <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </GsapReveal>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border text-center text-muted text-sm">
        <p>© 2026 Oasif Ahmed Rikto. All rights reserved.</p>
        <div className="flex items-center justify-center gap-6 mt-4">
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
          <a
            href="https://www.linkedin.com/in/oasif-ahmed-rikto-30610b354/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
        </div>
      </footer>
    </main>
  );
}
