"use client";

export default function ImportFiles() {
  const upload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/whitelist/import", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(`Imported ${data.imported || 0} addresses`);
    window.location.reload();
  };

  return (
    <label className="bg-green-600 px-4 py-2 rounded cursor-pointer">
      Import CSV / Excel / PDF
      <input
        type="file"
        accept=".csv,.xlsx,.xls,.pdf"
        hidden
        onChange={(e) => {
          if (e.target.files?.[0]) {
            upload(e.target.files[0]);
          }
        }}
      />
    </label>
  );
}
