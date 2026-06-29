"use client";
import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { CATEGORIES } from "@/mocks/data";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { user } = useApp();
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <div className="text-5xl">🔒</div>
      <h2 className="text-xl font-bold">Sign in to upload stickers</h2>
      <button onClick={() => router.push('/auth/signin')} className="px-6 py-3 rounded-xl font-medium" style={{ background: "var(--primary)", color: "#fff" }}>Sign In</button>
    </div>
  );

  const handleFile = (f: File) => {
    if (!f.type.match(/image\/(png|webp|gif)/)) { setError("Only PNG, WEBP, GIF allowed"); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "").toLowerCase();
    if (t && !tags.includes(t) && tags.length < 8) { setTags([...tags, t]); setTagInput(""); }
  };

  const handleSubmit = async () => {
    if (!file || !title || !category) { setError("Please fill all required fields and upload a file."); return; }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const { url, error: uploadErr } = await uploadRes.json();
      if (uploadErr) throw new Error(uploadErr);

      const stickerRes = await fetch("/api/stickers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc, image_url: url, tags, category, download_count: 0 }),
      });
      const { id, error: stickerErr } = await stickerRes.json();
      if (stickerErr) throw new Error(stickerErr);
      router.push(`/sticker/${id}`);
    } catch (e: any) {
      setError(e.message || "Upload failed. Try again.");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Upload a Sticker</h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Share your art with the StickerVerse community.</p>

      {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</div>}

      <div className="flex flex-col gap-6">
        <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => fileRef.current?.click()}
          className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-10 cursor-pointer transition"
          style={{ borderColor: dragging ? "var(--primary)" : "var(--border)", background: dragging ? "rgba(124,58,237,0.05)" : "var(--card)", minHeight: 220 }}>
          {preview ? (
            <div className="relative">
              <img src={preview} alt="preview" className="max-h-40 max-w-full object-contain rounded-xl" />
              <button onClick={e => { e.stopPropagation(); setPreview(null); setFile(null); }} className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--primary)" }}>
                <X size={12} color="#fff" />
              </button>
            </div>
          ) : (
            <>
              <ImageIcon size={36} style={{ color: "var(--muted)" }} className="mb-3" />
              <p className="font-medium">Drag & drop or click to upload</p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>PNG, WEBP, GIF supported</p>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/png,image/webp,image/gif" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Title <span style={{ color: "var(--primary-light)" }}>*</span></label>
          <input value={title} onChange={e => setTitle(e.target.value)} maxLength={60} placeholder="Give your sticker a name..." className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
          <p className="text-xs mt-1 text-right" style={{ color: "var(--muted)" }}>{title.length}/60</p>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} maxLength={200} rows={3} placeholder="Describe your sticker..." className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Category <span style={{ color: "var(--primary-light)" }}>*</span></label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} className="px-3 py-1.5 rounded-xl text-sm font-medium transition" style={{ background: category === c ? "var(--primary)" : "var(--card)", color: category === c ? "#fff" : "var(--muted)", border: `1px solid ${category === c ? "var(--primary)" : "var(--border)"}` }}>{c}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Tags</label>
          <div className="flex gap-2">
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add a tag and press Enter" className="flex-1 px-4 py-2.5 rounded-xl outline-none text-sm" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
            <button onClick={addTag} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: "var(--primary)", color: "#fff" }}>Add</button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(t => (
                <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--muted)" }}>
                  #{t} <button onClick={() => setTags(tags.filter(x => x !== t))}><X size={10} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleSubmit} disabled={uploading} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold transition hover:opacity-90 disabled:opacity-50" style={{ background: "var(--primary)", color: "#fff" }}>
          <Upload size={18} /> {uploading ? "Uploading..." : "Publish Sticker"}
        </button>
      </div>
    </div>
  );
}
