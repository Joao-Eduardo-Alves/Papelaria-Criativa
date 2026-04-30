using SistemaWeb.Models;

public class ProdutoService
{
    private readonly ProdutoRepository _repo;

    public ProdutoService(ProdutoRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<Produto>> Listar()
        => await _repo.Listar();

    public async Task<List<Produto>> BuscarPorNome(string nome)
        => await _repo.BuscarPorNome(nome);

    public async Task<Produto> Adicionar(Produto dados)
    {
        if (string.IsNullOrWhiteSpace(dados.Nome))
            throw new Exception("Nome obrigatório.");

        if (dados.Quantidade < 0)
            throw new Exception("Quantidade inválida.");

        if (dados.PrecoVenda <= dados.PrecoCusto)
            throw new Exception("Preço inválido.");

        var produto = new Produto
        {
            Nome = dados.Nome,
            Quantidade = dados.Quantidade,
            PrecoCusto = dados.PrecoCusto,
            PrecoVenda = dados.PrecoVenda
        };

        return await _repo.Adicionar(produto);
    }

    public async Task<Produto> Editar(int id, Produto dados)
    {
        var produto = await _repo.BuscarPorId(id);

        if (produto == null)
            throw new Exception("Produto não encontrado.");

        if (string.IsNullOrWhiteSpace(dados.Nome))
            throw new Exception("Nome obrigatório.");

        if (dados.Quantidade < 0)
            throw new Exception("Quantidade inválida.");

        if (dados.PrecoVenda <= dados.PrecoCusto)
            throw new Exception("Preço inválido.");

        produto.Nome = dados.Nome;
        produto.Quantidade = dados.Quantidade;
        produto.PrecoCusto = dados.PrecoCusto;
        produto.PrecoVenda = dados.PrecoVenda;

        return await _repo.Editar(produto);
    }
    public async Task Deletar(int id)
    {
        var produto = await _repo.BuscarPorId(id);

        if (produto == null)
            throw new Exception("Produto não encontrado.");

        await _repo.Deletar(id);
    }
}