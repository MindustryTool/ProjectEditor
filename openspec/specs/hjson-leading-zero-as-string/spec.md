## ADDED Requirements

### Requirement: Leading-zero integers parse as strings

When a numeric literal starts with `0` followed by one or more additional decimal digits, the HJSON parser SHALL produce a string value equal to the original literal text, rather than a numeric value.

#### Scenario: Two-digit leading-zero integer
- **WHEN** parsing `{id: 0023}`
- **THEN** the value of `id` SHALL be the string `"0023"`, not the number `23`

#### Scenario: Three-digit leading-zero integer
- **WHEN** parsing `{id: 00042}`
- **THEN** the value of `id` SHALL be the string `"00042"`

#### Scenario: Single zero remains a number
- **WHEN** parsing `{val: 0}`
- **THEN** the value of `val` SHALL be the number `0`

#### Scenario: Negative leading-zero integer
- **WHEN** parsing `{val: -007}`
- **THEN** the value of `val` SHALL be the string `"-007"`

#### Scenario: Positive leading-zero integer
- **WHEN** parsing `{val: +007}`
- **THEN** the value of `val` SHALL be the string `"+007"`

### Requirement: Leading-zero floats parse as strings

When a numeric literal starts with `0` followed by a decimal point and additional digits, the HJSON parser SHALL produce a string value.

#### Scenario: Leading-zero float with fraction
- **WHEN** parsing `{val: 0.5}`
- **THEN** the value of `val` SHALL be the string `"0.5"`, not the number `0.5`

#### Scenario: Leading-zero float zero-point-zero
- **WHEN** parsing `{val: 0.0}`
- **THEN** the value of `val` SHALL be the string `"0.0"`, not the number `0`

### Requirement: Hex literals remain numbers

Hex literals starting with `0x` or `0X` SHALL continue to parse as numeric values regardless of the leading zero.

#### Scenario: Hex literal stays a number
- **WHEN** parsing `{val: 0xFF}`
- **THEN** the value of `val` SHALL be the number `255`

### Requirement: Normal numbers without leading zero remain unchanged

Numeric literals that do not start with `0` (except single `0`) SHALL continue to parse as numeric values.

#### Scenario: Normal integer
- **WHEN** parsing `{val: 42}`
- **THEN** the value of `val` SHALL be the number `42`

#### Scenario: Normal negative integer
- **WHEN** parsing `{val: -10}`
- **THEN** the value of `val` SHALL be the number `-10`

#### Scenario: Normal float
- **WHEN** parsing `{val: 3.14}`
- **THEN** the value of `val` SHALL be the number `3.14`

#### Scenario: Exponent notation
- **WHEN** parsing `{val: 5e2}`
- **THEN** the value of `val` SHALL be the number `500`

#### Scenario: Negative exponent
- **WHEN** parsing `{val: 1e-3}`
- **THEN** the value of `val` SHALL be the number `0.001`

### Requirement: Leading-zero strings round-trip correctly

When a parsed leading-zero string value is serialized back to HJSON, it SHALL produce the original unquoted literal form.

#### Scenario: Leading-zero string round-trip
- **WHEN** parsing `{id: 0023}` and serializing the result
- **THEN** the output SHALL contain `id: 0023` (the leading-zero literal is preserved)
