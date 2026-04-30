using SistemaWeb.Models;


namespace SistemaWeb.Endpoints;

public static class ProdutoEndpoints
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/produtos", async (ProdutoService service)
            => Results.Ok(await service.Listar()));

        app.MapGet("/produtos/nome", async (string nome, ProdutoService service)
            => Results.Ok(await service.BuscarPorNome(nome)));

        app.MapPost("/produtos", async (ProdutoService service, Produto dados) =>
        {
            try
            {
                var result = await service.Adicionar(dados);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { mensagem = ex.Message });
            }
        });

        app.MapPut("/produtos/{id}", async (int id, ProdutoService service, Produto dados) =>
        {
            try
            {
                var result = await service.Editar(id, dados);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { mensagem = ex.Message });
            }
        });

        app.MapDelete("/produtos/{id}", async (int id, ProdutoService service) =>
        {
            try
            {
                await service.Deletar(id);
                return Results.Ok(new { mensagem = "Produto deletado com sucesso" });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { mensagem = ex.Message });
            }
        });

    }
}