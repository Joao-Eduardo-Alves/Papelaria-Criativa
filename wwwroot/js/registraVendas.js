    // =======================
    // Referências aos elementos HTML
    // =======================
    const formVenda = document.getElementById('form-venda');
    const listaVendas = document.getElementById('listaVendas');
    const inputProduto = document.getElementById('produto');
    const botaoRegistrar = formVenda.querySelector('button[type="submit"]');

// ==== INPUTS PARA CALCULAR VALOR TOTAL AUTOMATICAMENTE ====
    const inputNomeProduto = document.getElementById('produto');
    const inputQuantidade = document.getElementById('quantidade-venda');
    const inputTotal = document.getElementById('valor-venda');
    // ==========================================================

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
// =========== FUNÇÃO CALCULAR TOTAL =================
function calcularTotal() {
    console.log('nome digitado:', inputNomeProduto.value.trim().toLowerCase());
    console.log('array de produtos:', produtosDisponiveis.map(p => p.nome.toLowerCase()));

    const quantidade = parseFloat(inputQuantidade.value) || 0;
    console.log('quantidade:', inputQuantidade.value);

    const nomeProduto = inputNomeProduto.value.trim().toLowerCase();

    const produto = produtosDisponiveis.find(p => p.nome.toLowerCase() === nomeProduto);

    const preco = produto ? parseFloat(produto.precoVenda) : 0;

    const total = quantidade * preco;

    // Atualiza o input de valor

    console.log('inputTotal:', inputTotal, 'total:', total);
    inputTotal.value = total.toFixed(2);
}
    // ====================================================

    // ===== LISTENER PARA ATUALIZAR AUTOMATICAMENTE =====
    inputQuantidade.addEventListener('input', calcularTotal);
    // ===================================================


    // =======================
    // Registro de vendas
    // =======================
    formVenda.addEventListener('submit', function (event) {
        event.preventDefault(); // evita recarregar a página

        const nomeProduto = inputProduto.value.trim();
        const quantidade = parseInt(document.getElementById('quantidade-venda').value);
        const valorTotal = parseFloat(inputTotal.value);

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
            item.textContent = `${index + 1}. Produto: ${venda.produto}, Quantidade: ${venda.quantidade}, Valor: R$ ${venda.total}`;
            listaVendas.appendChild(item);
        });
    }