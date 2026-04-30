import {Generations, toID, Field} from '@smogon/calc';
//import {Sets, Teams} from '@pkmn/sets';
import * as dex from '@pkmn/dex';
import * as img from '@pkmn/img';
//import {Generations as DataGenerations, TypeName} from '@pkmn/data' ;
import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import Select from 'react-select';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow'

import { partyContext } from "./mons-container.js";
import { monDispatchContext } from "./App.js";

let context = React.createContext(null);

const typeColors = {
	normal: '#9FA19F',
	fire: '#E62829',
	water: '#2980EF',
	electric: '#FAC000',
	grass: '#3FA129',
	ice: '#3DCEF3',
	fighting: '#FF8000',
	poison: '#9141CB',
	ground: '#915121',
	flying: '#81B9EF',
	psychic: '#EF4179',
	bug: '#91A119',
	rock: '#AFA981',
	ghost: '#704170',
	dragon: '#5060E1',
	dark: '#624D4E',
	steel: '#60A1B8',
	fairy: '#EF70EF',
  //stellar: '#33D6F0',
  //stellar: 'conic-gradient(90deg, #EE3030, #b15b0c, #ffc746, #49b641, #33d6f0, #0a53a8, #c2558c, #ee3030)',
  stellar: 'conic-gradient(#fde144, #f7a519, #f5672b, #e34a6a, #c666ba, #8d49cb, #8362c1, #6f7ba6, #879eab, #5bb9e1, #33beea, #287ada, #345ac3, #4da2ba, #61d94c, #cbdc65, #e4e8c6, #e7cc9c, #fde144)',
};

