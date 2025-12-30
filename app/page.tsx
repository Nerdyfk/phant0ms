const submit = async () => {
  const res = await fetch("/api/whitelist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      wallet,
      twitter,
    }),
  });

  const data = await res.json();
  console.log("API response:", data);
};
