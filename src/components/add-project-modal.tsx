"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    X,
    Upload,
    Link,
    Github,
    Tag,
    Type,
    FileText,
    Trash2,
    GripVertical,
    ImagePlus,
    ChevronLeft,
    ChevronRight,
    Sparkles,
} from "lucide-react";

export interface CustomProject {
    id?: string;
    title: string;
    description: string;
    tags: string[];
    status: string;
    images: string[]; // base64 strings
    liveLink?: string;
    repoLink?: string;
    challenges?: string;
    futurePlans?: string;
}

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: CustomProject) => void;
    initialData?: CustomProject | null;
}

export function AddProjectCard({ onClick }: { onClick: () => void }) {
    return (
        <motion.div
            whileHover={{
                y: -12,
                boxShadow: "0 30px 60px -12px rgba(0,0,0,0.4)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={onClick}
            className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full cursor-pointer relative border-2 border-dashed border-border hover:border-foreground/20 transition-colors"
        >
            {/* Header */}
            <div className="px-4 py-2 border-b border-border bg-foreground/5 flex items-center justify-between">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 group-hover:bg-green-500/60 transition-colors" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 group-hover:bg-green-500/40 transition-colors" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors" />
                </div>
                <span className="text-[10px] font-mono text-muted/50 uppercase tracking-widest leading-none">
                    new
                </span>
            </div>

            <div className="p-8 flex flex-col flex-1 items-center justify-center min-h-[400px]">
                {/* Animated Plus Icon */}
                <motion.div
                    className="relative mb-8"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <div className="absolute inset-0 bg-foreground/5 rounded-full blur-xl scale-150 group-hover:bg-foreground/10 transition-colors" />
                    <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-foreground/10 group-hover:border-foreground/30 flex items-center justify-center transition-colors">
                        <Plus
                            size={32}
                            className="text-foreground/20 group-hover:text-foreground/60 transition-colors"
                        />
                    </div>
                </motion.div>

                <h3 className="text-xl font-bold mb-2 text-foreground/30 group-hover:text-foreground/70 transition-colors">
                    Add New Project
                </h3>
                <p className="text-sm text-muted/40 group-hover:text-muted/70 transition-colors text-center max-w-[200px]">
                    Showcase your latest work with images, links & tech stack
                </p>
            </div>
        </motion.div>
    );
}

export function AddProjectModal({ isOpen, onClose, onSave, initialData }: AddProjectModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [status, setStatus] = useState("Latest");
    const [images, setImages] = useState<string[]>([]);
    const [liveLink, setLiveLink] = useState("");
    const [repoLink, setRepoLink] = useState("");
    const [currentPreview, setCurrentPreview] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setTagInput("");
        setTags([]);
        setStatus("Latest");
        setImages([]);
        setLiveLink("");
        setRepoLink("");
        setCurrentPreview(0);
        setErrors({});
    };

    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.title || "");
            setDescription(initialData.description || "");
            setTags(initialData.tags || []);
            setStatus(initialData.status || "Latest");
            setImages(initialData.images || []);
            setLiveLink(initialData.liveLink || "");
            setRepoLink(initialData.repoLink || "");
        } else if (isOpen && !initialData) {
            resetForm();
        }
    }, [isOpen, initialData]);

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const tag = tagInput.trim();
            if (tag && !tags.includes(tag)) {
                setTags([...tags, tag]);
                setTagInput("");
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const compressImage = (file: File, maxWidth = 800, quality = 0.6): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new window.Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", quality));
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const processFiles = useCallback((files: FileList | null) => {
        if (!files) return;
        Array.from(files).forEach(async (file) => {
            if (!file.type.startsWith("image/")) return;
            const compressed = await compressImage(file);
            setImages((prev) => [...prev, compressed]);
        });
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            processFiles(e.dataTransfer.files);
        },
        [processFiles]
    );

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        if (currentPreview >= images.length - 1) {
            setCurrentPreview(Math.max(0, images.length - 2));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = "Project title is required";
        if (!description.trim()) newErrors.description = "Description is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const project: CustomProject = {
            id: initialData ? initialData.id : `custom-${Date.now()}`,
            title: title.trim(),
            description: description.trim(),
            tags,
            status,
            images,
            liveLink: liveLink.trim(),
            repoLink: repoLink.trim(),
        };

        onSave(project);
        handleClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 overflow-y-auto"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ backdropFilter: "blur(0px)" }}
                        animate={{ backdropFilter: "blur(12px)" }}
                        className="fixed inset-0 bg-background/70"
                        onClick={handleClose}
                    />

                    <div className="flex items-center justify-center min-h-full p-4">
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="glass-card w-full max-w-xl rounded-2xl relative z-10 border border-border/50 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                        {/* Modal Header */}
                        <div className="px-4 py-3 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-sm font-bold tracking-tight">{initialData ? "Edit Project" : "Add New Project"}</h2>
                            <button
                                onClick={handleClose}
                                className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted hover:text-foreground transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-4 flex flex-col gap-3">
                            {/* Title */}
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 mb-1.5 flex items-center gap-1.5">
                                    <Type size={12} />
                                    Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                                    }}
                                    placeholder="e.g. My Awesome Project"
                                    className={`w-full px-3 py-2 rounded-lg bg-foreground/[0.03] border text-sm ${
                                        errors.title ? "border-red-400/50" : "border-border"
                                    } text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all`}
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-400 mt-1">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 mb-1.5 flex items-center gap-1.5">
                                    <FileText size={12} />
                                    Description <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                        if (errors.description)
                                            setErrors((prev) => ({ ...prev, description: "" }));
                                    }}
                                    placeholder="Describe your project..."
                                    rows={2}
                                    className={`w-full px-3 py-2 rounded-lg bg-foreground/[0.03] border text-sm resize-none ${
                                        errors.description ? "border-red-400/50" : "border-border"
                                    } text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all`}
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-400 mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Tags + Status row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 mb-1.5 flex items-center gap-1.5">
                                        <Tag size={12} />
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder="Press Enter to add"
                                        className="w-full px-3 py-2 rounded-lg bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all text-sm"
                                    />
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {tags.map((tag) => (
                                                <span key={tag} className="px-2 py-0.5 rounded-md bg-foreground/5 border border-border text-[10px] font-semibold text-muted flex items-center gap-1">
                                                    {tag}
                                                    <button onClick={() => removeTag(tag)} className="text-muted/40 hover:text-red-400">
                                                        <X size={10} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 mb-1.5 block">
                                        Status
                                    </label>
                                    <div className="flex gap-1">
                                        {["Latest", "Active", "Archived", "WIP"].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setStatus(s)}
                                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                                    status === s
                                                        ? "bg-foreground text-background"
                                                        : "bg-foreground/5 border border-border text-muted hover:text-foreground"
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 mb-1.5 flex items-center gap-1.5">
                                        <Link size={12} />
                                        Live Link
                                    </label>
                                    <input
                                        type="url"
                                        value={liveLink}
                                        onChange={(e) => setLiveLink(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 rounded-lg bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 mb-1.5 flex items-center gap-1.5">
                                        <Github size={12} />
                                        Repo
                                    </label>
                                    <input
                                        type="url"
                                        value={repoLink}
                                        onChange={(e) => setRepoLink(e.target.value)}
                                        placeholder="https://github.com/..."
                                        className="w-full px-3 py-2 rounded-lg bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Images */}
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 mb-1.5 flex items-center gap-1.5">
                                    <ImagePlus size={12} />
                                    Screenshots
                                </label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-3 py-2 rounded-lg border border-dashed border-border text-xs text-muted/60 hover:text-foreground hover:border-foreground/20 transition-all"
                                    >
                                        <Upload size={14} className="inline mr-1" />
                                        Upload
                                    </button>
                                    {images.length > 0 && (
                                        <span className="text-[10px] text-muted/40">{images.length} image{images.length > 1 ? 's' : ''}</span>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                {images.length > 0 && (
                                    <div className="flex gap-1.5 mt-2 overflow-x-auto scrollbar-hide">
                                        {images.map((img, i) => (
                                            <div key={i} className="relative group/thumb flex-shrink-0">
                                                <div className="w-12 h-9 rounded-md overflow-hidden border border-border">
                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <button
                                                    onClick={() => removeImage(i)}
                                                    className="absolute -top-1 -right-1 p-0.5 rounded-full bg-red-500 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                                                >
                                                    <X size={8} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-border">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted hover:text-foreground hover:bg-foreground/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5 shadow-lg"
                                >
                                    <Plus size={14} />
                                    {initialData ? "Save Changes" : "Add Project"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
