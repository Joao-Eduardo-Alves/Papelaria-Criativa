using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Venda
{
    [Key]
    public int Id { get; set; }

    [Required]
    public DateTime Data { get; set; }

    public List<ItemVenda> ItensVenda { get; set; } = new();

    [Column(TypeName = "decimal(18,2)")]
    public decimal ValorTotalVenda { get; private set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal LucroTotalVenda { get; private set; }

    public void CalcularTotalVenda()
    {
        ValorTotalVenda = ItensVenda.Sum(i => i.ValorTotal);
        LucroTotalVenda = ItensVenda.Sum(i => i.ValorTotal - i.CustoTotal);
    }
}