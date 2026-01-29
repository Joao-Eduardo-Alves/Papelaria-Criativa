using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

public class RelatorioVendasPdf : IDocument
{
    private readonly List<Venda> _vendas;

    public RelatorioVendasPdf(List<Venda> vendas)
    {
        _vendas = vendas;
    }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);
            page.Margin(2, Unit.Centimetre);

            page.Header()
                .Text("Relatório de Vendas")
                .FontSize(20)
                .Bold()
                .AlignCenter();

            page.Content().Column(col =>
            {
                col.Spacing(10);

                foreach (var venda in _vendas)
                {
                    col.Item().Text($"Venda #{venda.Id} - {venda.Data:dd/MM/yyyy HH:mm}")
                        .Bold();

                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn();
                            c.ConstantColumn(60);
                            c.ConstantColumn(80);
                        });

                        table.Header(h =>
                        {
                            h.Cell().Text("Produto").Bold();
                            h.Cell().Text("Qtd").Bold();
                            h.Cell().Text("Total").Bold();

                        });

                        foreach (var item in venda.ItensVenda)
                        {
                            table.Cell().Text(item.NomeExibicao);
                            table.Cell().Text(item.Quantidade.ToString());
                            table.Cell().Text($"R$ {item.ValorTotal:F2}");
                        }
                    });

                    col.Item().AlignRight()
                        .Text($"Total da venda: R$ {venda.ValorTotalVenda:F2}")
                        .Bold();

                    col.Item().AlignRight()
                        .Text($"Lucro da venda: R$ {venda.LucroTotalVenda:F2}")
                        .Bold();
                }
            });
        });
    }
}
