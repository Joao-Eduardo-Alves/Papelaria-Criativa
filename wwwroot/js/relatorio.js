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

      const nomesProdutos = venda.itensVenda
        .map((item) => `${item.nomeExibicao} (${item.quantidade}x)`)
        .join(", ");

      const valorTotalVenda = venda.valorTotalVenda;
      const lucroVenda = venda.lucroTotalVenda;

      const dataLegivel = new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(venda.data));

      tr.innerHTML = `
                <td>${venda.id}</td>
                <td>${dataLegivel}</td>
                <td>${nomesProdutos}</td>
                <td>R$ ${Number(valorTotalVenda).toFixed(2)}</td>
                <td>R$ ${Number(lucroVenda).toFixed(2)}</td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar o relatório de vendas.");
  }
}

function exportarRelatorio() {
  window.open("/relatorio/vendas", "_blank");
}

window.addEventListener("load", async () => {
  await carregarVendas();
});
