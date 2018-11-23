using Microsoft.EntityFrameworkCore.Migrations;

namespace Todo.Api.Migrations
{
    public partial class Flag : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDoneFlag",
                table: "Items",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDoneFlag",
                table: "Items");
        }
    }
}
