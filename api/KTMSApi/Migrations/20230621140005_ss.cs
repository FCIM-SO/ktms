using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KTMSApi.Migrations
{
    /// <inheritdoc />
    public partial class ss : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedbyId",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Events_CreatedbyId",
                table: "Events",
                column: "CreatedbyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Users_CreatedbyId",
                table: "Events",
                column: "CreatedbyId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Users_CreatedbyId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_CreatedbyId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "CreatedbyId",
                table: "Events");
        }
    }
}
