using SistemaWeb.Models;
using SistemaWeb.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/listarProduto", async (ApplicationDbContext db) =>
{
    var produtos = await db.Produtos.ToListAsync();
    return Results.Ok(produtos);
})
.WithName("GetProdutos")
.WithOpenApi();

app.MapGet("/buscarNome", async ([FromQuery] string nome, ApplicationDbContext db) =>
{
     var produtos = await db.Produtos
        .AsNoTracking()
        .Where(p => p.Nome.Contains(nome))
        .ToListAsync();

    if (!produtos.Any())
    {
        return Results.NotFound(new { mensagem = "Nenhum produto encontrado." });
    }

    return Results.Ok(produtos);
})
.WithOpenApi();

app.MapPost("/adicionar", async ([FromBody] Produtos produto, ApplicationDbContext db) =>
{
    if (produto.PrecoVenda < produto.PrecoCusto)
    {
        return Results.BadRequest(new { mensagem = "Preço de venda não pode ser menor que o preço de custo." });
    }

    db.Produtos.Add(produto);
    await db.SaveChangesAsync();

    return Results.Created($"/buscarNome?nome={produto.Nome}", produto);
})
.WithOpenApi();

app.MapDelete("/deletar", async (ApplicationDbContext db) =>
{
    await db.Produtos.ExecuteDeleteAsync();
    await db.SaveChangesAsync();

    return Results.Ok(new { mensagem = "Todos os produtos foram deletados." });
})
.WithOpenApi();

app.MapDelete("/deletarProduto/{id}", async ([FromRoute] int id, ApplicationDbContext db) =>
{
    var produto = await db.Produtos.FindAsync(id);

    if (produto == null)
    {
        return Results.NotFound(new { mensagem = "Produto não encontrado." });
    }

    db.Produtos.Remove(produto);
    await db.SaveChangesAsync();

    return Results.Ok(new { mensagem = "Produto deletado com sucesso." });
})
.WithOpenApi();

app.MapPost("/registrarVenda", async ([FromBody] List<ItemVenda> itensVenda, ApplicationDbContext db) =>
{
    try
    {
        if (itensVenda == null || itensVenda.Count == 0)
        {
            return Results.BadRequest(new { mensagem = "Nenhuma venda foi fornecida." });
        }

        foreach (var item in itensVenda)
        {
            var produto = await db.Produtos.FindAsync(item.ProdutoId);

            if (produto == null)
            {
                return Results.NotFound(new { mensagem = $"Produto com ID '{item.ProdutoId}' não encontrado." });
            }

            if (produto.Quantidade < item.Quantidade)
            {
                return Results.BadRequest(new
                {
                    mensagem = $"Estoque insuficiente para '{produto.Nome}'. Disponível: {produto.Quantidade}, Solicitado: {item.Quantidade}"
                });
            }
        
            produto.Quantidade -= item.Quantidade;
            item.ValorTotal = item.Quantidade * produto.PrecoVenda;
        }

        var novaVenda = new Venda
        {
            Data = DateTime.Now,
            ItensVenda = itensVenda
        };
        
        novaVenda.ValorTotal = novaVenda.ValorTotalVenda;

        db.Vendas.Add(novaVenda);
        await db.SaveChangesAsync();

        return Results.Ok(new
        {
            mensagem = "Venda registrada com sucesso!",
        });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { mensagem = $"Erro ao registrar venda: {ex.Message}" });
    }
})
.WithOpenApi();

app.MapGet("/listarVendas", async (ApplicationDbContext db) =>
{
    var vendas = await db.Vendas
        .Include(v => v.ItensVenda)
        .ToListAsync();
    return Results.Ok(vendas);
})
.WithName("GetVendas")
.WithOpenApi();

app.Run();
