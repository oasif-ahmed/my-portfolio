"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Sparkles, Link as LinkIcon, ExternalLink } from "lucide-react";
import { getResumeUrl, updateResumeUrl } from "@/actions/resume";
import { BulgeText } from "@/components/bulge-text";

export function ResumeManager() {
  const [url, setUrl] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadResumeUrl();
  }, []);

  const loadResumeUrl = async () => {
    setLoading(true);
    const data = await getResumeUrl();
    setUrl(data);
    setSavedUrl(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!url.trim()) return;
    setSaving(true);
    setMessage(null);
    const result = await updateResumeUrl(url.trim());
    if (result.success) {
      setSavedUrl(url.trim());
      setMessage({ type: "success", text: "Resume URL updated successfully!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update" });
    }
    setSaving(false);
  };

  const hasChanges = url !== savedUrl;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold tracking-tight">Resume Link</h3>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-border/50 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-green-400" />
          <span className="text-sm font-bold uppercase tracking-widest text-foreground/40">
            Edit Resume URL
          </span>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1.5 block">
            Resume URL
          </label>
          <div className="relative">
            <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/40" />
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setMessage(null); }}
              placeholder="https://drive.google.com/your-resume"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 text-sm"
            />
          </div>
        </div>

        {savedUrl && (
          <a
            href={savedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink size={12} />
            Open current resume link
          </a>
        )}

        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`text-xs ${message.type === "success" ? "text-green-400" : "text-red-400"}`}
            >
              {message.text}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex gap-3 pt-2">
          <button
            onClick={loadResumeUrl}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted hover:text-foreground transition-colors"
          >
            <BulgeText text="Reset" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges || !url.trim()}
            className="flex-1 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-40 disabled:hover:scale-100"
          >
            <Save size={14} /> <BulgeText text={saving ? "Saving..." : "Save"} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 text-muted/40 text-sm">Loading resume URL...</div>
      )}
    </div>
  );
}
