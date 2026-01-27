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
    
    [Range(1, int.MaxValue)]
    public int Quantidade { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal ValorTotal { get; set; }
}