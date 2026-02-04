const botaoDelete = document.getElementById("btn-deletar");

botaoDelete.addEventListener("click", async () => {
  const id = document.getElementById("id-produto").value;

  if (!id) {
    toast("Digite um ID válido!", "aviso");
    return;
  }

  const resposta = confirm("Tem certeza que deseja excluir este produto?");

  if (!resposta) return;

  try {
    const response = await fetch(`/deletarProduto/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    const mensagem = data.mensagem;

    if (response.ok) {
      toast(mensagem, "sucesso");
      id.value = "";
      carregarProdutos();
    } else {
      toast(mensagem, "erro");
    }
  } catch (error) {
    console.error(error);
    toast("Ocorreu um erro ao tentar deletar o produto.", "erro");
  }
});
