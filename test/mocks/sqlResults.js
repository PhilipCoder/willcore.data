const getNewDBSql = `-- DB does not exists, creating DB.
CREATE DATABASE myDB;
USE myDB;
-- Create table.
CREATE TABLE \`user\` (
\`id\` int AUTO_INCREMENT PRIMARY KEY,
\`name\` varchar(256) null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create table.
CREATE TABLE \`product\` (
\`id\` int AUTO_INCREMENT PRIMARY KEY,
\`name\` varchar(256) null,
\`owner\` int null,
INDEX product_owner_user_id(owner),
FOREIGN KEY (owner) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`

exports.getNewDBSql = getNewDBSql;

const noChangeSQL = `USE myDB;`;

exports.noChangeSQL = noChangeSQL;