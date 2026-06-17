# weapon-metadata Specification

## Purpose
TBD - created by archiving change add-weapon-metadata-i18n. Update Purpose after archive.
## Requirements
### Requirement: Weapon fields have metadata annotations

Every field in `weaponObjectSchema` and weapon-type-specific schemas SHALL have `metadata({ name: "editor.weapon.<field>", description: "editor.weapon.<field>-description" })` added via `v.pipe()`.

#### Scenario: Base weapon fields have metadata

- **WHEN** weapon schema is loaded
- **THEN** `getSchemaMetadata(weaponObjectSchema.entries.shootX)` SHALL return an object with `name` equal to `"editor.weapon.shoot-x"` and `description` equal to `"editor.weapon.shoot-x-description"`

#### Scenario: All fields covered

- **WHEN** weapon schema is loaded
- **THEN** every field entry in `weaponObjectSchema` entries SHALL have non-null metadata with a `name` string

### Requirement: Sub-type specific weapon fields have metadata

Fields in `buildWeaponSchema`, `mineWeaponSchema`, `pointDefenseBulletWeaponSchema`, `pointDefenseWeaponSchema`, and `repairBeamWeaponSchema` SHALL have metadata annotations.

#### Scenario: Repair beam field metadata

- **WHEN** the repair beam weapon schema is resolved
- **THEN** `getSchemaMetadata(repairBeamWeaponSchema.entries.repairSpeed)` SHALL return metadata with `name` equal to `"editor.weapon.repair-speed"`

