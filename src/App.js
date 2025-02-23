//import logo from './logo.svg';
import {Generations, toID, Field, Side} from '@smogon/calc';
import './App.css';
import { MonsContainer } from "./mons-container.js";
import { CalcTable } from "./calc-table.js";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {Sets, Teams} from '@pkmn/sets';

const gen = Generations.get(9);


const tabNames = ["Mons", "Import"];

function capitalize(val) {
  return val.charAt(0).toUpperCase()+val.slice(1);
}


function PanelButton({ text, tab, focusTab, id, sideCode }) {
  const memoTab = useMemo(() => tab, [tab]);
  const memoText = useMemo(() => text, [text]);
  const memoFocusTab = useCallback(() => focusTab(memoTab), [memoTab, focusTab]);

  const sideMemo = useMemo(() => sideCode, [sideCode]);
  return (
    <button className={sideMemo+"-button"} type="button" id={id} onClick={memoFocusTab} >{memoText}</button>
  );
}

function ImportContainer({ sideCode, importFunc }) {
  const [importText, setImportText] = useState("");
  const sideMemo = useMemo(() => sideCode, [sideCode]);
  var [importedStyle1, setImportedStyle1] = useState({ transition: "opacity 0ms", opacity: "0" });
  var [importedStyle2, setImportedStyle2] = useState({ opacity: "0", transition: "opacity 2000ms"});
  var [using2, setUsing2] = useState(true);
  function fadeImported(){
    console.log("switchin");
    if (using2){
      setImportedStyle2({ transition: "opacity 0ms", opacity: "1" });
      setImportedStyle1({ opacity: "0", transition: "opacity 2000ms"});
      setUsing2(false);
    }
    else {
      setImportedStyle1({ transition: "opacity 0ms", opacity: "1"});
      setImportedStyle2({ opacity: "0", transition: "opacity 2000ms"});
      setUsing2(true);
    }
    
  }
  const importFuncMemo = useCallback(() => { importFunc(importText, fadeImported) }, [importText, importFunc]);

  const updateImported = useCallback((event) => { setImportText(event.target.value); }, [setImportText]);

  


  //useEffect(() => {
  //  console.log(importText); 
  //}, [importText]);

  return (
    <div style={{ display: "flex", height: "100%"}}>
      <div style={{ marginTop: "auto", marginBottom: "auto", marginLeft: "auto", marginRight: "auto"}}>
        <textarea id={sideMemo} cols="75" rows="20" onChange={updateImported} value={importText}></textarea>
        <p /><div style={{...{transition: "opacity 2000ms"}, ...importedStyle1}}>imported!</div><div style={{...{transition: "opacity 2000ms"}, ...importedStyle2}}>imported!</div>
        <button type="button" onClick={importFuncMemo}>Import</button>
      </div>
    </div>
  );
}

