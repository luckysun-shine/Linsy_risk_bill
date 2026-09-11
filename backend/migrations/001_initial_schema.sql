-- Linsy Risk Bill — initial schema (MySQL 8+)

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NULL,
    password_hash VARCHAR(255) NULL,
    api_key_hash VARCHAR(64) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'api_client',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT chk_users_role CHECK (role IN ('admin', 'api_client'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bill_links (
    id CHAR(36) NOT NULL PRIMARY KEY,
    token VARCHAR(64) NOT NULL UNIQUE,
    year INT NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    employee_name VARCHAR(100) NULL,
    department VARCHAR(100) NULL,
    role_key VARCHAR(30) NOT NULL DEFAULT 'staff',
    expires_at DATETIME(3) NULL,
    is_revoked TINYINT(1) NOT NULL DEFAULT 0,
    created_by CHAR(36) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_bill_links_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_bill_links_year_employee (year, employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bill_data (
    id CHAR(36) NOT NULL PRIMARY KEY,
    link_id CHAR(36) NOT NULL UNIQUE,
    year INT NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    payload JSON NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_bill_data_link FOREIGN KEY (link_id) REFERENCES bill_links(id) ON DELETE CASCADE,
    INDEX idx_bill_data_employee_year (employee_id, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS api_keys (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    key_prefix VARCHAR(12) NOT NULL,
    key_hash VARCHAR(64) NOT NULL UNIQUE,
    user_id CHAR(36) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_used_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    expires_at DATETIME(3) NULL,
    CONSTRAINT fk_api_keys_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS access_logs (
    id CHAR(36) NOT NULL PRIMARY KEY,
    link_id CHAR(36) NULL,
    token_prefix VARCHAR(8) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    accessed_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_access_logs_link FOREIGN KEY (link_id) REFERENCES bill_links(id) ON DELETE SET NULL,
    INDEX idx_access_logs_link_id (link_id),
    INDEX idx_access_logs_accessed_at (accessed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
