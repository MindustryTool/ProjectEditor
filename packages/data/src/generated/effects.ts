import type { Effect } from "@project/api";

export const baseEffects: readonly Effect[] = [
  {
    "id": 0,
    "name": "none"
  },
  {
    "id": 1,
    "name": "blockCrash"
  },
  {
    "id": 2,
    "name": "trailFade"
  },
  {
    "id": 3,
    "name": "unitSpawn"
  },
  {
    "id": 4,
    "name": "unitCapKill"
  },
  {
    "id": 5,
    "name": "unitEnvKill"
  },
  {
    "id": 6,
    "name": "unitControl"
  },
  {
    "id": 7,
    "name": "unitDespawn"
  },
  {
    "id": 8,
    "name": "unitSpirit"
  },
  {
    "id": 9,
    "name": "itemTransfer"
  },
  {
    "id": 10,
    "name": "pointBeam"
  },
  {
    "id": 11,
    "name": "pointHit"
  },
  {
    "id": 12,
    "name": "hitScepterSecondary"
  },
  {
    "id": 13,
    "name": "lightning"
  },
  {
    "id": 14,
    "name": "coreBuildShockwave"
  },
  {
    "id": 15,
    "name": "coreBuildBlock"
  },
  {
    "id": 16,
    "name": "pointShockwave"
  },
  {
    "id": 17,
    "name": "moveCommand"
  },
  {
    "id": 18,
    "name": "attackCommand"
  },
  {
    "id": 19,
    "name": "commandSend"
  },
  {
    "id": 20,
    "name": "upgradeCore"
  },
  {
    "id": 21,
    "name": "upgradeCoreBloom"
  },
  {
    "id": 22,
    "name": "placeBlock"
  },
  {
    "id": 23,
    "name": "coreLaunchConstruct"
  },
  {
    "id": 24,
    "name": "tapBlock"
  },
  {
    "id": 25,
    "name": "breakBlock"
  },
  {
    "id": 26,
    "name": "payloadDeposit"
  },
  {
    "id": 27,
    "name": "select"
  },
  {
    "id": 28,
    "name": "smoke"
  },
  {
    "id": 29,
    "name": "fallSmoke"
  },
  {
    "id": 30,
    "name": "unitWreck"
  },
  {
    "id": 31,
    "name": "rocketSmoke"
  },
  {
    "id": 32,
    "name": "rocketSmokeLarge"
  },
  {
    "id": 33,
    "name": "magmasmoke"
  },
  {
    "id": 34,
    "name": "spawn"
  },
  {
    "id": 35,
    "name": "unitAssemble"
  },
  {
    "id": 36,
    "name": "padlaunch"
  },
  {
    "id": 37,
    "name": "breakProp"
  },
  {
    "id": 38,
    "name": "unitDrop"
  },
  {
    "id": 39,
    "name": "unitLand"
  },
  {
    "id": 40,
    "name": "unitDust"
  },
  {
    "id": 41,
    "name": "unitLandSmall"
  },
  {
    "id": 42,
    "name": "unitPickup"
  },
  {
    "id": 43,
    "name": "crawlDust"
  },
  {
    "id": 44,
    "name": "landShock"
  },
  {
    "id": 45,
    "name": "pickup"
  },
  {
    "id": 46,
    "name": "sparkExplosion"
  },
  {
    "id": 47,
    "name": "titanExplosion"
  },
  {
    "id": 48,
    "name": "titanExplosionLarge"
  },
  {
    "id": 49,
    "name": "titanExplosionSmall"
  },
  {
    "id": 50,
    "name": "titanExplosionFrag"
  },
  {
    "id": 51,
    "name": "titanSmoke"
  },
  {
    "id": 52,
    "name": "titanSmokeLarge"
  },
  {
    "id": 53,
    "name": "titanSmokeSmall"
  },
  {
    "id": 54,
    "name": "coreExplosion"
  },
  {
    "id": 55,
    "name": "smokeAoeCloud"
  },
  {
    "id": 56,
    "name": "missileTrailSmoke"
  },
  {
    "id": 57,
    "name": "missileTrailSmokeSmall"
  },
  {
    "id": 58,
    "name": "neoplasmSplat"
  },
  {
    "id": 59,
    "name": "scatheExplosion"
  },
  {
    "id": 60,
    "name": "scatheExplosionSmall"
  },
  {
    "id": 61,
    "name": "scatheLight"
  },
  {
    "id": 62,
    "name": "scatheLightSmall"
  },
  {
    "id": 63,
    "name": "titanLightSmall"
  },
  {
    "id": 64,
    "name": "scatheSlash"
  },
  {
    "id": 65,
    "name": "dynamicSpikes"
  },
  {
    "id": 66,
    "name": "greenBomb"
  },
  {
    "id": 67,
    "name": "greenLaserCharge"
  },
  {
    "id": 68,
    "name": "greenLaserChargeSmall"
  },
  {
    "id": 69,
    "name": "greenCloud"
  },
  {
    "id": 70,
    "name": "healWaveDynamic"
  },
  {
    "id": 71,
    "name": "healWave"
  },
  {
    "id": 72,
    "name": "heal"
  },
  {
    "id": 73,
    "name": "dynamicWave"
  },
  {
    "id": 74,
    "name": "shieldWave"
  },
  {
    "id": 75,
    "name": "shieldApply"
  },
  {
    "id": 76,
    "name": "disperseTrail"
  },
  {
    "id": 77,
    "name": "hitBulletSmall"
  },
  {
    "id": 78,
    "name": "hitBulletColor"
  },
  {
    "id": 79,
    "name": "hitSquaresColor"
  },
  {
    "id": 80,
    "name": "squareWaveEffect"
  },
  {
    "id": 81,
    "name": "hitFuse"
  },
  {
    "id": 82,
    "name": "hitBulletBig"
  },
  {
    "id": 83,
    "name": "hitFlameSmall"
  },
  {
    "id": 84,
    "name": "hitFlamePlasma"
  },
  {
    "id": 85,
    "name": "hitLiquid"
  },
  {
    "id": 86,
    "name": "hitLaserBlast"
  },
  {
    "id": 87,
    "name": "hitEmpSpark"
  },
  {
    "id": 88,
    "name": "hitLancer"
  },
  {
    "id": 89,
    "name": "hitLancerLow"
  },
  {
    "id": 90,
    "name": "hitBeam"
  },
  {
    "id": 91,
    "name": "hitFlameBeam"
  },
  {
    "id": 92,
    "name": "hitMeltdown"
  },
  {
    "id": 93,
    "name": "hitMeltHeal"
  },
  {
    "id": 94,
    "name": "instBomb"
  },
  {
    "id": 95,
    "name": "instTrail"
  },
  {
    "id": 96,
    "name": "instShoot"
  },
  {
    "id": 97,
    "name": "instHit"
  },
  {
    "id": 98,
    "name": "hitLaser"
  },
  {
    "id": 99,
    "name": "hitLaserColor"
  },
  {
    "id": 100,
    "name": "despawn"
  },
  {
    "id": 101,
    "name": "airBubble"
  },
  {
    "id": 102,
    "name": "flakExplosion"
  },
  {
    "id": 103,
    "name": "plasticExplosion"
  },
  {
    "id": 104,
    "name": "plasticExplosionFlak"
  },
  {
    "id": 105,
    "name": "blastExplosion"
  },
  {
    "id": 106,
    "name": "sapExplosion"
  },
  {
    "id": 107,
    "name": "massiveExplosion"
  },
  {
    "id": 108,
    "name": "artilleryTrail"
  },
  {
    "id": 109,
    "name": "incendTrail"
  },
  {
    "id": 110,
    "name": "missileTrail"
  },
  {
    "id": 111,
    "name": "missileTrailShort"
  },
  {
    "id": 112,
    "name": "bulletSparkSmokeTrailSmall"
  },
  {
    "id": 113,
    "name": "colorTrail"
  },
  {
    "id": 114,
    "name": "absorb"
  },
  {
    "id": 115,
    "name": "forceShrink"
  },
  {
    "id": 116,
    "name": "flakExplosionBig"
  },
  {
    "id": 117,
    "name": "burning"
  },
  {
    "id": 118,
    "name": "fireRemove"
  },
  {
    "id": 119,
    "name": "fire"
  },
  {
    "id": 120,
    "name": "fireHit"
  },
  {
    "id": 121,
    "name": "fireSmoke"
  },
  {
    "id": 122,
    "name": "neoplasmHeal"
  },
  {
    "id": 123,
    "name": "steam"
  },
  {
    "id": 124,
    "name": "ventSteam"
  },
  {
    "id": 125,
    "name": "drillSteam"
  },
  {
    "id": 126,
    "name": "fluxVapor"
  },
  {
    "id": 127,
    "name": "corrosionVapor"
  },
  {
    "id": 128,
    "name": "vapor"
  },
  {
    "id": 129,
    "name": "vaporSmall"
  },
  {
    "id": 130,
    "name": "fireballsmoke"
  },
  {
    "id": 131,
    "name": "ballfire"
  },
  {
    "id": 132,
    "name": "freezing"
  },
  {
    "id": 133,
    "name": "melting"
  },
  {
    "id": 134,
    "name": "wet"
  },
  {
    "id": 135,
    "name": "muddy"
  },
  {
    "id": 136,
    "name": "sapped"
  },
  {
    "id": 137,
    "name": "electrified"
  },
  {
    "id": 138,
    "name": "sporeSlowed"
  },
  {
    "id": 139,
    "name": "oily"
  },
  {
    "id": 140,
    "name": "overdriven"
  },
  {
    "id": 141,
    "name": "overclocked"
  },
  {
    "id": 142,
    "name": "dropItem"
  },
  {
    "id": 143,
    "name": "shockwave"
  },
  {
    "id": 144,
    "name": "shockwaveSmaller"
  },
  {
    "id": 145,
    "name": "bigShockwave"
  },
  {
    "id": 146,
    "name": "spawnShockwave"
  },
  {
    "id": 147,
    "name": "podLandShockwave"
  },
  {
    "id": 148,
    "name": "explosion"
  },
  {
    "id": 149,
    "name": "dynamicExplosion"
  },
  {
    "id": 150,
    "name": "reactorExplosion"
  },
  {
    "id": 151,
    "name": "impactReactorExplosion"
  },
  {
    "id": 152,
    "name": "blockExplosionSmoke"
  },
  {
    "id": 153,
    "name": "steamCoolSmoke"
  },
  {
    "id": 154,
    "name": "smokePuff"
  },
  {
    "id": 155,
    "name": "shootSmall"
  },
  {
    "id": 156,
    "name": "shootSmallColor"
  },
  {
    "id": 157,
    "name": "shootHeal"
  },
  {
    "id": 158,
    "name": "shootHealYellow"
  },
  {
    "id": 159,
    "name": "shootSmallSmoke"
  },
  {
    "id": 160,
    "name": "shootBig"
  },
  {
    "id": 161,
    "name": "shootBig2"
  },
  {
    "id": 162,
    "name": "shootBigColor"
  },
  {
    "id": 163,
    "name": "shootScepterSecondary"
  },
  {
    "id": 164,
    "name": "shootQuellPulse"
  },
  {
    "id": 165,
    "name": "shootTitan"
  },
  {
    "id": 166,
    "name": "shootBigSmoke"
  },
  {
    "id": 167,
    "name": "shootBigSmoke2"
  },
  {
    "id": 168,
    "name": "shootSmokeDisperse"
  },
  {
    "id": 169,
    "name": "shootSmokeSquare"
  },
  {
    "id": 170,
    "name": "shootSmokeSquareSparse"
  },
  {
    "id": 171,
    "name": "shootSmokeSquareBig"
  },
  {
    "id": 172,
    "name": "shootSmokeTitan"
  },
  {
    "id": 173,
    "name": "shootSmokeSmite"
  },
  {
    "id": 174,
    "name": "shootSmokeMissile"
  },
  {
    "id": 175,
    "name": "shootSmokeMissileColor"
  },
  {
    "id": 176,
    "name": "regenParticle"
  },
  {
    "id": 177,
    "name": "regenSuppressParticle"
  },
  {
    "id": 178,
    "name": "regenSuppressSeek"
  },
  {
    "id": 179,
    "name": "surgeCruciSmoke"
  },
  {
    "id": 180,
    "name": "neoplasiaSmoke"
  },
  {
    "id": 181,
    "name": "heatReactorSmoke"
  },
  {
    "id": 182,
    "name": "circleColorSpark"
  },
  {
    "id": 183,
    "name": "colorSpark"
  },
  {
    "id": 184,
    "name": "colorSparkBig"
  },
  {
    "id": 185,
    "name": "randLifeSpark"
  },
  {
    "id": 186,
    "name": "shootPayloadDriver"
  },
  {
    "id": 187,
    "name": "shootSmallFlame"
  },
  {
    "id": 188,
    "name": "shootPyraFlame"
  },
  {
    "id": 189,
    "name": "shootLiquid"
  },
  {
    "id": 190,
    "name": "casing1"
  },
  {
    "id": 191,
    "name": "casing2"
  },
  {
    "id": 192,
    "name": "casing3"
  },
  {
    "id": 193,
    "name": "casing4"
  },
  {
    "id": 194,
    "name": "casing2Double"
  },
  {
    "id": 195,
    "name": "casing3Double"
  },
  {
    "id": 196,
    "name": "railShoot"
  },
  {
    "id": 197,
    "name": "railTrail"
  },
  {
    "id": 198,
    "name": "railHit"
  },
  {
    "id": 199,
    "name": "lancerLaserShoot"
  },
  {
    "id": 200,
    "name": "lancerLaserShootSmoke"
  },
  {
    "id": 201,
    "name": "lancerLaserCharge"
  },
  {
    "id": 202,
    "name": "lancerLaserChargeBegin"
  },
  {
    "id": 203,
    "name": "lightningCharge"
  },
  {
    "id": 204,
    "name": "sparkShoot"
  },
  {
    "id": 205,
    "name": "lightningShoot"
  },
  {
    "id": 206,
    "name": "thoriumShoot"
  },
  {
    "id": 207,
    "name": "reactorsmoke"
  },
  {
    "id": 208,
    "name": "redgeneratespark"
  },
  {
    "id": 209,
    "name": "turbinegenerate"
  },
  {
    "id": 210,
    "name": "generatespark"
  },
  {
    "id": 211,
    "name": "fuelburn"
  },
  {
    "id": 212,
    "name": "incinerateSlag"
  },
  {
    "id": 213,
    "name": "coreBurn"
  },
  {
    "id": 214,
    "name": "plasticburn"
  },
  {
    "id": 215,
    "name": "conveyorPoof"
  },
  {
    "id": 216,
    "name": "pulverize"
  },
  {
    "id": 217,
    "name": "pulverizeRed"
  },
  {
    "id": 218,
    "name": "pulverizeSmall"
  },
  {
    "id": 219,
    "name": "pulverizeMedium"
  },
  {
    "id": 220,
    "name": "producesmoke"
  },
  {
    "id": 221,
    "name": "artilleryTrailSmoke"
  },
  {
    "id": 222,
    "name": "smokeCloud"
  },
  {
    "id": 223,
    "name": "smeltsmoke"
  },
  {
    "id": 224,
    "name": "coalSmeltsmoke"
  },
  {
    "id": 225,
    "name": "formsmoke"
  },
  {
    "id": 226,
    "name": "blastsmoke"
  },
  {
    "id": 227,
    "name": "lava"
  },
  {
    "id": 228,
    "name": "dooropen"
  },
  {
    "id": 229,
    "name": "doorclose"
  },
  {
    "id": 230,
    "name": "dooropenlarge"
  },
  {
    "id": 231,
    "name": "doorcloselarge"
  },
  {
    "id": 232,
    "name": "generate"
  },
  {
    "id": 233,
    "name": "mineWallSmall"
  },
  {
    "id": 234,
    "name": "mineSmall"
  },
  {
    "id": 235,
    "name": "mine"
  },
  {
    "id": 236,
    "name": "mineBig"
  },
  {
    "id": 237,
    "name": "mineHuge"
  },
  {
    "id": 238,
    "name": "mineImpact"
  },
  {
    "id": 239,
    "name": "mineImpactWave"
  },
  {
    "id": 240,
    "name": "payloadReceive"
  },
  {
    "id": 241,
    "name": "teleportActivate"
  },
  {
    "id": 242,
    "name": "teleport"
  },
  {
    "id": 243,
    "name": "teleportOut"
  },
  {
    "id": 244,
    "name": "ripple"
  },
  {
    "id": 245,
    "name": "bubble"
  },
  {
    "id": 246,
    "name": "launchAccelerator"
  },
  {
    "id": 247,
    "name": "launch"
  },
  {
    "id": 248,
    "name": "launchPod"
  },
  {
    "id": 249,
    "name": "healWaveMend"
  },
  {
    "id": 250,
    "name": "overdriveWave"
  },
  {
    "id": 251,
    "name": "healBlock"
  },
  {
    "id": 252,
    "name": "healBlockFull"
  },
  {
    "id": 253,
    "name": "rotateBlock"
  },
  {
    "id": 254,
    "name": "lightBlock"
  },
  {
    "id": 255,
    "name": "overdriveBlockFull"
  },
  {
    "id": 256,
    "name": "shieldBreak"
  },
  {
    "id": 257,
    "name": "arcShieldBreak"
  },
  {
    "id": 258,
    "name": "coreLandDust"
  },
  {
    "id": 259,
    "name": "podLandDust"
  },
  {
    "id": 260,
    "name": "unitShieldBreak"
  },
  {
    "id": 261,
    "name": "chainLightning"
  },
  {
    "id": 262,
    "name": "chainEmp"
  },
  {
    "id": 263,
    "name": "legDestroy"
  },
  {
    "id": 264,
    "name": "debugLine"
  },
  {
    "id": 265,
    "name": "debugRect"
  }
] as const;
