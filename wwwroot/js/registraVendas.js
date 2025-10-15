const formVenda = document.getElementById('form-venda');
const listaVendas = document.getElementById('listaVendas');
const inputProduto = document.getElementById('produto');
const botaoRegistrar = formVenda.querySelector('button[type="submit"]');

const inputNomeProduto = document.getElementById('produto');
const inputQuantidade = document.getElementById('quantidade-venda');
const inputTotal = document.getElementById('valor-venda');

let produtosDisponiveis = []; 
let vendas = [];              

async function carregarProdutos() {
    try {
        const response = await fetch('/ListarProduto');
        if (response.ok) {
            produtosDisponiveis = await response.json();
        } else {
            alert('Erro ao carregar produtos do servidor.');
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

carregarProdutos();

inputProduto.addEventListener('input', () => {
    const valor = inputProduto.value.trim().toLowerCase();
    const produtosValidados = produtosDisponiveis.map(p => p.nome.toLowerCase());

    if (produtosValidados.includes(valor)) {
        inputProduto.style.borderColor = "green";  
        botaoRegistrar.disabled = false;           
    } else {
        inputProduto.style.borderColor = "red";    
        botaoRegistrar.disabled = true;            
    }
});

function calcularTotal() {

    const quantidade = parseFloat(inputQuantidade.value) || 0;

    const nomeProduto = inputNomeProduto.value.trim().toLowerCase();

    const produto = produtosDisponiveis.find(p => p.nome.toLowerCase() === nomeProduto);

    const preco = produto ? parseFloat(produto.precoVenda) : 0;

    const total = quantidade * preco;

    inputTotal.value = total.toFixed(2);

}
inputQuantidade.addEventListener('input', calcularTotal);

formVenda.addEventListener('submit', function (event) {
    event.preventDefault();

    const nomeProduto = inputProduto.value.trim();
    const quantidade = parseInt(document.getElementById('quantidade-venda').value);
    const valorTotal = parseFloat(inputTotal.value);
    const produtosValidados = produtosDisponiveis.map(p => p.nome.toLowerCase());

    if (!produtosValidados.includes(nomeProduto.toLowerCase())) {
        alert("Produto não cadastrado. Digite um produto válido.");
        return;
    }

    const venda = {
        produto: nomeProduto,
        quantidade: quantidade,
        total: valorTotal.toFixed(2)
    };

    vendas.push(venda);

    atualizarListaVendas();

    formVenda.reset();
    inputProduto.style.borderColor = "";
    botaoRegistrar.disabled = true;
});

function atualizarListaVendas() {
    listaVendas.innerHTML = '';
    vendas.forEach((venda, index) => {
        const item = document.createElement('li');
        item.textContent = `${index + 1}. Produto: ${venda.produto}, Quantidade: ${venda.quantidade}, Valor: R$ ${venda.total}`;
        listaVendas.appendChild(item);
    });

    localStorage.setItem('vendas', JSON.stringify(vendas));
}

// Ao carregar a página, recupera as vendas do localStorage
window.addEventListener('DOMContentLoaded', () => {
    const vendasSalvas = localStorage.getItem('vendas');
    if (vendasSalvas) {
        vendas = JSON.parse(vendasSalvas);
        atualizarListaVendas();
    }
});