const ChampionsLegalMoves = [
    '(No Move)',
    'Accelerock',
    'Acid Armor',
    'Acid Spray',
    'Acrobatics',
    'Acupressure',
    'Aerial Ace',
    'After You',
    'Agility',
    'Air Cutter',
    'Air Slash',
    'Alluring Voice',
    'Ally Switch',
    'Amnesia',
    'Ancient Power',
    'Apple Acid',
    'Aqua Cutter',
    'Aqua Jet',
    'Aqua Ring',
    'Aqua Step',
    'Aqua Tail',
    'Armor Cannon',
    'Aromatic Mist',
    'Assurance',
    'Attract',
    'Aura Sphere',
    'Aura Wheel',
    'Aurora Veil',
    'Avalanche',
    'Axe Kick',
    'Baby-Doll Eyes',
    'Baneful Bunker',
    'Baton Pass',
    'Beak Blast',
    'Beat Up',
    'Belch',
    'Belly Drum',
    'Bind',
    'Bite',
    'Bitter Blade',
    'Bitter Malice',
    'Blast Burn',
    'Blaze Kick',
    'Blizzard',
    'Block',
    'Body Press',
    'Body Slam',
    'Bone Rush',
    'Boomburst',
    'Bounce',
    'Brave Bird',
    'Breaking Swipe',
    'Brick Break',
    'Brutal Swing',
    'Bug Bite',
    'Bug Buzz',
    'Bulk Up',
    'Bulldoze',
    'Bullet Punch',
    'Bullet Seed',
    'Burn Up',
    'Burning Jealousy',
    'Calm Mind',
    'Ceaseless Edge',
    'Charge',
    'Charge Beam',
    'Charm',
    'Chilling Water',
    'Chilly Reception',
    'Circle Throw',
    'Clanging Scales',
    'Clangorous Soul',
    'Clear Smog',
    'Close Combat',
    'Coaching',
    'Coil',
    'Comeuppance',
    'Confuse Ray',
    'Copycat',
    'Corrosive Gas',
    'Cosmic Power',
    'Cotton Guard',
    'Cotton Spore',
    'Counter',
    'Covet',
    'Crabhammer',
    'Cross Chop',
    'Cross Poison',
    'Crunch',
    'Crush Claw',
    'Curse',
    'Dark Pulse',
    'Darkest Lariat',
    'Dazzling Gleam',
    'Decorate',
    'Defog',
    'Destiny Bond',
    'Detect',
    'Dig',
    'Dire Claw',
    'Disable',
    'Discharge',
    'Dive',
    'Double Hit',
    'Double Team',
    'Double-Edge',
    'Draco Meteor',
    'Dragon Cheer',
    'Dragon Claw',
    'Dragon Dance',
    'Dragon Darts',
    'Dragon Pulse',
    'Dragon Rush',
    'Dragon Tail',
    'Drain Punch',
    'Draining Kiss',
    'Drill Peck',
    'Drill Run',
    'Dual Wingbeat',
    'Dynamic Punch',
    'Earth Power',
    'Earthquake',
    'Eerie Impulse',
    'Eerie Spell',
    'Electric Terrain',
    'Electrify',
    'Electro Ball',
    'Electro Shot',
    'Electroweb',
    'Encore',
    'Endeavor',
    'Endure',
    'Energy Ball',
    'Entrainment',
    'Eruption',
    'Expanding Force',
    'Explosion',
    'Extrasensory',
    'Extreme Speed',
    'Facade',
    'Fairy Lock',
    'Fake Out',
    'Fake Tears',
    'Feather Dance',
    'Feint',
    'Fell Stinger',
    'Fickle Beam',
    'Fiery Dance',
    'Final Gambit',
    'Fire Blast',
    'Fire Fang',
    'Fire Lash',
    'Fire Punch',
    'Fire Spin',
    'First Impression',
    'Fissure',
    'Flail',
    'Flame Charge',
    'Flamethrower',
    'Flare Blitz',
    'Flash Cannon',
    'Flatter',
    'Fling',
    'Flip Turn',
    'Flower Trick',
    'Fly',
    'Flying Press',
    'Focus Blast',
    'Focus Energy',
    'Focus Punch',
    'Follow Me',
    'Forest\'s Curse',
    'Foul Play',
    'Freeze-Dry',
    'Frenzy Plant',
    'Frost Breath',
    'Future Sight',
    'Gastro Acid',
    'Giga Drain',
    'Giga Impact',
    'Gigaton Hammer',
    'Glare',
    'Grass Knot',
    'Grassy Glide',
    'Grassy Terrain',
    'Grav Apple',
    'Gravity',
    'Growth',
    'Guard Split',
    'Guard Swap',
    'Guillotine',
    'Gunk Shot',
    'Gyro Ball',
    'Hammer Arm',
    'Hard Press',
    'Haze',
    'Head Smash',
    'Headlong Rush',
    'Heal Bell',
    'Heal Pulse',
    'Healing Wish',
    'Heat Crash',
    'Heat Wave',
    'Heavy Slam',
    'Helping Hand',
    'Hex',
    'High Horsepower',
    'High Jump Kick',
    'Horn Drill',
    'Horn Leech',
    'Howl',
    'Hurricane',
    'Hydro Cannon',
    'Hydro Pump',
    'Hyper Beam',
    'Hyper Voice',
    'Hypnosis',
    'Ice Beam',
    'Ice Fang',
    'Ice Hammer',
    'Ice Punch',
    'Ice Shard',
    'Ice Spinner',
    'Icicle Crash',
    'Icicle Spear',
    'Icy Wind',
    'Imprison',
    'Infernal Parade',
    'Inferno',
    'Infestation',
    'Ingrain',
    'Instruct',
    'Iron Defense',
    'Iron Head',
    'Iron Tail',
    'Jet Punch',
    'King\'s Shield',
    'Knock Off',
    'Kowtow Cleave',
    'Lash Out',
    'Last Resort',
    'Last Respects',
    'Lava Plume',
    'Leaf Blade',
    'Leaf Storm',
    'Leech Life',
    'Leech Seed',
    'Life Dew',
    'Light Screen',
    'Light of Ruin',
    'Liquidation',
    'Lock-On',
    'Low Kick',
    'Low Sweep',
    'Lumina Crash',
    'Lunge',
    'Mach Punch',
    'Magic Powder',
    'Magic Room',
    'Magnet Rise',
    'Magnetic Flux',
    'Matcha Gotcha',
    'Mean Look',
    'Mega Kick',
    'Megahorn',
    'Memento',
    'Metal Burst',
    'Metal Sound',
    'Meteor Beam',
    'Meteor Mash',
    'Milk Drink',
    'Minimize',
    'Mirror Coat',
    'Misty Explosion',
    'Misty Terrain',
    'Moonblast',
    'Moonlight',
    'Morning Sun',
    'Mortal Spin',
    'Mountain Gale',
    'Mud Shot',
    'Mud-Slap',
    'Muddy Water',
    'Mystical Fire',
    'Nasty Plot',
    'Night Daze',
    'Night Shade',
    'Night Slash',
    'Noble Roar',
    'Nuzzle',
    'Outrage',
    'Overheat',
    'Pain Split',
    'Parabolic Charge',
    'Parting Shot',
    'Payback',
    'Perish Song',
    'Petal Blizzard',
    'Petal Dance',
    'Phantom Force',
    'Pin Missile',
    'Play Rough',
    'Pluck',
    'Poison Fang',
    'Poison Jab',
    'Poison Powder',
    'Pollen Puff',
    'Poltergeist',
    'Population Bomb',
    'Pounce',
    'Pound',
    'Power Gem',
    'Power Shift',
    'Power Split',
    'Power Swap',
    'Power Trick',
    'Power Trip',
    'Power Whip',
    'Protect',
    'Psych Up',
    'Psychic',
    'Psychic Fangs',
    'Psychic Noise',
    'Psychic Terrain',
    'Psycho Cut',
    'Psyshield Bash',
    'Psyshock',
    'Quash',
    'Quick Attack',
    'Quick Guard',
    'Quiver Dance',
    'Rage Powder',
    'Raging Bull',
    'Raging Fury',
    'Rain Dance',
    'Rapid Spin',
    'Razor Shell',
    'Recover',
    'Recycle',
    'Reflect',
    'Reflect Type',
    'Rest',
    'Reversal',
    'Rising Voltage',
    'Roar',
    'Rock Blast',
    'Rock Polish',
    'Rock Slide',
    'Rock Tomb',
    'Rock Wrecker',
    'Role Play',
    'Roost',
    'Round',
    'Sacred Sword',
    'Safeguard',
    'Salt Cure',
    'Sand Tomb',
    'Sandstorm',
    'Scald',
    'Scale Shot',
    'Scary Face',
    'Scorching Sands',
    'Screech',
    'Seed Bomb',
    'Seismic Toss',
    'Self-Destruct',
    'Shadow Ball',
    'Shadow Claw',
    'Shadow Punch',
    'Shadow Sneak',
    'Shed Tail',
    'Sheer Cold',
    'Shell Side Arm',
    'Shell Smash',
    'Shelter',
    'Simple Beam',
    'Sing',
    'Skill Swap',
    'Skitter Smack',
    'Sky Attack',
    'Slack Off',
    'Sleep Powder',
    'Sleep Talk',
    'Sludge Bomb',
    'Sludge Wave',
    'Smack Down',
    'Smart Strike',
    'Snap Trap',
    'Snarl',
    'Snore',
    'Snowscape',
    'Soak',
    'Soft-Boiled',
    'Solar Beam',
    'Solar Blade',
    'Sparkling Aria',
    'Speed Swap',
    'Spicy Extract',
    'Spikes',
    'Spiky Shield',
    'Spirit Shackle',
    'Spit Up',
    'Spite',
    'Spore',
    'Stealth Rock',
    'Steel Beam',
    'Steel Roller',
    'Steel Wing',
    'Sticky Web',
    'Stockpile',
    'Stomping Tantrum',
    'Stone Axe',
    'Stone Edge',
    'Stored Power',
    'Storm Throw',
    'Strength Sap',
    'String Shot',
    'Struggle',
    'Struggle Bug',
    'Stuff Cheeks',
    'Stun Spore',
    'Substitute',
    'Sucker Punch',
    'Sunny Day',
    'Super Fang',
    'Supercell Slam',
    'Superpower',
    'Surf',
    'Swagger',
    'Swallow',
    'Sweet Kiss',
    'Sweet Scent',
    'Switcheroo',
    'Swords Dance',
    'Synthesis',
    'Syrup Bomb',
    'Tail Slap',
    'Tailwind',
    'Taunt',
    'Tearful Look',
    'Teatime',
    'Teeter Dance',
    'Temper Flare',
    'Terrain Pulse',
    'Thief',
    'Thrash',
    'Throat Chop',
    'Thunder',
    'Thunder Fang',
    'Thunder Punch',
    'Thunder Wave',
    'Thunderbolt',
    'Tickle',
    'Tidy Up',
    'Torch Song',
    'Torment',
    'Toxic',
    'Toxic Spikes',
    'Toxic Thread',
    'Trailblaze',
    'Transform',
    'Tri Attack',
    'Trick',
    'Trick Room',
    'Trick-or-Treat',
    'Triple Arrows',
    'Triple Axel',
    'Trop Kick',
    'Twin Beam',
    'U-turn',
    'Upper Hand',
    'Uproar',
    'Vacuum Wave',
    'Venoshock',
    'Volt Switch',
    'Volt Tackle',
    'Water Pulse',
    'Water Shuriken',
    'Water Spout',
    'Waterfall',
    'Wave Crash',
    'Weather Ball',
    'Whirlpool',
    'Whirlwind',
    'Wide Guard',
    'Wild Charge',
    'Will-O-Wisp',
    'Wish',
    'Wonder Room',
    'Wood Hammer',
    'Worry Seed',
    'Wrap',
    'X-Scissor',
    'Yawn',
    'Zap Cannon',
    'Zen Headbutt',
];

