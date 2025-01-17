using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDbFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workplaces_Users_userId",
                table: "Workplaces");

            migrationBuilder.RenameColumn(
                name: "userId",
                table: "Workplaces",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Workplaces_userId",
                table: "Workplaces",
                newName: "IX_Workplaces_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Workplaces_Users_UserId",
                table: "Workplaces",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workplaces_Users_UserId",
                table: "Workplaces");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Workplaces",
                newName: "userId");

            migrationBuilder.RenameIndex(
                name: "IX_Workplaces_UserId",
                table: "Workplaces",
                newName: "IX_Workplaces_userId");

            migrationBuilder.AddForeignKey(
                name: "FK_Workplaces_Users_userId",
                table: "Workplaces",
                column: "userId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
