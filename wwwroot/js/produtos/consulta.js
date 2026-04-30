async function carregarProdutos() {
  try {
    const response = await fetch("/produtos");

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
        <td>
          <button 
            type="button" 
            class="btn-editar"
            data-id="${produto.id}"
            data-nome="${produto.nome}"
            data-quantidade="${produto.quantidade}"
            data-preco-custo="${produto.precoCusto}"
            data-preco-venda="${produto.precoVenda}">
            <i class="fas fa-pencil-alt"></i>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    toast("Erro ao carregar a lista de produtos.", "error");
  }
}

window.addEventListener("load", carregarProdutos);

document.addEventListener("DOMContentLoaded", () => {
  const btnRefresh = document.getElementById("btn-refresh");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", carregarProdutos);
  }
});
