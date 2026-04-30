namespace SistemaWeb.Endpoints;

public static class VendaEndpoints
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/vendas", async (VendaService service)
            => Results.Ok(await service.Listar()));


        app.MapPost("/vendas", async (VendaService service, List<ItemVenda> itensVenda) =>
        {
            try
            {
                var result = await service.Registrar(itensVenda);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { mensagem = ex.Message });
            }
        });

        app.MapGet("/pdf/vendas", async (VendaService service) =>
            {
                var bytes = await service.GerarRelatorioVendas();

                return Results.File(
                    bytes,
                    contentType: "application/pdf",
                    fileDownloadName: $"relatorio_vendas_{DateTime.Now:yyyyMMddHHmm}.pdf"
                );
            });
    }
}