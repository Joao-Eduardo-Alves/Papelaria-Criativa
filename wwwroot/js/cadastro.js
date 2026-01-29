const formCadastro = document.getElementById("form-cadastro");

formCadastro.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const precoCusto = parseFloat(document.getElementById("precoCusto").value);
  const precoVenda = parseFloat(document.getElementById("preco-venda").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);

  if (!nome || isNaN(quantidade) || isNaN(precoCusto) || isNaN(precoVenda)) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

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
      alert("Produto cadastrado com sucesso!");
      formCadastro.reset();
    } else if (response.status === 400) {
      const mensagem = await response.text();
      alert("Erro de validação: " + mensagem);
    } else {
      alert("Erro no servidor. Tente novamente mais tarde.");
      console.error(
        "Erro do servidor:",
        response.status,
        await response.text(),
      );
    }
  } catch (error) {
    alert("Erro na comunicação com o servidor.");
    console.error(error);
  }
});
