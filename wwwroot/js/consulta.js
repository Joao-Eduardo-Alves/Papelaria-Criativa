console.log("consulta.js carregado");

async function carregarProdutos() {
  try {
    const response = await fetch("/listarProduto");

    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }

    const produtos = await response.json();
    console.log("Produtos recebidos:", produtos);

    const tbody = document.getElementById("tbody-produtos");
    tbody.innerHTML = "";

    produtos.forEach((produto) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${Number(produto.precoCusto).toFixed(2)}</td>
                <td>R$ ${Number(produto.precoVenda).toFixed(2)}</td>
                <td><button class="btn-editar" data-id="${produto.id}" data-nome="${produto.nome}" data-quantidade="${produto.quantidade}" data-preco-custo="${produto.precoCusto}" data-preco-venda="${produto.precoVenda}">✏️ Editar</button></td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar a lista de produtos.");
  }
}

window.addEventListener("load", carregarProdutos);

document.addEventListener("DOMContentLoaded", () => {
  const btnRefresh = document.getElementById("btn-refresh");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", carregarProdutos);
  }
});

let id = null;

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-editar")) {
    const btn = e.target;
    id = btn.dataset.id;
    document.getElementById("edit-nome").value = btn.dataset.nome;
    document.getElementById("edit-quantidade").value = btn.dataset.quantidade;
    document.getElementById("edit-preco-custo").value = btn.dataset.precoCusto;
    document.getElementById("edit-preco-venda").value = btn.dataset.precoVenda;

    document.getElementById("modal-editar").style.display = "block";
  }
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
    const response = await fetch(`/editarProduto/${id}`, {
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

    alert("Produto atualizado com sucesso!");
    document.getElementById("modal-editar").style.display = "none";
    carregarProdutos();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
