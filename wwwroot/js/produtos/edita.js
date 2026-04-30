let id = null;

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-editar");
  if (!btn) return;

  id = btn.dataset.id;
  document.getElementById("edit-nome").value = btn.dataset.nome;
  document.getElementById("edit-quantidade").value = btn.dataset.quantidade;
  document.getElementById("edit-preco-custo").value = btn.dataset.precoCusto;
  document.getElementById("edit-preco-venda").value = btn.dataset.precoVenda;

  document.getElementById("modal-editar").style.display = "block";
});

document.getElementById("btn-cancelar").addEventListener("click", () => {
  document.getElementById("modal-editar").style.display = "none";
});

document.getElementById("btn-salvar").addEventListener("click", async () => {
  const nome = document.getElementById("edit-nome").value;
  const quantidade = document.getElementById("edit-quantidade").value;
  const precoCusto = document.getElementById("edit-preco-custo").value;
  const precoVenda = document.getElementById("edit-preco-venda").value;

  try {
    const response = await fetch(`/produtos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: String(nome),
        quantidade: Number(quantidade),
        precoCusto: Number(precoCusto),
        precoVenda: Number(precoVenda),
      }),
    });

    if (!response.ok) {
      const resultado = await response.json();
      throw new Error(resultado.mensagem);
    }

    toast("Produto atualizado com sucesso!", "sucesso");

    document.getElementById("modal-editar").style.display = "none";
    carregarProdutos();
  } catch (error) {
    console.error(error);
    toast(error.message, "erro");
  }
});
