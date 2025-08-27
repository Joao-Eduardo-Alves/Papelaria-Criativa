// =======================
// Referências aos elementos HTML
// =======================
const formVenda = document.getElementById('form-venda');
const listaVendas = document.getElementById('listaVendas');
const inputProduto = document.getElementById('produto');
const botaoRegistrar = formVenda.querySelector('button[type="submit"]');



let produtosDisponiveis = []; // produtos do back-end
let vendas = [];              // array para armazenar vendas



// =======================
// Carrega produtos do back-end via Minimal API
// =======================
async function carregarProdutos() {
    try {
        const response = await fetch('/ListarProduto'); // rota GET que retorna lista de produtos
        if (response.ok) {
            produtosDisponiveis = await response.json();
        } else {
            alert('Erro ao carregar produtos do servidor.');
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}


// Chama ao carregar a página
carregarProdutos();

// =======================
// Validação em tempo real do produto
// =======================


inputProduto.addEventListener('input', () => {
    const valor = inputProduto.value.trim().toLowerCase();
    const produtosValidados = produtosDisponiveis.map(p => p.nome.toLowerCase());

    if (produtosValidados.includes(valor)) {
        inputProduto.style.borderColor = "green";  // válido
        botaoRegistrar.disabled = false;           // habilita botão
    } else {
        inputProduto.style.borderColor = "red";    // inválido
        botaoRegistrar.disabled = true;            // desabilita botão
    }
});

// =======================
// Registro de vendas
// =======================
formVenda.addEventListener('submit', function (event) {
    event.preventDefault(); // evita recarregar a página

    const nomeProduto = inputProduto.value.trim();
    const quantidade = parseInt(document.getElementById('quantidade-venda').value);
    const valorTotal = parseFloat(document.getElementById('valor-venda').value);

    // valida novamente no submit (segurança extra)
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

    // limpa formulário
    formVenda.reset();
    inputProduto.style.borderColor = "";
    botaoRegistrar.disabled = true;
});

// =======================
// Atualizar lista de vendas na tela
// =======================
function atualizarListaVendas() {
    listaVendas.innerHTML = ''; // limpa lista
    vendas.forEach((venda, index) => {
        const item = document.createElement('li');
        item.textContent = `${index + 1}. Produto: ${venda.produto}, Quantidade: ${venda.quantidade}, Valor Total: R$ ${venda.total}`;
        listaVendas.appendChild(item);
    });
}
