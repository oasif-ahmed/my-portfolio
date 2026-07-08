"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Save, Trash2, Edit3, Sparkles, Search } from "lucide-react";
import { getSkills, addSkill, updateSkill, deleteSkill, Skill } from "@/actions/skills";
import { getIcon, ALL_ICON_NAMES } from "@/lib/icons";
import { BulgeText } from "@/components/bulge-text";

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("SiReact");
  const [level, setLevel] = useState(80);
  const [iconSearch, setIconSearch] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    const data = await getSkills();
    if (data) setSkills(data);
    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setIcon("SiReact");
    setLevel(80);
    setIconSearch("");
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (skill: Skill) => {
    setName(skill.name);
    setIcon(skill.icon);
    setLevel(skill.level);
    setEditingId(skill.id || null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    const data = { name: name.trim(), icon, level };
    if (editingId) {
      await updateSkill(editingId, data);
    } else {
      await addSkill(data);
    }
    resetForm();
    loadSkills();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this skill?")) {
      await deleteSkill(id);
      loadSkills();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold tracking-tight">Skills</h3>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Plus size={16} /> <BulgeText text="Add Skill" />
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="glass-card rounded-2xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-green-400" />
                <span className="text-sm font-bold uppercase tracking-widest text-foreground/40">
                  {editingId ? "Edit Skill" : "New Skill"}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. React"
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1.5 block">Icon</label>
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/40" />
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Search icons..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 text-sm"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto p-2 rounded-xl bg-foreground/[0.02] border border-border grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                  {ALL_ICON_NAMES.filter((n) => n.toLowerCase().includes(iconSearch.toLowerCase())).map((iconName) => {
                    const IconComp = getIcon(iconName);
                    const selected = icon === iconName;
                    return (
                      <button
                        key={iconName}
                        onClick={() => setIcon(iconName)}
                        className={`p-2 rounded-lg border transition-all ${
                          selected
                            ? "bg-foreground text-background border-foreground ring-2 ring-foreground/30"
                            : "bg-transparent text-muted border-border hover:border-foreground/30 hover:bg-foreground/5"
                        }`}
                        title={iconName}
                      >
                        {IconComp && <IconComp size={16} className="mx-auto" />}
                      </button>
                    );
                  })}
                  {ALL_ICON_NAMES.filter((n) => n.toLowerCase().includes(iconSearch.toLowerCase())).length === 0 && (
                    <div className="col-span-full text-center py-4 text-xs text-muted/40">No icons found</div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1.5 block">
                  Level: {level}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full accent-foreground"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={resetForm} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted hover:text-foreground transition-colors">
                  <BulgeText text="Cancel" />
                </button>
                <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                  <Save size={14} /> <BulgeText text={editingId ? "Update" : "Save"} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-12 text-muted/40 text-sm">Loading skills...</div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12 text-muted/40 text-sm">No skills added yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill) => {
            const SkillIcon = getIcon(skill.icon);
            return (
              <div key={skill.id} className="glass-card rounded-xl p-4 border border-border/40 flex items-center justify-between group hover:bg-foreground/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  {SkillIcon && (
                    <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center">
                      <SkillIcon className="w-5 h-5 text-muted" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold">{skill.name}</p>
                    <div className="w-24 h-1.5 rounded-full bg-foreground/10 mt-1 overflow-hidden">
                      <div className="h-full rounded-full bg-foreground/40" style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted hover:text-foreground transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => skill.id && handleDelete(skill.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
