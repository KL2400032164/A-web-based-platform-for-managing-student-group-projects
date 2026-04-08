# A-web-based-platform-for-managing-student-group-projects

## MySQL setup

This project can store login details in MySQL.

### 1. Configure the database connection

The project now auto-loads `.env` for the backend. Update these values in [.env](/Users/haran/Documents/Fsad%20project/.env):

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=student_project_management
```

### 2. Create the database and users table

Run the SQL from [server/data/schema.sql](/Users/haran/Documents/Fsad%20project/server/data/schema.sql) in MySQL Workbench, VS Code MySQL extension, or the MySQL terminal.

If you use MySQL terminal, the command is:

```bash
mysql -u root -p < server/data/schema.sql
```

### 3. Verify the connection

```bash
npm run db:check
```

If the connection is correct, it will print `MySQL connection successful`.

### 4. Run the full project

```bash
npm run dev
```

That starts:
- the backend with `.env` loaded
- the Vite frontend

### Notes

- New signup accounts will be stored in MySQL when MySQL is configured.
- Demo users like `admin@gmail.com` and `student@gmail.com` still work.
- If MySQL is not configured, the project falls back to the local JSON data for now.
# SDP-REVIEW---2-STUDENT-GROUP-PROJECT-STATUS-
