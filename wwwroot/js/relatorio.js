async function carregarVendas() {
  try {
    const response = await fetch("/listarVendas");

    if (!response.ok) {
      throw new Error("Erro ao buscar vendas");
    }

    const vendas = await response.json();

    const tbody = document.getElementById("tbody-relatorio");
    tbody.innerHTML = "";

    vendas.forEach((venda) => {
      const tr = document.createElement("tr");

      const nomeProdutos = venda.itensVenda
        .map((item) => `${item.produto} (${item.quantidade}x)`)
        .join(", ");

      const dataLegivel = new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(venda.data));

      tr.innerHTML = `
                <td>${venda.id}</td>
                <td>${dataLegivel}</td>
                <td>${nomeProdutos}</td>
                <td>R$ ${Number(venda.valorTotalVenda).toFixed(2)}</td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar a lista de produtos.");
  }
}
carregarVendas();
