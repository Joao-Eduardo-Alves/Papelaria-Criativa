using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaWeb.Models
{
    public class Produto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = default!;

        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecoCusto { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecoVenda { get; set; }

        [Range(0, int.MaxValue)]
        public int Quantidade { get; set; }
    }
}
