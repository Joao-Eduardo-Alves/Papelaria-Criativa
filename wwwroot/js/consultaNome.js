console.log('buscar.js carregado');

// Função para buscar produto pelo nome
async function buscarProdutoPorNome() {
    // ✅ 1) ID do input de busca no seu HTML
    const nomeBusca = document.getElementById('buscar-nome').value.trim();
    // Se o ID no seu HTML for diferente, altere aqui

    // Verifica se o campo não está vazio
    if (!nomeBusca) {
        alert('Digite um nome para buscar.');
        return;
    }

    try {
        // ✅ 2) Endpoint do seu back-end
        // Certifique-se de que a URL corresponda ao que você implementou
        const response = await fetch(`/buscarNome?nome=${encodeURIComponent(nomeBusca)}`);

        // ✅ 3) ID do tbody da tabela onde os produtos serão exibidos
        const tbody = document.getElementById('tbody-produtos');
        // Se o ID for diferente no seu HTML, altere aqui
        tbody.innerHTML = ''; // Limpa tabela antes de preencher

        if (!response.ok) {
            // Produto não encontrado
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Produto não encontrado</td></tr>';
            return;
        }

        // ✅ 4) Nomes das propriedades do objeto retornado pelo back-end
        const produto = await response.json();
        console.log('Produto recebido:', produto);

        // Cria uma linha na tabela com o produto retornado
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.nome}</td>        <!-- Nome do produto -->
            <td>${produto.quantidade}</td>  <!-- Quantidade em estoque -->
            <td>R$ ${Number(produto.precoCusto).toFixed(2)}</td>  <!-- Valor de custo -->
            <td>R$ ${Number(produto.precoVenda).toFixed(2)}</td>  <!-- Preço de venda -->
        `;
        tbody.appendChild(tr);

    } catch (error) {
        console.error(error);
        alert('Erro ao buscar o produto.');
    }
}

// ✅ 5) ID do botão de busca no HTML
const btnBuscar = document.getElementById('btn-buscar');
btnBuscar.addEventListener('click', buscarProdutoPorNome);
