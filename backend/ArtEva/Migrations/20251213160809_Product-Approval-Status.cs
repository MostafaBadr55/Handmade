using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArtEva.Migrations
{
    /// <inheritdoc />
    public partial class ProductApprovalStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Products','ApprovalStatus') IS NULL
    BEGIN
        ALTER TABLE [Products] ADD [ApprovalStatus] int NOT NULL DEFAULT 0;
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Products','RejectionMessage') IS NULL
    BEGIN
        ALTER TABLE [Products] ADD [RejectionMessage] nvarchar(max) NULL;
    END");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "CreatedAt" },
                values: new object[] { "98d82d24-f00c-48d5-981a-d56968c54eb6", new DateTime(2025, 12, 13, 16, 8, 6, 193, DateTimeKind.Utc).AddTicks(158) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "CreatedAt" },
                values: new object[] { "04937574-7500-4521-ba83-697dad3863e3", new DateTime(2025, 12, 13, 16, 8, 6, 193, DateTimeKind.Utc).AddTicks(170) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ConcurrencyStamp", "CreatedAt" },
                values: new object[] { "12edd86e-7e1f-498d-b8d6-2105bf686fe2", new DateTime(2025, 12, 13, 16, 8, 6, 193, DateTimeKind.Utc).AddTicks(176) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Products','ApprovalStatus') IS NOT NULL
    BEGIN
        ALTER TABLE [Products] DROP COLUMN [ApprovalStatus];
    END");

            migrationBuilder.Sql(@"IF COL_LENGTH('dbo.Products','RejectionMessage') IS NOT NULL
    BEGIN
        ALTER TABLE [Products] DROP COLUMN [RejectionMessage];
    END");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "CreatedAt" },
                values: new object[] { "b0bbfba2-4801-449a-abe3-31e2a3abb086", new DateTime(2025, 12, 11, 8, 59, 40, 913, DateTimeKind.Utc).AddTicks(3367) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "CreatedAt" },
                values: new object[] { "2e7e2a46-0bc1-4fd3-9f1a-e36d01d91cf0", new DateTime(2025, 12, 11, 8, 59, 40, 913, DateTimeKind.Utc).AddTicks(3387) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ConcurrencyStamp", "CreatedAt" },
                values: new object[] { "617e1ec1-4a82-47dd-b01a-b30cd6919254", new DateTime(2025, 12, 11, 8, 59, 40, 913, DateTimeKind.Utc).AddTicks(3393) });
        }
    }
}