const ChampionsLegalSpecies = [
  'Venusaur',
  'Venusaur-Mega',
  'Charizard',
  'Charizard-Mega-X',
  'Charizard-Mega-Y',
  'Blastoise',
  'Blastoise-Mega',
  'Beedrill',
  'Beedrill-Mega',
  'Pidgeot',
  'Pidgeot-Mega',
  'Arbok',
  'Pikachu',
  'Raichu',
  'Raichu-Alola',
  'Clefable',
  'Clefable-Mega',
  'Ninetales',
  'Ninetales-Alola',
  'Arcanine',
  'Arcanine-Hisui',
  'Alakazam',
  'Alakazam-Mega',
  'Machamp',
  'Victreebel',
  'Victreebel-Mega',
  'Slowbro',
  'Slowbro-Mega',
  'Slowbro-Galar',
  'Gengar',
  'Gengar-Mega',
  'Kangaskhan',
  'Kangaskhan-Mega',
  'Starmie',
  'Starmie-Mega',
  'Pinsir',
  'Pinsir-Mega',
  'Tauros',
  'Tauros-Paldea-Combat',
  'Tauros-Paldea-Blaze',
  'Tauros-Paldea-Aqua',
  'Gyarados',
  'Gyarados-Mega',
  'Ditto',
  'Vaporeon',
  'Jolteon',
  'Flareon',
  'Aerodactyl',
  'Aerodactyl-Mega',
  'Snorlax',
  'Dragonite',
  'Dragonite-Mega',
  'Meganium',
  'Meganium-Mega',
  'Typhlosion',
  'Typhlosion-Hisui',
  'Feraligatr',
  'Feraligatr-Mega',
  'Ariados',
  'Ampharos',
  'Ampharos-Mega',
  'Azumarill',
  'Politoed',
  'Espeon',
  'Umbreon',
  'Slowking',
  'Slowking-Galar',
  'Forretress',
  'Steelix',
  'Steelix-Mega',
  'Scizor',
  'Scizor-Mega',
  'Heracross',
  'Heracross-Mega',
  'Skarmory',
  'Skarmory-Mega',
  'Houndoom',
  'Houndoom-Mega',
  'Tyranitar',
  'Tyranitar-Mega',
  'Pelipper',
  'Gardevoir',
  'Gardevoir-Mega',
  'Sableye',
  'Sableye-Mega',
  'Aggron',
  'Aggron-Mega',
  'Medicham',
  'Medicham-Mega',
  'Manectric',
  'Manectric-Mega',
  'Sharpedo',
  'Sharpedo-Mega',
  'Camerupt',
  'Camerupt-Mega',
  'Torkoal',
  'Altaria',
  'Altaria-Mega',
  'Milotic',
  'Castform',
  'Castform-Sunny',
  'Castform-Rainy',
  'Castform-Snowy',
  'Banette',
  'Banette-Mega',
  'Chimecho',
  'Chimecho-Mega',
  'Absol',
  'Absol-Mega',
  'Glalie',
  'Glalie-Mega',
  'Torterra',
  'Infernape',
  'Empoleon',
  'Luxray',
  'Roserade',
  'Rampardos',
  'Bastiodon',
  'Lopunny',
  'Lopunny-Mega',
  'Spiritomb',
  'Garchomp',
  'Garchomp-Mega',
  'Lucario',
  'Lucario-Mega',
  'Hippowdon', 
  'Toxicroak',
  'Abomasnow',
  'Abomasnow-Mega',
  'Weavile',
  'Rhyperior',
  'Leafeon',
  'Glaceon',
  'Gliscor',
  'Mamoswine',
  'Gallade',
  'Gallade-Mega',
  'Froslass',
  'Froslass-Mega',
  'Rotom',
  'Rotom-Wash',
  'Rotom-Heat',
  'Rotom-Mow',
  'Rotom-Fan',
  'Rotom-Frost',
  'Serperior',
  'Emboar',
  'Emboar-Mega',
  'Samurott',
  'Samurott-Hisui',
  'Watchog',
  'Liepard',
  'Simisage',
  'Simisear',
  'Simipour',
  'Excadrill',
  'Excadrill-Mega',
  'Audino',
  'Audino-Mega',
  'Conkeldurr',
  'Whimsicott',
  'Krookodile',
  'Cofagrigus',
  'Garbodor',
  'Zoroark',
  'Zoroark-Hisui',
  'Reuniclus',
  'Vanilluxe',
  'Emolga',
  'Chandelure',
  'Chandelure-Mega',
  'Beartic',
  'Stunfisk',
  'Stunfisk-Galar',
  'Golurk',
  'Golurk-Mega',
  'Hydreigon',
  'Volcarona',
  'Chesnaught',
  'Chesnaught-Mega',
  'Delphox',
  'Delphox-Mega',
  'Greninja',
  'Greninja-Mega',
  'Diggersby',
  'Talonflame',
  'Vivillon',
  'Floette-Eternal',
  'Floette-Mega',
  'Florges',
  'Pangoro',
  'Furfrou',
  'Meowstic',
  'Meowstic-F',
  'Meowstic-M-Mega',
  'Meowstic-F-Mega',
  'Aegislash-Shield',
  'Aegislash-Blade',
  'Aegislash-Both',
  'Aromatisse',
  'Slurpuff',
  'Clawitzer',
  'Heliolisk',
  'Tyrantrum',
  'Aurorus',
  'Sylveon',
  'Hawlucha',
  'Hawlucha-Mega',
  'Dedenne',
  'Goodra',
  'Goodra-Hisui',
  'Klefki',
  'Trevenant',
  'Gourgeist',
  'Gourgeist-Small',
  'Gourgeist-Large',
  'Gourgeist-Super',
  'Avalugg',
  'Avalugg-Hisui',
  'Noivern',
  'Decidueye',
  'Decidueye-Hisui',
  'Incineroar',
  'Primarina',
  'Toucannon',
  'Crabominable',
  'Crabominable-Mega',
  'Lycanroc',
  'Lycanroc-Midnight',
  'Lycanroc-Dusk',
  'Toxapex',
  'Mudsdale',
  'Araquanid',
  'Salazzle',
  'Tsareena',
  'Oranguru',
  'Passimian',
  'Mimikyu',
  'Drampa',
  'Drampa-Mega',
  'Kommo-o',
  'Corviknight',
  'Flapple',
  'Appletun',
  'Sandaconda',
  'Polteageist',
  'Hatterene',
  'Mr. Rime',
  'Runerigus',
  'Alcremie',
  'Morpeko',
  'Dragapult',
  'Wyrdeer',
  'Kleavor',
  'Basculegion',
  'Basculegion-F',
  'Sneasler',
  'Meowscarada',
  'Skeledirge',
  'Quaquaval',
  'Maushold',
  'Garganacl',
  'Armarouge',
  'Ceruledge',
  'Bellibolt',
  'Scovillain',
  'Scovillain-Mega',
  'Espathra',
  'Tinkaton',
  'Palafin',
  'Palafin-Hero',
  'Orthworm',
  'Glimmora',
  'Glimmora-Mega',
  'Farigiraf',
  'Kingambit',
  'Sinistcha',
  'Archaludon',
  'Hydrapple'
];

