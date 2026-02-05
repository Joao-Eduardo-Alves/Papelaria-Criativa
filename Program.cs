using SistemaWeb.Models;
using SistemaWeb.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

QuestPDF.Settings.License = LicenseType.Community;

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
    var produtos = await db.Produtos
        .AsNoTracking()
        .ToListAsync();

    return Results.Ok(produtos);
})
.WithName("GetProdutos")
.WithOpenApi();

app.MapGet("/buscarNome", async ([FromQuery] string nome, ApplicationDbContext db) =>
{
    var produto = await db.Produtos
       .Where(p => p.Nome.Contains(nome))
       .AsNoTracking()
       .ToListAsync();

    if (!produto.Any())
    {
        return Results.NotFound(new { mensagem = "Nenhum produto encontrado." });
    }

    return Results.Ok(produto);
})
.WithOpenApi();

app.MapPost("/adicionar", async ([FromBody] Produto produto, ApplicationDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(produto.Nome))
    {
        return Results.BadRequest(new { mensagem = "Nome do produto é obrigatório." });
    }
    if (produto.PrecoVenda <= produto.PrecoCusto)
    {
        return Results.BadRequest(new { mensagem = "Preço de venda não pode ser menor ou igual ao preço de custo." });
    }
    if (produto.Quantidade < 0)
    {
        return Results.BadRequest(new { mensagem = "Quantidade não pode ser menor que 0." });
    }

    db.Produtos.Add(produto);
    await db.SaveChangesAsync();

    return Results.Created($"/produtos/{produto.Id}", produto);
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
            item.NomeExibicao = produto.Nome;
            item.PrecoCustoAtual = produto.PrecoCusto;
            item.PrecoVendaAtual = produto.PrecoVenda;

            item.CalcularTotalItem();
        }

        var novaVenda = new Venda
        {
            Data = DateTime.Now,
            ItensVenda = itensVenda
        };
        novaVenda.CalcularTotalVenda();

        db.Vendas.Add(novaVenda);
        await db.SaveChangesAsync();

        return Results.Ok(new
        {
            mensagem = "Venda registrada com sucesso!",
        });
    }
    catch
    {
        return Results.BadRequest(new { mensagem = "Erro ao registrar venda." });
    }
})
.WithOpenApi();

app.MapGet("/listarVendas", async (ApplicationDbContext db) =>
{
    var vendas = await db.Vendas
        .Include(v => v.ItensVenda)
        .AsNoTracking()
        .ToListAsync();
    return Results.Ok(vendas);
})
.WithName("GetVendas")
.WithOpenApi();

app.MapGet("/pdf/vendas", async (ApplicationDbContext db) =>
{
    var vendas = await db.Vendas
        .Include(v => v.ItensVenda)
        .AsNoTracking()
        .ToListAsync();

    if (!vendas.Any())
        return Results.NotFound("Nenhuma venda registrada.");

    var pdf = new RelatorioVendasPdf(vendas);
    var bytes = pdf.GeneratePdf();

    return Results.File(
        bytes,
        contentType: "application/pdf",
        fileDownloadName: $"relatorio_vendas_{DateTime.Now:yyyyMMddHHmm}.pdf"
    );
});

app.MapPut("/editarProduto/{id}", async ([FromRoute] int id, [FromBody] Produto produtoAtualizado, ApplicationDbContext db) =>
{
    var produto = await db.Produtos.FindAsync(id);

    if (produto == null)
    {
        return Results.NotFound(new { mensagem = "Produto não encontrado." });
    }
    if (string.IsNullOrWhiteSpace(produtoAtualizado.Nome))
    {
        return Results.BadRequest(new { mensagem = "Nome do produto é obrigatório." });
    }
    if (produtoAtualizado.PrecoVenda <= produtoAtualizado.PrecoCusto)
    {
        return Results.BadRequest(new { mensagem = "Preço de venda não pode ser menor ou igual ao preço de custo." });
    }
    if (produtoAtualizado.Quantidade < 0)
    {
        return Results.BadRequest(new { mensagem = "Quantidade não pode ser menor que 0." });
    }
    produto.Nome = produtoAtualizado.Nome;
    produto.Quantidade = produtoAtualizado.Quantidade;
    produto.PrecoCusto = produtoAtualizado.PrecoCusto;
    produto.PrecoVenda = produtoAtualizado.PrecoVenda;

    await db.SaveChangesAsync();

    return Results.Ok(new { mensagem = "Produto atualizado com sucesso." });
})
.WithName("EditarProduto")
.WithOpenApi();

app.Run();
