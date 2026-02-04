const formCadastro = document.getElementById("form-cadastro");

formCadastro.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const precoCusto = parseFloat(document.getElementById("precoCusto").value);
  const precoVenda = parseFloat(document.getElementById("preco-venda").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);

  const produto = {
    nome: nome,
    precoCusto: precoCusto,
    precoVenda: precoVenda,
    quantidade: quantidade,
  };

  try {
    console.log(JSON.stringify(produto));

    const response = await fetch("/adicionar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produto),
    });

    if (response.ok) {
      toast("Produto cadastrado com sucesso!", "sucesso");
      formCadastro.reset();
    } else if (response.status === 400) {
      const data = await response.json();
      const mensagem = data.mensagem;
      toast("Erro de validação: " + mensagem, "erro");
    } else {
      toast("Erro no servidor. Tente novamente mais tarde.", "erro");
      console.error(
        "Erro do servidor:",
        response.status,
        await response.text(),
      );
    }
  } catch (error) {
    toast("Erro na comunicação com o servidor.", "erro");
    console.error(error);
  }
});
