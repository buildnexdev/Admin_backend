-- ============================================================
-- BuildNexDev Admin — Additive RBAC / Auth migration
-- SAFE: does NOT rename/drop existing production tables.
-- New tables use tbl_ prefix as required.
-- Run against your MySQL database after backup.
-- ============================================================

-- Allow bcrypt hashes (existing password column is too short)
ALTER TABLE `tblUser`
  MODIFY COLUMN `password` VARCHAR(255) NOT NULL;

-- ----------------------------------------------------------
-- Companies mirror / extension (existing `company` kept)
-- Prefer mapping table for multi-company users
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_companies` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `legacy_company_id` INT NULL COMMENT 'maps to existing company.companyID',
  `name` VARCHAR(255) NOT NULL,
  `logo` VARCHAR(500) NULL,
  `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_legacy_company` (`legacy_company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tbl_roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(64) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `description` VARCHAR(255) NULL,
  `is_system` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tbl_permissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(128) NOT NULL,
  `module` VARCHAR(64) NOT NULL,
  `action` VARCHAR(64) NOT NULL,
  `description` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_perm_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tbl_role_permissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` INT UNSIGNED NOT NULL,
  `permission_id` INT UNSIGNED NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_perm` (`role_id`,`permission_id`),
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `tbl_roles`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `tbl_permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tbl_user_roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT 'maps to tblUser.userId',
  `role_id` INT UNSIGNED NOT NULL,
  `company_id` INT NOT NULL COMMENT 'maps to company.companyID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role_co` (`user_id`,`role_id`,`company_id`),
  CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `tbl_roles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tbl_user_companies` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `company_id` INT NOT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_company` (`user_id`,`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tbl_activity_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `company_id` INT NULL,
  `action` VARCHAR(64) NOT NULL,
  `module` VARCHAR(64) NULL,
  `record_id` VARCHAR(64) NULL,
  `description` VARCHAR(500) NULL,
  `ip` VARCHAR(64) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_al_company` (`company_id`),
  KEY `idx_al_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tbl_settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` INT NULL,
  `key_name` VARCHAR(128) NOT NULL,
  `value_json` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_settings_co_key` (`company_id`,`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tbl_notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `company_id` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `body` VARCHAR(1000) NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed roles
INSERT IGNORE INTO `tbl_roles` (`code`,`name`,`description`,`is_system`) VALUES
('SUPER_ADMIN','Super Admin','Full platform access',1),
('COMPANY_ADMIN','Company Admin','Full access within company',1),
('MANAGER','Manager','Manage content and team',1),
('STAFF','Staff','Operational access',1),
('USER','User','Limited access',1);

-- Seed core permissions
INSERT IGNORE INTO `tbl_permissions` (`code`,`module`,`action`,`description`) VALUES
('dashboard.view','dashboard','view','View dashboard'),
('banner.view','banner','view','View banners'),
('banner.create','banner','create','Create banners'),
('banner.edit','banner','edit','Edit banners'),
('banner.delete','banner','delete','Delete banners'),
('project.view','project','view','View projects'),
('project.create','project','create','Create projects'),
('project.edit','project','edit','Edit projects'),
('project.delete','project','delete','Delete projects'),
('service.view','service','view','View services'),
('service.create','service','create','Create services'),
('service.edit','service','edit','Edit services'),
('service.delete','service','delete','Delete services'),
('blog.view','blog','view','View blogs'),
('blog.create','blog','create','Create blogs'),
('blog.edit','blog','edit','Edit blogs'),
('blog.delete','blog','delete','Delete blogs'),
('quotation.view','quotation','view','View quotations'),
('quotation.create','quotation','create','Create quotations'),
('quotation.edit','quotation','edit','Edit quotations'),
('quotation.delete','quotation','delete','Delete quotations'),
('quotation.approve','quotation','approve','Approve quotations'),
('tblUser.view','tblUser','view','View users'),
('tblUser.create','tblUser','create','Create users'),
('tblUser.edit','tblUser','edit','Edit users'),
('tblUser.delete','tblUser','delete','Delete users'),
('company.view','company','view','View companies'),
('company.create','company','create','Create companies'),
('company.edit','company','edit','Edit companies'),
('company.delete','company','delete','Delete companies'),
('role.view','role','view','View roles'),
('role.manage','role','manage','Manage roles'),
('report.view','report','view','View reports'),
('ticket.view','ticket','view','View tickets'),
('ticket.manage','ticket','manage','Manage tickets'),
('task.view','task','view','View tasks'),
('task.manage','task','manage','Manage tasks'),
('account.view','account','view','View accounts'),
('account.manage','account','manage','Manage accounts');

-- Grant ALL permissions to SUPER_ADMIN and COMPANY_ADMIN
INSERT IGNORE INTO `tbl_role_permissions` (`role_id`,`permission_id`)
SELECT r.id, p.id FROM `tbl_roles` r CROSS JOIN `tbl_permissions` p
WHERE r.code IN ('SUPER_ADMIN','COMPANY_ADMIN');

-- Manager: content + quotation + tasks (no company.delete)
INSERT IGNORE INTO `tbl_role_permissions` (`role_id`,`permission_id`)
SELECT r.id, p.id FROM `tbl_roles` r CROSS JOIN `tbl_permissions` p
WHERE r.code = 'MANAGER'
  AND p.code NOT IN ('company.delete','company.create','role.manage','tblUser.delete');

-- Staff: view + create/edit content, tickets/tasks
INSERT IGNORE INTO `tbl_role_permissions` (`role_id`,`permission_id`)
SELECT r.id, p.id FROM `tbl_roles` r CROSS JOIN `tbl_permissions` p
WHERE r.code = 'STAFF'
  AND p.action IN ('view','create','edit','manage')
  AND p.module IN ('dashboard','banner','project','service','blog','quotation','ticket','task');
