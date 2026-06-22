"use client";

import { useCallback, useState } from "react";
import { Upload, File, X, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  size: number;
  preview?: string;
  type: string;
}

interface FileUploadProps {
  onFilesSelected?: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  className?: string;
  label?: string;
}

/** Drag-and-drop file upload with preview and animated progress. */
export function FileUpload({
  onFilesSelected,
  accept = "image/*,.pdf",
  multiple = false,
  maxSizeMB = 10,
  className,
  label = "Upload file",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const processFiles = useCallback(
    (rawFiles: FileList) => {
      const processed: UploadedFile[] = [];
      Array.from(rawFiles).forEach((file) => {
        if (file.size > maxSizeMB * 1024 * 1024) return;
        const uploaded: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
        };
        if (file.type.startsWith("image/")) {
          uploaded.preview = URL.createObjectURL(file);
        }
        processed.push(uploaded);
      });

      setFiles(processed);
      onFilesSelected?.(processed);

      // Simulate upload progress
      setUploading(true);
      setProgress(0);
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 20;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setTimeout(() => setUploading(false), 300);
        }
        setProgress(Math.min(p, 100));
      }, 150);
    },
    [maxSizeMB, onFilesSelected]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) processFiles(e.target.files);
    },
    [processFiles]
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div
        onDragEnter={() => setIsDragging(true)}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-accent bg-accent/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-surface-2"
        )}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={onInputChange}
        />
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200",
            isDragging ? "bg-accent/20" : "bg-surface-2"
          )}
        >
          <Upload
            size={24}
            className={cn(
              "transition-colors duration-200",
              isDragging ? "text-accent" : "text-text-muted"
            )}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-text font-body">
            {isDragging ? "Drop your file here" : label}
          </p>
          <p className="text-xs text-text-muted mt-1 font-body">
            Drag & drop or click to browse • Max {maxSizeMB}MB
          </p>
          <p className="text-xs text-text-muted font-body">JPG, PNG, PDF supported</p>
        </div>
      </div>

      {/* Upload progress */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-1.5"
          >
            <div className="flex justify-between text-xs text-text-muted font-body">
              <span>Uploading…</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File previews */}
      <AnimatePresence>
        {files.map((file, i) => (
          <motion.div
            key={file.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
          >
            {file.preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={file.preview}
                alt={file.name}
                className="w-12 h-12 rounded-lg object-cover border border-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center border border-border">
                {file.type.startsWith("image/") ? (
                  <ImageIcon size={20} className="text-text-muted" />
                ) : (
                  <File size={20} className="text-text-muted" />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate font-body">{file.name}</p>
              <p className="text-xs text-text-muted font-body">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); removeFile(i); }}
              className="text-text-muted hover:text-accent-warm transition-colors p-1"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
