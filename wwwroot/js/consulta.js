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