function TabManager({ sideCode, updateMons, monsPanelOpen, setMonsPanelOpen, closeMonsPanels, closeFieldPanel }) {
  const [tabsActive, setTabsActive] = useState([true, false]);
  const [importedTeamStorage, setImportedTeamStorage] = useState({});
  const sideMemo = useMemo(() => sideCode, [sideCode]);
  const [containerTransition, setContainerTransition] = useState({ height: "34px"});
  const [buttonTransition, setButtonTransition] = useState((sideCode === "attacker") ? { top: "33px" } : { bottom: "34px" });
  const [containerCollapsed, setContainerCollapsed] = useState(true);
  const monsPanelOpenMemo = useMemo(() => monsPanelOpen, [monsPanelOpen]);

  useEffect(() => {if (!monsPanelOpenMemo){ setContainerCollapsed(true); forceClosedContainer(); } }, [monsPanelOpenMemo]);
  
  function focusTab(tab) {
    if (tabsActive[tabNames.indexOf(tab)]){
      collapseContainer();
    }
    else {
      forceOpenContainer();
      const blankArr = new Array(tabNames.length).fill(false);
      blankArr[tabNames.indexOf(tab)] = true;
      setTabsActive(blankArr);
    }
  }
  function forceOpenContainer(){
    setContainerTransition({ height: ((sideCode === "attacker") ? "552" : "421")+"px" });
    setButtonTransition((sideCode === "attacker") ? { top: "551px" } : { bottom: "421px" });
    setContainerCollapsed(false);
    setMonsPanelOpen(true);
  }
  function collapseContainer(tab) {
    console.log("collapsing");
    if (containerCollapsed){
      setContainerTransition({ height: ((sideCode === "attacker") ? "552" : "421")+"px" });
      setButtonTransition((sideCode === "attacker") ? { top: "551px" } : { bottom: "421px" });
      setContainerCollapsed(false);
      setMonsPanelOpen(true);
      closeFieldPanel();
    }
    else {
      setContainerTransition({ height: "34px" });
      setButtonTransition((sideCode === "attacker") ? { top: "33px" } : { bottom: "34px" });
      setContainerCollapsed(true);
      //setMonsPanelOpen(false);
      //closeMonsPanels();
    }
  }
  function forceClosedContainer(){
    console.log("closing");
    setContainerTransition({ height: "34px" });
    setButtonTransition((sideCode === "attacker") ? { top: "33px" } : { bottom: "34px" });
    setContainerCollapsed(true);
    setMonsPanelOpen(false);
  }

  function importMons(input, fadeImported) {
    if (input && Teams.importTeam(input)) {
      fadeImported();
      var importedTeam = Teams.importTeam(input.trim()).team;
      var species = [];
      var natures = [];
      var abilities = [];
      var items = [];
      var teraTypes = [];
      var moves = [];
      var evs = [];
      var ivs = [];
      var notes = [];
      for (const mon of importedTeam) {
        if (gen.species.get((toID(mon.species)))){ // valid mon
          species.push(mon.species);
          natures.push((mon.nature) ? mon.nature : "Serious");
          abilities.push((mon.ability) ? mon.ability : gen.species.get((toID(mon.species))).abilities[0]);
          items.push((mon.item) ? mon.item : "(no item)");
          teraTypes.push((mon.teraType) ? mon.teraType : undefined);
          moves.push({
            1: (mon.moves && mon.moves[0]) ? mon.moves[0] : "(No Move)",
            2: (mon.moves && mon.moves[1]) ? mon.moves[1] : "(No Move)",
            3: (mon.moves && mon.moves[2]) ? mon.moves[2] : "(No Move)",
            4: (mon.moves && mon.moves[3]) ? mon.moves[3] : "(No Move)",
          });
          evs.push({
            hp: (mon.evs && mon.evs["hp"]) ? mon.evs["hp"] : 0,
            atk: (mon.evs && mon.evs["atk"]) ? mon.evs["atk"] : 0,
            def: (mon.evs && mon.evs["def"]) ? mon.evs["def"] : 0,
            spa: (mon.evs && mon.evs["spa"]) ? mon.evs["spa"] : 0,
            spd: (mon.evs && mon.evs["spd"]) ? mon.evs["spd"] : 0,
            spe: (mon.evs && mon.evs["spe"]) ? mon.evs["spe"] : 0,
          });
          ivs.push({
            hp: (mon.ivs && mon.ivs["hp"]) ? mon.ivs["hp"] : 31,
            atk: (mon.ivs && mon.ivs["atk"]) ? mon.ivs["atk"] : 31,
            def: (mon.ivs && mon.ivs["def"]) ? mon.ivs["def"] : 31,
            spa: (mon.ivs && mon.ivs["spa"]) ? mon.ivs["spa"] : 31,
            spd: (mon.ivs && mon.ivs["spd"]) ? mon.ivs["spd"] : 31,
            spe: (mon.ivs && mon.ivs["spe"]) ? mon.ivs["spe"] : 31,
          });
          notes.push((mon.name) ? mon.name : "");
        }
      }
      setImportedTeamStorage({
        species: species,
        natures: natures,
        abilities: abilities,
        items: items,
        teraTypes: teraTypes,
        moves: moves,
        evs: evs,
        ivs: ivs,
        notes: notes,
      });
    }
  }

  return (
    <div>
      <div className={sideCode+"s"} id={sideCode+"Mons"} style={{...{overflow: "hidden"}, ...containerTransition, ...{scrollbarWidth: (containerCollapsed) ? "0px" : "auto"}}}><MonsContainer updateMons={updateMons} tabActive={(tabsActive[0])} collapsed={containerCollapsed} sideCode={sideCode} imported={importedTeamStorage}></MonsContainer></div>
      <div className={sideCode+"s"} id={sideCode+"Import"} style={{...{overflow: "hidden"}, ...containerTransition, ...((tabsActive[1] && !containerCollapsed) ? {} : {display: "none"})}}><ImportContainer sideCode={sideCode} importFunc={importMons}></ImportContainer></div>
      <div className={sideCode+"s-buttons"} style={{ ...buttonTransition }}>
          <PanelButton text={capitalize(sideCode)+"s"} sideCode={sideCode} tab={tabNames[0]} focusTab={focusTab} id={(tabsActive[0]) ? "active" : "inactive"}></PanelButton>
          <PanelButton text="Import" sideCode={sideCode} tab={tabNames[1]} focusTab={focusTab} id={(tabsActive[1]) ? "active" : "inactive"}></PanelButton>
          <PanelButton text="Collapse/Expand" sideCode={sideCode} tab={tabNames[0]} focusTab={collapseContainer} id={"inactive"}></PanelButton>
      </div>
    </div>
  );
}

