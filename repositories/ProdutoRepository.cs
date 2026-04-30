using Microsoft.EntityFrameworkCore;
using SistemaWeb.Data;
using SistemaWeb.Models;

public class ProdutoRepository
{
    private readonly ApplicationDbContext _db;

    public ProdutoRepository(ApplicationDbContext db)
    {
        _db = db;
    }
    public async Task<Produto> BuscarPorId(int id)
        => await _db.Produtos.FindAsync(id);
    public async Task<List<Produto>> Listar()
        => await _db.Produtos.AsNoTracking().ToListAsync();

    public async Task<List<Produto>> BuscarPorNome(string nome)
        => await _db.Produtos
            .Where(p => p.Nome.Contains(nome))
            .AsNoTracking()
            .ToListAsync();

    public async Task<Produto> Adicionar(Produto produto)
    {
        _db.Produtos.Add(produto);
        await _db.SaveChangesAsync();
        return produto;
    }

    public async Task<Produto> Editar(Produto produto)
    {
        _db.Produtos.Update(produto);
        await _db.SaveChangesAsync();
        return produto;
    }

    public async Task Deletar(int id)
    {
        var produto = await BuscarPorId(id);
        if (produto != null)
        {
            _db.Produtos.Remove(produto);
            await _db.SaveChangesAsync();
        }
    }
}