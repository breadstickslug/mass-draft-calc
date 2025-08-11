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

const gen = Generations.get(9);
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

var sortedMoves = [];
for (const id of gen.moves) {
  sortedMoves.push(id.name);
}
sortedMoves.sort(function(a, b) {
  if (a.toUpperCase() > b.toUpperCase()) { return 1; }
  else if (a.toUpperCase() < b.toUpperCase()) { return -1; }
  return 0;
})

var sortedMons = [];
for (const id of speciesDex.species.all()) {
    if (id.name !== "Xerneas-Neutral" && id.name !== "Eevee-Starter" && id.name !== "Pikachu-Starter" && id.name !== "MissingNo." && !id.name.includes("Pokestar") &&
        id.name !== "Pikachu-Belle" && !id.name.includes("Rock-Star") && !id.name.includes("Pop-Star") && !id.name.includes("PhD") && !id.name.includes("Partner") &&
        !id.name.includes("Cosplay") && !id.name.includes("Libre") && !id.name.includes("Spiky-eared")){
        sortedMons.push(id.name);
    }
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
    return "transparent url(".concat(img.Icons.getPokemon(species).url)
                      .concat(") no-repeat scroll ")
                      .concat(img.Icons.getPokemon(species).left.toString())
                      .concat("px ")
                      .concat(img.Icons.getPokemon(species).top.toString())
                      .concat("px");},
    [species]);
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
        <input default="0" pattern="[0-9]*" min="0" max="252" step="4" type="number" placeholder="0" onChange={(e) => { var evsTemp = {
          hp: mons[pC.containerIndex][monIDMemo].EVs["hp"],
          atk: mons[pC.containerIndex][monIDMemo].EVs["atk"],
          def: mons[pC.containerIndex][monIDMemo].EVs["def"],
          spa: mons[pC.containerIndex][monIDMemo].EVs["spa"],
          spd: mons[pC.containerIndex][monIDMemo].EVs["spd"],
          spe: mons[pC.containerIndex][monIDMemo].EVs["spe"],
      }; evsTemp[statMemo] = Math.min(Math.max((e.target.value !== "") ? parseInt(e.target.value) : 0, 0), 252); setTotalMons({ containerIndex: pC.containerIndex, type: "updateEVs", EVs: evsTemp, index: monIDMemo }); }} value={Math.min(Math.max(mons[pC.containerIndex][monIDMemo].EVs[statMemo], 0), 252)}></input>
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
    const statFirstStep = Math.floor((2 * baseStats[statMemo] + ivs[statMemo] + Math.floor(evs[statMemo]/4)) * level / 100)
    const natureMod = (plus === statMemo && plus !== minus) ? 1.1 : ((minus === statMemo && minus !== plus) ? 0.9 : 1);
    const statSecondStep = (statMemo === "hp") ? statFirstStep + level + 10 : (statFirstStep + 5) * natureMod;
    //var dummyMon = new Pokemon(gen, speciesMemo, {evs: evMemoObj, ivs: ivMemoObj, ability: abilityMemo, nature: natureMemo});
    var statNum = Math.floor(statSecondStep * (2+Math.max(0, boosts[statMemo]))/(2-Math.min(0, boosts[statMemo])));
    return statNum;
    }, [baseStats, nature, ivs, evs, boosts, statMemo, gameTypeMemo]);

    return (
        <tr><td style={{color: (statMemo === minus && minus !== plus) ? "#1680f6" : ((statMemo === plus && plus !== minus) ? "#ff5a84": "#ffd21f")}}>{ev_names[statIndexMemo]}: </td><td><EVInput key={monUniqueID + "EV" + statMemo}  stat={statMemo} monID={monIDMemo} monUniqueID={monUniqueID}></EVInput></td><td> IV: </td><td><IVInput key={monUniqueID + "IV" + statMemo}  stat={statMemo} monID={monIDMemo} monUniqueID={monUniqueID}></IVInput></td>{boostPickerNoHP}<td><b>{statNumMemo}</b></td></tr>
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
          <div style={{paddingTop: "1px", paddingBottom: "1px"}}><TeraTypeSelector key={monUniqueID + "teratype"} monID={monID} monUniqueID={monUniqueID}></TeraTypeSelector></div>
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

  