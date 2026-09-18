# Appointment Booking

A small, beginner-friendly appointment booking application built with React, Parcel, Spring Boot, and MySQL.

## What it does

- Lets a visitor book an appointment.
- Shows all appointments in an admin-style list.
- Lets the admin change an appointment from `PENDING` to `CONFIRMED` or `CANCELLED`.
- Stores everything in MySQL.

## Prerequisites

- Node.js 18+
- Java 21+
- Maven 3.9+
- MySQL 8+

## Database setup

Run this once in MySQL:

```sql
CREATE DATABASE appointment_booking;
```

The application uses `root` with an empty password by default. Change the values in `backend/src/main/resources/application.properties` if yours differ.

## Start the backend

```bash
cd backend
mvn spring-boot:run
```

It runs at `http://localhost:8080`.

## Start the frontend

```bash
cd frontend
npm install
npm start
```

Open the address Parcel prints (normally `http://localhost:1234`).

## Project layout

```
frontend/  React user interface
backend/   Spring Boot REST API
```
