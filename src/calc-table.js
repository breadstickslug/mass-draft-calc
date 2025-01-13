import {calculate, Result, Pokemon, Generations, toID, Move} from "@smogon/calc";
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
  stellar: 'conic-gradient( #fde144, #f7a519, #f5672b, #e34a6a, #c666ba, #8d49cb, #8362c1, #6f7ba6, #879eab, #5bb9e1, #33beea, #287ada, #345ac3, #4da2ba, #61d94c, #cbdc65, #e4e8c6, #e7cc9c, #fde144)',
};
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

function AttackerRows({ attacker, defenders }){
    //const [calcs, setCalcs] = useState([]);
    //const attackerMemo = useMemo(() => attacker, [attacker]);
    //const defendersMemo = useMemo(() => defenders, [defenders]);

    // ATTACKERS ARENT UPDATING IMMEDIATELY, DEFENDERS ARE...?

    //const movesFiltered = useMemo(() => attacker.moves.filter((move) => gen.moves.get(toID(move)).category !== "Status"), [attacker]);
    const movesFiltered = attacker.moves.filter((move) => gen.moves.get(toID(move)).category !== "Status");

    // calcs is a list corresponding to moves producing lists of calcs vs defenders
    const calcs = useMemo(() => defenders.map((defender) => {
        var tempDefender = defender.clone();
        if (defender.item === "(no item)") { tempDefender.item = undefined; }
        tempDefender.name = tempDefender.species.name;
        var tempAttacker = attacker.clone();
        tempAttacker.name = tempAttacker.species.name;
        return Object.values(movesFiltered).map((move) => {
            const m = new Move(gen, move, {isStellarFirstUse: (attacker.teraType && attacker.teraType === "Stellar")});
            //console.log("attacker ",attacker," defender ",tempDefender," move ",m);
            //console.log(calculate(gen, attacker, tempDefender, m));
            return calculate(gen, tempAttacker, tempDefender, m);
        });
    }), [attacker, defenders, movesFiltered]);


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
                <td style={{ textAlign: "center", paddingLeft: "5px"}}><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" style={{
                                width: "40px",
                                height: "30px",
                                display: "inline-block",
                                imageRendering: "pixelated",
                                border: "0",
                                background: "transparent url("+img.Icons.getPokemon(calc.attacker.species.name).url+") no-repeat scroll "+img.Icons.getPokemon(calc.attacker.species.name).left.toString()+"px "+img.Icons.getPokemon(calc.attacker.species.name).top.toString()+"px",
                                }}></img></td>
                <td style={{ textAlign: "center", paddingRight: "5px" }}>{calc.attacker.species.name + ((attacker.name !== undefined) ? " ("+attacker.name+")" : "")}</td>
                <td style={{ textAlign: "center", display: "flex", lineHeight: "34px", background: gD["background"]}}>
                    <div style={{position: "relative", display: "inline-block", height: "30px", width: "30px"}}>
                        <img src={gD["imgSrc"]} alt="" style={{
                            left: "0px",
                            top: "2px",
                            width: "30px",
                            height: "30px",
                            border: "0",
                            position: "absolute",
                        }}></img>
                    </div>
                <div style={{ ...{ textAlign: "center", paddingLeft: "10px", paddingRight: "10px", color: "#fff", fontWeight: "bold" }, ...{
                    textShadow: (calc.move.isStellarFirstUse || (calc.attacker.teraType && moveType === calc.attacker.teraType)) ? "1px 1px 2px #111, -1px 1px 2px #111, -1px -1px 1px #000, 1px -1px 2px #111" : "#000 0px 0px 0px"
                }}}>{calc.move.name}</div></td>
                <td style={{ textAlign: "center", paddingLeft: "5px"}}><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" style={{
                                width: "40px",
                                height: "30px",
                                display: "inline-block",
                                imageRendering: "pixelated",
                                border: "0",
                                background: "transparent url("+img.Icons.getPokemon(calc.defender.species.name).url+") no-repeat scroll "+img.Icons.getPokemon(calc.defender.species.name).left.toString()+"px "+img.Icons.getPokemon(calc.defender.species.name).top.toString()+"px",
                                }}></img></td>
                <td style={{ textAlign: "center", paddingLeft: "5px", paddingRight: "5px" }}>{calc.defender.species.name + ((defenders[index1].name !== undefined && defenders[index1].name !== "") ? " ("+defenders[index1].name+")" : "")}</td>
                <td style={{ textAlign: "center", paddingLeft: "5px", paddingRight: "5px" }}>{calc.range()[0]+ " - " + calc.range()[1]}</td>
                <td style={{ textAlign: "center", paddingLeft: "5px", paddingRight: "5px", background: dmgGradient}}>{pctLower.toString()+" - "+pctHigher.toString()+"%"}</td>
            </tr>
            );
        });
        //console.log(r);
        return r;
    }).flat(3), [calcs, attacker, defenders]);

    return rows.map((r, index) => r);
}

export function CalcTable({ attackers, defenders}) {
    const a = useMemo(() => attackers, [attackers]);
    const d = useMemo(() => defenders, [defenders]);

    useEffect(() => {
        console.log("DEFENDERS UPDATED", d);
    }, [d]);

    //useEffect(() => {
    //    console.log("table is getting new attackers");
    //    console.log("attackers are now ",a);
    //}, [a]);

    return (
        <table style={{backgroundColor: "#fff", textAlign: "center", marginLeft: "auto", marginRight: "auto", borderCollapse: "collapse"}}>
            <thead style={{backgroundColor: "#1a2a43", color: "#fff" }}>
                <tr>
                    <th></th>
                    <th>Attacker</th>
                    <th>Move</th>
                    <th></th>
                    <th>Defender</th>
                    <th>Damage</th>
                    <th>% Range</th>
                </tr>
            </thead>
            <tbody>
                {a.map((attacker, index) =>
                    <AttackerRows key={attacker.species+index} attacker={attacker} defenders={d}></AttackerRows>
                )}
            </tbody>
        </table>
    );
}