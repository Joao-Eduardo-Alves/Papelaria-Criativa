public class Venda
{
    public int Id { get; set; }
    public DateTime Data { get; set; }
    public List <ItemVenda> ItensVenda { get; set; } = new();
    public decimal ValorTotalVenda =>
        ItensVenda.Sum(item => item.ValorTotal);
}