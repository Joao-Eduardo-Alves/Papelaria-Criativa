// =======================
// Referência ao formulário
// =======================
const formCadastro = document.getElementById('form-cadastro');


// =======================
// Evento de submit do formulário de cadastro
// =======================
formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault(); // impede o envio normal para não recarregar a página

    // Pega os valores dos inputs
    const nome = document.getElementById('nome').value.trim();
    const precoCusto = parseFloat(document.getElementById('precoCusto').value);
    const precoVenda = parseFloat(document.getElementById('preco-venda').value);
    const quantidade = parseInt(document.getElementById('quantidade').value);

    // Validação simples
    if (!nome || isNaN(quantidade) || isNaN(precoCusto) || isNaN(precoVenda)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    // Monta o objeto que a API espera
    const produto = {
        nome: nome,
        precoCusto: precoCusto,
        precoVenda: precoVenda,
        quantidade: quantidade
    };

    try {
        console.log(JSON.stringify(produto));

        const response = await fetch('/adicionar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });

        if (response.ok) {
            alert('Produto cadastrado com sucesso!');
            formCadastro.reset(); // limpa o formulário

        } else {
            alert('Erro ao cadastrar o produto.');
        }
    } catch (error) {
        alert('Erro na comunicação com o servidor.');
        console.error(error);
    }
});
