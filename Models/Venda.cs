using System.ComponentModel.DataAnnotations;

public class Venda
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public DateTime Data { get; set; }

    public List<ItemVenda> ItensVenda { get; set; } = new();
    public decimal ValorTotal { get; set; }
    
    public decimal ValorTotalVenda =>
        ItensVenda.Sum(item => item.ValorTotal);
}