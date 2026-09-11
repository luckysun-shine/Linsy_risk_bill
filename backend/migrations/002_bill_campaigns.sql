-- 年度账单配置（统一内容）与部门发布目标

CREATE TABLE IF NOT EXISTS bill_campaigns (
    id CHAR(36) NOT NULL PRIMARY KEY,
    year INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    base_payload JSON NOT NULL,
    created_by CHAR(36) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT chk_campaign_status CHECK (status IN ('draft', 'published')),
    CONSTRAINT fk_campaigns_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY uk_bill_campaigns_year_title (year, title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bill_campaign_departments (
    id CHAR(36) NOT NULL PRIMARY KEY,
    campaign_id CHAR(36) NOT NULL,
    dept_code VARCHAR(50) NOT NULL,
    dept_name VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(100) NULL,
    role_key VARCHAR(30) NOT NULL DEFAULT 'manager',
    sort_order INT NOT NULL DEFAULT 0,
    overrides JSON NOT NULL,
    link_id CHAR(36) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_campaign_dept_campaign FOREIGN KEY (campaign_id) REFERENCES bill_campaigns(id) ON DELETE CASCADE,
    CONSTRAINT fk_campaign_dept_link FOREIGN KEY (link_id) REFERENCES bill_links(id) ON DELETE SET NULL,
    UNIQUE KEY uk_campaign_dept_code (campaign_id, dept_code),
    INDEX idx_bill_campaign_departments_campaign (campaign_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
