import {calculate, Result, Pokemon, Generations, toID, Move, Field} from "@smogon/calc";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as img from '@pkmn/img';

const gen = Generations.get(9);

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
  stellar: 'conic-gradient(from 0deg at 20px 20px, #fde144, #f7a519, #f5672b, #e34a6a, #c666ba, #8d49cb, #8362c1, #6f7ba6, #879eab, #5bb9e1, #33beea, #287ada, #345ac3, #4da2ba, #61d94c, #cbdc65, #e4e8c6, #e7cc9c, #fde144)',
};

// the below reproduced from the calc
function OF16(n) {
  return n > 65535 ? n % 65536 : n;
}

// the below reproduced from the calc
function getModifiedStat(stat, mod, gen) {
  if (gen && gen.num < 3) {
    if (mod >= 0) {
      const pastGenBoostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
      stat = Math.floor(stat * pastGenBoostTable[mod]);
    } else {
      const numerators = [100, 66, 50, 40, 33, 28, 25];
      stat = Math.floor((stat * numerators[-mod]) / 100);
    }
    return Math.min(999, Math.max(1, stat));
  }
  
  const numerator = 0;
  const denominator = 1;
  const modernGenBoostTable = [
    [2, 8],
    [2, 7],
    [2, 6],
    [2, 5],
    [2, 4],
    [2, 3],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 2],
    [8, 2],
  ];
  stat = OF16(stat * modernGenBoostTable[6 + mod][numerator]);
  stat = Math.floor(stat / modernGenBoostTable[6 + mod][denominator]);

  return stat;
}

// the below reproduced from the calc
function getQPBoostedStat(pokemon, gen) {
  if (pokemon.boostedStat && pokemon.boostedStat !== 'auto') {
    return pokemon.boostedStat; // override.
  }
  let bestStat = 'atk';
  for (const stat of ['def', 'spa', 'spd', 'spe']) {
    if (
      // proto/quark ignore boosts when considering their boost
      getModifiedStat(pokemon.rawStats[stat], pokemon.boosts[stat], gen) >
      getModifiedStat(pokemon.rawStats[bestStat], pokemon.boosts[bestStat], gen)
    ) {
      bestStat = stat;
    }
  }
  return bestStat;
}

