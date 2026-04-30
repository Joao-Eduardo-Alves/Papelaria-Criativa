using Microsoft.EntityFrameworkCore;
using SistemaWeb.Data;
using SistemaWeb.Models;

public class VendaRepository
{
    private readonly ApplicationDbContext _db;

    public VendaRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<List<Venda>> Listar()
    {
        return await _db.Vendas
            .Include(v => v.ItensVenda)
            .AsNoTracking()
            .ToListAsync();
    }
    public async Task<Venda> Registrar(Venda venda)
    {
        _db.Vendas.Add(venda);
        await _db.SaveChangesAsync();
        return venda;
    }


}