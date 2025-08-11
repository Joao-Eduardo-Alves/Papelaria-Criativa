using SistemaWeb.Models;
using Microsoft.AspNetCore.Mvc;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

// Simula o banco com uma lista de produtos em memória                                         //Minhas variáveis: listaprodutos e buscar
var listaprodutos = new List<Produtos>
{
   new Produtos { Id = 1, Nome = "Caneta", Quantidade = 100, PrecoCusto = 2.5m, PrecoVenda = 5.0m },
   new Produtos { Id = 2, Nome = "Caderno", Quantidade = 50, PrecoCusto = 15.9m, PrecoVenda = 25.0m },
   new Produtos { Id = 2, Nome = "Borracha", Quantidade = 30, PrecoCusto = 1.5m, PrecoVenda = 2.0m },
   new Produtos { Id = 3, Nome = "Lápis", Quantidade = 200, PrecoCusto = 1.2m, PrecoVenda = 3.0m }
};
//1º END POINT listar TODOS os protudos--------------------------------------------------------------------

app.MapGet("/listarProduto", () =>
{
    return Results.Ok(listaprodutos); // retorna a lista
})
.WithName("GetProdutos")
.WithOpenApi();
//2º END POINT Buscar produto por nome --------------------------------------------------------------------

app.MapGet("/buscarNome", ([FromQuery] string nome) =>
{
    var buscar = listaprodutos.FirstOrDefault(p => p.Nome.ToLower() == nome.ToLower());

    if (buscar == default)
    {
        return Results.NotFound();
    }

    return Results.Ok(buscar);
});
//---------------------------------------------------------------------------------------------------------

//3º END POINT Adiciona novo produto ----------------------------------------------------------------------

app.MapPost("/adicionar", ([FromBody] Produtos produto) =>
{
    produto.Id = listaprodutos.Any() ? listaprodutos.Max(p => p.Id) + 1 : 1;
    listaprodutos.Add(produto);

    return Results.Created($"buscar/{produto.Nome}", produto);
});
//----------------------------------------------------------------------------------------------------------

//4º ENDPOINT Deleta produto -------------------------------------------------------------------------------
app.MapDelete("/deletar", () =>
{
    listaprodutos = new List<Produtos>();

    return Results.Ok();
});
//----------------------------------------------------------------------------------------------------------

// 5º ENDPOINT deletar produto por ID ----------------------------------------------------------------------
app.MapDelete("/deletarProduto/{id}", ([FromRoute] int id) =>
{
    var produto = listaprodutos.FirstOrDefault(p => p.Id == id);

    if (produto == null)
    {
        return Results.NotFound("Produto não encontrado.");
    }

    listaprodutos.Remove(produto);

    return Results.Ok("Produto deletado com sucesso.");
});

app.Run();
