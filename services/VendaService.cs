using SistemaWeb.Models;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

public class VendaService
{
    private readonly VendaRepository _VendaRepo;
    private readonly ProdutoRepository _ProdRepo;

    public VendaService(VendaRepository vendaRepo, ProdutoRepository prodRepo)
    {
        _VendaRepo = vendaRepo;
        _ProdRepo = prodRepo;
    }


    public async Task<List<Venda>> Listar()
        => await _VendaRepo.Listar();

    public async Task<Venda> Registrar(List<ItemVenda> itensVenda)
    {

        if (itensVenda == null || itensVenda.Count == 0)
            throw new Exception("Nenhuma venda foi fornecida.");

        foreach (var item in itensVenda)
        {
            var produto = await _ProdRepo.BuscarPorId(item.ProdutoId);

            if (produto == null)

                throw new Exception($"Produto com ID '{item.ProdutoId}' não encontrado.");

            if (produto.Quantidade < item.Quantidade)

                throw new Exception($"Estoque insuficiente para '{produto.Nome}'. Disponível: {produto.Quantidade}, Solicitado: {item.Quantidade}");

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

        return await _VendaRepo.Registrar(novaVenda);

    }

    public async Task<byte[]> GerarRelatorioVendas()
    {
        var vendas = await _VendaRepo.Listar();

        if (!vendas.Any())
            throw new Exception("Nenhuma venda registrada.");

        var pdf = new RelatorioVendasPdf(vendas);
        return pdf.GeneratePdf();
    }

}




