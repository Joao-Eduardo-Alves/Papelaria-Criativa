// Seleciona o botão pelo ID
const botaoDelete = document.getElementById('btn-delete');

botaoDelete.addEventListener('click', async () => {

    const resposta = confirm("Tem certeza que deseja excluir este produto?");
    if (!resposta) return; // Sai da função se clicar em "Cancelar"

    // Pega o valor digitado no input
    const id = document.getElementById('id-produto').value;

    // Valida se o ID foi digitado
    if (!id) {
        alert("Digite um ID válido!");
        return;
    }

    try {

        // Faz a requisição DELETE
        const response = await fetch(`/deletarProduto/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert(`Produto com ID ${id} deletado com sucesso!`);
            id.value = ""; // limpa o campo
            carregarProdutos()
        } else {
            alert(`Erro ao deletar produto.`);
        }
    } catch (error) {
        console.error(error);
        alert("Ocorreu um erro ao tentar deletar o produto.");
    }
});

