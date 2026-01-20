const formVenda = document.getElementById("form-venda");
const listaVendas = document.getElementById("listaVendas");
const inputProduto = document.getElementById("produtos");
const botaoRegistrar = formVenda.querySelector('button[type="submit"]');
const botaoFinalizar = document.getElementById("finalizar-venda");

const inputQuantidade = document.getElementById("quantidade-produto");
const inputValorItem = document.getElementById("valor-item");

let produtosDisponiveis = [];
let vendas = [];

async function carregarProdutos() {
  try {
    const response = await fetch("/ListarProduto");
    if (response.ok) {
      produtosDisponiveis = await response.json();
    } else {
      alert("Erro ao carregar produtos do servidor.");
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
}

carregarProdutos();

inputProduto.addEventListener("input", () => {
  const produtoDigitado = inputProduto.value.trim().toLowerCase();
  const produtosValidados = produtosDisponiveis.map((p) =>
    p.nome.toLowerCase()
  );

  if (produtosValidados.includes(produtoDigitado)) {
    inputProduto.style.borderColor = "green";
    botaoRegistrar.disabled = false;
  } else {
    inputProduto.style.borderColor = "red";
    botaoRegistrar.disabled = true;
  }
});

function calcularTotal() {
  const quantidade = parseFloat(inputQuantidade.value) || 0;

  const nomeProduto = inputProduto.value.trim().toLowerCase();

  const produto = produtosDisponiveis.find(
    (p) => p.nome.toLowerCase() === nomeProduto
  );

  const preco = produto ? parseFloat(produto.precoVenda) : 0;

  const total = quantidade * preco;

  inputValorItem.value = total.toFixed(2);
}

inputQuantidade.addEventListener("input", calcularTotal);

formVenda.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nomeProduto = inputProduto.value.trim();
  const quantidade = parseInt(
    document.getElementById("quantidade-produto").value
  );
  const valorTotal = parseFloat(inputValorItem.value);

  const produto = produtosDisponiveis.find(
    (p) => p.nome.toLowerCase() === nomeProduto.toLowerCase()
  );

  if (!produto) {
    alert(`Produto "${nomeProduto}" não encontrado.`);
    return;
  }

  if (produto.quantidade < quantidade) {
    alert(
      `Estoque insuficiente para "${nomeProduto}".\nDisponível: ${produto.quantidade}\nSolicitado: ${quantidade}`
    );
    return;
  }

  const venda = {
    produto: nomeProduto,
    quantidade: quantidade,
    valorTotal: valorTotal.toFixed(2),
  };

  vendas.push(venda);

  atualizarListaVendas();

  formVenda.reset();
  inputProduto.style.borderColor = "";
  botaoRegistrar.disabled = true;
});

botaoFinalizar.addEventListener("click", async () => {
  if (vendas.lenght == 0) {
    alert("nenhuma venda registrada");
    return;
  }

  try {
    const response = await fetch("/registrarVenda", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vendas),
    });

    const resultado = await response.json();

    if (!response.ok) {
      alert(`Erro: ${resultado.mensagem}`);
      return;
    }

    alert(resultado.mensagem);

    vendas = [];

    atualizarListaVendas();
    carregarProdutos();

    formVenda.reset();
    inputProduto.style.borderColor = "";
    botaoRegistrar.disabled = true;
  } catch (error) {
    console.error("Erro ao registrar venda:", error);
    alert("Erro ao registrar venda no servidor.");
  }
});

function atualizarListaVendas() {
  listaVendas.innerHTML = "";
  vendas.forEach((venda, index) => {
    const item = document.createElement("li");
    item.textContent = `${index + 1}. Produto: ${venda.produto}, Quantidade: ${
      venda.quantidade
    }, Valor: R$ ${venda.valorTotal}`;
    listaVendas.appendChild(item);
  });

  localStorage.setItem("vendas", JSON.stringify(vendas));
}

window.addEventListener("DOMContentLoaded", () => {
  const vendasSalvas = localStorage.getItem("vendas");
  if (vendasSalvas) {
    vendas = JSON.parse(vendasSalvas);
    atualizarListaVendas();
  }
});
