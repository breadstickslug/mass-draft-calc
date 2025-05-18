//import logo from './logo.svg';
import {Generations, toID, Field, Side} from '@smogon/calc';
import './App.css';
import { MonsContainer } from "./mons-container.js";
import { CalcTable } from "./calc-table.js";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {Sets, Teams} from '@pkmn/sets';

const gen = Generations.get(7);
const root = document.documentElement;


const tabNames = ["Mons", "Import", "Export"];

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

function ExportContainer({ sideCode, exportString }) {
  //const [exportText, setExportText] = useState("");
  const sideMemo = useMemo(() => sideCode, [sideCode]);
  const exportStringMemo = useMemo(() => exportString, [exportString]);
  
  //const exportFuncMemo = useCallback(() => { exportFunc(exportText) }, [exportText, exportFunc]);

  //const updateExported = useCallback((event) => { setExportText(event.target.value); }, [setExportText]);


  return (
    <div style={{ display: "flex", height: "100%"}}>
      <div style={{ marginTop: "auto", marginBottom: "auto", marginLeft: "auto", marginRight: "auto"}}>
        <textarea readOnly id={sideMemo} cols="75" rows="20" value={exportStringMemo}></textarea>
      </div>
    </div>
  );
}

function TabManager({ sideCode, updateMons, monsPanelOpen, setMonsPanelOpen, closeMonsPanels, closeFieldPanel, gameType }) {
  const [tabsActive, setTabsActive] = useState([true, false, false]);
  const [importedTeamStorage, setImportedTeamStorage] = useState({});
  const sideMemo = useMemo(() => sideCode, [sideCode]);
  const [containerTransition, setContainerTransition] = useState({ height: "34px"});
  const [buttonTransition, setButtonTransition] = useState((sideCode === "attacker") ? { top: "33px" } : { bottom: "34px" });
  const [containerCollapsed, setContainerCollapsed] = useState(true);
  const monsPanelOpenMemo = useMemo(() => monsPanelOpen, [monsPanelOpen]);
  const gameTypeMemo = useMemo(() => gameType, [gameType]);
  const [exportString, setExportString] = useState("");

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
    root.style.setProperty((sideCode === "attacker") ? "--attacker-panel-height" : "--defender-panel-height", ((sideCode === "attacker") ? "552" : "421") + "px");
    setButtonTransition((sideCode === "attacker") ? { top: "551px" } : { bottom: "421px" });
    root.style.setProperty((sideCode === "attacker") ? "--attacker-buttons-top" : "--defender-buttons-bottom", ((sideCode === "attacker") ? "551" : "421") + "px");
    setContainerCollapsed(false);
    setMonsPanelOpen(true);
  }
  function collapseContainer(tab) {
    console.log("collapsing");
    if (containerCollapsed){
      setContainerTransition({ height: ((sideCode === "attacker") ? "552" : "421")+"px" });
      root.style.setProperty((sideCode === "attacker") ? "--attacker-panel-height" : "--defender-panel-height", ((sideCode === "attacker") ? "552" : "421") + "px");
      setButtonTransition((sideCode === "attacker") ? { top: "551px" } : { bottom: "421px" });
      root.style.setProperty((sideCode === "attacker") ? "--attacker-buttons-top" : "--defender-buttons-bottom", ((sideCode === "attacker") ? "551" : "421") + "px");
      setContainerCollapsed(false);
      setMonsPanelOpen(true);
      closeFieldPanel();
    }
    else {
      setContainerTransition({ height: "34px" });
      root.style.setProperty((sideCode === "attacker") ? "--attacker-panel-height" : "--defender-panel-height", "34px");
      setButtonTransition((sideCode === "attacker") ? { top: "33px" } : { bottom: "34px" });
      root.style.setProperty((sideCode === "attacker") ? "--attacker-buttons-top" : "--defender-buttons-bottom", ((sideCode === "attacker") ? "33" : "34") + "px");
      setContainerCollapsed(true);
      //setMonsPanelOpen(false);
      //closeMonsPanels();
    }
  }
  function forceClosedContainer(){
    console.log("closing");
    setContainerTransition({ height: "34px" });
    root.style.setProperty((sideCode === "attacker") ? "--attacker-panel-height" : "--defender-panel-height", "34px");
    setButtonTransition((sideCode === "attacker") ? { top: "33px" } : { bottom: "34px" });
    root.style.setProperty((sideCode === "attacker") ? "--attacker-buttons-top" : "--defender-buttons-bottom", ((sideCode === "attacker") ? "33" : "34") + "px");
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
      //var statuses = [];
      var notes = [];
      for (const mon of importedTeam) {
        if (gen.species.get((toID(mon.species)))){ // valid mon
          species.push(mon.species);
          natures.push((mon.nature && gen.natures.get((toID(mon.nature)))) ? mon.nature : "Serious");
          abilities.push((mon.ability && gen.abilities.get((toID(mon.ability)))) ? mon.ability : gen.species.get((toID(mon.species))).abilities[0]);
          items.push((mon.item && gen.items.get((toID(mon.item)))) ? mon.item : "(no item)");
          teraTypes.push((mon.teraType) ? mon.teraType : undefined);
          moves.push({
            1: (mon.moves && mon.moves[0] && gen.moves.get((toID(mon.moves[0])))) ? mon.moves[0] : "(No Move)",
            2: (mon.moves && mon.moves[1] && gen.moves.get((toID(mon.moves[1])))) ? mon.moves[1] : "(No Move)",
            3: (mon.moves && mon.moves[2] && gen.moves.get((toID(mon.moves[2])))) ? mon.moves[2] : "(No Move)",
            4: (mon.moves && mon.moves[3] && gen.moves.get((toID(mon.moves[3])))) ? mon.moves[3] : "(No Move)",
          });
          evs.push({
            hp: (mon.evs && mon.evs["hp"] !== undefined && Number.isInteger(mon.evs["hp"])) ? Math.max(Math.min(mon.evs["hp"], 252), 0) : 0,
            atk: (mon.evs && mon.evs["atk"] !== undefined && Number.isInteger(mon.evs["atk"])) ? Math.max(Math.min(mon.evs["atk"], 252), 0) : 0,
            def: (mon.evs && mon.evs["def"] !== undefined && Number.isInteger(mon.evs["def"])) ? Math.max(Math.min(mon.evs["def"], 252), 0) : 0,
            spa: (mon.evs && mon.evs["spa"] !== undefined && Number.isInteger(mon.evs["spa"])) ? Math.max(Math.min(mon.evs["spa"], 252), 0) : 0,
            spd: (mon.evs && mon.evs["spd"] !== undefined && Number.isInteger(mon.evs["spd"])) ? Math.max(Math.min(mon.evs["spd"], 252), 0) : 0,
            spe: (mon.evs && mon.evs["spe"] !== undefined && Number.isInteger(mon.evs["spe"])) ? Math.max(Math.min(mon.evs["spe"], 252), 0) : 0,
          });
          ivs.push({
            hp: (mon.ivs && mon.ivs["hp"] !== undefined && Number.isInteger(mon.evs["hp"])) ? Math.max(Math.min(mon.ivs["hp"], 31), 0) : 31,
            atk: (mon.ivs && mon.ivs["atk"] !== undefined && Number.isInteger(mon.evs["atk"])) ? Math.max(Math.min(mon.ivs["atk"], 31), 0) : 31,
            def: (mon.ivs && mon.ivs["def"] !== undefined && Number.isInteger(mon.evs["def"])) ? Math.max(Math.min(mon.ivs["def"], 31), 0) : 31,
            spa: (mon.ivs && mon.ivs["spa"] !== undefined && Number.isInteger(mon.evs["spa"])) ? Math.max(Math.min(mon.ivs["spa"], 31), 0) : 31,
            spd: (mon.ivs && mon.ivs["spd"] !== undefined && Number.isInteger(mon.evs["spd"])) ? Math.max(Math.min(mon.ivs["spd"], 31), 0) : 31,
            spe: (mon.ivs && mon.ivs["spe"] !== undefined && Number.isInteger(mon.evs["spe"])) ? Math.max(Math.min(mon.ivs["spe"], 31), 0) : 31,
          });
          //statuses.push("(none)");
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
        //statuses: statuses,
        notes: notes,
      });
    }
  }

  function exportMons(){

  }

  return (
    <div>
      <div className={sideCode+"s"} id={sideCode+"Mons"} style={{...{overflow: "hidden"}, ...containerTransition, ...{scrollbarWidth: (containerCollapsed) ? "0px" : "auto"}}}><MonsContainer updateMons={updateMons} tabActive={(tabsActive[0])} collapsed={containerCollapsed} sideCode={sideCode} imported={importedTeamStorage} gameType={gameTypeMemo} setExportString={setExportString}></MonsContainer></div>
      <div className={sideCode+"s"} id={sideCode+"Import"} style={{...{overflow: "hidden"}, ...containerTransition, ...((tabsActive[1] && !containerCollapsed) ? {} : {display: "none"})}}><ImportContainer sideCode={sideCode} importFunc={importMons}></ImportContainer></div>
      <div className={sideCode+"s"} id={sideCode+"Export"} style={{...{overflow: "hidden"}, ...containerTransition, ...((tabsActive[2] && !containerCollapsed) ? {} : {display: "none"})}}><ExportContainer sideCode={sideCode} exportString={exportString}></ExportContainer></div>
      <div className={sideCode+"s-buttons"} style={{ ...buttonTransition, height: "30px", display: "flex", justifyContent: "center"}}>
          <PanelButton text={capitalize(sideCode)+"s"} sideCode={sideCode} tab={tabNames[0]} focusTab={focusTab} id={(tabsActive[0]) ? "active" : "inactive"}></PanelButton>
          <PanelButton text="Import" sideCode={sideCode} tab={tabNames[1]} focusTab={focusTab} id={(tabsActive[1]) ? "active" : "inactive"}></PanelButton>
          <PanelButton text="Export" sideCode={sideCode} tab={tabNames[2]} focusTab={focusTab} id={(tabsActive[2]) ? "active" : "inactive"}></PanelButton>
          <div style={{width: "5px", height: "0px"}}></div>
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
          <option value="Doubles">Doubles</option>
          <option value="Singles">Singles</option>
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
        <div className="field-check-div"></div>
        <div style={{textAlign: "center", textOverflow: "clip"}}>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="gravity" onChange={changeGravity} checked={gravityMemo}></input><label id="gravity-btn" className="btn btn-primary" htmlFor="gravity">Gravity</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="reflect" onChange={changeReflectDefender} checked={reflectDefenderMemo}></input><label id="reflect-btn" className="btn btn-primary" htmlFor="reflect">Reflect</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="lightscreen" onChange={changeLightscreenDefender} checked={lightscreenDefenderMemo}></input><label id="lightscreen-btn" className="btn btn-primary" htmlFor="lightscreen">Light Screen</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="auroraveil" onChange={changeVeilDefender} checked={veilDefenderMemo}></input><label id="auroraveil-btn" className="btn btn-primary" htmlFor="auroraveil">Aurora Veil</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="magicroom" onChange={changeMagicRoom} checked={magicroomMemo}></input><label id="magicroom-btn" className="btn btn-primary" htmlFor="magicroom">Magic Room</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="wonderroom" onChange={changeWonderRoom} checked={wonderroomMemo}></input><label id="wonderroom-btn" className="btn btn-primary" htmlFor="wonderroom">Wonder Room</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="helpinghand" onChange={changeHelpinghand} checked={helpinghandMemo}></input><label id="helpinghand-btn" className="btn btn-primary" htmlFor="helpinghand">Helping Hand</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="tailwind" onChange={changeTailwind} checked={tailwindMemo}></input><label id="tailwind-btn" className="btn btn-primary" htmlFor="tailwind">Tailwind (attacking)</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="tailwinddef" onChange={changeTailwindDef} checked={tailwindDefMemo}></input><label id="tailwinddef-btn" className="btn btn-primary" htmlFor="tailwinddef">Tailwind (defending)</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="friendguard" onChange={changeFriendguard} checked={friendguardMemo}></input><label id="friendguard-btn" className="btn btn-primary" htmlFor="friendguard">Friend Guard</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="battery" onChange={changeBattery} checked={batteryMemo}></input><label id="battery-btn" className="btn btn-primary" htmlFor="battery">Battery</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="powerspot" onChange={changePowerspot} checked={powerspotMemo}></input><label id="powerspot-btn" className="btn btn-primary" htmlFor="powerspot">Power Spot</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="flowergift" onChange={changeFlowergift} checked={flowergiftMemo}></input><label id="flowergift-btn" className="btn btn-primary" htmlFor="flowergift">Flower Gift (attacking)</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="flowergiftdef" onChange={changeFlowergiftDef} checked={flowergiftDefMemo}></input><label id="flowergiftdef-btn" className="btn btn-primary" htmlFor="flowergiftdef">Flower Gift (defending)</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="beadsofruin" onChange={changeBeadsofruin} checked={beadsofruinMemo}></input><label id="beadsofruin-btn" className="btn btn-primary" htmlFor="beadsofruin">Beads of Ruin</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="swordofruin" onChange={changeSwordofruin} checked={swordofruinMemo}></input><label id="swordofruin-btn" className="btn btn-primary" htmlFor="swordofruin">Sword of Ruin</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="tabletsofruin" onChange={changeTabletsofruin} checked={tabletsofruinMemo}></input><label id="tabletsofruin-btn" className="btn btn-primary" htmlFor="tabletsofruin">Tablets of Ruin</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="vesselofruin" onChange={changeVesselofruin} checked={vesselofruinMemo}></input><label id="vesselofruin-btn" className="btn btn-primary" htmlFor="vesselofruin">Vessel of Ruin</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="aurabreak" onChange={changeAurabreak} checked={aurabreakMemo}></input><label id="aurabreak-btn" className="btn btn-primary" htmlFor="aurabreak">Aura Break</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="darkaura" onChange={changeDarkaura} checked={darkauraMemo}></input><label id="darkaura-btn" className="btn btn-primary" htmlFor="darkaura">Dark Aura</label></div>
          <div className="field-check-div"><input type="checkbox" className="btn-check" id="fairyaura" onChange={changeFairyaura} checked={fairyauraMemo}></input><label id="fairyaura-btn" className="btn btn-primary" htmlFor="fairyaura">Fairy Aura</label></div>
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
  const [field, setField] = useState(new Field({ gameType: "Doubles" }));
  const [gameType, setGameType] = useState("Doubles");
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
      <div className="calcTable" style={{position: "absolute", width: "100%", top: "calc(var(--attacker-panel-height) + 80px)", transition: "top 300ms"}}>
        <CalcTable attackers={attackerMons} defenders={defenderMons} field={field}></CalcTable>
        <div style={{height: "80px"}}></div>
      </div>
      <TabManager sideCode="attacker" updateMons={updateMons} monsPanelOpen={monsPanelOpen} setMonsPanelOpen={setMonsPanelOpen} closeMonsPanels={closeMonsPanels} closeFieldPanel={closeFieldPanel} gameType={gameType}></TabManager>
      <FieldPanel updateHelpinghand={updateHelpinghand} updateGameType={updateGameType} updateWeather={updateWeather} updateTerrain={updateTerrain} updateGravity={updateGravity} updateReflect={updateReflect}
                  updateLightscreen={updateLightscreen} updateVeil={updateVeil} updateMagicRoom={updateMagicRoom} updateWonderRoom={updateWonderRoom} updateTailwind={updateTailwind} updateTailwindDef={updateTailwindDef}
                  updateFriendguard={updateFriendguard} updateBattery={updateBattery} updatePowerspot={updatePowerspot} updateFlowergift={updateFlowergift} updateFlowergiftDef={updateFlowergiftDef} updateSteelyspirit={updateSteelyspirit}
                  updateBeadsofruin={updateBeadsofruin} updateSwordofruin={updateSwordofruin} updateTabletsofruin={updateTabletsofruin} updateVesselofruin={updateVesselofruin} updateAurabreak={updateAurabreak}
                  updateDarkaura={updateDarkaura} updateFairyaura={updateFairyaura} fieldPanelOpen={fieldPanelOpen} setFieldPanelOpen={setFieldPanelOpen} closeMonsPanels={closeMonsPanels} closeFieldPanel={closeFieldPanel}></FieldPanel>
      <TabManager sideCode="defender" updateMons={updateMons} monsPanelOpen={monsPanelOpen} setMonsPanelOpen={setMonsPanelOpen} closeMonsPanels={closeMonsPanels} closeFieldPanel={closeFieldPanel} gameType={gameType}></TabManager>
      
    </div>
  );
}







export default App;