function iconIndexToCoords(num) {
  const top = -Math.floor(num / 12) * 30;
  const left = -(num % 12) * 40;
  return { top: top, left: left };
}

function speciesIconExceptions(name) {
  if (name === "Vanilluxe") { return iconIndexToCoords(584); }
  if (name === "Absol") { return iconIndexToCoords(359); }
  if (name === "Absol-Mega") { return iconIndexToCoords(1354); }
  if (name === "Tsareena") { return iconIndexToCoords(763); }
  if (name === "Torterra") { return iconIndexToCoords(389); }
  if (name === "Sylveon") { return iconIndexToCoords(700); }
  if (name === "Simisear") { return iconIndexToCoords(514); }
  if (name === "Scovillain-Mega") { return iconIndexToCoords(1446); }
  if (name === "Rotom-Wash") { return iconIndexToCoords(1084); }
  if (name === "Roserade") { return iconIndexToCoords(407); }
  if (name === "Politoed") { return iconIndexToCoords(186); }
  if (name === "Meowstic-M-Mega") { return iconIndexToCoords(1440); }
  if (name === "Meowstic-F-Mega") { return iconIndexToCoords(1440); }
  if (name === "Klefki") { return iconIndexToCoords(707); }
  if (name === "Greninja") { return iconIndexToCoords(658); }
  if (name === "Golurk") { return iconIndexToCoords(623); }
  if (name === "Golurk-Mega") { return iconIndexToCoords(1439); }
  if (name === "Glimmora-Mega") { return iconIndexToCoords(1447); }
  if (name === "Garbodor") { return iconIndexToCoords(569); }
  if (name === "Excadrill") { return iconIndexToCoords(530); }
  if (name === "Emboar") { return iconIndexToCoords(500); }
  if (name === "Crabominable-Mega") { return iconIndexToCoords(1441); }
  if (name === "Clefable") { return iconIndexToCoords(36); }
  if (name === "Clawitzer") { return iconIndexToCoords(693); }
  if (name === "Chimecho-Mega") { return iconIndexToCoords(1432); }
  if (name === "Castform-Snowy") { return iconIndexToCoords(1068); }
  if (name === "Aegislash-Shield") { return iconIndexToCoords(681); }
  if (name === "Aegislash-Both") { return iconIndexToCoords(681); }
  return { top: img.Icons.getPokemon(name).top.toString(), left: img.Icons.getPokemon(name).left.toString() };
}

const gen = Generations.get(9);
console.log(gen);

const speciesDex = dex.Dex.forGen(9);
console.log(speciesDex);
const ev_names = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];
const stat_names = {
  hp: "HP",
  atk: "Atk",
  def: "Def",
  spa: "SpA",
  spd: "SpD",
  spe: "Spe"
};
const statList = ["hp", "atk", "def", "spa", "spd", "spe"];
const boostList = ["+6", "+5", "+4", "+3", "+2", "+1", "--", "-1", "-2", "-3", "-4", "-5", "-6"];
const boostValues = [6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6];


var sortedTypes = [];
for (const id of gen.types) {
  if (id.name !== "???"){
    sortedTypes.push(id.name);
  }
}
sortedTypes.sort(function(a, b) {
  if (a.toUpperCase() > b.toUpperCase()) { return 1; }
  else if (a.toUpperCase() < b.toUpperCase()) { return -1; }
  return 0;
})

var sortedItems = [];
for (const id of gen.items) {
  sortedItems.push(id.name);
}
sortedItems.sort(function(a, b) {
  if (a.toUpperCase() > b.toUpperCase()) { return 1; }
  else if (a.toUpperCase() < b.toUpperCase()) { return -1; }
  return 0;
})
sortedItems.unshift("(no item)");

/*
var sortedMoves = [];
for (const id of gen.moves) {
  sortedMoves.push(id.name);
}
sortedMoves.sort(function(a, b) {
  if (a.toUpperCase() > b.toUpperCase()) { return 1; }
  else if (a.toUpperCase() < b.toUpperCase()) { return -1; }
  return 0;
})
*/
var sortedMoves = ChampionsLegalMoves;

var sortedMons = [];
//for (const id of speciesDex.species.all()) {
//for (const id of gen.species) {
for (const id of ChampionsLegalSpecies) {
    //if (id.name !== "Xerneas-Neutral" && id.name !== "Eevee-Starter" && id.name !== "Pikachu-Starter" && id.name !== "MissingNo." && !id.name.includes("Pokestar") &&
    //    id.name !== "Pikachu-Belle" && !id.name.includes("Rock-Star") && !id.name.includes("Pop-Star") && !id.name.includes("PhD") && !id.name.includes("Partner") &&
    //    !id.name.includes("Cosplay") && !id.name.includes("Libre") && !id.name.includes("Spiky-eared")){
    //    sortedMons.push(id.name);
    //}
    sortedMons.push(id);
}
sortedMons.sort(function(a, b) {
  if (a.toUpperCase() > b.toUpperCase()) { return 1; }
  else if (a.toUpperCase() < b.toUpperCase()) { return -1;}
  return 0;
});

var sortedAbilities = [];
for (const id of gen.abilities) {
  sortedAbilities.push(id.name);
}
sortedAbilities.sort(function(a, b) {
  if (a.toUpperCase() > b.toUpperCase()) { return 1; }
  else if (a.toUpperCase() < b.toUpperCase()) { return -1;}
  return 0;
});

// takes move information and returns background color + img icon src
function moveGraphicData(type, teratype, teraactive) {
  //var m = result.move;
  //var a = result.attacker;
  //var moveType = result.move.type.toLowerCase();
  const moveType = type.toLowerCase();
  var background = "";

  // move background
  if ((teraactive && teratype === "Stellar") || (teraactive && moveType === teratype.toLowerCase()))
  {
    var baseColor = typeColors[moveType];
    var shineColor = "#".concat(Math.round((255-parseInt(baseColor.substring(1, 3), 16))*0.5 + parseInt(baseColor.substring(1, 3), 16)).toString(16))
                        .concat(Math.round((255-parseInt(baseColor.substring(3, 5), 16))*0.5 + parseInt(baseColor.substring(3, 5), 16)).toString(16))
                        .concat(Math.round((255-parseInt(baseColor.substring(5, 7), 16))*0.5 + parseInt(baseColor.substring(5, 7), 16)).toString(16));
    if (moveType !== "stellar")
    {
      background = "conic-gradient(from -75deg, "
                    .concat(baseColor).concat(", ")
                    .concat(shineColor).concat(", ")
                    .concat(baseColor).concat(", ")
                    .concat(shineColor).concat(", ")
                    .concat(baseColor).concat(")");
    }
    else{
      background = baseColor;
    }
  }
  else
  {
    background = typeColors[moveType];
  }

  var imgSrc = "";
  // img icon src
  if ((teratype === "Stellar" && moveType !== "stellar" && teraactive) || (teraactive && moveType === teratype.toLowerCase() && moveType !== "stellar"))
  {
    if (teratype === "Stellar")
    {
      imgSrc = process.env.PUBLIC_URL + "/img/stellar_icon.png";
    }
    else
    {
      imgSrc = process.env.PUBLIC_URL + "/img/tera_" + moveType + "_icon_color.png";
    }
  }
  else {
    imgSrc = process.env.PUBLIC_URL + "/img/" + moveType + "_icon.png";
  }

  return {
    background: background,
    imgSrc: imgSrc,
  }
}



