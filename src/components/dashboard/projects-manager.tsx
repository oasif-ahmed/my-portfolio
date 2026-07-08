"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, ExternalLink, Github } from "lucide-react";
import { AddProjectModal } from "@/components/add-project-modal";
import { getProjects, addProject, updateProject, deleteProject, CustomProject } from "@/actions/projects";
import { BulgeText } from "@/components/bulge-text";

export function ProjectsManager() {
  const [projects, setProjects] = useState<CustomProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<CustomProject | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await getProjects();
    if (data) setProjects(data as CustomProject[]);
    setLoading(false);
  };

  const handleSave = async (project: CustomProject) => {
    const { id, ...dataToSave } = project;
    if (id && projects.find((p) => p.id === id)) {
      await updateProject(id, dataToSave);
    } else {
      await addProject(dataToSave);
    }
    setIsModalOpen(false);
    setEditData(null);
    loadProjects();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this project?")) {
      await deleteProject(id);
      loadProjects();
    }
  };

  const openEdit = (project: CustomProject) => {
    setEditData(project);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold tracking-tight">Projects</h3>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Plus size={16} /> <BulgeText text="Add Project" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted/40 text-sm">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-muted/40 text-sm">No projects added yet.</div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="glass-card rounded-xl p-4 border border-border/40 group hover:bg-foreground/[0.02] transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-sm font-bold">{project.title}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-foreground/5 border border-border text-[10px] uppercase font-bold tracking-widest text-muted">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted/70 line-clamp-2">{project.description}</p>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-foreground/5 text-[10px] font-semibold text-muted/70 border border-border/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {(project.liveLink || project.repoLink) && (
                    <div className="flex gap-3 mt-2">
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted/50 hover:text-foreground transition-colors">
                          <ExternalLink size={12} /> Live
                        </a>
                      )}
                      {project.repoLink && (
                        <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted/50 hover:text-foreground transition-colors">
                          <Github size={12} /> Repo
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted hover:text-foreground transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => project.id && handleDelete(project.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditData(null); }}
        onSave={handleSave}
        initialData={editData}
      />
    </div>
  );
}
