import { useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadFile, deleteFileByUrl } from "@/lib/storage-api";

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  /** Max file size in MB (default 5) */
  maxSizeMB?: number;
  /** Delete the previously stored file from Appwrite when replaced/cleared. Default true. */
  cleanupOnReplace?: boolean;
  className?: string;
  aspect?: "video" | "square" | "portrait";
}

export function ImageUploader({
  value,
  onChange,
  label = "Cover image",
  maxSizeMB = 5,
  cleanupOnReplace = true,
  className = "",
  aspect = "video",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const aspectClass =
    aspect === "square" ? "aspect-square" : aspect === "portrait" ? "aspect-[3/4]" : "aspect-video";

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Image must be under ${maxSizeMB} MB.`);
      return;
    }
    setUploading(true);
    try {
      const prev = value;
      const { url } = await uploadFile(file);
      onChange(url);
      if (cleanupOnReplace && prev) await deleteFileByUrl(prev);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const clear = async () => {
    const prev = value;
    onChange("");
    if (cleanupOnReplace && prev) await deleteFileByUrl(prev);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="text-[11px] uppercase tracking-widest text-maroon/60">{label}</span>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative ${aspectClass} w-full rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden bg-ivory/40 ${
          dragOver ? "border-gold bg-gold/5" : "border-maroon/20 hover:border-gold/60"
        }`}
      >
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-maroon/0 hover:bg-maroon/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <span className="text-ivory text-xs uppercase tracking-widest">Click to replace</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-maroon flex items-center justify-center shadow-md"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-maroon/50 gap-2">
            {uploading ? (
              <Loader2 className="animate-spin" size={26} />
            ) : (
              <>
                <ImageIcon size={26} />
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
                  <Upload size={12} /> Drop or click to upload
                </div>
                <span className="text-[10px] text-maroon/40">
                  PNG, JPG, WEBP · up to {maxSizeMB} MB
                </span>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
