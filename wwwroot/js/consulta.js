console.log('consulta.js carregado');

async function carregarProdutos() {
    try {
        // Faz a requisição para o endpoint listarProduto
        const response = await fetch('/listarProduto');

        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }

        const produtos = await response.json();
        console.log('Produtos recebidos:', produtos);

        // Pega o tbody da tabela para inserir as linhas
        const tbody = document.getElementById('tbody-produtos');
        tbody.innerHTML = ''; // Limpa as linhas anteriores

        // Para cada produto cria uma linha na tabela
        produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${Number(produto.precoCusto).toFixed(2)}</td>
                <td>R$ ${Number(produto.precoVenda).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        alert('Erro ao carregar a lista de produtos.');
    }
}

// Espera o carregamento da página para executar
window.addEventListener('load', carregarProdutos);
