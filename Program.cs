using Microsoft.EntityFrameworkCore;
using SistemaWeb.Data;
using SistemaWeb.Endpoints; //namespace
using QuestPDF.Infrastructure;

QuestPDF.Settings.License = LicenseType.Community;

var builder = WebApplication.CreateBuilder(args);

// 1. Banco de dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Services
builder.Services.AddScoped<ProdutoService>();
builder.Services.AddScoped<VendaService>();

// 3. Repositories
builder.Services.AddScoped<ProdutoRepository>();
builder.Services.AddScoped<VendaRepository>();

// 4. Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 5. Migration automática
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

// 6. Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 7. Arquivos estáticos
app.UseDefaultFiles();
app.UseStaticFiles();

// 8. Endpoints (aqui é a grande mudança)
ProdutoEndpoints.Map(app);
VendaEndpoints.Map(app);

app.Run();