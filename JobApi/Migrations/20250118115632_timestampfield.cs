using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobApi.Migrations
{
    /// <inheritdoc />
    public partial class timestampfield : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StatusTimeStamp",
                table: "Workplaces",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StatusTimeStamp",
                table: "Workplaces");
        }
    }
}
