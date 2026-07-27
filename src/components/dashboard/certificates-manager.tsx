"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit3, Trash2, ExternalLink, Upload, X } from "lucide-react";
import { getCertificates, addCertificate, updateCertificate, deleteCertificate, Certificate } from "@/actions/certificates";
import { BulgeText } from "@/components/bulge-text";
import { toast } from "sonner";

export function CertificatesManager() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Certificate | null>(null);

  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await getCertificates();
    if (data) setCerts(data as Certificate[]);
    setLoading(false);
  };

  const resetForm = () => {
    setTitle(""); setIssuer(""); setDate(""); setImage(""); setCredentialUrl("");
    setEditData(null); setShowForm(false);
  };

  const openEdit = (c: Certificate) => {
    setEditData(c);
    setTitle(c.title); setIssuer(c.issuer); setDate(c.date);
    setImage(c.image); setCredentialUrl(c.credentialUrl || "");
    setShowForm(true);
  };

  const compressImage = (file: File, maxWidth = 600, quality = 0.6): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width, height = img.height;
          if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(await compressImage(file));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!title.trim() || !issuer.trim() || !date.trim() || !image) {
      toast.error("Please fill in all required fields and upload an image.");
      return;
    }
    const payload = { title: title.trim(), issuer: issuer.trim(), date: date.trim(), image, credentialUrl: credentialUrl.trim() };
    try {
      if (editData?.id) {
        const result = await updateCertificate(editData.id, payload);
        if (result?.success === false) {
          toast.error("Failed to update certificate.");
          return;
        }
        toast.success("Certificate updated successfully.");
      } else {
        const result = await addCertificate(payload);
        if (result?.success === false) {
          toast.error("Failed to add certificate.");
          return;
        }
        toast.success("Certificate added successfully.");
      }
      resetForm();
      load();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this certificate?")) {
      try {
        const result = await deleteCertificate(id);
        if (result?.success === false) {
          toast.error("Failed to delete certificate.");
          return;
        }
        toast.success("Certificate deleted.");
        load();
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold tracking-tight">Certificates</h3>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Plus size={16} /> <BulgeText text="Add Certificate" />
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-4 border border-border/40 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 rounded-lg bg-foreground/[0.03] border border-border text-sm" />
            <input value={issuer} onChange={e => setIssuer(e.target.value)} placeholder="Issuer" className="w-full px-3 py-2 rounded-lg bg-foreground/[0.03] border border-border text-sm" />
            <input value={date} onChange={e => setDate(e.target.value)} placeholder="Date (e.g. June 2026)" className="w-full px-3 py-2 rounded-lg bg-foreground/[0.03] border border-border text-sm" />
            <input value={credentialUrl} onChange={e => setCredentialUrl(e.target.value)} placeholder="Credential URL (optional)" className="w-full px-3 py-2 rounded-lg bg-foreground/[0.03] border border-border text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 rounded-lg border border-dashed border-border text-xs text-muted/60 hover:text-foreground transition-all">
              <Upload size={14} className="inline mr-1" /> <BulgeText text="Upload Image" />
            </button>
            {image && <span className="text-[10px] text-muted/40">Image selected</span>}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>
          <div className="flex gap-2 pt-2 border-t border-border">
            <button onClick={resetForm} className="flex-1 py-2 rounded-xl border border-border text-xs font-semibold text-muted hover:text-foreground transition-all"><BulgeText text="Cancel" /></button>
            <button onClick={handleSave} className="flex-1 py-2 rounded-xl bg-foreground text-background text-xs font-bold"><BulgeText text={editData ? "Update Certificate" : "Add Certificate"} /></button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted/40 text-sm">Loading certificates...</div>
      ) : certs.length === 0 ? (
        <div className="text-center py-12 text-muted/40 text-sm">No certificates added yet.</div>
      ) : (
        <div className="space-y-3">
          {certs.map((c) => (
            <div key={c.id} className="glass-card rounded-xl p-4 border border-border/40 group hover:bg-foreground/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                {c.image && (
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-surface">
                    <img src={c.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold">{c.title}</h4>
                  <p className="text-xs text-muted/70">{c.issuer} · {c.date}</p>
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted/50 hover:text-foreground transition-colors mt-1">
                      <ExternalLink size={10} /> Verify
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted hover:text-foreground transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => c.id && handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors">
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
