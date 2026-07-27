import { getSkills, addSkill } from "@/actions/skills";
import { getJourney, addJourneyItem } from "@/actions/journey";
import { getCertificates } from "@/actions/certificates";
import Home from "./home-page";

const defaultSkills = [
    { name: "HTML5", icon: "SiHtml5", level: 95 },
    { name: "CSS3", icon: "SiCss3", level: 90 },
    { name: "JavaScript", icon: "SiJavascript", level: 85 },
    { name: "TypeScript", icon: "SiTypescript", level: 80 },
    { name: "React", icon: "SiReact", level: 90 },
    { name: "Next.js", icon: "SiNextdotjs", level: 85 },
    { name: "Tailwind CSS", icon: "SiTailwindcss", level: 95 },
    { name: "Framer Motion", icon: "SiFramer", level: 75 },
    { name: "Vite", icon: "SiVite", level: 80 },
    { name: "Node.js", icon: "SiNodedotjs", level: 75 },
    { name: "Express", icon: "SiExpress", level: 80 },
    { name: "MongoDB", icon: "SiMongodb", level: 70 },
    { name: "PostgreSQL", icon: "SiPostgresql", level: 65 },
    { name: "Firebase", icon: "SiFirebase", level: 75 },
    { name: "JWT", icon: "SiJsonwebtokens", level: 90 },
    { name: "Python", icon: "SiPython", level: 80 },
    { name: "C++", icon: "SiCplusplus", level: 70 },
    { name: "Git", icon: "SiGit", level: 85 },
    { name: "GitHub", icon: "SiGithub", level: 85 },
    { name: "Docker", icon: "SiDocker", level: 60 },
    { name: "Figma", icon: "SiFigma", level: 70 },
];

const defaultJourney = [
    { title: "B.Sc. in Computer Science", period: "2022 - 2026", description: "Prime University. Graduated with a focus on Software Engineering and Artificial Intelligence.", icons: ["Book", "Award", "Terminal"] },
    { title: "Exploration Phase", period: "2022 - 2023", description: "Started my coding journey by exploring the fundamentals.", icons: ["SiC", "SiCplusplus", "SiHtml5", "SiCss3", "SiPython", "SiJavascript", "SiDocker", "SiPostgresql"] },
    { title: "Core Concepts & Mobile Development", period: "2023 - 2024", description: "Grabbed core software engineering concepts including OOP and DSA.", highlights: ["Deep dive into OOP and DSA", "Explored React Native and Swift for mobile apps"], icons: ["Code2", "Database", "SiReact", "SiSwift", "Tablet", "Terminal"] },
    { title: "Full Stack Development", period: "2024 - 2025", description: "Transitioned into full-scale professional development.", icons: ["SiJavascript", "SiTypescript", "SiReact", "SiNextdotjs", "SiNodedotjs", "SiExpress", "SiMongodb", "SiTailwindcss", "SiPostman", "SiDocker"] },
    { title: "AI-Enhanced Development", period: "2025 - 2026", description: "Mastering the integration of AI into the software engineering lifecycle.", icons: ["Bot", "Sparkles", "Cpu", "Terminal", "Code2"] },
];

export default async function Page() {
    let skills = await getSkills();
    if (!skills || skills.length === 0) {
        for (const s of defaultSkills) {
            await addSkill({ name: s.name, icon: s.icon, level: s.level });
        }
        skills = defaultSkills.map(s => ({ id: "", ...s }));
    }

    let journey = await getJourney();
    if (!journey || journey.length === 0) {
        for (let i = 0; i < defaultJourney.length; i++) {
            await addJourneyItem({ ...defaultJourney[i], order: i });
        }
        journey = defaultJourney.map((item, i) => ({ ...item, id: "", order: i, highlights: item.highlights || [] }));
    }

    const certificates = await getCertificates();

    return (
        <Home
            initialSkills={skills.map(s => ({ name: s.name, icon: s.icon, level: s.level }))}
            initialJourney={journey.map(j => ({ title: j.title, period: j.period, description: j.description, highlights: j.highlights, icons: j.icons }))}
            initialCertificates={certificates?.map(c => ({ title: c.title, issuer: c.issuer, date: c.date, image: c.image, credentialUrl: c.credentialUrl })) || []}
        />
    );
}
