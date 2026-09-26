# Wave H — Table rename map (`tbl*` convention)

**Status:** deferred until after RBAC is stable. Dual-write **not started**.  
Do **not** execute `003_tbl_rename_preview.sql` in production until a migration playbook (backup, dual-read, dual-write, cutover) is approved.

## Current → target

| Current table        | Target `tbl*` name     | Sequelize model        | Notes |
|----------------------|------------------------|------------------------|-------|
| `user`               | `tblUser`              | `models/user.js`       | Core auth; high risk |
| `company`            | `tblCompany`           | `models/company.js`    | Tenant root |
| `categories`         | `tblCategory`          | `models/category.js`   | |
| `projects`           | `tblProject`           | `models/project.js`    | CMS projects |
| `builder_projects`   | `tblBuilderProject`    | `models/builderProject.js` | Legacy builder uploads |
| `tblBannerImages`    | `tblBanner`            | `models/banner.js`     | Already partially prefixed; normalize name |
| `services`           | `tblService`           | `models/service.js`    | |
| `blogs`              | `tblBlog`              | `models/blog.js`       | |
| `contact_messages`   | `tblContactMessage`    | `models/contact.js`    | |
| `reviews`            | `tblReview`            | `models/review.js`     | |
| `team_members`       | `tblTeamMember`        | `models/team_member.js`| |
| `quotations`         | `tblQuotation`         | `models/quotation.js`  | |
| `menu`               | `tblMenu`              | `models/menu.js`       | |
| `home_page_images`   | `tblHomePageImage`     | `models/homePageImage.js` | |
| `srs_images`         | `tblSrsImage`          | `models/srsImage.js`   | |

## Already on `tbl*` (RBAC — leave as-is)

| Table              | Model |
|--------------------|-------|
| `tblRole`          | `models/tblRole.js` |
| `tblPermission`    | `models/tblPermission.js` |
| `tblRolePermission`| `models/tblRolePermission.js` |
| `tblUserRole`      | `models/tblUserRole.js` |
| `tblAuditLog`      | `models/tblAuditLog.js` |

## Deferral notes

1. **RBAC first** — role/permission tables and login audit must remain stable before renames.
2. **Dual-write not started** — no application code writes to both old and new table names yet.
3. **Cutover prerequisites** — full DB backup, Sequelize `tableName` updates in one release, smoke tests for auth/CMS/quotation, then drop old names only after verification window.
4. Preview SQL lives beside this file: `003_tbl_rename_preview.sql` (commented out; documentation only).