// takes move information and returns background color + img icon src
function moveGraphicData(type, teratype, teraactive) {
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

// adds leading zero if single digit
function doubleZero(num) {
    if (num.length < 2){
      if (num.length < 1){
        return "00";
      }
      return "0".concat(num);
    }
    return num;
}
// takes hex codes and a decimal 0 < pct < 1, returns color value (hex code) within gradient
function colorMap(colors, pct)
{
    if (colors.length === 1) { return colors[0]; }
    if (pct < 0) { pct = 0; }
    else if (pct > 1) { pct = 1; }

    var color1 = colors[0];
    var color2 = colors[1];
    var lastColor = 0;
    for (var i = 0; i < colors.length-1; i++)
    {
        //console.log("testing whether ".concat(pct.toString()).concat(" is in segment ").concat((i+1).toString()));
        if (pct <= ((i+1)/(colors.length-1))){
        color1 = colors[i];
        color2 = colors[i+1];
        lastColor = i;
        break;
        }
    }
    var betweenIndex = 1 / (colors.length-1); // section of full gradient between colors - 1/1 for 2 colors, 1/2 for 3 colors, etc
    var scaling = (pct - (betweenIndex*lastColor)) / betweenIndex;

    var resultColor = "#".concat(doubleZero((Math.round(parseInt(color2.substring(1, 3), 16)*scaling+parseInt(color1.substring(1, 3), 16)*(1-scaling))).toString(16))) // scaled difference of color1 and color2
                        .concat(doubleZero((Math.round(parseInt(color2.substring(3, 5), 16)*scaling+parseInt(color1.substring(3, 5), 16)*(1-scaling))).toString(16)))
                        .concat(doubleZero((Math.round(parseInt(color2.substring(5, 7), 16)*scaling+parseInt(color1.substring(5, 7), 16)*(1-scaling))).toString(16)));
    //console.log(resultColor);
    return resultColor;
}

function AttackerRows({ objAttacker, objDefenders, fieldObject }){
    const field = new Field(fieldObject);
    const attacker = new Pokemon(gen, objAttacker.species, {
                  nature: objAttacker.nature,
                  ability: objAttacker.ability,
                  item: objAttacker.item,
                  moves: Object.values(objAttacker.moves),
                  evs: objAttacker.EVs,
                  ivs: objAttacker.IVs,
                  boosts: objAttacker.boosts,
                  name: objAttacker.notes,
                  teraType: (objAttacker.teraActive) ? objAttacker.teraType : undefined,
                  teraactive: objAttacker.teraActive,
                  status: objAttacker.status,
                });
    //console.log(attacker);
    const defenders = objDefenders.map((d, index) => { return new Pokemon(gen, d.species, {
                  nature: d.nature,
                  ability: d.ability,
                  item: d.item,
                  moves: Object.values(d.moves),
                  evs: d.EVs,
                  ivs: d.IVs,
                  boosts: d.boosts,
                  name: d.notes,
                  teraType: (d.teraActive) ? d.teraType : undefined,
                  teraactive: d.teraActive,
                  status: d.status,
                }); });
    //console.log(objDefenders);
    //console.log(defenders);
    //const [calcs, setCalcs] = useState([]);
    //const attackerMemo = useMemo(() => attacker, [attacker]);
    //const defendersMemo = useMemo(() => defenders, [defenders]);

    // ATTACKERS ARENT UPDATING IMMEDIATELY, DEFENDERS ARE...?

    //const movesFiltered = useMemo(() => attacker.moves.filter((move) => gen.moves.get(toID(move)).category !== "Status"), [attacker]);
    const movesFiltered = attacker.moves.filter((move) => gen.moves.get(toID(move)).category !== "Status");

    // calcs is a list corresponding to moves producing lists of calcs vs defenders
    const calcs = defenders.map((defender) => {
        console.log(field);
        var tempDefender = defender.clone();
        if (defender.item === "(no item)") { tempDefender.item = undefined; }
        tempDefender.name = tempDefender.species.name;
        if (defender.ability === "Protosynthesis" && (field.weather === "Sun" || field.weather === "Harsh Sunshine" || defender.item === "Booster Energy")) { tempDefender.boostedStat = getQPBoostedStat(tempDefender, gen); }
        if (defender.ability === "Quark Drive" && (field.terrain === "Electric" || defender.item === "Booster Energy")) { tempDefender.boostedStat = getQPBoostedStat(tempDefender, gen); }
        var tempAttacker = attacker.clone();
        if (attacker.item === "(no item)") { tempAttacker.item = undefined; }
        tempAttacker.name = tempAttacker.species.name;
        if (attacker.ability === "Protosynthesis" && (field.weather === "Sun" || field.weather === "Harsh Sunshine" || attacker.item === "Booster Energy")) { tempAttacker.boostedStat = getQPBoostedStat(tempAttacker, gen); }
        if (attacker.ability === "Quark Drive" && (field.terrain === "Electric" || attacker.item === "Booster Energy")) { tempAttacker.boostedStat = getQPBoostedStat(tempAttacker, gen); }
        if (field.gameType === "Doubles") { tempAttacker.level = 50; tempDefender.level = 50; } else { tempAttacker.level = 100; tempDefender.level = 100; }
        return Object.values(movesFiltered).map((move) => {
            const m = new Move(gen, move, {ability: attacker.ability, isStellarFirstUse: (attacker.teraType && attacker.teraType === "Stellar")});
            console.log("attacker ",tempAttacker," defender ",tempDefender," move ",m);
            console.log(field);
            return calculate(gen, tempAttacker, tempDefender, m, field);
        });
    });


    const rows = useMemo(() => calcs.map((defs, index1) => { // over defenders
        const r = defs.map((calc, index2) => { // over moves
            //console.log(defenders[index1]);
            const moveType = ((!calc.attacker.species.name.includes("Terapagos-Stellar") || calc.move.name !== "Tera Starstorm") ? // if species isnt terapagos and the move isnt tera starstorm, do the top option
            ((!calc.attacker.species.name.includes("Ogerpon") || calc.move.name !== "Ivy Cudgel") ? // if species isnt an ogerpon and the move isnt ivy cudgel, do the top option
              ((calc.move.name === "Tera Blast" && (calc.attacker.teraType !== undefined)) ? // if using terablast with tera active, do the top option
                calc.attacker.teraType :
                calc.move.type) :
              (((calc.attacker.species.name.includes("Teal")) || !calc.attacker.species.name.includes("-")) ? // if this is an ogerpon ivy cudgel + is either the teal tera or base form, to the top option
                "Grass" :
                calc.attacker.species.types[1])) :
            "Stellar");
            const gD = moveGraphicData(moveType, calc.attacker.teraType, (calc.attacker.teraType !== undefined));

            var pctLower = Math.round((calc.range()[0] / calc.defender.stats.hp * 1000) + Number.EPSILON) / 10;
            var pctHigher = Math.round((calc.range()[1] / calc.defender.stats.hp * 1000) + Number.EPSILON) / 10;
            var dmgGradient = "linear-gradient(90deg, ".concat(colorMap(["#6aa84f", "#ffd966", "#e06666", "#cc0000"], (pctLower/100)))
                                                                              .concat(", ")
                                                                              .concat(colorMap(["#6aa84f", "#ffd966", "#e06666", "#cc0000"], (pctLower/100)))
                                                                              .concat(", ")
                                                                              .concat(colorMap(["#6aa84f", "#ffd966", "#e06666", "#cc0000"], (pctLower/100)))
                                                                              .concat(", ")
                                                                              .concat(colorMap(["#6aa84f", "#ffd966", "#e06666", "#cc0000"], (pctHigher/100)))
                                                                              .concat(", ")
                                                                              .concat(colorMap(["#6aa84f", "#ffd966", "#e06666", "#cc0000"], (pctHigher/100)))
                                                                              .concat(", ")
                                                                              .concat(colorMap(["#6aa84f", "#ffd966", "#e06666", "#cc0000"], (pctHigher/100)))
                                                                              .concat(")");
            return (
            <tr key={calc.attacker.species.name+attacker.name+calc.move.name+calc.defender.species.name+defenders[index1].name+index1+" "+index2} style={{height: "34px"}}>
                <td style={{ textAlign: "center", paddingLeft: "5px"}}><object src="//:0" alt=" " style={{
                                width: "40px",
                                height: "30px",
                                display: "inline-block",
                                imageRendering: "pixelated",
                                border: "0",
                                background: "transparent url("+img.Icons.getPokemon(calc.attacker.species.name).url+") no-repeat scroll "+img.Icons.getPokemon(calc.attacker.species.name).left.toString()+"px "+img.Icons.getPokemon(calc.attacker.species.name).top.toString()+"px",
                                }}></object></td>
                <td style={{ textAlign: "center", paddingRight: "5px" }}>{calc.attacker.species.name + ((attacker.name !== undefined && attacker.name !== "" && attacker.name !== calc.attacker.species.name) ? " ("+attacker.name+")" : "")}</td>
                <td style={{ textAlign: "center", display: "flex", lineHeight: "34px", background: gD["background"]}}>
                    <div style={{position: "relative", display: "inline-block", height: "30px", width: "45px"}}>
                        <img src={gD["imgSrc"]} alt="" style={{
                            left: "0px",
                            top: "2px",
                            width: "30px",
                            height: "30px",
                            border: "0",
                            position: "absolute",
                        }}></img>
                    </div>
                <div style={{ ...{ background: (moveType === "Stellar") ? 'linear-gradient(90deg,rgba(141, 73, 203, 0.4),rgba(131, 98, 193, 0.4),rgba(111, 123, 166, 0.4),rgba(135, 158, 171, 0.4),rgba(91, 185, 225, 0.4),rgba(51, 190, 234, 0.4),rgba(40, 122, 218, 0.4),rgba(52, 90, 195, 0.4),rgba(77, 162, 186, 0.4),rgba(97, 217, 76, 0.4),rgba(203, 220, 101, 0.4),rgba(228, 232, 198, 0.4),rgba(231, 204, 156, 0.4),rgba(253, 225, 68, 0.4),rgba(253, 225, 68, 0.4),rgba(247, 165, 25, 0.4),rgba(245, 103, 43, 0.4),rgba(227, 74, 106, 0.4),rgba(198, 102, 186, 0.4))' : ("rgba(0, 0, 0, 0.15)"), 
                                    width: "100%", borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px", textAlign: "center", color: "#fff", fontWeight: "bold" }, ...{
                    textShadow: (calc.move.isStellarFirstUse || (calc.attacker.teraType && moveType === calc.attacker.teraType)) ? "1px 1px 2px #111, -1px 1px 2px #111, -1px -1px 1px #000, 1px -1px 2px #111" : "#000 0px 0px 0px"
                }}}>{calc.move.name}</div></td>
                <td style={{ textAlign: "center", paddingLeft: "5px"}}><object src="//:0" alt=" " style={{
                                width: "40px",
                                height: "30px",
                                display: "inline-block",
                                imageRendering: "pixelated",
                                border: "0",
                                background: "transparent url("+img.Icons.getPokemon(calc.defender.species.name).url+") no-repeat scroll "+img.Icons.getPokemon(calc.defender.species.name).left.toString()+"px "+img.Icons.getPokemon(calc.defender.species.name).top.toString()+"px",
                                }}></object></td>
                <td style={{ textAlign: "center", paddingLeft: "5px", paddingRight: "5px" }}>{calc.defender.species.name + ((defenders[index1].name !== undefined && defenders[index1].name !== "" && defenders[index1].name !== calc.defender.species.name) ? " ("+defenders[index1].name+")" : "")}</td>
                <td style={{ textAlign: "center", paddingLeft: "5px", paddingRight: "5px" }}>{calc.range()[0]+ " - " + calc.range()[1]}</td>
                <td style={{ textAlign: "center", paddingLeft: "5px", paddingRight: "5px", background: dmgGradient, position: "relative"}}>
                  {pctLower.toString()+" - "+pctHigher.toString()+"%"}
                  <div className="calcHover" onClick={(e) => navigator.clipboard.writeText(calc.fullDesc())}>
                    <button className="copyButton" type="button" onClick={(e) => navigator.clipboard.writeText(calc.fullDesc())}>Copy</button>
                  </div>
                </td>
            </tr>
            );
        });
        //console.log(r);
        return r;
    }).flat(3), [calcs, attacker, defenders]);

    return rows.map((r, index) => r);
}

export function CalcTable({ field, attackerIndex, mons }) {
    //console.log(attackerIndex);
    const a = useMemo(() => {if (attackerIndex === 1) { return mons[1]; } else { return mons[0]; }}, [mons, attackerIndex]);
    const d = useMemo(() => {if (attackerIndex === 1) { return mons[0]; } else { return mons[1]; }}, [mons, attackerIndex]);
    const f = useMemo(() => field, [field]);

    //useEffect(() => {
    //    console.log("table is getting new attackers");
    //    console.log("attackers are now ",a);
    //}, [a]);

    return (
        <table style={{backgroundColor: "#fff", textAlign: "center", marginLeft: "auto", marginRight: "auto", borderCollapse: "collapse"}}>
            <thead style={{backgroundColor: "#1a2a43", color: "#fff" }}>
                <tr>
                    <th style={{paddingLeft: "5px", paddingRight: "5px"}}></th>
                    <th style={{paddingLeft: "5px", paddingRight: "5px"}}>Attacker</th>
                    <th style={{paddingLeft: "5px", paddingRight: "5px"}}>Move</th>
                    <th style={{paddingLeft: "5px", paddingRight: "5px"}}></th>
                    <th style={{paddingLeft: "5px", paddingRight: "5px"}}>Defender</th>
                    <th style={{paddingLeft: "5px", paddingRight: "5px"}}>Damage</th>
                    <th style={{paddingLeft: "5px", paddingRight: "5px"}}>% Range</th>
                </tr>
            </thead>
            <tbody>
                {a.map((attacker, index) =>
                    <AttackerRows key={attacker.species+index} objAttacker={attacker} objDefenders={d} fieldObject={f}></AttackerRows>
                )}
            </tbody>
        </table>
    );
}

// top: calc(50vh - 350px - ( var(--defender-panel-height) / 2 ) + ( var(--attacker-panel-height) / 2));