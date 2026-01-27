using System.ComponentModel.DataAnnotations;

namespace SistemaWeb.Models
{
    public class Produtos
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = default!;
        
        [Range(0, double.MaxValue)]
        public decimal PrecoCusto { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal PrecoVenda { get; set; }
        
        [Range(0, int.MaxValue)]
        public int Quantidade { get; set; }
    }
}