function FieldPanel({ updateGameType, gametype, updateWeather, weather, updateTerrain, terrain, updateGravity, gravity, updateReflect, reflectAttacker, reflectDefender, updateLightscreen, lightscreenAttacker, lightscreenDefender, updateVeil, veilAttacker, veilDefender, updateMagicRoom, magicroom, updateWonderRoom, wonderroom,
                      updateHelpinghand, helpinghand, updateTailwind, tailwind, updateTailwindDef, tailwindDef, updateFriendguard, friendguard, updateBattery, battery, updatePowerspot, powerspot, updateFlowergift, flowergift, updateFlowergiftDef, flowergiftDef,
                      updateSteelyspirit, steelyspirit, updateBeadsofruin, beadsofruin, updateSwordofruin, swordofruin, updateTabletsofruin, tabletsofruin, updateVesselofruin, vesselofruin, updateAurabreak, aurabreak, updateDarkaura, darkaura, updateFairyaura, fairyaura,
                      fieldPanelOpen, setFieldPanelOpen, setMonsPanelOpen, closeMonsPanels, closeFieldPanel
 }) {
  //const [tabsActive, setTabsActive] = useState([true]);
  const [containerTransition, setContainerTransition] = useState({ width: "0px" });
  const [buttonTransition, setButtonTransition] = useState({ left: "0px" });
  const [containerCollapsed, setContainerCollapsed] = useState(true);

  const fieldPanelOpenMemo = useMemo(() => fieldPanelOpen, [fieldPanelOpen]);

  const gameTypeMemo = useMemo(() => gametype, [gametype]);
  const weatherMemo = useMemo(() => weather, [weather]);
  const terrainMemo = useMemo(() => terrain, [terrain]);
  const gravityMemo = useMemo(() => gravity, [gravity]);
  //const reflectAttackerMemo = useMemo(() => reflectAttacker, [reflectAttacker]);
  //const lightscreenAttackerMemo = useMemo(() => lightscreenAttacker, [lightscreenAttacker]);
  //const veilAttackerMemo = useMemo(() => veilAttacker, [veilAttacker]);
  const reflectDefenderMemo = useMemo(() => reflectDefender, [reflectDefender]);
  const lightscreenDefenderMemo = useMemo(() => lightscreenDefender, [lightscreenDefender]);
  const veilDefenderMemo = useMemo(() => veilDefender, [veilDefender]);
  const magicroomMemo = useMemo(() => magicroom, [magicroom]);
  const wonderroomMemo = useMemo(() => wonderroom, [wonderroom]);
  const helpinghandMemo = useMemo(() => helpinghand, [helpinghand]);
  const tailwindMemo = useMemo(() => tailwind, [tailwind]);
  const tailwindDefMemo = useMemo(() => tailwindDef, [tailwindDef]);
  const friendguardMemo = useMemo(() => friendguard, [friendguard]);
  const batteryMemo = useMemo(() => battery, [battery]);
  const powerspotMemo = useMemo(() => powerspot, [powerspot]);
  const flowergiftMemo = useMemo(() => flowergift, [flowergift]);
  const flowergiftDefMemo = useMemo(() => flowergiftDef, [flowergiftDef]);
  const steelyspiritMemo = useMemo(() => steelyspirit, [steelyspirit]);
  const beadsofruinMemo = useMemo(() => beadsofruin, [beadsofruin]);
  const swordofruinMemo = useMemo(() => swordofruin, [swordofruin]);
  const tabletsofruinMemo = useMemo(() => tabletsofruin, [tabletsofruin]);
  const vesselofruinMemo = useMemo(() => vesselofruin, [vesselofruin]);
  const aurabreakMemo = useMemo(() => aurabreak, [aurabreak]);
  const darkauraMemo = useMemo(() => darkaura, [darkaura]);
  const fairyauraMemo = useMemo(() => fairyaura, [fairyaura]);
  var changeGameType = useCallback((event) => updateGameType(event.target.value), [updateGameType]);
  var changeWeather = useCallback((event) => updateWeather(event.target.value), [updateWeather]);
  var changeTerrain = useCallback((event) => updateTerrain(event.target.value), [updateTerrain]);
  var changeGravity = useCallback((event) => updateGravity(event.target.checked), [updateGravity]);
  //var changeReflectAttacker = useCallback((event) => updateReflect(event.target.checked, "attacker"), [updateReflect]);
  //var changeLightscreenAttacker = useCallback((event) => updateLightscreen(event.target.checked, "attacker"), [updateLightscreen]);
  //var changeVeilAttacker = useCallback((event) => updateVeil(event.target.checked, "attacker"), [updateVeil]);
  //var changeReflectDefender = useCallback((event) => {updateReflect(event.target.checked, "defender"); updateVeil(veilDefenderMemo && !event.target.checked, "defender");}, [updateReflect, veilDefenderMemo, updateVeil]);
  //var changeLightscreenDefender = useCallback((event) => {updateLightscreen(event.target.checked, "defender"); updateVeil(veilDefenderMemo && !event.target.checked, "defender")}, [updateLightscreen, veilDefenderMemo, updateVeil]);
  //var changeVeilDefender = useCallback((event) => {updateVeil(event.target.checked, "defender"); updateReflect(reflectDefenderMemo && !event.target.checked, "defender"); updateLightscreen(lightscreenDefenderMemo && !event.target.checked, "defender");}, [updateVeil, reflectDefenderMemo, updateReflect, lightscreenDefenderMemo, updateLightscreen]);
  var changeReflectDefender = useCallback((event) => updateReflect(event.target.checked, "defender"), [updateReflect]);
  var changeLightscreenDefender = useCallback((event) => updateLightscreen(event.target.checked, "defender"), [updateLightscreen]);
  var changeVeilDefender = useCallback((event) => updateVeil(event.target.checked, "defender"), [updateVeil]);
  var changeMagicRoom = useCallback((event) => updateMagicRoom(event.target.checked), [updateMagicRoom]);
  var changeWonderRoom = useCallback((event) => updateWonderRoom(event.target.checked), [updateWonderRoom]);
  var changeHelpinghand = useCallback((event) => updateHelpinghand(event.target.checked), [updateHelpinghand]);
  var changeTailwind = useCallback((event) => updateTailwind(event.target.checked), [updateTailwind]);
  var changeTailwindDef = useCallback((event) => updateTailwindDef(event.target.checked), [updateTailwindDef]);
  var changeFriendguard = useCallback((event) => updateFriendguard(event.target.checked), [updateFriendguard]);
  var changeBattery = useCallback((event) => updateBattery(event.target.checked), [updateBattery]);
  var changePowerspot = useCallback((event) => updatePowerspot(event.target.checked), [updatePowerspot]);
  var changeFlowergift = useCallback((event) => updateFlowergift(event.target.checked), [updateFlowergift]);
  var changeFlowergiftDef = useCallback((event) => updateFlowergiftDef(event.target.checked), [updateFlowergiftDef]);
  var changeSteelyspirit = useCallback((event) => updateSteelyspirit(event.target.checked), [updateSteelyspirit]);
  var changeBeadsofruin = useCallback((event) => updateBeadsofruin(event.target.checked), [updateBeadsofruin]);
  var changeSwordofruin = useCallback((event) => updateSwordofruin(event.target.checked), [updateSwordofruin]);
  var changeTabletsofruin = useCallback((event) => updateTabletsofruin(event.target.checked), [updateTabletsofruin]);
  var changeVesselofruin = useCallback((event) => updateVesselofruin(event.target.checked), [updateVesselofruin]);
  var changeAurabreak = useCallback((event) => updateAurabreak(event.target.checked), [updateAurabreak]);
  var changeDarkaura = useCallback((event) => updateDarkaura(event.target.checked), [updateDarkaura]);
  var changeFairyaura = useCallback((event) => updateFairyaura(event.target.checked), [updateFairyaura]);

  useEffect(() => {if (!fieldPanelOpenMemo){ setContainerCollapsed(true); forceClosedContainer(); } }, [fieldPanelOpenMemo]);


  function focusTab(tab) {
    console.log(fieldPanelOpenMemo);
    if (fieldPanelOpenMemo){
      collapseContainer();
    }
    else {
      forceOpenContainer();
      //const blankArr = new Array(1).fill(false);
      //blankArr[0] = true;
      //setTabsActive(blankArr);
    }
  }
  function forceOpenContainer(){
    console.log("forcing open");
    setContainerTransition({ width: "200px" });
    setButtonTransition({ left: "200px" });
    setContainerCollapsed(false);
    setFieldPanelOpen(true);
    closeMonsPanels();
  }
  function collapseContainer(tab) {
    console.log("collapsing");
    console.log(containerCollapsed);
    if (containerCollapsed){
      setContainerTransition({ width: "200px" });
      setButtonTransition({ left: "200px" });
      setContainerCollapsed(false);
      setFieldPanelOpen(true);
      console.log("closing mon panels");
      closeMonsPanels();
    }
    else {
      setContainerTransition({ width: "0px" });
      setButtonTransition({ left: "0px" });
      setContainerCollapsed(true);
      setFieldPanelOpen(false);
      closeFieldPanel();
    }
  }
  function forceClosedContainer(){
    setContainerTransition({ width: "0px" });
    setButtonTransition({ left: "0px" });
    setContainerCollapsed(true);
    setFieldPanelOpen(false);
  }

  return (
    <div>
      <div className={"field"} id={"field"} style={{...{overflow: "hidden"}, ...containerTransition, ...{scrollbarWidth: (containerCollapsed) ? "0px" : "auto"}}}>
        <div>Format</div>
        <select value={gameTypeMemo} onChange={changeGameType}>
          <option value="Singles">Singles</option>
          <option value="Doubles">Doubles</option>
        </select>
        <div>Weather</div>
        <select value={weatherMemo} onChange={changeWeather}>
          <option value="">None</option>
          <option value="Rain">Rain</option>
          <option value="Heavy Rain">Heavy Rain</option>
          <option value="Sun">Sun</option>
          <option value="Harsh Sunshine">Harsh Sunshine</option>
          <option value="Sand">Sandstorm</option>
          <option value="Snow">Snow</option>
          <option value="Strong Winds">Strong Winds</option>
        </select>
        <div>Terrain</div>
        <select value={terrainMemo} onChange={changeTerrain}>
          <option value="">None</option>
          <option value="Electric">Electric Terrain</option>
          <option value="Grassy">Grassy Terrain</option>
          <option value="Psychic">Psychic Terrain</option>
          <option value="Misty">Misty Terrain</option>
        </select>
        <div style={{textAlign: "left", textOverflow: "clip"}}>
          <div><input type="checkbox" onChange={changeGravity} checked={gravityMemo}></input> Gravity</div>
          <div><input type="checkbox" onChange={changeReflectDefender} checked={reflectDefenderMemo}></input> Reflect</div>
          <div><input type="checkbox" onChange={changeLightscreenDefender} checked={lightscreenDefenderMemo}></input> Light Screen</div>
          <div><input type="checkbox" onChange={changeVeilDefender} checked={veilDefenderMemo}></input> Aurora Veil</div>
          <div><input type="checkbox" onChange={changeMagicRoom} checked={magicroomMemo}></input> Magic Room</div>
          <div><input type="checkbox" onChange={changeWonderRoom} checked={wonderroomMemo}></input> Wonder Room</div>
          <div><input type="checkbox" onChange={changeHelpinghand} checked={helpinghandMemo}></input> Helping Hand</div>
          <div><input type="checkbox" onChange={changeTailwind} checked={tailwindMemo}></input> Tailwind (attacking)</div>
          <div><input type="checkbox" onChange={changeTailwindDef} checked={tailwindDefMemo}></input> Tailwind (defending)</div>
          <div><input type="checkbox" onChange={changeFriendguard} checked={friendguardMemo}></input> Friend Guard</div>
          <div><input type="checkbox" onChange={changeBattery} checked={batteryMemo}></input> Battery</div>
          <div><input type="checkbox" onChange={changePowerspot} checked={powerspotMemo}></input> Power Spot</div>
          <div><input type="checkbox" onChange={changeFlowergift} checked={flowergiftMemo}></input> Flower Gift (attacking)</div>
          <div><input type="checkbox" onChange={changeFlowergiftDef} checked={flowergiftDefMemo}></input> Flower Gift (defending)</div>
          <div><input type="checkbox" onChange={changeBeadsofruin} checked={beadsofruinMemo}></input> Beads of Ruin</div>
          <div><input type="checkbox" onChange={changeSwordofruin} checked={swordofruinMemo}></input> Sword of Ruin</div>
          <div><input type="checkbox" onChange={changeTabletsofruin} checked={tabletsofruinMemo}></input> Tablets of Ruin</div>
          <div><input type="checkbox" onChange={changeVesselofruin} checked={vesselofruinMemo}></input> Vessel of Ruin</div>
          <div><input type="checkbox" onChange={changeAurabreak} checked={aurabreakMemo}></input> Aura Break</div>
          <div><input type="checkbox" onChange={changeDarkaura} checked={darkauraMemo}></input> Dark Aura</div>
          <div><input type="checkbox" onChange={changeFairyaura} checked={fairyauraMemo}></input> Fairy Aura</div>
        </div>
      </div>
      
      <div className={"field-buttons"} style={{ ...buttonTransition }}>
        <PanelButton text="Field" sideCode="field" tab="Field" focusTab={focusTab} id={(fieldPanelOpenMemo) ? "active" : "inactive"}></PanelButton>
      </div>
    </div>
  );
}

