-- ============================================================
-- Wave C RBAC — SAFE additive migration
-- Does NOT ALTER `user` / tblUser. Live users remain in `user`.
-- Tables use PascalCase columns; FKs only among RBAC tables.
-- ============================================================

CREATE TABLE IF NOT EXISTS `tblRole` (
  `RoleId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Code` VARCHAR(64) NOT NULL,
  `Name` VARCHAR(128) NOT NULL,
  `Description` VARCHAR(255) NULL,
  `IsSystem` TINYINT(1) NOT NULL DEFAULT 0,
  `CreatedDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`RoleId`),
  UNIQUE KEY `uk_tblRole_Code` (`Code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tblPermission` (
  `PermissionId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Code` VARCHAR(128) NOT NULL,
  `Module` VARCHAR(64) NOT NULL,
  `Action` VARCHAR(64) NOT NULL,
  `Description` VARCHAR(255) NULL,
  `CreatedDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PermissionId`),
  UNIQUE KEY `uk_tblPermission_Code` (`Code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tblRolePermission` (
  `RolePermissionId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `RoleId` INT UNSIGNED NOT NULL,
  `PermissionId` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`RolePermissionId`),
  UNIQUE KEY `uk_tblRolePermission_role_perm` (`RoleId`, `PermissionId`),
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`RoleId`) REFERENCES `tblRole` (`RoleId`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_perm` FOREIGN KEY (`PermissionId`) REFERENCES `tblPermission` (`PermissionId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tblUserRole` (
  `UserRoleId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `UserId` INT NOT NULL COMMENT 'maps to user.userId',
  `RoleId` INT UNSIGNED NOT NULL,
  `CompanyId` INT NOT NULL COMMENT 'maps to company.companyID',
  PRIMARY KEY (`UserRoleId`),
  UNIQUE KEY `uk_tblUserRole_user_role_co` (`UserId`, `RoleId`, `CompanyId`),
  CONSTRAINT `fk_ur_role` FOREIGN KEY (`RoleId`) REFERENCES `tblRole` (`RoleId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tblAuditLog` (
  `AuditLogId` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `UserId` INT NULL,
  `CompanyId` INT NULL,
  `Action` VARCHAR(64) NOT NULL,
  `Module` VARCHAR(64) NULL,
  `RecordId` VARCHAR(64) NULL,
  `Description` VARCHAR(500) NULL,
  `IpAddress` VARCHAR(64) NULL,
  `CreatedDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`AuditLogId`),
  KEY `idx_audit_user` (`UserId`),
  KEY `idx_audit_company` (`CompanyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed roles
INSERT IGNORE INTO `tblRole` (`Code`, `Name`, `Description`, `IsSystem`) VALUES
('SUPER_ADMIN', 'Super Admin', 'Full platform access', 1),
('COMPANY_ADMIN', 'Company Admin', 'Full access within company', 1),
('MANAGER', 'Manager', 'Create and edit within company', 1),
('STAFF', 'Staff', 'View-only operational access', 1);

-- Seed permissions
INSERT IGNORE INTO `tblPermission` (`Code`, `Module`, `Action`, `Description`) VALUES
('DASHBOARD_VIEW', 'DASHBOARD', 'VIEW', 'View dashboard'),
('SETTINGS_VIEW', 'SETTINGS', 'VIEW', 'View settings'),
('PROJECT_VIEW', 'PROJECT', 'VIEW', 'View projects'),
('PROJECT_CREATE', 'PROJECT', 'CREATE', 'Create projects'),
('PROJECT_EDIT', 'PROJECT', 'EDIT', 'Edit projects'),
('PROJECT_DELETE', 'PROJECT', 'DELETE', 'Delete projects'),
('BANNER_VIEW', 'BANNER', 'VIEW', 'View banners'),
('BANNER_CREATE', 'BANNER', 'CREATE', 'Create banners'),
('BANNER_EDIT', 'BANNER', 'EDIT', 'Edit banners'),
('BANNER_DELETE', 'BANNER', 'DELETE', 'Delete banners'),
('SERVICE_VIEW', 'SERVICE', 'VIEW', 'View services'),
('SERVICE_CREATE', 'SERVICE', 'CREATE', 'Create services'),
('SERVICE_EDIT', 'SERVICE', 'EDIT', 'Edit services'),
('SERVICE_DELETE', 'SERVICE', 'DELETE', 'Delete services'),
('BLOG_VIEW', 'BLOG', 'VIEW', 'View blogs'),
('BLOG_CREATE', 'BLOG', 'CREATE', 'Create blogs'),
('BLOG_EDIT', 'BLOG', 'EDIT', 'Edit blogs'),
('BLOG_DELETE', 'BLOG', 'DELETE', 'Delete blogs'),
('QUOTATION_VIEW', 'QUOTATION', 'VIEW', 'View quotations'),
('QUOTATION_CREATE', 'QUOTATION', 'CREATE', 'Create quotations'),
('QUOTATION_EDIT', 'QUOTATION', 'EDIT', 'Edit quotations'),
('QUOTATION_DELETE', 'QUOTATION', 'DELETE', 'Delete quotations'),
('SRS_VIEW', 'SRS', 'VIEW', 'View SRS'),
('SRS_CREATE', 'SRS', 'CREATE', 'Create SRS'),
('SRS_EDIT', 'SRS', 'EDIT', 'Edit SRS'),
('SRS_DELETE', 'SRS', 'DELETE', 'Delete SRS'),
('REVIEW_VIEW', 'REVIEW', 'VIEW', 'View reviews'),
('REVIEW_CREATE', 'REVIEW', 'CREATE', 'Create reviews'),
('REVIEW_EDIT', 'REVIEW', 'EDIT', 'Edit reviews'),
('REVIEW_DELETE', 'REVIEW', 'DELETE', 'Delete reviews'),
('TEAM_VIEW', 'TEAM', 'VIEW', 'View team'),
('TEAM_CREATE', 'TEAM', 'CREATE', 'Create team members'),
('TEAM_EDIT', 'TEAM', 'EDIT', 'Edit team members'),
('TEAM_DELETE', 'TEAM', 'DELETE', 'Delete team members'),
('CONTACT_VIEW', 'CONTACT', 'VIEW', 'View contacts'),
('REVENUE_VIEW', 'REVENUE', 'VIEW', 'View revenue'),
('CATEGORY_VIEW', 'CATEGORY', 'VIEW', 'View categories'),
('CATEGORY_CREATE', 'CATEGORY', 'CREATE', 'Create categories'),
('CATEGORY_EDIT', 'CATEGORY', 'EDIT', 'Edit categories'),
('CATEGORY_DELETE', 'CATEGORY', 'DELETE', 'Delete categories'),
('STAFF_VIEW', 'STAFF', 'VIEW', 'View staff'),
('STAFF_CREATE', 'STAFF', 'CREATE', 'Create staff'),
('STAFF_EDIT', 'STAFF', 'EDIT', 'Edit staff'),
('STAFF_DELETE', 'STAFF', 'DELETE', 'Delete staff'),
('USER_MANAGE', 'USER', 'MANAGE', 'Manage users'),
('RBAC_VIEW', 'RBAC', 'VIEW', 'View RBAC'),
('RBAC_EDIT', 'RBAC', 'EDIT', 'Edit RBAC'),
('COMPANY_VIEW', 'COMPANY', 'VIEW', 'View company'),
('COMPANY_CREATE', 'COMPANY', 'CREATE', 'Create companies'),
('COMPANY_LIST_ALL', 'COMPANY', 'LIST_ALL', 'List all companies'),
('TASK_VIEW', 'TASK', 'VIEW', 'View tasks'),
('TICKET_VIEW', 'TICKET', 'VIEW', 'View tickets'),
('ACCOUNT_VIEW', 'ACCOUNT', 'VIEW', 'View accounts'),
('REPORT_VIEW', 'REPORT', 'VIEW', 'View reports');

-- SUPER_ADMIN: all permissions
INSERT IGNORE INTO `tblRolePermission` (`RoleId`, `PermissionId`)
SELECT r.`RoleId`, p.`PermissionId`
FROM `tblRole` r
CROSS JOIN `tblPermission` p
WHERE r.`Code` = 'SUPER_ADMIN';

-- COMPANY_ADMIN: all except COMPANY_LIST_ALL and COMPANY_CREATE
INSERT IGNORE INTO `tblRolePermission` (`RoleId`, `PermissionId`)
SELECT r.`RoleId`, p.`PermissionId`
FROM `tblRole` r
CROSS JOIN `tblPermission` p
WHERE r.`Code` = 'COMPANY_ADMIN'
  AND p.`Code` NOT IN ('COMPANY_LIST_ALL', 'COMPANY_CREATE');

-- MANAGER: *_VIEW + *_CREATE + *_EDIT
INSERT IGNORE INTO `tblRolePermission` (`RoleId`, `PermissionId`)
SELECT r.`RoleId`, p.`PermissionId`
FROM `tblRole` r
CROSS JOIN `tblPermission` p
WHERE r.`Code` = 'MANAGER'
  AND p.`Action` IN ('VIEW', 'CREATE', 'EDIT');

-- STAFF: *_VIEW only
INSERT IGNORE INTO `tblRolePermission` (`RoleId`, `PermissionId`)
SELECT r.`RoleId`, p.`PermissionId`
FROM `tblRole` r
CROSS JOIN `tblPermission` p
WHERE r.`Code` = 'STAFF'
  AND p.`Action` = 'VIEW';