// ITEM SELECTOR
  function ItemIcon({ monID, monUniqueID }) {
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;

    const itemName = mons[pC.containerIndex][monID].item;
    
    const imgSrcMemo = useMemo(() => {
      return "transparent url(".concat(img.Icons.getItem(itemName).url)
                              .concat(") no-repeat scroll ")
                              .concat(img.Icons.getItem(itemName).left.toString())
                              .concat("px ")
                              .concat(img.Icons.getItem(itemName).top.toString())
                              .concat("px");
    }, [itemName]);
    return (
      <object src="//:0" alt=" " style={{
        width: "24px",
        height: "24px",
        display: "inline-block",
        imageRendering: "pixelated",
        border: "0",
        background: imgSrcMemo,
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "5px",
        marginRight: "5px",
      }}></object>
    );
  }
  function ItemDropdown({ monID, monUniqueID }) {
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;
  
    const options = useMemo(() => sortedItems.map((item, index) =>
      <option value={item} key={monUniqueID+"item"+index}>{item}</option>
    ), []);

    return (
      <select value={mons[pC.containerIndex][monID].item} onChange={(e) => { setTotalMons({ containerIndex: pC.containerIndex, type: "updateItem", item: e.target.value, index: monID }); }}>
        {options}
      </select>
    );
  }
  function ItemSelector({ monID, monUniqueID }) {
    const sideCode = useContext(partyContext).sideCodeMemo;

    return (
      <div style={{display: "flex", "lineHeight": "34px"}}>Item: <ItemIcon key={monUniqueID + "itemicon"} monID={monID} monUniqueID={monUniqueID}></ItemIcon><ItemDropdown key={monUniqueID + "itempicker"} monID={monID} monUniqueID={monUniqueID}></ItemDropdown></div>
    );
  }
  


  // MOVE SELECTORS
  function MoveIcon({ moveNum, monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    // COME BACK AND ADD THE FIELD
    const moveNumMemo = useMemo(() => moveNum, [moveNum]);
    const moves = mons[pC.containerIndex][monID].moves;
    const species = mons[pC.containerIndex][monID].species;
    const teraType = mons[pC.containerIndex][monID].teraType;
    const teraActive = mons[pC.containerIndex][monID].teraActive;
    const moveGraphicDataMemo = useCallback((type, teratype, teraactive) => moveGraphicData(type, teratype, teraactive), []);
    const moveTypeGetMemo = useCallback((move) => gen.moves.get(toID(move)).type, []);
    const monTypeGetMemo = useCallback((species, index) => gen.species.get(toID(species)).types[index], []);

    const graphicDataMemo = useMemo(() => {
      var graphicData;
      if (moves[moveNumMemo] !== "(No Move)"){
          //var dummyMon = new Pokemon(gen, speciesMemo, { teraType: (teraActiveMemo) ? teraTypeMemo : undefined });
          //dummyMon.moves = [];
          const moveType = ((!species.includes("Terapagos-Stellar") || moves[moveNumMemo] !== "Tera Starstorm") ? // if species isnt terapagos and the move isnt tera starstorm, do the top option
            ((!species.includes("Ogerpon") || moves[moveNumMemo] !== "Ivy Cudgel") ? // if species isnt an ogerpon and the move isnt ivy cudgel, do the top option
              ((moves[moveNumMemo] === "Tera Blast" && teraActive) ? // if using terablast with tera active, do the top option
                teraType :
                moveTypeGetMemo(moves[moveNumMemo])) :
              (((species.includes("Teal")) || !species.includes("-")) ? // if this is an ogerpon ivy cudgel + is either the teal tera or base form, to the top option
                "Grass" :
                monTypeGetMemo(species, 1))) :
            "Stellar");
          //const fakeCalc = calculate(gen, dummyMon, new Pokemon(gen, "Kricketot"), new Move(gen, moveMemo, { isStellarFirstUse: (teraActiveMemo && teraTypeMemo === "Stellar") ? true : false, }));
          graphicData = moveGraphicDataMemo(moveType, teraType, teraActive);
      }
      else{
          graphicData = {
              background: "transparent",
              imgSrc: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
          }
      }
      return graphicData;
    }, [species, teraType, teraActive, moves, moveNumMemo, monTypeGetMemo, moveTypeGetMemo, moveGraphicDataMemo]);
  
    return (
        <div style={{ marginLeft: "auto", position: "relative", background: graphicDataMemo["background"], top: "0px", width: "30px", height: "30px"}}><img src={graphicDataMemo["imgSrc"]} style={{top: "0px", left: "0px", width: "30px", height: "30px"}} alt=""></img></div>
    );
  }
  function MoveDropdown({ moveNum, monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;
    const options = useMemo(() => sortedMoves.map((move, index) =>
      <option value={move} key={monUniqueID+"move"+moveNum+"choice"+index}>{move}</option>
    ), []);
    const moveNumMemo = useMemo(() => moveNum, [moveNum]);

    return (
      <select value={mons[pC.containerIndex][monID].moves[moveNumMemo]} style={{ marginRight: "auto", position: "relative" }} onChange={(e) => { var movesTemp = {
          1: mons[pC.containerIndex][monID].moves["1"],
          2: mons[pC.containerIndex][monID].moves["2"],
          3: mons[pC.containerIndex][monID].moves["3"],
          4: mons[pC.containerIndex][monID].moves["4"],
      }; movesTemp[moveNumMemo.toString()] = e.target.value; setTotalMons({ containerIndex: pC.containerIndex, type: "updateMoves", moves: movesTemp, index: monID }); }}>
        { options }
      </select>
    );
  }
  function MoveSelector({ moveNum, monID, monUniqueID }) {
    const moveNumMemo = useMemo(() => moveNum, [moveNum]);
    const sideCode = useContext(partyContext).sideCodeMemo;
  
    return (
        <div style={{display: "flex", "lineHeight": "30px"}}><MoveIcon key={monUniqueID + "moveicon" + moveNumMemo.toString()} moveNum={moveNumMemo} monID={monID} monUniqueID={monUniqueID}></MoveIcon><MoveDropdown key={monUniqueID + "movepicker" + moveNumMemo.toString()} moveNum={moveNumMemo} monID={monID} monUniqueID={monUniqueID}></MoveDropdown></div>
    );
  }
  

  // SPECIES SELECTOR
  function SpeciesIcon({ monID, monUniqueID }){
    //const monStateStore = useMemo(() => ms, [ms]);
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;

    const species = mons[pC.containerIndex][monID].species;

    const imgSrcMemo = useMemo(() => {
        var imgData = speciesIconExceptions(species);
        return "transparent url(".concat(img.Icons.getPokemon(species).url)
                        .concat(") no-repeat scroll ")
                        .concat(imgData.left)
                        .concat("px ")
                        .concat(imgData.top)
                        .concat("px");
    }, [species]);
    //const imgSrcMemo = useMemo(() => {
    //return "transparent url(".concat(img.Icons.getPokemon(species).url)
    //                  .concat(") no-repeat scroll ")
    //                  .concat(img.Icons.getPokemon(species).left.toString())
    //                  .concat("px ")
    //                  .concat(img.Icons.getPokemon(species).top.toString())
    //                  .concat("px");},
    //[species]);
    return (
      <object src="//:0" alt=" " style={{
        width: "40px",
        height: "30px",
        display: "inline-block",
        imageRendering: "pixelated",
        border: "0",
        background: imgSrcMemo,
      }}></object>
    );
  }
  function SpeciesDropdown({ monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;
    const options = useMemo(() => sortedMons.map((specie, index) =>
      //<option value={specie} key={index}>{specie}</option>
      new Object({
        value: specie,
        label: specie,
        key: monUniqueID+"specie"+index,
      })
    ), []);
    const sideCode = useContext(partyContext).sideCodeMemo;

    return (
      <Select key={monUniqueID + "speciesselect"} menuPosition="fixed" options={options} classNamePrefix="species" value={options.find(x => x.value === mons[pC.containerIndex][monID].species)} onChange={(o) => { setTotalMons({ containerIndex: pC.containerIndex, type: "updateSpecies", species: o.value, index: monID }); }} onSelectResetsInput={false} menuPortalTarget={document.body}
      
      styles={{
        container: (baseStyles, state) => ({
          ...baseStyles,
          lineHeight: "30px",
          height: "30px",
        }),
        
        control: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: "rgba(209, 222, 232, 0.8)",
          borderRadius: "5px",
          border: "1px solid rgba(209, 222, 232, 1)",
          // height: "25px",
          minHeight: "30px",
          width: "200px",
          lineHeight: "30px",
          height: "30px",
          fontSize: "0.8em",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        }),

        valueContainer: (baseStyles, state) => ({
          ...baseStyles,
          height: "30px",
          color: "black",
          //lineHeight: "25px",
          textAlign: "left",
          padding: "0px 8px",
          //alignItems: "start",
        }),

        singleValue: (baseStyles, state) => ({
          ...baseStyles,
          color: "black",
          fontSize: "1em",
          height: "30px",
        }),

        indicatorsContainer: (baseStyles, state) => ({
          ...baseStyles,
          //lineHeight: "25px",
          height: "30px",
        }),

        dropdownIndicator: (baseStyles, state) => ({
          ...baseStyles,
          color: "black",
          height: "30px",
          width: "30px",
          alignItems: "center",
        }),

        indicatorSeparator: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: "black",
        }),

        menuPortal: (baseStyles, state) => ({
          ...baseStyles,
          zIndex: 9999,
        }),

        menu: (baseStyles, state) => ({
          ...baseStyles,
        }),

        menuList: (baseStyles, state) => ({
          ...baseStyles,
          "::-webkit-scrollbar": {
              width: "4px",
          },
          scrollbarWidth: "thin",
        }),

        option: (baseStyles, state) => ({
          ...baseStyles,
          color: "black",
          height: "30px",
          lineHeight: "20px",
          fontSize: "0.77em",
        }),

        input: (baseStyles, state) => ({
          ...baseStyles,
          input: {
            opacity: "1 !important",
          },
          lineHeight: "15px",
        })
      }} />
    );
  }
  function SpeciesSelector({ monID, monUniqueID }) {
    const sideCode = useContext(partyContext).sideCodeMemo;

    return (
      <div style={{display: "flex", "lineHeight": "34px"}}><SpeciesIcon key={monUniqueID + "speciesicon"} monID={monID} monUniqueID={monUniqueID}></SpeciesIcon><SpeciesDropdown key={monUniqueID + "speciespicker"} monID={monID} monUniqueID={monUniqueID}></SpeciesDropdown></div>
    );
  }



  // ABILITY SELECTOR
  function AbilityDropdown({ monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;

    const options = useMemo(() => sortedAbilities.map((abil, index) =>
        <option value={abil} key={monUniqueID+"ability"+index}>{abil}</option>
    ), []);

    return (
        <select value={mons[pC.containerIndex][monID].ability} style={{marginLeft: "10px", marginRight: "auto"}} onChange={(e) => { setTotalMons({ containerIndex: pC.containerIndex, type: "updateAbility", ability: e.target.value, index: monID }); }}>
            {options}
        </select>
    )
  }
  function AbilitySelector({ monID, monUniqueID }) {
    const sideCode = useContext(partyContext).sideCodeMemo;

    return (
        <div style={{display: "flex"}}>Ability: <AbilityDropdown key={monUniqueID + "abilitypicker"} monID={monID} monUniqueID={monUniqueID}></AbilityDropdown></div>
    );
  }


  // NATURE SELECTOR
  function NatureDropdown({ monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;
    
    const options = useMemo(() => Array.from(gen.natures).map((nat, index) =>
        <option value={nat.name} key={monUniqueID+"nature"+index}>{nat.name+((gen.natures.get(toID(nat.name)).plus !== gen.natures.get(toID(nat.name)).minus) ? " (+"+stat_names[gen.natures.get(toID(nat.name)).plus]+", -"+stat_names[gen.natures.get(toID(nat.name)).minus]+")" : "")}</option>
    ), []);

    return (
        <select value={mons[pC.containerIndex][monID].nature} style={{marginLeft: "10px", marginRight: "auto"}} onChange={(e) => { setTotalMons({ containerIndex: pC.containerIndex, type: "updateNature", nature: e.target.value, index: monID }); }}>
            {options}
        </select>
    )
  }
  function NatureSelector({ monID, monUniqueID }) {
    const sideCode = useContext(partyContext).sideCodeMemo;

    return (
        <div style={{display: "flex"}}>Nature: <NatureDropdown key={monUniqueID + "naturepicker"} monID={monID} monUniqueID={monUniqueID}></NatureDropdown></div>
    );
  }

  function StatusDropdown({ monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;

    const options = useMemo((() => [{disp: "(none)", value: ""},
                                    {disp: "Burned", value: "brn"},
                                    {disp: "Poisoned", value: "psn"},
                                    {disp: "Badly Poisoned", value: "tox"},
                                    {disp: "Paralyzed", value: "par"},
                                    {disp: "Asleep", value: "slp"},
                                    {disp: "Frozen", value: "frz"}].map((s, index) =>
      <option value={s.value} key={monUniqueID+"status"+index}>{s.disp}</option>
    )), []);

    return (
      <select value={mons[pC.containerIndex][monID].status} style={{marginLeft: "10px", marginRight: "auto"}} onChange={(e) => { setTotalMons({ containerIndex: pC.containerIndex, type: "updateStatus", status: e.target.value, index: monID }); }}>
        {options}
      </select>
    );
  }
  function StatusSelector({ monID, monUniqueID }){
    const sideCode = useContext(partyContext).sideCodeMemo;

    return (
      <div style={{display: "flex"}}>Status: <StatusDropdown key={monUniqueID + "statuspicker"} monID={monID} monUniqueID={monUniqueID}></StatusDropdown></div>
    );
  }



  // TERA TYPE SELECTOR
  function TeraIcon({ monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const teraType = mons[pC.containerIndex][monID].teraType;
    const imgSrcMemo = useMemo(() => process.env.PUBLIC_URL + "/img/tera_" + teraType.toLowerCase() + "_gem.png", [teraType]);
    
    return (
        <img src={imgSrcMemo} alt="" style={{
          width: "30px",
          height: "30px",
          marginLeft: "5px",
          marginRight: "5px",
        }}></img>
      );
  }
  function TeraDropdown({ monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;

    const options = sortedTypes.map((t, index) =>
        <option value={t} key={monUniqueID+"teratype"+index}>{t}</option>
    );

    return (
        <select value={mons[pC.containerIndex][monID].teraType} onChange={(e) => { setTotalMons({ containerIndex: pC.containerIndex, type: "updateTeraType", teraType: e.target.value, index: monID }); }}>
            {options}
        </select>
    );
  }
  function TeraToggle({ monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;

    return (
        <input type="checkbox" onChange={(e) => { setTotalMons({ containerIndex: pC.containerIndex, type: "updateTeraActive", teraActive: e.target.checked, index: monID }); }} checked={mons[pC.containerIndex][monID].teraActive}></input>
    );
  }
  function TeraTypeSelector({ monID, monUniqueID }){
    const sideCode = useContext(partyContext).sideCodeMemo;

    return (
        <div style={{display: "flex", "lineHeight": "30px"}}>Tera Type: <TeraIcon key={monUniqueID + "teraicon"} monID={monID} monUniqueID={monUniqueID}></TeraIcon><TeraDropdown key={monUniqueID + "terapicker"} monID={monID} monUniqueID={monUniqueID}></TeraDropdown><TeraToggle key={monUniqueID + "teratoggle"} monID={monID} monUniqueID={monUniqueID}></TeraToggle></div>
    );
  }


  
  // STATS TABLE
  function EVInput({ stat, monID, monUniqueID }){
    //const monStateStore = useMemo(() => ms, [ms]);
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;

    const monIDMemo = useMemo(() => monID, [monID]);
    const statMemo = useMemo(() => stat, [stat]);

    return (
        <input default="0" pattern="[0-9]*" min="0" max="32" step="1" type="number" placeholder="0" onChange={(e) => { var evsTemp = {
          hp: mons[pC.containerIndex][monIDMemo].EVs["hp"],
          atk: mons[pC.containerIndex][monIDMemo].EVs["atk"],
          def: mons[pC.containerIndex][monIDMemo].EVs["def"],
          spa: mons[pC.containerIndex][monIDMemo].EVs["spa"],
          spd: mons[pC.containerIndex][monIDMemo].EVs["spd"],
          spe: mons[pC.containerIndex][monIDMemo].EVs["spe"],
      }; evsTemp[statMemo] = Math.min(Math.max((e.target.value !== "") ? parseInt(e.target.value) : 0, 0), 32); setTotalMons({ containerIndex: pC.containerIndex, type: "updateEVs", EVs: evsTemp, index: monIDMemo }); }} value={Math.min(Math.max(mons[pC.containerIndex][monIDMemo].EVs[statMemo], 0), 32)}></input>
    );
  }
  function IVInput({ stat, monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;

    const statMemo = useMemo(() => stat, [stat]);
    const monIDMemo = useMemo(() => monID, [monID]);

    return (
        <input default="0" pattern="[0-9]*" min="0" max="31" step="1" type="number" placeholder="31" onChange={(e) => { var ivsTemp = {
          hp: mons[pC.containerIndex][monIDMemo].IVs["hp"],
          atk: mons[pC.containerIndex][monIDMemo].IVs["atk"],
          def: mons[pC.containerIndex][monIDMemo].IVs["def"],
          spa: mons[pC.containerIndex][monIDMemo].IVs["spa"],
          spd: mons[pC.containerIndex][monIDMemo].IVs["spd"],
          spe: mons[pC.containerIndex][monIDMemo].IVs["spe"],
      }; ivsTemp[statMemo] = Math.min(Math.max((e.target.value !== "") ? parseInt(e.target.value) : 0, 0), 31); setTotalMons({ containerIndex: pC.containerIndex, type: "updateIVs", IVs: ivsTemp, index: monIDMemo }); }} value={Math.min(Math.max(mons[pC.containerIndex][monIDMemo].IVs[statMemo], 0), 31)}></input>
    );
  }
  function BoostDropdown({ stat, monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;
    var options = boostList.map((boost, index) => 
        <option value={boostValues[index]} key={monUniqueID+stat+"boost"+index}>{boost}</option>
    );

    const statMemo = useMemo(() => stat, [stat]);
    const monIDMemo = useMemo(() => monID, [monID]);

    return (
        <select value={mons[pC.containerIndex][monIDMemo].boosts[statMemo]} onChange={(e) => { var boostsTemp = {
          hp: mons[pC.containerIndex][monIDMemo].boosts["hp"],
          atk: mons[pC.containerIndex][monIDMemo].boosts["atk"],
          def: mons[pC.containerIndex][monIDMemo].boosts["def"],
          spa: mons[pC.containerIndex][monIDMemo].boosts["spa"],
          spd: mons[pC.containerIndex][monIDMemo].boosts["spd"],
          spe: mons[pC.containerIndex][monIDMemo].boosts["spe"],
      }; boostsTemp[statMemo] = parseInt(e.target.value); setTotalMons({ containerIndex: pC.containerIndex, type: "updateBoosts", boosts: boostsTemp, index: monIDMemo }); }}>
            {options}
        </select>
    );
  }
  function StatsTableRow({ stat, statIndex, gameType, monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const sideCode = useContext(partyContext).sideCodeMemo;

    const statMemo = useMemo(() => stat, [stat])
    const statIndexMemo = useMemo(() => statIndex, [statIndex]);
    const gameTypeMemo = useMemo(() => gameType, [gameType]);
    const monIDMemo = useMemo(() => monID, [monID]);
    
    var boostPickerNoHP = (statMemo !== "hp") ? <td><BoostDropdown key={monUniqueID + "boost" + statMemo}  stat={statMemo} monID={monIDMemo} ></BoostDropdown></td> : <td></td>;

    const evs = mons[pC.containerIndex][monIDMemo].EVs;
    const ivs = mons[pC.containerIndex][monIDMemo].IVs;
    const nature = mons[pC.containerIndex][monIDMemo].nature;
    const boosts = mons[pC.containerIndex][monIDMemo].boosts;
    const baseStats = gen.species.get(toID(mons[pC.containerIndex][monIDMemo].species)).baseStats;
    const plus = useMemo(() => gen.natures.get(toID(nature)).plus, [nature]);
    const minus = useMemo(() => gen.natures.get(toID(nature)).minus, [nature]);

    const statNumMemo = useMemo(() => {
    var level = (gameTypeMemo === "Doubles") ? 50 : 100;
    //const statFirstStep = Math.floor((2 * baseStats[statMemo] + ivs[statMemo] + Math.floor(evs[statMemo])) * level / 100)
    const natureMod = (plus === statMemo && plus !== minus) ? 1.1 : ((minus === statMemo && minus !== plus) ? 0.9 : 1);
    //const statSecondStep = (statMemo === "hp") ? statFirstStep + level + 10 : (statFirstStep + 5) * natureMod;
    //var dummyMon = new Pokemon(gen, speciesMemo, {evs: evMemoObj, ivs: ivMemoObj, ability: abilityMemo, nature: natureMemo});
    //var statNum = Math.floor(statSecondStep * (2+Math.max(0, boosts[statMemo]))/(2-Math.min(0, boosts[statMemo])));
    var statNum = (statMemo === "hp") ? baseStats[statMemo] + evs[statMemo] + 75 : Math.floor((baseStats[statMemo]+evs[statMemo]+20)*natureMod);
    return statNum;
    }, [baseStats, nature, ivs, evs, boosts, statMemo, gameTypeMemo]);

    return (
        <tr><td style={{color: (statMemo === minus && minus !== plus) ? "#1680f6" : ((statMemo === plus && plus !== minus) ? "#ff5a84": "#ffd21f")}}>{ev_names[statIndexMemo]}: </td><td><EVInput key={monUniqueID + "EV" + statMemo}  stat={statMemo} monID={monIDMemo} monUniqueID={monUniqueID}></EVInput></td>{boostPickerNoHP}<td><b>{statNumMemo}</b></td></tr>
    );
  }
  function StatsTable({ gameType, monID, monUniqueID }){
    const gameTypeMemo = useMemo(() => gameType, [gameType]);
    const monIDMemo = useMemo(() => monID, [monID]);
    const sideCode = useContext(partyContext).sideCodeMemo;

    //const rows = statList.map((stat, index) =>
    //    <StatsTableRow stat={stat} statIndex={index} key={sideCode + monID.toString() + stat}  gameType={gameTypeMemo} monID={monID} ></StatsTableRow>
    //);

    return (
        <table>
            <tbody>
                <StatsTableRow stat={"hp"} statIndex={0} key={monUniqueID + "hp"}  gameType={gameTypeMemo} monID={monIDMemo} monUniqueID={monUniqueID}></StatsTableRow>
                <StatsTableRow stat={"atk"} statIndex={1} key={monUniqueID + "atk"}  gameType={gameTypeMemo} monID={monIDMemo} monUniqueID={monUniqueID}></StatsTableRow>
                <StatsTableRow stat={"def"} statIndex={2} key={monUniqueID + "def"}  gameType={gameTypeMemo} monID={monIDMemo} monUniqueID={monUniqueID}></StatsTableRow>
                <StatsTableRow stat={"spa"} statIndex={3} key={monUniqueID + "spa"}  gameType={gameTypeMemo} monID={monIDMemo} monUniqueID={monUniqueID}></StatsTableRow>
                <StatsTableRow stat={"spd"} statIndex={4} key={monUniqueID + "spd"}  gameType={gameTypeMemo} monID={monIDMemo} monUniqueID={monUniqueID}></StatsTableRow>
                <StatsTableRow stat={"spe"} statIndex={5} key={monUniqueID + "spe"}  gameType={gameTypeMemo} monID={monIDMemo} monUniqueID={monUniqueID}></StatsTableRow>
            </tbody>
        </table>
    );
  }

  // NOTES INPUT
  function NotesInput({ monID, monUniqueID }){
    const pC = useContext(partyContext);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;
    
    return (
        <div style={{display: "flex"}}>Notes: <input style={{ marginLeft: "10px" }} onBlur={(e) => { setTotalMons({ containerIndex: pC.containerIndex, type: "updateNotes", notes: e.target.value, index: monID }); }} defaultValue={mons[pC.containerIndex][monID].notes}></input></div>
    );
  }

  // MAIN PANEL
  export function PokemonPanel({ monID, monSide, monUniqueID }) {
    var pC = useContext(partyContext);

    const sideCode = useMemo(() => monSide, [monSide]);
    
    return (
      <div style={{display: "flex", textAlign: "center"}}>
        <div>
          <div style={{paddingTop: "1px", paddingBottom: "1px"}}><SpeciesSelector key={monUniqueID + "species"} monID={monID} monUniqueID={monUniqueID}></SpeciesSelector></div>
          <div style={{paddingTop: "1px", paddingBottom: "1px"}}><NatureSelector key={monUniqueID + "nature"} monID={monID} monUniqueID={monUniqueID}></NatureSelector></div>
          <div style={{paddingTop: "1px", paddingBottom: "1px"}}><AbilitySelector key={monUniqueID + "ability"} monID={monID} monUniqueID={monUniqueID}></AbilitySelector></div>
          <div style={{paddingTop: "1px", paddingBottom: "1px"}}><ItemSelector key={monUniqueID + "item"} monID={monID} monUniqueID={monUniqueID}></ItemSelector></div>
          <StatsTable key={monUniqueID + "stats"}  gameType={pC.gameTypeMemo} monID={monID} monUniqueID={monUniqueID}></StatsTable>
          <div style={{paddingTop: "1px", paddingBottom: "1px"}}><StatusSelector key={monUniqueID + "status"} monID={monID} monUniqueID={monUniqueID}></StatusSelector></div>
          <NotesInput key={monUniqueID + "notes"} monID={monID} monUniqueID={monUniqueID}></NotesInput>
          { (sideCode === "attacker") && (
          <div>
            <p></p>
            <div><MoveSelector key={monUniqueID + "move1"} id={"Move1-" + monUniqueID} moveNum={1} monID={monID} monUniqueID={monUniqueID}></MoveSelector></div>
            <div><MoveSelector key={monUniqueID + "move2"} id={"Move2-" + monUniqueID} moveNum={2} monID={monID} monUniqueID={monUniqueID}></MoveSelector></div>
            <div><MoveSelector key={monUniqueID + "move3"} id={"Move3-" + monUniqueID} moveNum={3} monID={monID} monUniqueID={monUniqueID}></MoveSelector></div>
            <div><MoveSelector key={monUniqueID + "move4"} id={"Move4-" + monUniqueID} moveNum={4} monID={monID} monUniqueID={monUniqueID}></MoveSelector></div>
          </div>
          )}
        </div>
      </div>
    );

    //</context.Provider>
  }

  //export const PokemonPanelMemo = React.memo(PokemonPanel, () => {console.log("Memo check"); return true;});

  