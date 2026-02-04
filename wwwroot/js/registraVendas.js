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
      atualizarDataList();
    } else {
      toast("Erro ao carregar produtos do servidor.", "erro");
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
}

function atualizarDataList() {
  const datalist = document.getElementById("listaProdutos");
  datalist.innerHTML = "";
  produtosDisponiveis.forEach((produto) => {
    const option = document.createElement("option");
    option.value = produto.nome;
    datalist.appendChild(option);
  });
}

carregarProdutos();

inputProduto.addEventListener("input", () => {
  const produtoDigitado = inputProduto.value.trim().toLowerCase();
  const produtosValidados = produtosDisponiveis.map((p) =>
    p.nome.toLowerCase(),
  );

  if (produtosValidados.includes(produtoDigitado)) {
    inputProduto.style.borderColor = "green";
    botaoRegistrar.disabled = false;

    calcularTotal();
  } else {
    inputProduto.style.borderColor = "red";
    botaoRegistrar.disabled = true;
  }
});

function calcularTotal() {
  const quantidade = parseFloat(inputQuantidade.value) || 0;

  const nomeProduto = inputProduto.value.trim().toLowerCase();

  const produto = produtosDisponiveis.find(
    (p) => p.nome.toLowerCase() === nomeProduto,
  );

  const preco = produto ? parseFloat(produto.precoVenda) : 0;

  const total = quantidade * preco;

  inputValorItem.value = total.toFixed(2);
}

inputQuantidade.addEventListener("input", calcularTotal);

formVenda.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nomeProduto = inputProduto.value.trim();

  const produto = produtosDisponiveis.find(
    (p) => p.nome.toLowerCase() === nomeProduto.toLowerCase(),
  );

  const quantidade = parseInt(
    document.getElementById("quantidade-produto").value,
  );
  const valorTotal = parseFloat(inputValorItem.value);

  if (!produto) {
    toast(`Produto "${nomeProduto}" não encontrado.`, "erro");
    return;
  }

  if (produto.quantidade < quantidade) {
    toast(
      `Estoque insuficiente para "${nomeProduto}".\nDisponível: ${produto.quantidade}\nSolicitado: ${quantidade}`,
      "aviso",
    );
    return;
  }

  const venda = {
    produtoId: produto.id,
    quantidade: quantidade,
    nomeParaExibicao: produto.nome,
    valorTotal: valorTotal,
  };

  vendas.push(venda);

  atualizarListaVendas();

  formVenda.reset();
  inputProduto.style.borderColor = "";
  botaoRegistrar.disabled = true;
});

botaoFinalizar.addEventListener("click", async () => {
  if (vendas.length == 0) {
    toast("nenhuma venda registrada", "aviso");
    return;
  }

  try {
    console.log("Vendas enviadas:", vendas);
    const response = await fetch("/registrarVenda", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vendas),
    });

    const resultado = await response.json();

    if (!response.ok) {
      toast(`Erro: ${resultado.mensagem}`, "erro");
      return;
    }

    toast(resultado.mensagem, "sucesso");

    vendas = [];

    atualizarListaVendas();
    carregarProdutos();

    formVenda.reset();
    inputProduto.style.borderColor = "";
    botaoRegistrar.disabled = true;
  } catch (error) {
    console.error("Erro ao registrar venda:", error);
    toast("Erro ao registrar venda no servidor.", "erro");
  }
});

function atualizarListaVendas() {
  listaVendas.innerHTML = "";
  vendas.forEach((venda, index) => {
    const item = document.createElement("li");
    item.classList.add("item-venda");

    const texto = document.createElement("span");
    texto.textContent = `${index + 1}. Produto: ${venda.nomeParaExibicao}, Quantidade: ${
      venda.quantidade
    }, Valor: R$ ${venda.valorTotal} `;

    const botao = document.createElement("button");
    botao.dataset.index = index;
    botao.classList.add("btn-remover");
    botao.textContent = "X";
    botao.setAttribute("aria-label", `Remover`);
    listaVendas.appendChild(botao);

    item.appendChild(texto);
    item.appendChild(botao);
    listaVendas.appendChild(item);
  });

  localStorage.setItem("vendas", JSON.stringify(vendas));
}

listaVendas.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-remover")) {
    const index = event.target.dataset.index;

    vendas.splice(index, 1);
    atualizarListaVendas();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const vendasSalvas = localStorage.getItem("vendas");
  if (vendasSalvas) {
    vendas = JSON.parse(vendasSalvas);
    atualizarListaVendas();
  }
});
