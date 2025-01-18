using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobApi.Migrations
{
    /// <inheritdoc />
    public partial class extrafields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "Workplaces",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "Workplaces",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Company",
                table: "Workplaces");

            migrationBuilder.DropColumn(
                name: "Link",
                table: "Workplaces");
        }
    }
}
