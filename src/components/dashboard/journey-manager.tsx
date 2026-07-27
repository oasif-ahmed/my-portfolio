"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Save, Trash2, Edit3, Sparkles, GripVertical } from "lucide-react";
import { getJourney, addJourneyItem, updateJourneyItem, deleteJourneyItem, JourneyItem } from "@/actions/journey";
import { getIcon, ALL_ICON_NAMES } from "@/lib/icons";
import { BulgeText } from "@/components/bulge-text";
import { toast } from "sonner";

export function JourneyManager() {
  const [items, setItems] = useState<JourneyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");
  const [highlightsStr, setHighlightsStr] = useState("");
  const [icons, setIcons] = useState<string[]>([]);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await getJourney();
    if (data) setItems(data);
    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setPeriod("");
    setDescription("");
    setHighlightsStr("");
    setIcons([]);
    setOrder(items.length);
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (item: JourneyItem) => {
    setTitle(item.title);
    setPeriod(item.period);
    setDescription(item.description);
    setHighlightsStr((item.highlights || []).join(", "));
    setIcons(item.icons);
    setOrder(item.order);
    setEditingId(item.id || null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !period.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const highlights = highlightsStr.split(",").map((s) => s.trim()).filter(Boolean);
    const data = {
      title: title.trim(),
      period: period.trim(),
      description: description.trim(),
      highlights: highlights.length > 0 ? highlights : undefined,
      icons,
      order,
    };
    try {
      if (editingId) {
        const result = await updateJourneyItem(editingId, data);
        if (result?.success === false) {
          toast.error("Failed to update entry.");
          return;
        }
        toast.success("Entry updated successfully.");
      } else {
        const result = await addJourneyItem(data);
        if (result?.success === false) {
          toast.error("Failed to add entry.");
          return;
        }
        toast.success("Entry added successfully.");
      }
      resetForm();
      loadItems();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this journey entry?")) {
      try {
        const result = await deleteJourneyItem(id);
        if (result?.success === false) {
          toast.error("Failed to delete entry.");
          return;
        }
        toast.success("Entry deleted.");
        loadItems();
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const toggleIcon = (iconName: string) => {
    setIcons((prev) =>
      prev.includes(iconName) ? prev.filter((i) => i !== iconName) : [...prev, iconName]
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold tracking-tight">Journey</h3>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Plus size={16} /> <BulgeText text="Add Entry" />
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
                  {editingId ? "Edit Journey Entry" : "New Journey Entry"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1.5 block">Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Full Stack Development"
                    className="w-full px-4 py-2.5 rounded-xl bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1.5 block">Period</label>
                  <input type="text" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="e.g. 2024 - 2025"
                    className="w-full px-4 py-2.5 rounded-xl bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1.5 block">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe this period..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 text-sm resize-none" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1.5 block">Highlights (comma separated)</label>
                <input type="text" value={highlightsStr} onChange={(e) => setHighlightsStr(e.target.value)} placeholder="e.g. Deep dive into OOP, Led team project"
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 text-sm" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1.5 block">Icons</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 rounded-xl bg-foreground/[0.02] border border-border">
                  {ALL_ICON_NAMES.map((iconName) => {
                    const IconComp = getIcon(iconName);
                    const selected = icons.includes(iconName);
                    return (
                      <button
                        key={iconName}
                        onClick={() => toggleIcon(iconName)}
                        className={`p-2 rounded-lg border transition-all ${
                          selected
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent text-muted border-border hover:border-foreground/30"
                        }`}
                        title={iconName}
                      >
                        {IconComp && <IconComp size={16} />}
                      </button>
                    );
                  })}
                </div>
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
        <div className="text-center py-12 text-muted/40 text-sm">Loading journey entries...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted/40 text-sm">No journey entries added yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="glass-card rounded-xl p-4 border border-border/40 group hover:bg-foreground/[0.02] transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-sm font-bold">{item.title}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-foreground/5 border border-border text-[10px] uppercase font-bold tracking-widest text-muted">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-xs text-muted/70 line-clamp-2">{item.description}</p>
                  {item.highlights && item.highlights.length > 0 && (
                    <p className="text-xs text-muted/50 mt-1">{item.highlights.join(" · ")}</p>
                  )}
                  {item.icons && item.icons.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {item.icons.map((iconName) => {
                        const IconComp = getIcon(iconName);
                        return IconComp ? (
                          <div key={iconName} className="w-6 h-6 rounded-md bg-foreground/5 border border-border flex items-center justify-center">
                            <IconComp size={12} className="text-muted/60" />
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted hover:text-foreground transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => item.id && handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
