using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KTMSApi.Migrations
{
    /// <inheritdoc />
    public partial class jopa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<int>(
                name: "Createdby",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Createdby",
                table: "Events");

            migrationBuilder.AddColumn<int>(
                name: "CreatedbyId",
                table: "Events",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Events_CreatedbyId",
                table: "Events",
                column: "CreatedbyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Users_CreatedbyId",
                table: "Events",
                column: "CreatedbyId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
