let produtosDisponiveis = [];

async function carregarProdutos() {
  try {
    const response = await fetch("/ListarProduto");
    if (response.ok) {
      produtosDisponiveis = await response.json();
      console.log("Produtos recebidos:", produtosDisponiveis);
    } else {
      alert("Erro ao carregar produtos do servidor.");
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
}

async function carregarVendas() {
  try {
    const response = await fetch("/listarVendas");

    if (!response.ok) {
      throw new Error("Erro ao buscar vendas");
    }

    const vendas = await response.json();

    console.log("Vendas recebidas:", vendas);

    const tbody = document.getElementById("tbody-relatorio");
    tbody.innerHTML = "";

    vendas.forEach((venda) => {
      const tr = document.createElement("tr");

      const nomeProdutos = venda.itensVenda
        .map((item) => {
          const produto = produtosDisponiveis.find(
            (p) => p.id === item.produtoId,
          );
          return produto
            ? `${produto.nome} (${item.quantidade}x)`
            : `Produto ${item.produtoId} (${item.quantidade}x)`;
        })
        .join(", ");

      const lucroVenda = venda.itensVenda.reduce((total, item) => {
        const produto = produtosDisponiveis.find(
          (p) => p.id === item.produtoId,
        );
        if (!produto) return total;

        const lucroItem =
          (produto.precoVenda - produto.precoCusto) * item.quantidade;
        return total + lucroItem;
      }, 0);

      const dataLegivel = new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(venda.data));

      tr.innerHTML = `
                <td>${venda.id}</td>
                <td>${dataLegivel}</td>
                <td>${nomeProdutos}</td>
                <td>R$ ${Number(venda.valorTotalVenda).toFixed(2)}</td>
                <td>R$ ${Number(lucroVenda).toFixed(2)}</td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar o relatório de vendas.");
  }
}

window.addEventListener("load", async () => {
  await carregarProdutos();
  await carregarVendas();
});
