"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface Props {
  onFiles: (files: FileList) => void;
}

export function FileDropzone({ onFiles }: Props) {
  const t = useTranslations("scanner");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) onFiles(e.dataTransfer.files);
    },
    [onFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) onFiles(e.target.files);
    },
    [onFiles],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Drop files to scan"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "w-full max-w-xl border-2 border-dashed rounded-xl p-16 flex flex-col items-center gap-3 text-center cursor-pointer transition-colors select-none",
        isDragging
          ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20"
          : "border-border hover:border-violet-400 hover:bg-muted/30",
      )}
    >
      <span className="text-4xl pointer-events-none">
        {isDragging ? "📥" : "📂"}
      </span>

      <div className="pointer-events-none">
        <p className="text-sm font-medium">
          {t("dropzone.title")}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{t("dropzone.click")}</p>
      </div>

      <p className="text-xs text-muted-foreground pointer-events-none">
        {t("dropzone.accepts")}
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        onChange={handleChange}
        tabIndex={-1}
      />
    </div>
  );
}
