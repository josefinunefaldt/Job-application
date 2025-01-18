using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobApi.Migrations
{
    /// <inheritdoc />
    public partial class deletefield : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MyProperty",
                table: "Workplaces");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MyProperty",
                table: "Workplaces",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
