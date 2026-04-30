function toast(msg, tipo = "info") {
  const cores = {
    sucesso: "#16a34a",
    erro: "#dc2626",
    aviso: "#f59e0b",
    info: "#2563eb",
  };

  Toastify({
    text: msg,
    duration: 3000,
    gravity: "top",
    position: "center",
    close: true,
    style: {
      background: cores[tipo] || cores.info,
      borderRadius: "14px",
      padding: "10px 20px",
      fontWeight: "bold",
    },
  }).showToast();
}
