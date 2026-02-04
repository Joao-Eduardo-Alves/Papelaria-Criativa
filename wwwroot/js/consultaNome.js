async function buscarProdutoPorNome() {
  const nomeBusca = document.getElementById("buscar-nome").value.trim();

  try {
    const response = await fetch(
      `/buscarNome?nome=${encodeURIComponent(nomeBusca)}`,
    );

    const tbody = document.getElementById("tbody-produtos");

    tbody.innerHTML = "";

    if (!response.ok) {
      tbody.innerHTML =
        '<tr><td colspan="100%" style="text-align:center">Produto não encontrado</td></tr>';
      return;
    }

    const produtos = await response.json();

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
            data-preco-venda="${produto.precoVenda}"
          >
            <i class="fas fa-pencil-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    toast("Erro ao buscar o produto.", "error");
  }
}

const formBusca = document.getElementById("form-consulta");

formBusca.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!formBusca.checkValidity()) {
    formBusca.reportValidity();
    return;
  }

  await buscarProdutoPorNome();
});
