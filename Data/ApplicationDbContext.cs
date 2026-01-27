using Microsoft.EntityFrameworkCore;
using SistemaWeb.Models;

namespace SistemaWeb.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Produtos> Produtos { get; set; }
        public DbSet<Venda> Vendas { get; set; }
        public DbSet<ItemVenda> ItensVenda { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Produtos>().HasData(
                new Produtos { Id = 1, Nome = "Caneta", Quantidade = 100, PrecoCusto = 2.5m, PrecoVenda = 5.0m },
                new Produtos { Id = 2, Nome = "Caderno", Quantidade = 50, PrecoCusto = 15.9m, PrecoVenda = 25.0m },
                new Produtos { Id = 3, Nome = "Borracha", Quantidade = 30, PrecoCusto = 1.5m, PrecoVenda = 2.0m },
                new Produtos { Id = 4, Nome = "Lapiseira", Quantidade = 200, PrecoCusto = 1.2m, PrecoVenda = 3.0m }
            );
        }
    }
}
