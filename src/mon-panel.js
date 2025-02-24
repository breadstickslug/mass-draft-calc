import {Generations, toID, Field} from '@smogon/calc';
//import {Sets, Teams} from '@pkmn/sets';
import * as dex from '@pkmn/dex';
import * as img from '@pkmn/img';
//import {Generations as DataGenerations, TypeName} from '@pkmn/data' ;
import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import Select from 'react-select';

import { partyContext } from "./mons-container.js";

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
function ItemIcon({ contextC }) {
    //const c = useContext(context);

    const itemMemo = useMemo(() => contextC.itemName, [contextC.itemName]);
    
    const imgSrcMemo = useMemo(() => {
      return "transparent url(".concat(img.Icons.getItem(itemMemo).url)
                              .concat(") no-repeat scroll ")
                              .concat(img.Icons.getItem(itemMemo).left.toString())
                              .concat("px ")
                              .concat(img.Icons.getItem(itemMemo).top.toString())
                              .concat("px");
    }, [itemMemo]);
    return (
      <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" style={{
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
      }}></img>
    );
  }
  function ItemDropdown( { contextC } ) {
  
    const options = useMemo(() => sortedItems.map((item, index) =>
      <option value={item} key={index}>{item}</option>
    ), []);
  
    const itemMemo = useMemo(() => contextC.itemName, [contextC.itemName]);

    var changeItem = useCallback((event) => contextC.setItem(event.target.value), [contextC]);

    return (
      <select value={itemMemo} onChange={changeItem}>
        {options}
      </select>
    );
  }
  function ItemSelector() {
    const c = useContext(context);

    return (
      <div style={{display: "flex", "lineHeight": "34px"}}>Item: <ItemIcon key={c.sideCode + c.id.toString() + "itemicon"} contextC={c}></ItemIcon><ItemDropdown key={c.sideCode + c.id.toString() + "itempicker"} contextC={c}></ItemDropdown></div>
    );
  }
  


  // MOVE SELECTORS
  function MoveIcon({ contextC, moveNum }){
    // COME BACK AND ADD THE FIELD
    const moveNumMemo = useMemo(() => moveNum, [moveNum]);
    const movesMemo = useMemo(() => contextC.moves, [contextC.moves]);
    const speciesMemo = useMemo(() => contextC.species, [contextC.species]);
    const teraTypeMemo = useMemo(() => contextC.teraType, [contextC.teraType]);
    const teraActiveMemo = useMemo(() => contextC.teraActive, [contextC.teraActive]);
    const moveGraphicDataMemo = useCallback((type, teratype, teraactive) => moveGraphicData(type, teratype, teraactive), []);
    const moveTypeGetMemo = useCallback((move) => gen.moves.get(toID(move)).type, []);
    const monTypeGetMemo = useCallback((species, index) => gen.species.get(toID(species)).types[index], []);

    const graphicDataMemo = useMemo(() => {
      var graphicData;
      if (movesMemo[moveNumMemo] !== "(No Move)"){
          //var dummyMon = new Pokemon(gen, speciesMemo, { teraType: (teraActiveMemo) ? teraTypeMemo : undefined });
          //dummyMon.moves = [];
          const moveType = ((!speciesMemo.includes("Terapagos-Stellar") || movesMemo[moveNumMemo] !== "Tera Starstorm") ? // if species isnt terapagos and the move isnt tera starstorm, do the top option
            ((!speciesMemo.includes("Ogerpon") || movesMemo[moveNumMemo] !== "Ivy Cudgel") ? // if species isnt an ogerpon and the move isnt ivy cudgel, do the top option
              ((movesMemo[moveNumMemo] === "Tera Blast" && teraActiveMemo) ? // if using terablast with tera active, do the top option
                teraTypeMemo :
                moveTypeGetMemo(movesMemo[moveNumMemo])) :
              (((speciesMemo.includes("Teal")) || !speciesMemo.includes("-")) ? // if this is an ogerpon ivy cudgel + is either the teal tera or base form, to the top option
                "Grass" :
                monTypeGetMemo(speciesMemo, 1))) :
            "Stellar");
          //const fakeCalc = calculate(gen, dummyMon, new Pokemon(gen, "Kricketot"), new Move(gen, moveMemo, { isStellarFirstUse: (teraActiveMemo && teraTypeMemo === "Stellar") ? true : false, }));
          graphicData = moveGraphicDataMemo(moveType, teraTypeMemo, teraActiveMemo);
      }
      else{
          graphicData = {
              background: "transparent",
              imgSrc: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
          }
      }
      return graphicData;
    }, [speciesMemo, teraTypeMemo, teraActiveMemo, movesMemo, moveNumMemo, monTypeGetMemo, moveTypeGetMemo, moveGraphicDataMemo]);
  
    return (
        <div style={{ marginLeft: "auto", position: "relative", background: graphicDataMemo["background"], top: "0px", width: "30px", height: "30px"}}><img src={graphicDataMemo["imgSrc"]} style={{top: "0px", left: "0px", width: "30px", height: "30px"}} alt=""></img></div>
    );
  }
  function MoveDropdown({ contextC, moveNum }){
    const options = useMemo(() => sortedMoves.map((move, index) =>
      <option value={move} key={index}>{move}</option>
    ), []);
    const moveNumMemo = useMemo(() => moveNum, [moveNum]);
    const movesMemo = useMemo(() => contextC.moves, [contextC.moves]);

    var changeMove = useCallback((event) => contextC.setMove(event.target.value, moveNumMemo), [movesMemo, moveNumMemo, contextC]);

    return (
      <select value={movesMemo[moveNumMemo]} style={{ marginRight: "auto", position: "relative" }} onChange={changeMove}>
        { options }
      </select>
    );
  }
  function MoveSelector({ moveNum }) {
    const c = useContext(context);
    const moveNumMemo = useMemo(() => moveNum, [moveNum]);
  
    return (
        <div style={{display: "flex", "lineHeight": "30px"}}><MoveIcon key={c.sideCode + c.id.toString() + "moveicon" + moveNumMemo.toString()} contextC={c} moveNum={moveNumMemo}></MoveIcon><MoveDropdown key={c.sideCode + c.id.toString() + "movepicker" + moveNumMemo.toString()} contextC={c} moveNum={moveNumMemo}></MoveDropdown></div>
    );
  }
  

  // SPECIES SELECTOR
  function SpeciesIcon({ contextC }){

    const speciesMemo = useMemo(() => contextC.species, [contextC.species]);

    const imgSrcMemo = useMemo(() => {
    return "transparent url(".concat(img.Icons.getPokemon(speciesMemo).url)
                      .concat(") no-repeat scroll ")
                      .concat(img.Icons.getPokemon(speciesMemo).left.toString())
                      .concat("px ")
                      .concat(img.Icons.getPokemon(speciesMemo).top.toString())
                      .concat("px");},
    [speciesMemo]);
    return (
      <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" style={{
        width: "40px",
        height: "30px",
        display: "inline-block",
        imageRendering: "pixelated",
        border: "0",
        background: imgSrcMemo,
      }}></img>
    );
  }
  function SpeciesDropdown({ contextC }){
    const options = useMemo(() => sortedMons.map((specie, index) =>
      //<option value={specie} key={index}>{specie}</option>
      new Object({
        value: specie,
        label: specie,
        key: index,
      })
    ), []);
    const speciesMemo = useMemo(() => contextC.species, [contextC.species]);

    var changeSpecies = useCallback((option, reason) => {
      if (reason.action === "set-value" ||
        reason.action === "input-blur" ||
        reason.action === "menu-close") {
          return;
      }
      contextC.setSpecies(option.value)}, [contextC]);

    return (
      <Select key={contextC.sideCode + contextC.id.toString() + "speciesselect"} menuPosition="fixed" options={options} classNamePrefix="species" value={options.find(x => x.value === speciesMemo)} onChange={changeSpecies} onSelectResetsInput={false} menuPortalTarget={document.body}
      
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
  function SpeciesSelector() {
    const c = useContext(context);

    return (
      <div style={{display: "flex", "lineHeight": "34px"}}><SpeciesIcon key={c.sideCode + c.id.toString() + "speciesicon"} contextC={c}></SpeciesIcon><SpeciesDropdown key={c.sideCode + c.id.toString() + "speciespicker"} contextC={c}></SpeciesDropdown></div>
    );
  }



  // ABILITY SELECTOR
  function AbilityDropdown({ contextC }){

    const options = useMemo(() => sortedAbilities.map((abil, index) =>
        <option value={abil} key={index}>{abil}</option>
    ), []);

    const abilityMemo = useMemo(() => contextC.ability, [contextC.ability]);

    var changeAbility = useCallback((event) => contextC.updateAbility(event.target.value), [contextC]);

    return (
        <select value={abilityMemo} style={{marginLeft: "10px", marginRight: "auto"}} onChange={changeAbility}>
            {options}
        </select>
    )
  }
  function AbilitySelector() {
    const c = useContext(context);
    return (
        <div style={{display: "flex"}}>Ability: <AbilityDropdown key={c.sideCode + c.id.toString() + "abilitypicker"} contextC={c}></AbilityDropdown></div>
    );
  }


  // NATURE SELECTOR
  function NatureDropdown({ contextC }){
    
    const options = useMemo(() => Array.from(gen.natures).map((nat, index) =>
        <option value={nat.name} key={index}>{nat.name}</option>
    ), []);

    const natureMemo = useMemo(() => contextC.nature, [contextC.nature]);

    var updateNature = useCallback((event) => contextC.changeNature(event.target.value), [contextC]);

    return (
        <select value={natureMemo} style={{marginLeft: "10px", marginRight: "auto"}} onChange={updateNature}>
            {options}
        </select>
    )
  }
  function NatureSelector() {
    const c = useContext(context);

    return (
        <div style={{display: "flex"}}>Nature: <NatureDropdown key={c.sideCode + c.id.toString() + "naturepicker"} contextC={c}></NatureDropdown></div>
    );
  }



  // TERA TYPE SELECTOR
  function TeraIcon({ contextC }){

    const contextMemo = useMemo(() => contextC, [contextC]);
    const teraTypeMemo = useMemo(() => contextMemo.teraType, [contextMemo.teraType]);
    const imgSrcMemo = useMemo(() => process.env.PUBLIC_URL + "/img/tera_" + teraTypeMemo.toLowerCase() + "_gem.png", [teraTypeMemo]);
    
    return (
        <img src={imgSrcMemo} alt="" style={{
          width: "30px",
          height: "30px",
          marginLeft: "5px",
          marginRight: "5px",
        }}></img>
      );
  }
  function TeraDropdown({ contextC }){
    const options = sortedTypes.map((t, index) =>
        <option value={t} key={index}>{t}</option>
    );

    const contextMemo = useMemo(() => contextC, [contextC]);
    const teraTypeMemo = useMemo(() => contextMemo.teraType, [contextMemo.teraType]);

    var updateTeraType = useCallback((event) => contextMemo.changeTeraType(event.target.value), [contextMemo]);

    return (
        <select value={teraTypeMemo} onChange={updateTeraType}>
            {options}
        </select>
    );
  }
  function TeraToggle({ contextC }){

    const teraActiveMemo = useMemo(() => contextC.teraActive, [contextC.teraActive]);
    var updateTeraStatus = useCallback((event) => contextC.toggleTera(event.target.checked), [contextC]);

    return (
        <input type="checkbox" onChange={updateTeraStatus} checked={teraActiveMemo}></input>
    );
  }
  function TeraTypeSelector(){
    const c = useContext(context);

    return (
        <div style={{display: "flex", "lineHeight": "30px"}}>Tera Type: <TeraIcon key={c.sideCode + c.id.toString() + "teraicon"} contextC={c}></TeraIcon><TeraDropdown key={c.sideCode + c.id.toString() + "terapicker"} contextC={c}></TeraDropdown><TeraToggle key={c.sideCode + c.id.toString() + "teratoggle"} contextC={c}></TeraToggle></div>
    );
  }


  
  // STATS TABLE
  function EVInput({ contextC, stat }){

    const statMemo = useMemo(() => stat, [stat]);
    const evsMemo = useMemo(() => contextC.evs, [contextC]);

    var updateEV = useCallback((event) => contextC.setEV(event.target.value, statMemo), [evsMemo, statMemo, contextC]);

    //function updateEVLocal(event){
    //  contextC.setEV(event.target.value, statMemo);
    //}

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
      }, 5000)
  
      return () => clearTimeout(delayDebounceFn)
    }, [evsMemo]);

    return (
        <input default="0" pattern="[0-9]*" min="0" max="252" step="1" type="number" placeholder="0" onBlur={updateEV} defaultValue={evsMemo[statMemo]}></input>
    );
  }
  function IVInput({ contextC, stat }){

    const statMemo = useMemo(() => stat, [stat]);
    const ivsMemo = useMemo(() => contextC.ivs, [contextC]);

    var updateIV = useCallback((event) => contextC.setIV(event.target.value, statMemo), [ivsMemo, statMemo, contextC]);

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
      }, 5000)
  
      return () => clearTimeout(delayDebounceFn)
    }, [ivsMemo]);

    return (
        <input default="0" pattern="[0-9]*" min="0" max="31" step="1" type="number" placeholder="31" onBlur={updateIV} defaultValue={ivsMemo[statMemo]}></input>
    );
  }
  function BoostDropdown({ contextC, stat }){
    var options = boostList.map((boost, index) => 
        <option value={boostValues[index]} key={index}>{boost}</option>
    );

    const statMemo = useMemo(() => stat, [stat]);
    const boostsMemo = useMemo(() => contextC.boosts, [contextC.boosts]);

    var updateBoost = useCallback((event) => contextC.setBoost(event.target.value, statMemo), [boostsMemo, statMemo, contextC]);

    return (
        <select value={boostsMemo[statMemo]} onChange={updateBoost}>
            {options}
        </select>
    );
  }
  function StatsTableRow({ stat, statIndex }){
    const c = useContext(context);

    const statMemo = useMemo(() => stat, [stat])
    const statIndexMemo = useMemo(() => statIndex, [statIndex]);
    
    var boostPickerNoHP = (statMemo !== "hp") ? <td><BoostDropdown key={c.sideCode + c.id.toString() + "boost" + statMemo} contextC={c} stat={statMemo}></BoostDropdown></td> : <td></td>;

    //const speciesMemo = useMemo(() => c.species, [c.species]);
    const evsMemo = useMemo(() => c.evs, [c.evs]);
    const ivsMemo = useMemo(() => c.ivs, [c.ivs]);
    const natureMemo = useMemo(() => c.nature, [c.nature]);
    const boostsMemo = useMemo(() => c.boosts, [c.boosts]);
    const baseStatsMemo = useMemo(() => c.baseStats, [c.baseStats]);
    const plus = useMemo(() => gen.natures.get(toID(natureMemo)).plus, [natureMemo]);
    const minus = useMemo(() => gen.natures.get(toID(natureMemo)).minus, [natureMemo]);

    const statNumMemo = useMemo(() => {
    const statFirstStep = Math.floor((2 * baseStatsMemo[statMemo] + ivsMemo[statMemo] + Math.floor(evsMemo[statMemo]/4)) * 100 / 100) // level 100 assumed
    const natureMod = (plus === statMemo && plus !== minus) ? 1.1 : ((minus === statMemo && minus !== plus) ? 0.9 : 1);
    const statSecondStep = (statMemo === "hp") ? statFirstStep + 100 + 10 : (statFirstStep + 5) * natureMod; // level 100 assumed
    //var dummyMon = new Pokemon(gen, speciesMemo, {evs: evMemoObj, ivs: ivMemoObj, ability: abilityMemo, nature: natureMemo});
    var statNum = Math.floor(statSecondStep * (2+Math.max(0, boostsMemo[statMemo]))/(2-Math.min(0, boostsMemo[statMemo])));
    return statNum;
    }, [baseStatsMemo, natureMemo, ivsMemo, evsMemo, boostsMemo, statMemo]);

    return (
        <tr><td style={{color: (statMemo === minus && minus !== plus) ? "#1680f6" : ((statMemo === plus && plus !== minus) ? "#ff5a84": "#ffd21f")}}>{ev_names[statIndexMemo]}: </td><td><EVInput key={c.sideCode + c.id.toString() + "EV" + statMemo} contextC={c} stat={statMemo}></EVInput></td><td> IV: </td><td><IVInput key={c.sideCode + c.id.toString() + "IV" + statMemo} contextC={c} stat={statMemo}></IVInput></td>{boostPickerNoHP}<td><b>{statNumMemo}</b></td></tr>
    );
  }
  function StatsTable(){
    const rows = statList.map((stat, index) =>
        <StatsTableRow stat={stat} statIndex={index} key={index}></StatsTableRow>
    );

    return (
        <table>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
  }

  // NOTES INPUT
  function NotesInput(){
    const c = useContext(context);

    //function reviseNotes(event){
    //    c.updateNotes(event.target.value);
    //}

    var reviseNotes = useCallback((event) => c.updateNotes(event.target.value), [c]);
    
    return (
        <div style={{display: "flex"}}>Notes: <input style={{ marginLeft: "10px" }} onBlur={reviseNotes} defaultValue={c.notes}></input></div>
    );
  }

  // MAIN PANEL
  export function PokemonPanel({ passedNotes, monID, monSide, pSpecies, pNature, pTeraType, pAbility, pTeraActive, pItem, pMoves, pEVs, pIVs, pBoosts }) {
    //var [mon, setMon] = useState(passedMon);
    var pC = useContext(partyContext);

    const [sideCode] = useState(monSide);
    const [id] = useState(monID);
    const [species, setSpeciesName] = useState(pSpecies);
    const [baseStats, setBaseStats] = useState(gen.species.get(toID(pSpecies)).baseStats);
    const [nature, setNature] = useState(pNature);
    const [teraType, setTeraType] = useState((pTeraType) ? pTeraType : ((!pSpecies.includes("Terapagos")) ? ((!pSpecies.includes("Ogerpon-")) ?  gen.species.get(toID(pSpecies)).types[0] : ((pSpecies.includes("Teal")) ? "Grass" : gen.species.get(toID(pSpecies)).types[1])) : "Stellar"));
    const [ability, setAbility] = useState(pAbility);
    const [teraActive, setTeraStatus] = useState(pTeraActive);
    const [itemName, setItemName] = useState((pItem) ? pItem : "(no item)");
    var [moves, setMoves] = useState({ 
        1: (pMoves["1"] !== undefined) ? pMoves["1"] : "(No Move)",
        2: (pMoves["2"] !== undefined) ? pMoves["2"] : "(No Move)",
        3: (pMoves["3"] !== undefined) ? pMoves["3"] : "(No Move)",
        4: (pMoves["4"] !== undefined) ? pMoves["4"] : "(No Move)"});
    var [evs, setEVs] = useState({ hp: pEVs["hp"], atk: pEVs["atk"], def: pEVs["def"], spa: pEVs["spa"], spd: pEVs["spd"], spe: pEVs["spe"] });
    var [ivs, setIVs] = useState({ hp: pIVs["hp"], atk: pIVs["atk"], def: pIVs["def"], spa: pIVs["spa"], spd: pIVs["spd"], spe: pIVs["spe"] });
    var [boosts, setBoosts] = useState({ hp: pBoosts["hp"], atk: pBoosts["atk"], def: pBoosts["def"], spa: pBoosts["spa"], spd: pBoosts["spd"], spe: pBoosts["spe"] });
    var [notes, setNotes] = useState(passedNotes);

    //const [, forceUpdate] = useReducer(x => x + 1, 0);

    //console.log("incoming species for ", id, " is ", pSpecies, " and is it the same as previous value ", species, "? ", (pSpecies === species));

    //console.log("mon index "+monID.toString()+" reinitialized with the following species:");
    //console.log(species);
    

    /*
    function updateMon(){
        forceUpdate();
        //console.log(species);
        var newMon = new Pokemon(gen, species, {
            nature: nature,
            ability: ability,
            item: itemName,
            moves: moves,
            evs: evs,
            ivs: ivs,
            boosts: boosts,
            teraType: (teraActive) ? teraType : undefined,
        });
        //setMon(newMon);
        //pC.setMon(newMon, id);
    }
    */

    function setItem(item){
        setItemName(item);
        //updateMon();
    }

    useEffect( () => {
      pC.setItem(itemName, id);
    }, [itemName]);

    function setSpecies(s){
        setSpeciesName(s);
        var newBaseStats = gen.species.get(toID(s)).baseStats;
        setBaseStats(newBaseStats);
        var newTeraType = ((!s.includes("Terapagos")) ? ((!s.includes("Ogerpon-")) ? gen.species.get(toID(s)).types[0] : ((s.includes("Teal")) ? "Grass" : gen.species.get(toID(s)).types[1])) : "Stellar");
        changeTeraType(newTeraType);
        var newAbility = gen.species.get(toID(s)).abilities[0];
        updateAbility(newAbility);
        setTeraStatus(((s.includes("-Tera") && !s.includes("pagos")) || s.includes("Stellar")) ? true : false);
        //updateMon();

    }

    useEffect( () => {
      pC.setSpecie(species, id);
    }, [species]);

    function updateAbility(abil){
        setAbility(abil);
        //updateMon();
    }

    useEffect( () => {
      pC.setAbility(ability, id);
    }, [ability]);

    function toggleTera(status){
        setTeraStatus(status);
        //updateMon();
    }

    useEffect( () => {
      pC.setTeraActive(teraActive, id);
    }, [teraActive]);

    function changeTeraType(type){
        setTeraType(type);
        //updateMon();
    }

    useEffect( () => {
      pC.setTeraType(teraType, id);
    }, [teraType]);

    function changeNature(nat){
        setNature(nat);
        //updateMon();
    }

    useEffect( () => {
      pC.setNature(nature, id);
    }, [nature]);

    function setMove(move, moveNum){
        var movesCopy = {
            1: moves["1"],
            2: moves["2"],
            3: moves["3"],
            4: moves["4"],
        }
        movesCopy[moveNum.toString()] = move;
        setMoves(movesCopy);
        //updateMon();
        
    }

    useEffect( () => {
      //console.log("passing up moves ",moves," to mon ",monID," of ",monSide,"s");
      pC.setMoveset(moves, id);
    }, [moves]);

    function setEV(ev, stat){
        var statsCopy = {
            hp: evs["hp"],
            atk: evs["atk"],
            def: evs["def"],
            spa: evs["spa"],
            spd: evs["spd"],
            spe: evs["spe"],
        }
        statsCopy[stat] = Math.min(Math.max(ev, 0), 252);
        setEVs(statsCopy);
        //updateMon();
    }

    useEffect( () => {
      pC.setEVs(evs, id);
    }, [evs]);

    function setIV(iv, stat){
        var statsCopy = {
            hp: ivs["hp"],
            atk: ivs["atk"],
            def: ivs["def"],
            spa: ivs["spa"],
            spd: ivs["spd"],
            spe: ivs["spe"],
        }
        statsCopy[stat] = Math.min(Math.max(iv, 0), 31);
        setIVs(statsCopy);
        //updateMon();
    }

    useEffect( () => {
      pC.setIVs(ivs, id);
    }, [ivs]);

    function setBoost(boost, stat){
        var statsCopy = {
            hp: parseInt(boosts["hp"]),
            atk: parseInt(boosts["atk"]),
            def: parseInt(boosts["def"]),
            spa: parseInt(boosts["spa"]),
            spd: parseInt(boosts["spd"]),
            spe: parseInt(boosts["spe"]),
        }
        statsCopy[stat] = boost;
        setBoosts(statsCopy);
        //updateMon();
    }

    useEffect( () => {
      pC.setBoosts(boosts, id);
    }, [boosts]);

    function updateNotes(info){
      setNotes(info);
    }

    useEffect( () => {
      pC.setMonNotes(notes, id);
    }, [notes]);
    /*
    useEffect( () => {
      var newMon = new Pokemon(gen, species, {
        nature: nature,
        ability: ability,
        item: itemName,
        moves: moves,
        evs: evs,
        ivs: ivs,
        boosts: boosts,
        teraType: (teraActive) ? teraType : undefined,
      });
      //console.log("MON UPDATED");
      pC.setParty([...pC.party.slice(0,id), newMon, ...pC.party.slice(id+1)]);
      //pC.setMonNotes([...pC.notes.slice(0, id), notes, ...pC.notes.slice(id+1)]);
    }, [fetchDataSwitch]);
    */
  
    return (
    <context.Provider value={{ sideCode, setItem, setSpecies, setMove, changeTeraType, toggleTera, changeNature, updateAbility, setEV, setIV, setBoost, updateNotes, id, notes, boosts, ivs, evs, ability, nature, teraType, teraActive, itemName, moves, species, baseStats }}>
      <div style={{display: "flex"}}>
        <div>
          <div style={{paddingTop: "1px", paddingBottom: "1px"}}><SpeciesSelector key={sideCode + id.toString() + "species"}></SpeciesSelector></div>
          <div style={{paddingTop: "1px", paddingBottom: "1px"}}><NatureSelector key={sideCode + id.toString() + "nature"}></NatureSelector></div>
          <div style={{paddingTop: "1px", paddingBottom: "1px"}}><TeraTypeSelector key={sideCode + id.toString() + "teratype"}></TeraTypeSelector></div>
          <div style={{paddingTop: "1px", paddingBottom: "1px"}}><AbilitySelector key={sideCode + id.toString() + "ability"}></AbilitySelector></div>
          <div style={{paddingTop: "1px", paddingBottom: "1px"}}><ItemSelector key={sideCode + id.toString() + "item"}></ItemSelector></div>
          <StatsTable key={sideCode + id.toString() + "stats"}></StatsTable>
          <NotesInput key={sideCode + id.toString() + "notes"}></NotesInput>
          { (sideCode === "attacker") && (
          <div>
            <p></p>
            <div><MoveSelector key={sideCode + id.toString() + "move1"} id={sideCode + "Move1-" + id.toString()} moveNum={1}></MoveSelector></div>
            <div><MoveSelector key={sideCode + id.toString() + "move2"} id={sideCode + "Move2-" + id.toString()} moveNum={2}></MoveSelector></div>
            <div><MoveSelector key={sideCode + id.toString() + "move3"} id={sideCode + "Move3-" + id.toString()} moveNum={3}></MoveSelector></div>
            <div><MoveSelector key={sideCode + id.toString() + "move4"} id={sideCode + "Move4-" + id.toString()} moveNum={4}></MoveSelector></div>
          </div>
          )}
        </div>
      </div>
      </context.Provider>
    );
  }

  //export const PokemonPanelMemo = React.memo(PokemonPanel, () => {console.log("Memo check"); return true;});

  