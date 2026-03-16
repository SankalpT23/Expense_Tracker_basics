# Expense Tracker API

## About
Spring Boot REST API to track personal expenses.

## Tech Stack
- Java 17
- Spring Boot 3
- Spring Data JPA
- MySQL

## How to Run
1. Create a new database in MySQL : `CREATE DATABASE expense_tracker;`
2. `application.properties` Go to properties and change details according to your database
3. `mvn spring-boot:run` Start the project

## API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| POST   | /expenso | Add expense |
| GET    | /expenso | All expenses |
| PUT    | /expenso/{id} | Update expense |
| DELETE | /expenso/{id} | Delete expense |
| GET    | /expenso/byCategory?category=Food | Filter by category |
| GET    | /expenso/filter?start=...&end=... | Filter by date |
| GET    | /expenso/summary?month=3&year=2025 | Monthly summary |