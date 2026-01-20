using SistemaWeb.Models;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseDefaultFiles();
app.UseStaticFiles();

var listaprodutos = new List<Produtos>
{
    new() { Id = 1, Nome = "Caneta", Quantidade = 100, PrecoCusto = 2.5m, PrecoVenda = 5.0m },
    new() { Id = 2, Nome = "Caderno", Quantidade = 50, PrecoCusto = 15.9m, PrecoVenda = 25.0m },
    new() { Id = 3, Nome = "Borracha", Quantidade = 30, PrecoCusto = 1.5m, PrecoVenda = 2.0m },
    new() { Id = 4, Nome = "Lapiseira", Quantidade = 200, PrecoCusto = 1.2m, PrecoVenda = 3.0m }
};

var vendasConcluidas = new List<Venda>();

app.MapGet("/listarProduto", () =>
{
    return Results.Ok(listaprodutos);
})
.WithName("GetProdutos")
.WithOpenApi();

int LevenshteinDistance(string a, string b)
{
    var matrix = new int[a.Length + 1, b.Length + 1];

    for (int i = 0; i <= a.Length; i++) matrix[i, 0] = i;
    for (int j = 0; j <= b.Length; j++) matrix[0, j] = j;

    for (int i = 1; i <= a.Length; i++)
    {
        for (int j = 1; j <= b.Length; j++)
        {
            int cost = a[i - 1] == b[j - 1] ? 0 : 1;
            matrix[i, j] = Math.Min(
                Math.Min(matrix[i - 1, j] + 1, matrix[i, j - 1] + 1),
                matrix[i - 1, j - 1] + cost
            );
        }
    }

    return matrix[a.Length, b.Length];
}

app.MapGet("/buscarNome", ([FromQuery] string nome) =>
{
    var buscar = listaprodutos.FirstOrDefault(p => LevenshteinDistance(p.Nome.ToLower(), nome.ToLower()) <=2);

    if (buscar == default)
    {
        return Results.NotFound();
    }

    return Results.Ok(buscar);
});

app.MapPost("/adicionar", ([FromBody] Produtos produto) =>
{
    if (produto.PrecoVenda < produto.PrecoCusto)
    {
        return Results.BadRequest("Pre�o de venda n�o pode ser menor que o pre�o de custo.");
    }
    produto.Id = listaprodutos.Any() ? listaprodutos.Max(p => p.Id) + 1 : 1;
    listaprodutos.Add(produto);

    return Results.Created($"buscar/{produto.Nome}", produto);
});

app.MapDelete("/deletar", () =>
{
    listaprodutos = new List<Produtos>();

    return Results.Ok();
});

app.MapDelete("/deletarProduto/{id}", ([FromRoute] int id) =>
{
    var produto = listaprodutos.FirstOrDefault(p => p.Id == id);

    if (produto == null)
    {
        return Results.NotFound("Produto n�o encontrado.");
    }

    listaprodutos.Remove(produto);

    return Results.Ok("Produto deletado com sucesso.");
});

app.MapPost("/registrarVenda", ([FromBody] List<ItemVenda> itemVenda) =>
{
    try
    {
        if (itemVenda == null || itemVenda.Count == 0)
        {
            return Results.BadRequest(new { mensagem = "Nenhuma venda foi fornecida." });
        }

        decimal totalVenda = 0;

        foreach (var item in itemVenda)
        {
            var produto = listaprodutos.FirstOrDefault(p => p.Nome.ToLower() == item.Produto.ToLower());

            if (produto == null)
            {
                return Results.NotFound(new { mensagem = $"Produto '{item.Produto}' não encontrado." });
            }

            if (produto.Quantidade < item.Quantidade)
            {
                return Results.BadRequest(new 
                { 
                    mensagem = $"Estoque insuficiente para '{item.Produto}'. Disponível: {produto.Quantidade}, Solicitado: {item.Quantidade}" 
                });
            }
        }
            
        foreach (var item in itemVenda)
        {
            var produto = listaprodutos.First(p => p.Nome.ToLower() == item.Produto.ToLower());
            produto.Quantidade -= item.Quantidade;
            totalVenda += item.ValorTotal;
        }

        var novaVenda = new Venda
        {
            Id = vendasConcluidas.Count + 1,
            Data = DateTime.Now,
            ItensVenda = itemVenda,
        }; 

        vendasConcluidas.Add(novaVenda);
        
        return Results.Ok(new 
        { 
            mensagem = "Venda(s) registrada(s) com sucesso!",
        });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { mensagem = $"Erro ao registrar vendas: {ex.Message}" });
    }
});


//===================================

app.MapGet("/listarVendas", () =>
{
    return Results.Ok(vendasConcluidas);
})
.WithName("GetVendas")
.WithOpenApi();


//===================================
app.Run();
