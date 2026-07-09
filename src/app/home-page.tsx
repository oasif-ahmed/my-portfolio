"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TechMarquee } from "@/components/tech-marquee";
import { SkillsGrid } from "@/components/skills-grid";
import { Journey } from "@/components/journey";
import { GithubCalendar } from "@/components/github-calendar";
import { ProjectHoverList } from "@/components/project-hover-list";
import { GsapReveal } from "@/components/gsap-reveal";
import { CertificatesCarousel } from "@/components/certificates-carousel";
import { BulgeText } from "@/components/bulge-text";

import { Mail, Copy, Github, Linkedin, Twitter, Phone, MessageCircle } from "lucide-react";
import { getProjects, addProject } from "@/actions/projects";
import { getIcon } from "@/lib/icons";
import { IconType } from "react-icons";

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
  },

];

interface HomePageProps {
  initialSkills?: { name: string; icon: string; level: number }[];
  initialJourney?: { title: string; period: string; description: string; highlights?: string[]; icons: string[] }[];
  initialCertificates?: { title: string; issuer: string; date: string; image: string; credentialUrl?: string }[];
  resumeUrl?: string;
}

export default function Home({ initialSkills, initialJourney, initialCertificates, resumeUrl }: HomePageProps) {
  const router = useRouter();
  const [customProjects, setCustomProjects] = useState<any[]>([]);

  useEffect(() => {
    const handleAddFromPalette = () => router.push("/dashboard");
    const handleDBCheck = async () => {
      const dbProjects = await getProjects();
      if (dbProjects) {
        alert(`Database Status: ONLINE\nProjects Found: ${dbProjects.length}`);
      } else {
        alert("Database Status: OFFLINE or UNREACHABLE");
      }
    };

    window.addEventListener("trigger-add-project", handleAddFromPalette);
    window.addEventListener("trigger-db-check", handleDBCheck);
    return () => {
      window.removeEventListener("trigger-add-project", handleAddFromPalette);
      window.removeEventListener("trigger-db-check", handleDBCheck);
    };
  }, [router]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const dbProjects = await getProjects();
        if (dbProjects && dbProjects.length > 0) {
          setCustomProjects(dbProjects);
        } else {
          const initialDefaults = defaultProjects.map(p => ({
            title: p.title,
            description: p.description,
            tags: p.tags,
            status: p.status,
            images: p.images,
            liveLink: p.liveLink,
            repoLink: p.repoLink,
          }));

          const addedWithIds: any[] = [];
          for (const proj of initialDefaults) {
            const res = await addProject(proj);
            if (res.success) addedWithIds.push({ ...proj, id: res.id });
          }
          setCustomProjects(addedWithIds);
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    };
    loadProjects();
  }, []);

  return (
    <main className="min-h-screen relative selection:bg-foreground/10">
      <Navbar />

      <Hero />
      
      <TechMarquee />

      <SkillsGrid
        initialSkills={initialSkills?.map(s => ({
          name: s.name,
          icon: getIcon(s.icon) || getIcon("SiReact")!,
          level: s.level,
        }))}
      />

      <Journey
        initialData={initialJourney?.map(item => ({
          title: item.title,
          period: item.period,
          description: item.description,
          highlights: item.highlights,
          icons: item.icons.map(name => getIcon(name)).filter(Boolean) as IconType[],
        }))}
      />

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
          />
        </GsapReveal>
      </section>

      {initialCertificates && initialCertificates.length > 0 && (
        <CertificatesCarousel certificates={initialCertificates} />
      )}

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

                <a
                  href={resumeUrl || 'https://drive.google.com/file/d/1u1eJkYcgpB14Nss5f-SOgRH9sSQ3frOy/view?usp=drive_link'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-full bg-foreground text-background font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <BulgeText text="Resume" />
                </a>
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
                  <BulgeText text="Say Hello" />
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("oasifrikto@gmail.com");
                    alert("Email copied to clipboard!");
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-full glass font-semibold hover:bg-foreground/5 transition-colors flex items-center justify-center gap-2 group"
                >
                  <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <BulgeText text="Copy Email" />
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
