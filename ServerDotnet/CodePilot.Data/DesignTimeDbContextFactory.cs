
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using CodePilot.Data;  // הוספת הפנייה זו

public class CodePilotDbContextFactory : IDesignTimeDbContextFactory<CodePilotDbContext>
{
    public CodePilotDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<CodePilotDbContext>();

        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Username=postgres;Password=Mb214833493!;Database=CodePilotDb");

        return new CodePilotDbContext(optionsBuilder.Options);
    }
}
