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
    id: string;
    title: string;
    description: string;
    tags: string[];
    status: string;
    images: string[]; // base64 strings
    liveLink: string;
    repoLink: string;
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
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ backdropFilter: "blur(0px)" }}
                        animate={{ backdropFilter: "blur(12px)" }}
                        className="absolute inset-0 bg-background/70"
                        onClick={handleClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="glass-card w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl relative z-10 border border-border/50 shadow-2xl scrollbar-hide"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 z-30 px-6 py-4 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <Sparkles size={18} className="text-green-400" />
                                </div>
                                <h2 className="text-lg font-bold tracking-tight">{initialData ? "Edit Project" : "Add New Project"}</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-xl hover:bg-foreground/5 text-muted hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 flex flex-col gap-6">
                            {/* Image Upload Area */}
                            <div>
                                <label className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-3 flex items-center gap-2">
                                    <ImagePlus size={14} />
                                    Project Screenshots
                                </label>

                                {/* Image Preview */}
                                {images.length > 0 && (
                                    <div className="mb-4">
                                        <div className="w-full aspect-video rounded-2xl bg-surface border border-border relative overflow-hidden group/preview">
                                            <img
                                                src={images[currentPreview]}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            {images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            setCurrentPreview(
                                                                (prev) => (prev - 1 + images.length) % images.length
                                                            )
                                                        }
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/70 backdrop-blur-sm opacity-0 group-hover/preview:opacity-100 transition-opacity border border-border"
                                                    >
                                                        <ChevronLeft size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setCurrentPreview(
                                                                (prev) => (prev + 1) % images.length
                                                            )
                                                        }
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/70 backdrop-blur-sm opacity-0 group-hover/preview:opacity-100 transition-opacity border border-border"
                                                    >
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Thumbnail Strip */}
                                        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
                                            {images.map((img, i) => (
                                                <div key={i} className="relative group/thumb flex-shrink-0">
                                                    <button
                                                        onClick={() => setCurrentPreview(i)}
                                                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                                                            i === currentPreview
                                                                ? "border-foreground/40 scale-105"
                                                                : "border-border opacity-60 hover:opacity-100"
                                                        }`}
                                                    >
                                                        <img
                                                            src={img}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() => removeImage(i)}
                                                        className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-500 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Drop Zone */}
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`w-full py-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                                        isDragging
                                            ? "border-green-400/50 bg-green-400/5"
                                            : "border-border hover:border-foreground/20 hover:bg-foreground/[0.02]"
                                    }`}
                                >
                                    <Upload
                                        size={24}
                                        className={`transition-colors ${
                                            isDragging ? "text-green-400" : "text-muted/40"
                                        }`}
                                    />
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-muted/60">
                                            {isDragging
                                                ? "Drop images here"
                                                : "Drag & drop images or click to browse"}
                                        </p>
                                        <p className="text-xs text-muted/30 mt-1">PNG, JPG, WebP supported</p>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-3 flex items-center gap-2">
                                    <Type size={14} />
                                    Project Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                                    }}
                                    placeholder="e.g. My Awesome Project"
                                    className={`w-full px-4 py-3 rounded-xl bg-foreground/[0.03] border ${
                                        errors.title ? "border-red-400/50" : "border-border"
                                    } text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all text-sm`}
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-400 mt-1.5">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-3 flex items-center gap-2">
                                    <FileText size={14} />
                                    Description <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                        if (errors.description)
                                            setErrors((prev) => ({ ...prev, description: "" }));
                                    }}
                                    placeholder="Describe your project, its features, and what makes it special..."
                                    rows={4}
                                    className={`w-full px-4 py-3 rounded-xl bg-foreground/[0.03] border ${
                                        errors.description ? "border-red-400/50" : "border-border"
                                    } text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all text-sm resize-none`}
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-400 mt-1.5">{errors.description}</p>
                                )}
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-3 flex items-center gap-2">
                                    <Tag size={14} />
                                    Tech Stack
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {tags.map((tag) => (
                                        <motion.span
                                            key={tag}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-border text-xs font-semibold text-muted flex items-center gap-1.5 group/tag"
                                        >
                                            {tag}
                                            <button
                                                onClick={() => removeTag(tag)}
                                                className="text-muted/40 hover:text-red-400 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </motion.span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Type a tag and press Enter..."
                                    className="w-full px-4 py-3 rounded-xl bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all text-sm"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-3 block">
                                    Status
                                </label>
                                <div className="flex gap-2">
                                    {["Latest", "Active", "Archived", "WIP"].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setStatus(s)}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
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

                            {/* Links */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-3 flex items-center gap-2">
                                        <Link size={14} />
                                        Live Link
                                    </label>
                                    <input
                                        type="url"
                                        value={liveLink}
                                        onChange={(e) => setLiveLink(e.target.value)}
                                        placeholder="https://your-project.com"
                                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-3 flex items-center gap-2">
                                        <Github size={14} />
                                        GitHub Repo
                                    </label>
                                    <input
                                        type="url"
                                        value={repoLink}
                                        onChange={(e) => setRepoLink(e.target.value)}
                                        placeholder="https://github.com/you/repo"
                                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-4 border-t border-border">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-3.5 rounded-2xl border border-border text-sm font-semibold text-muted hover:text-foreground hover:bg-foreground/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 py-3.5 rounded-2xl bg-foreground text-background text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-xl"
                                >
                                    <Plus size={16} />
                                    {initialData ? "Save Changes" : "Add Project"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
