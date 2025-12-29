<button
  onClick={async () => {
    try {
      const res = await fetch("/api/admin/whitelist/export", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (!res.ok) {
        alert("Export failed");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "whitelist.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export blocked by browser extension");
      console.error(err);
    }
  }}
  className="px-4 py-2 bg-blue-600 rounded font-semibold"
>
  Export CSV
</button>
