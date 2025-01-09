import {calculate, Generations, Pokemon, Move, toID, Field} from '@smogon/calc';
//import {Sets, Teams} from '@pkmn/sets';
import * as dex from '@pkmn/dex';
import * as img from '@pkmn/img';
//import {Generations as DataGenerations, TypeName} from '@pkmn/data' ;
import React, { useState, useContext, useReducer, useEffect } from 'react';
import debounce from 'lodash.debounce';

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
  stellar: 'conic-gradient( #fde144, #f7a519, #f5672b, #e34a6a, #c666ba, #8d49cb, #8362c1, #6f7ba6, #879eab, #5bb9e1, #33beea, #287ada, #345ac3, #4da2ba, #61d94c, #cbdc65, #e4e8c6, #e7cc9c, #fde144)',
};

const gen = Generations.get(9);
const speciesDex = dex.Dex.forGen(9);
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
function moveGraphicData(result) {
  var m = result.move;
  var a = result.attacker;
  var moveType = result.move.type.toLowerCase();
  var background = "";

  // move background
  if (m.isStellarFirstUse || (a.teraType !== undefined && moveType === a.teraType.toLowerCase()))
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
  if ((m.isStellarFirstUse && moveType !== "stellar") || (a.teraType && moveType === a.teraType.toLowerCase() && moveType !== "stellar"))
  {
    if (m.isStellarFirstUse)
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
function ItemIcon() {
    const c = useContext(context);

    var imgSrc = "transparent url(".concat(img.Icons.getItem(c.itemName).url)
                            .concat(") no-repeat scroll ")
                            .concat(img.Icons.getItem(c.itemName).left.toString())
                            .concat("px ")
                            .concat(img.Icons.getItem(c.itemName).top.toString())
                            .concat("px");
    return (
      <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" style={{
        width: "24px",
        height: "24px",
        display: "inline-block",
        imageRendering: "pixelated",
        border: "0",
        background: imgSrc,
      }}></img>
    );
  }
  function ItemDropdown({ onChange }) {
    const c = useContext(context);
  
    const options = sortedItems.map((item, index) =>
      <option value={item} key={index}>{item}</option>
    );
  
    return (
      <select value={c.itemName} onChange={onChange}>
        {options}
      </select>
    );
  }
  function ItemSelector() {
    const c = useContext(context);

    function changeItem(event) {
      c.setItem(event.target.value);
      c.updateMon();
    }
    
    return (
      <div style={{display: "flex", "lineHeight": "34px"}}>Item: <ItemIcon style={{
        "margin-top": "auto",
        "margin-bottom": "auto"}}></ItemIcon><ItemDropdown onChange={changeItem}></ItemDropdown></div>
    );
  }
  

  // MOVE SELECTORS
  function MoveIcon({ moveNum }){
    // COME BACK AND ADD THE FIELD
    const c = useContext(context);

    var graphicData;
    if (c.moves[moveNum.toString()] !== "(No Move)"){
        var dummyMon = new Pokemon(gen, c.species, { teraType: (c.teraActive) ? c.teraType : undefined });
        dummyMon.moves = [];
        const fakeCalc = calculate(gen, dummyMon, new Pokemon(gen, "Kricketot"), new Move(gen, c.moves[moveNum.toString()], { isStellarFirstUse: (c.teraActive && c.teraType === "Stellar") ? true : false, }));
        graphicData = moveGraphicData(fakeCalc);
    }
    else{
        graphicData = {
            background: "transparent",
            imgSrc: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
        }
    }
  
    return (
        <div style={{ background: graphicData["background"], top: "0px", left: "0px", width: "30px", height: "30px"}}><img src={graphicData["imgSrc"]} style={{top: "0px", left: "0px", width: "30px", height: "30px"}} alt=""></img></div>
    );
  }
  function MoveDropdown({ onChange, moveNum }){
    const options = sortedMoves.map((move, index) =>
      <option value={move} key={index}>{move}</option>
    );
    const c = useContext(context);
    return (
      <select value={c.moves[moveNum.toString()]} onChange={onChange}>
        {options}
      </select>
    );
  }
  function MoveSelector({ moveNum }) {
  
    const c = useContext(context);
    function changeMove(event) {
      //setMoveName(event.target.value);
      //c.setMoveName(event.target.value, moveNum);
      c.setMove(event.target.value, moveNum);
      //console.log(c.moves);
      c.updateMon();
    }
  
    return (
        <div style={{display: "flex", "lineHeight": "30px"}}><MoveIcon moveNum={moveNum}></MoveIcon><MoveDropdown moveNum={moveNum} onChange={changeMove}></MoveDropdown></div>
    );
  }
  

  // SPECIES SELECTOR
  function SpeciesIcon(){
    const c = useContext(context);

    var imgSrc = "transparent url(".concat(img.Icons.getPokemon(c.species).url)
                            .concat(") no-repeat scroll ")
                            .concat(img.Icons.getPokemon(c.species).left.toString())
                            .concat("px ")
                            .concat(img.Icons.getPokemon(c.species).top.toString())
                            .concat("px");
    return (
      <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" style={{
        width: "40px",
        height: "30px",
        display: "inline-block",
        imageRendering: "pixelated",
        border: "0",
        background: imgSrc,
      }}></img>
    );
  }
  function SpeciesDropdown({ onChange }){
    const options = sortedMons.map((specie, index) =>
      <option value={specie} key={index}>{specie}</option>
    );
    const c = useContext(context);

    return (
      <select value={c.species} onChange={onChange}>
        {options}
      </select>
    );
  }
  function SpeciesSelector() {
  
    const c = useContext(context);

    function changeSpecies(event) {
      c.setSpecies(event.target.value);
      c.updateMon();
    }
  
    return (
      <div style={{display: "flex", "lineHeight": "34px"}}><SpeciesIcon></SpeciesIcon><SpeciesDropdown onChange={changeSpecies}></SpeciesDropdown></div>
    );
  }



  // ABILITY SELECTOR
  function AbilityDropdown({ onChange }){
    const c = useContext(context);

    const options = sortedAbilities.map((abil, index) =>
        <option value={abil} key={index}>{abil}</option>
    );

    return (
        <select value={c.ability} onChange={onChange}>
            {options}
        </select>
    )
  }
  function AbilitySelector() {
    const c = useContext(context);

    function changeAbility(event) {
        c.updateAbility(event.target.value);
        c.updateMon();
    }

    return (
        <div style={{display: "flex"}}>Ability: <AbilityDropdown onChange={changeAbility}></AbilityDropdown></div>
    );
  }


  // NATURE SELECTOR
  function NatureDropdown({ onChange }){
    const c = useContext(context);
    const options = Array.from(gen.natures).map((nat, index) =>
        <option value={nat.name} key={index}>{nat.name}</option>
    );

    return (
        <select value={c.nature} onChange={onChange}>
            {options}
        </select>
    )
  }
  function NatureSelector() {
    const c = useContext(context);

    function updateNature(event) {
        c.changeNature(event.target.value);
        c.updateMon();
    }

    return (
        <div style={{display: "flex"}}>Nature: <NatureDropdown onChange={updateNature}></NatureDropdown></div>
    );
  }



  // TERA TYPE SELECTOR
  function TeraIcon(){
    const c = useContext(context);
    
    var imgSrc = process.env.PUBLIC_URL + "/img/tera_" + c.teraType.toLowerCase() + "_gem.png";
    return (
        <img src={imgSrc} alt="" style={{
          width: "30px",
          height: "30px",
        }}></img>
      );
  }
  function TeraDropdown({ onChange }){
    const options = sortedTypes.map((t, index) =>
        <option value={t} key={index}>{t}</option>
    );
    const c = useContext(context);

    return (
        <select value={c.teraType} onChange={onChange}>
            {options}
        </select>
    );
  }
  function TeraToggle({ onChange }){
    return (
        <input type="checkbox" onChange={onChange}></input>
    );
  }
  function TeraTypeSelector(){
    const c = useContext(context);

    function updateTeraType(event) {
        c.changeTeraType(event.target.value);
        c.updateMon();
    }

    function updateTeraStatus(event) {
        c.toggleTera(event.target.checked);
        c.updateMon();
    }

    return (
        <div style={{display: "flex", "lineHeight": "30px"}}>Tera Type: <TeraIcon></TeraIcon><TeraDropdown onChange={updateTeraType}></TeraDropdown><TeraToggle onChange={updateTeraStatus}></TeraToggle></div>
    );
  }


  
  // STATS TABLE
  function EVInput({ stat, onChange }){
    const c = useContext(context);

    return (
        <input default="0" pattern="[0-9]*" min="0" max="252" step="1" type="number" placeholder="0" onChange={onChange} value={c.evs[stat]}></input>
    );
  }
  function IVInput({ stat, onChange }){
    const c = useContext(context);

    return (
        <input default="0" pattern="[0-9]*" min="0" max="31" step="1" type="number" placeholder="31" onChange={onChange} value={c.ivs[stat]}></input>
    );
  }
  function BoostDropdown({ stat, onChange }){
    const c = useContext(context);
    var options = boostList.map((boost, index) => 
        <option value={boostValues[index]} key={index}>{boost}</option>
    );

    return (
        <select value={c.boosts[stat]} onChange={onChange}>
            {options}
        </select>
    );
  }
  function StatsTableRow({ stat, statIndex }){
    const c = useContext(context);

    function updateEV(event){
        c.setEV(event.target.value, stat);
        c.updateMon();
    }

    function updateIV(event){
        c.setIV(event.target.value, stat);
        c.updateMon();
    }

    function updateBoost(event){
        c.setBoost(event.target.value, stat);
        c.updateMon();
    }
    var boostPickerNoHP = (stat !== "hp") ? <td><BoostDropdown stat={stat} onChange={updateBoost}></BoostDropdown></td> : <td></td>;

    var dummyMon = new Pokemon(gen, c.species, {evs: c.evs, ivs: c.ivs, ability: c.ability, nature: c.nature});
    var statNum = Math.floor(dummyMon.stats[stat] * (2+Math.max(0, c.boosts[stat]))/(2-Math.min(0, c.boosts[stat])));

    return (
        <tr><td>{ev_names[statIndex]}: </td><td><EVInput stat={stat} onChange={updateEV}></EVInput></td><td> IV: </td><td><IVInput stat={stat} onChange={updateIV}></IVInput></td>{boostPickerNoHP}<td>{statNum}</td></tr>
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

    function reviseNotes(event){
        c.updateNotes(event.target.value);
    }
    return (
        <div style={{display: "flex"}}>Notes: <input onChange={reviseNotes}></input></div>
    );
  }

  // MAIN PANEL
  export function PokemonPanel({ passedMon, passedNotes, monID, monSide }) {
    var [mon, setMon] = useState(passedMon);
    const [sideCode] = useState(monSide);
    const [id] = useState(monID);
    const [species, setSpeciesName] = useState(passedMon.species.name);
    const [nature, setNature] = useState(passedMon.nature);
    const [teraType, setTeraType] = useState((passedMon.teraType) ? passedMon.teraType : passedMon.types[0]);
    const [ability, setAbility] = useState(passedMon.ability);
    const [teraActive, setTeraStatus] = useState((passedMon.teraType) ? true : false);
    const [itemName, setItemName] = useState((passedMon.item) ? passedMon.item : "(no item)");
    var [moves, setMoves] = useState({ 
        1: (passedMon.moves[0] !== undefined) ? passedMon.moves[0] : "(No Move)",
        2: (passedMon.moves[0] !== undefined) ? passedMon.moves[1] : "(No Move)",
        3: (passedMon.moves[0] !== undefined) ? passedMon.moves[2] : "(No Move)",
        4: (passedMon.moves[0] !== undefined) ? passedMon.moves[3] : "(No Move)"});
    var [evs, setEVs] = useState({ hp: passedMon.evs["hp"], atk: passedMon.evs["atk"], def: passedMon.evs["def"], spa: passedMon.evs["spa"], spd: passedMon.evs["spd"], spe: passedMon.evs["spe"] });
    var [ivs, setIVs] = useState({ hp: passedMon.ivs["hp"], atk: passedMon.ivs["atk"], def: passedMon.ivs["def"], spa: passedMon.ivs["spa"], spd: passedMon.ivs["spd"], spe: passedMon.ivs["spe"] });
    var [boosts, setBoosts] = useState({ hp: passedMon.boosts["hp"], atk: passedMon.boosts["atk"], def: passedMon.boosts["def"], spa: passedMon.boosts["spa"], spd: passedMon.boosts["spd"], spe: passedMon.boosts["spe"] });
    var [notes, setNotes] = useState(passedNotes);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [fetchDataSwitch, setFetchDataSwitch] = useState(false);

    const debouncedFetchData = debounce((cb) => {
      cb(!fetchDataSwitch);
    }, 100);

    //console.log("mon index "+monID.toString()+" reinitialized with the following species:");
    //console.log(species);
    var pC = useContext(partyContext);

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
        setMon(newMon);
        pC.setMon(newMon, id);
    }

    function setItem(item){
        setItemName(item);
        //updateMon();
    }

    function setSpecies(s){
        setSpeciesName(s);
        var newTeraType = gen.species.get(toID(s)).types[0];
        changeTeraType(newTeraType);
        var newAbility = gen.species.get(toID(s)).abilities[0];
        updateAbility(newAbility);
        //updateMon();

    }

    function updateAbility(abil){
        setAbility(abil);
        //updateMon();
    }

    function toggleTera(status){
        setTeraStatus(status);
        //updateMon();
    }

    function changeTeraType(type){
        setTeraType(type);
        //updateMon();
    }

    function changeNature(nat){
        setNature(nat);
        //updateMon();
    }

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

    function setBoost(boost, stat){
        var statsCopy = {
            hp: boosts["hp"],
            atk: boosts["atk"],
            def: boosts["def"],
            spa: boosts["spa"],
            spd: boosts["spd"],
            spe: boosts["spe"],
        }
        statsCopy[stat] = boost;
        setBoosts(statsCopy);
        //updateMon();
    }

    function updateNotes(info){
        setNotes(info);
        pC.setMonNotes(info);
    }

    useEffect( () => {
      debouncedFetchData((res) => {
        setFetchDataSwitch(res);
      });
    }, [species, nature, ability, itemName, moves, evs, ivs, boosts, teraType, teraActive]);

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
  
    return (
    <context.Provider value={{ mon, setItem, setSpecies, setMove, changeTeraType, toggleTera, changeNature, updateAbility, setEV, setIV, setBoost, updateMon, updateNotes, notes, boosts, ivs, evs, ability, nature, teraType, teraActive, itemName, moves, species }}>
      <div style={{display: "flex"}} className="mon-panel">
        <div>
          <SpeciesSelector></SpeciesSelector>
          <NatureSelector></NatureSelector>
          <TeraTypeSelector></TeraTypeSelector>
          <AbilitySelector></AbilitySelector>
          <ItemSelector></ItemSelector>
          <StatsTable></StatsTable>
          <NotesInput></NotesInput>
        </div>
        { (sideCode === "attacker") && (
        <div style={{ "marginTop": "auto", "marginBottom": "auto"}}>
          <div><MoveSelector id={sideCode + "Move1-" + id.toString()} moveNum={1}></MoveSelector></div>
          <div><MoveSelector id={sideCode + "Move2-" + id.toString()} moveNum={2}></MoveSelector></div>
          <div><MoveSelector id={sideCode + "Move3-" + id.toString()} moveNum={3}></MoveSelector></div>
          <div><MoveSelector id={sideCode + "Move4-" + id.toString()} moveNum={4}></MoveSelector></div>
        </div>
        ) }
      </div>
      </context.Provider>
    );
  }