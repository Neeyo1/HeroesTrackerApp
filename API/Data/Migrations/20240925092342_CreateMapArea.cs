using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreateMapArea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MapAreaId",
                table: "Maps",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "MapAreas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapAreas", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Maps_MapAreaId",
                table: "Maps",
                column: "MapAreaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Maps_MapAreas_MapAreaId",
                table: "Maps",
                column: "MapAreaId",
                principalTable: "MapAreas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Maps_MapAreas_MapAreaId",
                table: "Maps");

            migrationBuilder.DropTable(
                name: "MapAreas");

            migrationBuilder.DropIndex(
                name: "IX_Maps_MapAreaId",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "MapAreaId",
                table: "Maps");
        }
    }
}
