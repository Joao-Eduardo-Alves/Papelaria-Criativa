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
}

// Simula o banco com uma lista de produtos em memória                                         //Minhas variáveis: listaprodutos e buscar
var listaprodutos = new List<Produtos>
{
    new Produtos { id = 1, nome = "Caneta", precoCusto = 2.5m },
    new Produtos { id = 2, nome = "Caderno", precoCusto = 15.9m },
    new Produtos { id = 3, nome = "Lápis", precoCusto = 1.2m }
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
    var buscar = listaprodutos.FirstOrDefault(p => p.nome.ToLower() == nome.ToLower());

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
    listaprodutos.Add(produto);

    return Results.Created($"buscar/{produto.nome}", produto);
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
    var produto = listaprodutos.FirstOrDefault(p => p.id == id);

    if (produto == null)
    {
        return Results.NotFound("Produto não encontrado.");
    }

    listaprodutos.Remove(produto);

    return Results.Ok("Produto deletado com sucesso.");
});

app.Run();
