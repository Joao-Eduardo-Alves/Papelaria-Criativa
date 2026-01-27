console.log("colsultaNome.js carregado");

async function buscarProdutoPorNome() {
  const nomeBusca = document.getElementById("buscar-nome").value.trim();

  if (!nomeBusca) {
    alert("Digite um nome para buscar.");
    return;
  }

  try {
    const response = await fetch(
      `/buscarNome?nome=${encodeURIComponent(nomeBusca)}`,
    );

    const tbody = document.getElementById("tbody-produtos");

    tbody.innerHTML = "";

    if (!response.ok) {
      tbody.innerHTML =
        '<tr><td colspan="4" style="text-align:center">Produto não encontrado</td></tr>';
      return;
    }

    const produtos = await response.json();

    produtos.forEach((produto) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>        <!-- Nome do produto -->
            <td>${produto.quantidade}</td>  <!-- Quantidade em estoque -->
            <td>R$ ${Number(produto.precoCusto).toFixed(2)}</td>  <!-- Valor de custo -->
            <td>R$ ${Number(produto.precoVenda).toFixed(2)}</td>  <!-- Preço de venda -->
        `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao buscar o produto.");
  }
}

const btnBuscar = document.getElementById("btn-buscar");
btnBuscar.addEventListener("click", buscarProdutoPorNome);