/*

          <div>
            <div>Attackers</div>
            <div><input type="checkbox" onChange={changeReflectAttacker} checked={reflectAttackerMemo && !veilAttackerMemo}></input> Reflect</div>
            <div><input type="checkbox" onChange={changeLightscreenAttacker} checked={lightscreenAttackerMemo && !veilAttackerMemo}></input> Light Screen</div>
            <div><input type="checkbox" onChange={changeVeilAttacker} checked={veilAttackerMemo && !reflectAttackerMemo && !lightscreenAttackerMemo}></input> Aurora Veil</div>
          </div>
            <div>Defenders</div>

*/


function App() {

  const [monsPanelOpen, setMonsPanelOpen] = useState(false);
  const [fieldPanelOpen, setFieldPanelOpen] = useState(false);
  const [attackerMons, setAttackerMons] = useState([]);
  const [defenderMons, setDefenderMons] = useState([]);
  const [field, setField] = useState(new Field());
  const [gameType, setGameType] = useState("Singles");
  const [weather, setWeather] = useState("");
  const [terrain, setTerrain] = useState("");
  const [gravity, setGravity] = useState(false);
  const [magicroom, setMagicRoom] = useState(false);
  const [wonderroom, setWonderRoom] = useState(false);
  const [helpinghand, setHelpinghand] = useState(false);
  const [tailwind, setTailwind] = useState(false);
  const [tailwindDef, setTailwindDef] = useState(false);
  const [friendguard, setFriendguard] = useState(false);
  const [battery, setBattery] = useState(false);
  const [powerspot, setPowerspot] = useState(false);
  const [flowergift, setFlowergift] = useState(false);
  const [flowergiftDef, setFlowergiftDef] = useState(false);
  const [steelyspirit, setSteelyspirit] = useState(false);
  const [beadsofruin, setBeadsofruin] = useState(false);
  const [swordofruin, setSwordofruin] = useState(false);
  const [tabletsofruin, setTabletsofruin] = useState(false);
  const [vesselofruin, setVesselofruin] = useState(false);
  const [aurabreak, setAurabreak] = useState(false);
  const [darkaura, setDarkaura] = useState(false);
  const [fairyaura, setFairyaura] = useState(false);
  const [attackerReflect, setAttackerReflect] = useState(false);
  const [attackerLightscreen, setAttackerLightscreen] = useState(false);
  const [attackerVeil, setAttackerVeil] = useState(false);
  const [attackerField, setAttackerField] = useState(new Side());
  const [defenderReflect, setDefenderReflect] = useState(false);
  const [defenderLightscreen, setDefenderLightscreen] = useState(false);
  const [defenderVeil, setDefenderVeil] = useState(false);
  const [defenderField, setDefenderField] = useState(new Side());

  function updateMons(sideCode, packaged){
    /*
    const monified = packaged.map((mon) =>
      new Pokemon(gen, mon.species, {
        nature: mon.nature,
        ability: mon.ability,
        item: mon.item,
        teraType: (mon.teraActive) ? (mon.teraType) : undefined,
        moves: mon.moves,
        evs: mon.evs,
        ivs: mon.ivs,
        name: mon.notes,
      })
    )
    */
    if (sideCode === "attacker") {
      setAttackerMons(packaged);
    }
    else if (sideCode === "defender") {
      setDefenderMons(packaged);
    }
  }

  function updateGameType(t){
    setGameType(t);
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: t, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: defenderField});
  }

  function updateWeather(w){
    setWeather(w);
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: w, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: defenderField});
  }

  function updateTerrain(t){
    setTerrain(t);
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: t, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: defenderField});
  }

  function updateGravity(g){
    setGravity(g);
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: g, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: defenderField})
  }

  function updateMagicRoom(m){
    setMagicRoom(m);
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: m, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: defenderField});
  }

  function updateWonderRoom(w){
    setWonderRoom(w);
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: w, attackerSide: attackerField, defenderSide: defenderField});
  }

  function updateHelpinghand(h){
    setHelpinghand(h);
    setAttackerField({isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: h, isTailwind: tailwind, isBattery: battery, isPowerSpot: powerspot})
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: {isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: h, isTailwind: tailwind, isBattery: battery, isPowerSpot: powerspot}, defenderSide: defenderField});
  }

  function updateTailwind(t){
    setTailwind(t);
    setAttackerField({isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: t, isBattery: battery, isPowerSpot: powerspot});
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: {isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: t, isBattery: battery, isPowerSpot: powerspot}, defenderSide: defenderField});
  }

  function updateTailwindDef(t){
    setTailwindDef(t);
    setDefenderField({isFriendGuard: friendguard, isReflect: defenderReflect, isLightScreen: defenderLightscreen, isAuroraVeil: defenderVeil, isTailwind: t});
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: {isFlowerGift: flowergiftDef, isTailwind: t, isFriendGuard: friendguard, isReflect: defenderReflect, isLightScreen: defenderLightscreen, isAuroraVeil: defenderVeil}});
  }

  function updateFriendguard(f){
    setFriendguard(f);
    setDefenderField({isFriendGuard: f, isReflect: defenderReflect, isLightScreen: defenderLightscreen, isAuroraVeil: defenderVeil, isTailwind: tailwindDef});
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: {isTailwind: tailwindDef, isFlowerGift: flowergiftDef, isFriendGuard: f, isReflect: defenderReflect, isLightScreen: defenderLightscreen, isAuroraVeil: defenderVeil}});
  }

  function updateBattery(b){
    setBattery(b);
    setAttackerField({isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: b, isPowerSpot: powerspot});
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: {isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: b, isPowerSpot: powerspot}, defenderSide: defenderField});
  }

  function updatePowerspot(p){
    setPowerspot(p);
    setAttackerField({isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: battery, isPowerSpot: p});
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: {isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: battery, isPowerSpot: p}, defenderSide: defenderField});
  }

  function updateFlowergift(f){
    setFlowergift(f);
    setAttackerField({isSteelySpirit: steelyspirit, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: battery, isPowerSpot: powerspot, isFlowerGift: f});
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: {isSteelySpirit: steelyspirit, isFlowerGift: f, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: battery, isPowerSpot: powerspot}, defenderSide: defenderField});
  }

  function updateFlowergiftDef(f){
    setFlowergiftDef(f);
    setDefenderField({isFlowerGift: f, isFriendGuard: friendguard, isReflect: defenderReflect, isLightScreen: defenderLightscreen, isAuroraVeil: defenderVeil, isTailwind: tailwindDef});
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: {isTailwind: tailwindDef, isFlowerGift: f, isFriendGuard: friendguard, isReflect: defenderReflect, isLightScreen: defenderLightscreen, isAuroraVeil: defenderVeil}});
  }

  function updateSteelyspirit(s){
    setSteelyspirit(s);
    setAttackerField({isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: battery, isPowerSpot: powerspot, isFlowerGift: flowergift, isSteelySpirit: s});
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: {isSteelySpirit: s, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: battery, isPowerSpot: powerspot}, defenderSide: defenderField});
  }

  function updateBeadsofruin(b){
    setBeadsofruin(b);
    updateField({isBeadsOfRuin: b, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: defenderField});
  }

  function updateSwordofruin(s){
    setSwordofruin(s);
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: s, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: defenderField});
  }

  function updateTabletsofruin(t){
    setTabletsofruin(t);
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: t, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: defenderField});
  }

  function updateVesselofruin(v){
    setVesselofruin(v);
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: v, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: defenderField});
  }

  function updateAurabreak(a){
    setAurabreak(a);
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: a, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: defenderField});
  }

  function updateDarkaura(d){
    setDarkaura(d);
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: d, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: defenderField});
  }

  function updateFairyaura(f){
    setFairyaura(f);
    updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: f, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: defenderField});
  }

  function updateReflect(r, sideCode){
    if (sideCode === "attacker"){
      setAttackerReflect(r);
      if (attackerVeil && r){
        setAttackerVeil(false);
      }
      setAttackerField({isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: battery, isPowerSpot: powerspot, isReflect: r, isLightScreen: attackerLightscreen, isAuroraVeil: attackerVeil && !r});
      updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: {isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: battery, isPowerSpot: powerspot, isReflect: r, isLightScreen: attackerLightscreen, isAuroraVeil: attackerVeil && !r}, defenderSide: defenderField});
    }
    else if (sideCode === "defender"){
      setDefenderReflect(r);
      //if (defenderVeil && r){
      //  setDefenderVeil(false);
      //}
      setDefenderField({isFlowerGift: flowergiftDef, isTailwind: tailwindDef, isFriendGuard: friendguard, isReflect: r, isLightScreen: defenderLightscreen, isAuroraVeil: defenderVeil});
      updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: {isFlowerGift: flowergiftDef, isTailwind: tailwindDef, isFriendGuard: friendguard, isReflect: r, isLightScreen: defenderLightscreen, isAuroraVeil: defenderVeil}});
    }
  }

  function updateLightscreen(l, sideCode){
    if (sideCode === "attacker"){
      setAttackerLightscreen(l);
      if (attackerVeil && l){
        setAttackerVeil(false);
      }
      setAttackerField({isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: battery, isPowerSpot: powerspot, isReflect: attackerReflect, isLightScreen: l, isAuroraVeil: attackerVeil && !l});
      updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: {isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: battery, isPowerSpot: powerspot, isReflect: attackerReflect, isLightScreen: l, isAuroraVeil: attackerVeil && !l}, defenderSide: defenderField});
    }
    else if (sideCode === "defender"){
      setDefenderLightscreen(l);
      //if (defenderVeil && l){
      //  setDefenderVeil(false);
      //}
      setDefenderField({isFlowerGift: flowergiftDef, isTailwind: tailwindDef, isFriendGuard: friendguard, isReflect: defenderReflect, isLightScreen: l, isAuroraVeil: defenderVeil});
      updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: {isFlowerGift: flowergiftDef, isTailwind: tailwindDef, isFriendGuard: friendguard, isReflect: defenderReflect, isLightScreen: l, isAuroraVeil: defenderVeil}});
    }
  }

  function updateVeil(v, sideCode){
    if (sideCode === "attacker"){
      setAttackerVeil(v);
      //if (attackerReflect && v){
      //  setAttackerReflect(false);
      //}
      //if (attackerLightscreen && v){
      //  setAttackerLightscreen(false);
      //}
      setAttackerField({isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: battery, isPowerSpot: powerspot, isReflect: attackerReflect, isLightScreen: attackerLightscreen, isAuroraVeil: v});
      updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: {isSteelySpirit: steelyspirit, isFlowerGift: flowergift, isHelpingHand: helpinghand, isTailwind: tailwind, isBattery: battery, isPowerSpot: powerspot, isReflect: attackerReflect, isLightScreen: attackerLightscreen, isAuroraVeil: v}, defenderSide: defenderField});
    }
    if (sideCode === "defender"){
      setDefenderVeil(v);
      //if (defenderReflect && v){
      //  setDefenderReflect(false);
      //}
      //if (defenderLightscreen && v){
      //  setDefenderLightscreen(false);
      //}
      setDefenderField({isFlowerGift: flowergiftDef, isTailwind: tailwindDef, isFriendGuard: friendguard, isReflect: defenderReflect, isLightScreen: defenderLightscreen, isAuroraVeil: v});
      updateField({isBeadsOfRuin: beadsofruin, isSwordOfRuin: swordofruin, isTabletsOfRuin: tabletsofruin, isVesselOfRuin: vesselofruin, isAuraBreak: aurabreak, isDarkAura: darkaura, isFairyAura: fairyaura, gameType: gameType, weather: weather, terrain: terrain, isGravity: gravity, isMagicRoom: magicroom, isWonderRoom: wonderroom, attackerSide: attackerField, defenderSide: {isFlowerGift: flowergiftDef, isTailwind: tailwindDef, isFriendGuard: friendguard, isReflect: defenderReflect, isLightScreen: defenderLightscreen, isAuroraVeil: v}});
    }
  }

  function updateField(packaged){
    setField(new Field(packaged));
  }

  function closeFieldPanel(){
    setMonsPanelOpen(true);
    setFieldPanelOpen(false);
  }

  function closeMonsPanels(){
    setFieldPanelOpen(true);
    setMonsPanelOpen(false);
  }

  return (
    <div className="App" >
      {/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      */}
      <div className="calcTable" style={{position: "absolute", width: "100%", top: "80px"}}>
        <CalcTable attackers={attackerMons} defenders={defenderMons} field={field}></CalcTable>
        <div style={{height: "80px"}}></div>
      </div>
      <TabManager sideCode="attacker" updateMons={updateMons} monsPanelOpen={monsPanelOpen} setMonsPanelOpen={setMonsPanelOpen} closeMonsPanels={closeMonsPanels} closeFieldPanel={closeFieldPanel}></TabManager>
      <FieldPanel updateHelpinghand={updateHelpinghand} updateGameType={updateGameType} updateWeather={updateWeather} updateTerrain={updateTerrain} updateGravity={updateGravity} updateReflect={updateReflect}
                  updateLightscreen={updateLightscreen} updateVeil={updateVeil} updateMagicRoom={updateMagicRoom} updateWonderRoom={updateWonderRoom} updateTailwind={updateTailwind} updateTailwindDef={updateTailwindDef}
                  updateFriendguard={updateFriendguard} updateBattery={updateBattery} updatePowerspot={updatePowerspot} updateFlowergift={updateFlowergift} updateFlowergiftDef={updateFlowergiftDef} updateSteelyspirit={updateSteelyspirit}
                  updateBeadsofruin={updateBeadsofruin} updateSwordofruin={updateSwordofruin} updateTabletsofruin={updateTabletsofruin} updateVesselofruin={updateVesselofruin} updateAurabreak={updateAurabreak}
                  updateDarkaura={updateDarkaura} updateFairyaura={updateFairyaura} fieldPanelOpen={fieldPanelOpen} setFieldPanelOpen={setFieldPanelOpen} closeMonsPanels={closeMonsPanels} closeFieldPanel={closeFieldPanel}></FieldPanel>
      <TabManager sideCode="defender" updateMons={updateMons} monsPanelOpen={monsPanelOpen} setMonsPanelOpen={setMonsPanelOpen} closeMonsPanels={closeMonsPanels} closeFieldPanel={closeFieldPanel}></TabManager>
      
    </div>
  );
}







export default App;
