using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArtEva.Migrations
{
    /// <inheritdoc />
    public partial class addProductQueryFilter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.UserNotifications','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [UserNotifications] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.SubCategories','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [SubCategories] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Shops','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Shops] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.ShopFollowers','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [ShopFollowers] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Shipments','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Shipments] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Reviews','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Reviews] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Refunds','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Refunds] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Products','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Products] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.ProductImages','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [ProductImages] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Payments','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Payments] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Orders','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Orders] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.OrderItems','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [OrderItems] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Notifications','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Notifications] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Favorites','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Favorites] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Disputes','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Disputes] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Categories','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Categories] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Carts','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Carts] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.CartItems','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [CartItems] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Addresses','DeletedAt') IS NULL
    BEGIN
        ALTER TABLE [Addresses] ADD [DeletedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
    END");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "CreatedAt" },
                values: new object[] { "c1d2728e-6ec0-436c-9b9a-9272d0288a42", new DateTime(2025, 12, 17, 11, 9, 17, 155, DateTimeKind.Utc).AddTicks(5444) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "CreatedAt" },
                values: new object[] { "2f740610-e5a3-4358-8612-94945ca39438", new DateTime(2025, 12, 17, 11, 9, 17, 155, DateTimeKind.Utc).AddTicks(5455) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ConcurrencyStamp", "CreatedAt" },
                values: new object[] { "bd608ca4-8bd5-427e-aa48-49445cf68ba8", new DateTime(2025, 12, 17, 11, 9, 17, 155, DateTimeKind.Utc).AddTicks(5472) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "UserNotifications");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "SubCategories");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Shops");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "ShopFollowers");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Shipments");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Refunds");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "ProductImages");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Favorites");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Disputes");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "CartItems");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Addresses");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "CreatedAt" },
                values: new object[] { "dda8857f-f5b8-49d9-a734-026d2819e562", new DateTime(2025, 12, 15, 18, 24, 9, 650, DateTimeKind.Utc).AddTicks(6899) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "CreatedAt" },
                values: new object[] { "1067e2b1-9efc-42d9-9df2-c06c257c0c14", new DateTime(2025, 12, 15, 18, 24, 9, 650, DateTimeKind.Utc).AddTicks(6910) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ConcurrencyStamp", "CreatedAt" },
                values: new object[] { "57dffefe-8cd4-4db8-8837-88bf12b9e410", new DateTime(2025, 12, 15, 18, 24, 9, 650, DateTimeKind.Utc).AddTicks(6917) });
        }
    }
}
