"use client";

import { useRef, useState } from "react";

/** Downscale a picked image in the browser so uploads stay small. PDFs are sent untouched. */
async function downscale(file: File, maxDim = 1600): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    let { width, height } = img;
    if (width > maxDim || height > maxDim) {
      const s = maxDim / Math.max(width, height);
      width = Math.round(width * s);
      height = Math.round(height * s);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
    return await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.85));
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Upload an invoice/receipt/screenshot (image or PDF) to /api/media and hand back the hosted URL. */
export function FileUpload({
  value,
  onUploaded,
  label = "Upload invoice / screenshot",
}: {
  value?: string | null;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);

  async function handle(file: File) {
    setBusy(true);
    setErr(null);
    try {
      const pdf = file.type === "application/pdf";
      setIsPdf(pdf);
      let blob: Blob = file;
      let filename = pdf ? "upload.pdf" : "upload.jpg";
      if (!pdf) {
        try {
          blob = await downscale(file);
        } catch {
          /* fall back to original if canvas fails */
        }
      }
      const fd = new FormData();
      fd.append("file", blob, filename);
      const res = await fetch("/api/media/upload", { method: "POST", body: fd });
      if (!res.ok) {
        setErr((await res.text()) || "Upload failed.");
        return;
      }
      const { url } = await res.json();
      onUploaded(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {value ? (
        isPdf ? (
          <div className="w-12 h-12 rounded-lg bg-red-light border border-border shrink-0 flex items-center justify-center text-red text-[11px] font-bold">PDF</div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-12 h-12 rounded-lg object-cover border border-border shrink-0" />
        )
      ) : (
        <div className="w-12 h-12 rounded-lg bg-gray-bg border border-border shrink-0 flex items-center justify-center text-muted text-lg">📄</div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="text-[13px] font-bold text-brand-dark bg-white border border-border rounded-full px-3 py-1.5 cursor-pointer disabled:opacity-50"
      >
        {busy ? "Uploading…" : value ? "Replace file" : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          e.target.value = "";
        }}
      />
      {err && <span className="text-[12px] text-red">{err}</span>}
    </div>
  );
}
