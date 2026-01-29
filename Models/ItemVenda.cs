using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class ItemVenda
{
    [Key]
    public int Id { get; set; }

    [Required]
    [ForeignKey("Venda")]
    public int VendaId { get; set; }

    [Required]
    [ForeignKey("Produto")]
    public int ProdutoId { get; set; }

    [Required]
    [StringLength(150)]
    public string NomeExibicao { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int Quantidade { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal PrecoCustoAtual { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal PrecoVendaAtual { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal CustoTotal { get; private set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal ValorTotal { get; private set; }
    public void CalcularTotalItem()
    {
        CustoTotal = Quantidade * PrecoCustoAtual;
        ValorTotal = Quantidade * PrecoVendaAtual;
    }
}