namespace SistemaWeb.Models
{
    public class Produtos
    {
        public int Id { get; set; }
        public string Nome { get; set; } = default!;
        public decimal PrecoCusto { get; set; }
        public decimal PrecoVenda { get; set; }
        public int Quantidade { get; set; }
    }
}
