export const README = `
# Mindustry JSON Mod Development Guide

## Introduction

Mindustry supports content mods written entirely in JSON (or HJSON). JSON mods allow you to add:

* Items
* Liquids
* Status Effects
* Blocks
* Turrets
* Walls
* Power Blocks
* Factories
* Units
* Weapons
* Bullets
* Planet Content
* Sectors
* Weather
* Sounds
* Music
* Schematics
* Localization Bundles

JSON mods are easier to create than Java mods and require no programming.

---

# Mod Folder Structure

A typical JSON mod looks like:

my-mod/
├── mod.hjson
├── bundles/
│   ├── bundle.properties
│   ├── bundle_vi.properties
│   └── bundle_ru.properties
├── content/
│   ├── items/
│   ├── liquids/
│   ├── blocks/
│   ├── units/
│   ├── status/
│   ├── sectors/
│   ├── planets/
│   └── weather/
├── sprites/
│   ├── item-name.png
│   ├── block-name.png
│   └── unit-name.png
├── sounds/
│   └── custom-sound.ogg
├── music/
│   └── custom-music.ogg
└── schematics/

# mod.hjson

Required file.

hjson
name: "Example Mod"
author: "Your Name"
description: "Example content mod"
version: "1.0"
minGameVersion: 146


Fields:

| Field          | Required    | Description               |
| -------------- | ----------- | ------------------------- |
| name           | Yes         | Mod name                  |
| author         | No          | Author                    |
| description    | No          | Description               |
| version        | No          | Version                   |
| minGameVersion | Recommended | Minimum supported version |

---

# Content Types

Content files are placed under:

content/


Each file defines one piece of content.

Example:

content/items/copper-plus.hjson


---

# Item

hjson
type: Item

name: copper-plus
color: ff8844
cost: 1.2
hardness: 2
radioactivity: 0
flammability: 0
explosiveness: 0
charge: 0


Properties:

| Property      | Type  |
| ------------- | ----- |
| color         | Color |
| cost          | Float |
| hardness      | Int   |
| radioactivity | Float |
| flammability  | Float |
| explosiveness | Float |
| charge        | Float |

---

# Liquid

hjson
type: Liquid

name: acid
color: 00ff00

temperature: 0.8
viscosity: 0.6
flammability: 0
heatCapacity: 0.4
explosiveness: 0.1


Properties:

| Property      | Type  |
| ------------- | ----- |
| temperature   | Float |
| viscosity     | Float |
| flammability  | Float |
| heatCapacity  | Float |
| explosiveness | Float |

---

# Status Effect

hjson
type: StatusEffect

name: frozen-plus

speedMultiplier: 0.5
reloadMultiplier: 0.7
damage: 0.2


Properties:

| Property             | Type  |
| -------------------- | ----- |
| damage               | Float |
| speedMultiplier      | Float |
| reloadMultiplier     | Float |
| buildSpeedMultiplier | Float |
| dragMultiplier       | Float |
| healthMultiplier     | Float |

---

# Unit

hjson
type: UnitType

name: assault-drone

health: 500
speed: 3
armor: 4
hitSize: 12

flying: true
lowAltitude: false

engineOffset: 8
engineSize: 3


Common properties:

| Property     |
| ------------ |
| health       |
| armor        |
| speed        |
| accel        |
| drag         |
| rotateSpeed  |
| hitSize      |
| flying       |
| targetAir    |
| targetGround |
| itemCapacity |
| buildSpeed   |
| mineSpeed    |
| mineTier     |

---

# Unit Weapon

hjson
weapons: [
  {
    x: 4
    y: 0
    reload: 20

    bullet: {
      type: BasicBulletType

      speed: 5
      damage: 25

      width: 8
      height: 10
    }
  }
]


---

# Bullet Types

## BasicBulletType

hjson
bullet: {
    type: BasicBulletType
    speed: 4
    damage: 30
}


## MissileBulletType

hjson
bullet: {
    type: MissileBulletType

    speed: 3
    damage: 40
    homingPower: 0.08
}


## LaserBulletType

hjson
bullet: {
    type: LaserBulletType

    damage: 150
    length: 160
}


## ContinuousLaserBulletType

hjson
bullet: {
    type: ContinuousLaserBulletType

    damage: 30
    length: 200
}


## FlakBulletType

hjson
bullet: {
    type: FlakBulletType
    damage: 20
    splashDamage: 30
    splashDamageRadius: 24
}


## ArtilleryBulletType

hjson
bullet: {
    type: ArtilleryBulletType

    damage: 50
    splashDamage: 70
    splashDamageRadius: 32
}


---

# Generic Block

hjson
type: Block

name: example-block

size: 2
health: 250


---

# Wall

hjson
type: Wall

size: 1
health: 600


Additional:

hjson
chanceDeflect: 10
flashHit: true


---

# Conveyor

hjson
type: Conveyor

speed: 0.08
displayedSpeed: 8
health: 50


---

# Router

hjson
type: Router

health: 70


---

# Junction

hjson
type: Junction

capacity: 6
speed: 26


---

# Drill

hjson
type: Drill

size: 2

drillTime: 300
tier: 3

liquidBoostIntensity: 1.6


---

# Pump

hjson
type: Pump

pumpAmount: 0.3


---

# Power Node

hjson
type: PowerNode

laserRange: 8
maxNodes: 10


---

# Battery

hjson
type: Battery

consumePowerBuffered: 5000


---

# Solar Generator

hjson
type: SolarGenerator

powerProduction: 1.5


---

# Thermal Generator

hjson
type: ThermalGenerator

powerProduction: 2.5


---

# Combustion Generator

hjson
type: ConsumeGenerator

powerProduction: 2

itemDuration: 120


---

# Crafter

hjson
type: GenericCrafter

size: 2

craftTime: 60

consumeItems: {
    items: [
        copper/2
        lead/1
    ]
}

outputItem: silicon/1


---

# Separator

hjson
type: Separator

results: [
    copper/5
    lead/3
]


---

# Incinerator

hjson
type: Incinerator


---

# Storage Block

hjson
type: StorageBlock

itemCapacity: 1000


---

# Core Block

hjson
type: CoreBlock

unitCapModifier: 8
itemCapacity: 6000
health: 5000


---

# Turret

hjson
type: ItemTurret

size: 3

range: 180
reload: 20

ammoTypes: {
    copper: {
        type: BasicBulletType
        damage: 15
        speed: 4
    }
}


---

# Liquid Turret

hjson
type: LiquidTurret

ammoTypes: {
    water: {
        type: LiquidBulletType
        damage: 3
    }
}


---

# Power Turret

hjson
type: PowerTurret

shootType: {
    type: LaserBulletType
    damage: 120
    length: 180
}


---

# Weather

hjson
type: ParticleWeather

duration: 6000

soundVol: 0.5

attrs: {
    water: 0.2
}


---

# Planet

hjson
type: Planet

radius: 1
orbitRadius: 20

accessible: true


---

# Sector

hjson
type: SectorPreset

planet: serpulo

captureWave: 20
difficulty: 4


---

# Localization

File:

bundles/bundle.properties


Example:

properties
block.example-mod-super-drill.name=Super Drill
block.example-mod-super-drill.description=Fast mining drill.

item.example-mod-titanium-plus.name=Titanium+
item.example-mod-titanium-plus.description=Improved titanium.


Pattern:

properties
block.MOD-CONTENT.name=
block.MOD-CONTENT.description=

item.MOD-CONTENT.name=
item.MOD-CONTENT.description=

unit.MOD-CONTENT.name=
unit.MOD-CONTENT.description=


---

# Sprites

Sprites go in:

sprites/


Naming:

item-name.png
block-name.png
unit-name.png


Examples:

copper-plus.png
super-drill.png
assault-drone.png


---

# Sounds

sounds/


Supported:

.ogg
.mp3
.wav


Example:

sounds/laser.ogg


Usage:

hjson
shootSound: laser


---

# Music

music/


Example:

music/boss-theme.ogg


---

# References

Reference vanilla content by internal name:

hjson
copper
lead
graphite
thorium

dagger
flare

water
slag

burning
freezing


Example:

hjson
requirements: [
    copper/100
    lead/50
]


---

# HJSON Features

Mindustry primarily uses HJSON.

Comments:

hjson
# comment


Multiline:

hjson
description:
'''
Long here
'''


Unquoted strings:

hjson
name: super-drill


Trailing commas optional.

---

# Useful Vanilla Sources

To discover available properties:

1. Mindustry source code
2. Mindustry core content definitions
3. Existing community mods
4. Generated JSON exports from the game

Most JSON content classes correspond directly to Java classes:

Item
Liquid
StatusEffect
UnitType
Weapon
BulletType
Block
Wall
PowerNode
Battery
Drill
Pump
CoreBlock
ItemTurret
PowerTurret
LiquidTurret
Planet
SectorPreset
Weather


Every public field of these classes is generally configurable through JSON/HJSON.
`;
