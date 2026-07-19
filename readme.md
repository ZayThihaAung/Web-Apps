# Expense Tracker with Database

## Project Overview
Expense Tracker with Database is a lightweight web application for tracking personal expenses, managing a starting budget, and visualizing spending habits through a simple dashboard and analytics page. The application is built as a front-end web app with Supabase as the backend database service, allowing expenses and budget values to be stored persistently.

## Project Goal
The main objective of this project is to help users:
- record daily or monthly expenses easily,
- monitor remaining budget in real time,
- understand spending patterns using a visual chart,
- review transaction history with details such as product name, amount, description, category, and payment method.

## Target Users
This application is designed for:
- students who want to manage small personal budgets,
- freelancers or employees tracking everyday spending,
- anyone who needs a simple and practical expense monitoring tool.

## Core Features
### 1. Budget Management
- Users can set or update an initial budget.
- The app calculates remaining budget after each expense entry.
- Users can reset budget and expense data when needed.

### 2. Expense Entry
- Users can enter:
  - expense amount,
  - product name,
  - description/note,
  - payment method,
  - expense category.
- Input validation prevents incomplete or invalid submissions.

### 3. Expense History and Analytics
- Expenses are displayed in a structured transaction list.
- Expenses can be sorted by ascending or descending amount.
- A bar chart visualizes all recorded expenses.
- Large expenses are highlighted visually for easier review.

### 4. Persistent Storage with Supabase
- Expense data and budget data are stored in a remote database using Supabase.
- Data remains available across sessions rather than being limited to browser memory.

## User Flow
1. Open the home page and set an initial budget.
2. Enter an expense amount and product details.
3. Select payment method and category.
4. Submit the expense.
5. View the updated remaining budget and transaction history in the analytics page.

## Technical Stack
- HTML5 for structure
- CSS3 for styling
- JavaScript for app logic
- Bootstrap for UI components
- Chart.js for expense visualization
- Supabase for database storage and data retrieval

## Project Structure
- html/main.html: home page for adding expenses and managing the budget
- html/expense.html: analytics page for viewing expense history and charts
- css/: styles for the main dashboard and expense tracking page
- script/main.js: logic for adding expenses, updating budget, and handling forms
- script/expense.js: logic for rendering history, sorting, deleting items, and building the chart
- script/supabase-config.js: Supabase client configuration
- database/supabase-setup.sql: SQL setup for creating the required database tables

## Data Model
The app uses the following logical data entities:
- Budget: stores the current remaining or initial budget amount.
- Expense List: stores each expense entry with product name, price, description, and date.
- Category: stores the selected category and payment method for each expense.

## Current Status
This is a functional MVP (Minimum Viable Product) focused on simple personal expense tracking with persistent database support.

## Future Enhancements
Planned improvements for future versions include:
- user authentication and login/signup support,
- multi-user accounts with private expense data,
- monthly and yearly reporting summaries,
- export/import of transaction data,
- dark mode and improved mobile responsiveness,
- recurring expense templates and reminders.

## Future Version Note: User Authentication
A future version of this project will introduce user authentication so that each person can securely sign in and manage their own budget and expense records. This enhancement will include:
- user registration and login,
- protected routes and authenticated sessions,
- personalized dashboards per user,
- secure storage of each user's expenses and budget data.
