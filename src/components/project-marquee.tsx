"use client";

import React from "react";
import { ProjectCard } from "./project-card";
import { CustomProject } from "./add-project-modal";

interface ProjectMarqueeProps {
    projects: CustomProject[];
    onEdit: (project: CustomProject) => void;
    onDelete: (id: string) => void;
}

export function ProjectMarquee({ projects, onEdit, onDelete }: ProjectMarqueeProps) {
    if (!projects || projects.length === 0) return null;

    // Duplicate projects multiple times to ensure it covers the screen width and loops seamlessly
    // We need at least enough items to fill the width twice
    const duplicatedProjects = [...projects, ...projects, ...projects, ...projects];

    return (
        <div className="relative w-full overflow-hidden py-28 marquee-container">
            <div className="flex animate-marquee w-max gap-12 px-4">
                {duplicatedProjects.map((project, i) => (
                    <div 
                        key={`${project.id}-${i}`} 
                        className="w-[320px] md:w-[450px] flex-shrink-0"
                    >
                        <ProjectCard
                            title={project.title}
                            description={project.description}
                            tags={project.tags}
                            status={project.status}
                            images={project.images}
                            liveLink={project.liveLink}
                            repoLink={project.repoLink}
                            onEdit={() => onEdit(project)}
                            onDelete={() => onDelete(project.id || "")}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
