//import logo from './logo.svg';
import {Generations, toID, Field, Side} from '@smogon/calc';
import './App.css';
import { MonsContainer } from "./mons-container.js";
import { CalcTable } from "./calc-table.js";
import React, { useState, useMemo, useCallback, useEffect, useReducer } from 'react';
import {Sets, Teams} from '@pkmn/sets';

const gen = Generations.get(9);
const root = document.documentElement;
export const monDispatchContext = React.createContext(null);


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
  // const [exportText, setExportText] = useState("");
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

function TabManager({ sideCode, containerIndex, updateMons, mons, monsPanelOpen, setMonsPanelOpen, closeMonsPanels, closeFieldPanel, gameType, swapped, openFeedback, panelOpen, setTotalMons }) {
  const [tabsActive, setTabsActive] = useState([true, false, false]);
  const [importedTeamStorage, setImportedTeamStorage] = useState({});
  const sideMemo = useMemo(() => sideCode, [sideCode]);
  const [containerTransition, setContainerTransition] = useState((panelOpen) ? {height: "573px"} : { height: "34px"});
  const [buttonTransition, setButtonTransition] = useState((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? ((panelOpen) ? { top: "572px" } : { top: "33px" }) : ((panelOpen) ? { bottom: "442px" } : { bottom: "34px" }));
  const [heightValue, setHeightValue] = useState(((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped)) ? { height: "42vh" } : { height: "32vh" });
  const [containerCollapsed, setContainerCollapsed] = useState(panelOpen);
  const monsPanelOpenMemo = useMemo(() => monsPanelOpen, [monsPanelOpen]);
  const gameTypeMemo = useMemo(() => gameType, [gameType]);
  const swappedMemo = useMemo(() => swapped, [swapped]);
  //const feedbackMemo = useMemo((b) => openFeedback(b), [openFeedback]);
  //const attackerMonsMemo = useMemo(() => attackerMons, [attackerMons]);
  //const defenderMonsMemo = useMemo(() => defenderMons, [defenderMons]);
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
    setContainerTransition({ height: ((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "573" : "442")+"px" }); // 552 and 421 pre-status, 573 and 442 after
    root.style.setProperty((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "--attacker-panel-height" : "--defender-panel-height", ((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "573" : "442") + "px");
    setButtonTransition((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? { top: "572px" } : { bottom: "442px" });
    root.style.setProperty((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "--attacker-buttons-top" : "--defender-buttons-bottom", ((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "572" : "442") + "px");
    setContainerCollapsed(false);
    openFeedback(true);
    setMonsPanelOpen(true);
  }
  function collapseContainer(tab) {
    console.log("collapsing");
    if (containerCollapsed){
      setContainerTransition({ height: ((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "573" : "442")+"px" });
      root.style.setProperty((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "--attacker-panel-height" : "--defender-panel-height", ((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "573" : "442") + "px");
      setButtonTransition((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? { top: "572px" } : { bottom: "442px" });
      root.style.setProperty((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "--attacker-buttons-top" : "--defender-buttons-bottom", ((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "572" : "442") + "px");
      setContainerCollapsed(false);
      openFeedback(true);
      setMonsPanelOpen(true);
      closeFieldPanel();
    }
    else {
      setContainerTransition({ height: "34px" });
      root.style.setProperty((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "--attacker-panel-height" : "--defender-panel-height", "34px");
      setButtonTransition((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? { top: "33px" } : { bottom: "34px" });
      root.style.setProperty((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "--attacker-buttons-top" : "--defender-buttons-bottom", ((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "33" : "34") + "px");
      setContainerCollapsed(true);
      openFeedback(false);
      //setMonsPanelOpen(false);
      //closeMonsPanels();
    }
  }
  function forceClosedContainer(){
    console.log("closing");
    setContainerTransition({ height: "34px" });
    root.style.setProperty((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "--attacker-panel-height" : "--defender-panel-height", "34px");
    setButtonTransition((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? { top: "33px" } : { bottom: "34px" });
    root.style.setProperty((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "--attacker-buttons-top" : "--defender-buttons-bottom", ((((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped))) ? "33" : "34") + "px");
    setContainerCollapsed(true);
    openFeedback(false);
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
      if (importedTeam.length > 0) { setTotalMons({ containerIndex: containerIndex, type: "wipe" }); }
      for (const mon of importedTeam) {
        if (gen.species.get((toID(mon.species)))){ // valid mon
          console.log(mon.species);
          setTotalMons({ containerIndex: containerIndex, type: "import", mon: {
            species: mon.species,
            nature: (mon.nature && gen.natures.get((toID(mon.nature)))) ? mon.nature : "Serious",
            ability: (mon.ability && gen.abilities.get((toID(mon.ability)))) ? mon.ability : gen.species.get((toID(mon.species))).abilities[0],
            item: (mon.item && gen.items.get((toID(mon.item)))) ? mon.item : "(no item)",
            moves: {
              1: (mon.moves && mon.moves[0] && gen.moves.get((toID(mon.moves[0])))) ? mon.moves[0] : "(No Move)",
              2: (mon.moves && mon.moves[1] && gen.moves.get((toID(mon.moves[1])))) ? mon.moves[1] : "(No Move)",
              3: (mon.moves && mon.moves[2] && gen.moves.get((toID(mon.moves[2])))) ? mon.moves[2] : "(No Move)",
              4: (mon.moves && mon.moves[3] && gen.moves.get((toID(mon.moves[3])))) ? mon.moves[3] : "(No Move)",
            },
            teraType: (mon.teraType) ? mon.teraType : gen.species.get((toID(mon.species))).types[0],
            EVs: {
              hp: (mon.evs && mon.evs["hp"] !== undefined && Number.isInteger(mon.evs["hp"])) ? mon.evs["hp"] : 0,
              atk: (mon.evs && mon.evs["atk"] !== undefined && Number.isInteger(mon.evs["atk"])) ? mon.evs["atk"] : 0,
              def: (mon.evs && mon.evs["def"] !== undefined && Number.isInteger(mon.evs["def"])) ? mon.evs["def"] : 0,
              spa: (mon.evs && mon.evs["spa"] !== undefined && Number.isInteger(mon.evs["spa"])) ? mon.evs["spa"] : 0,
              spd: (mon.evs && mon.evs["spd"] !== undefined && Number.isInteger(mon.evs["spd"])) ? mon.evs["spd"] : 0,
              spe: (mon.evs && mon.evs["spe"] !== undefined && Number.isInteger(mon.evs["spe"])) ? mon.evs["spe"] : 0,
            },
            IVs: {
              hp: (mon.ivs && mon.ivs["hp"] !== undefined && Number.isInteger(mon.ivs["hp"])) ? mon.ivs["hp"] : 31,
              atk: (mon.ivs && mon.ivs["atk"] !== undefined && Number.isInteger(mon.ivs["atk"])) ? mon.ivs["atk"] : 31,
              def: (mon.ivs && mon.ivs["def"] !== undefined && Number.isInteger(mon.ivs["def"])) ? mon.ivs["def"] : 31,
              spa: (mon.ivs && mon.ivs["spa"] !== undefined && Number.isInteger(mon.ivs["spa"])) ? mon.ivs["spa"] : 31,
              spd: (mon.ivs && mon.ivs["spd"] !== undefined && Number.isInteger(mon.ivs["spd"])) ? mon.ivs["spd"] : 31,
              spe: (mon.ivs && mon.ivs["spe"] !== undefined && Number.isInteger(mon.ivs["spe"])) ? mon.ivs["spe"] : 31,
            },
            boosts: {
              hp: 0,
              atk: 0,
              def: 0,
              spa: 0,
              spd: 0,
              spe: 0,
            },
            notes: (mon.name) ? mon.name : "",
            status: "(none)",
          }});
          /*
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
            hp: (mon.evs && mon.evs["hp"] !== undefined && Number.isInteger(mon.evs["hp"])) ? mon.evs["hp"] : 0,
            atk: (mon.evs && mon.evs["atk"] !== undefined && Number.isInteger(mon.evs["atk"])) ? mon.evs["atk"] : 0,
            def: (mon.evs && mon.evs["def"] !== undefined && Number.isInteger(mon.evs["def"])) ? mon.evs["def"] : 0,
            spa: (mon.evs && mon.evs["spa"] !== undefined && Number.isInteger(mon.evs["spa"])) ? mon.evs["spa"] : 0,
            spd: (mon.evs && mon.evs["spd"] !== undefined && Number.isInteger(mon.evs["spd"])) ? mon.evs["spd"] : 0,
            spe: (mon.evs && mon.evs["spe"] !== undefined && Number.isInteger(mon.evs["spe"])) ? mon.evs["spe"] : 0,
          });
          ivs.push({
            hp: (mon.ivs && mon.ivs["hp"] !== undefined && Number.isInteger(mon.ivs["hp"])) ? mon.ivs["hp"] : 31,
            atk: (mon.ivs && mon.ivs["atk"] !== undefined && Number.isInteger(mon.ivs["atk"])) ? mon.ivs["atk"] : 31,
            def: (mon.ivs && mon.ivs["def"] !== undefined && Number.isInteger(mon.ivs["def"])) ? mon.ivs["def"] : 31,
            spa: (mon.ivs && mon.ivs["spa"] !== undefined && Number.isInteger(mon.ivs["spa"])) ? mon.ivs["spa"] : 31,
            spd: (mon.ivs && mon.ivs["spd"] !== undefined && Number.isInteger(mon.ivs["spd"])) ? mon.ivs["spd"] : 31,
            spe: (mon.ivs && mon.ivs["spe"] !== undefined && Number.isInteger(mon.ivs["spe"])) ? mon.ivs["spe"] : 31,
          });
          notes.push((mon.name) ? mon.name : "");
          */
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

  var altSideCode = (sideCode === "attacker") ? "defender" : "attacker";

  return (
    <div>
      <div className={(!swapped ? sideCode : altSideCode)+"s"} id={(!swapped ? sideCode : altSideCode)+"Mons"} style={{...{overflow: "hidden"}, ...containerTransition, ...(((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped)) ? { height: "var(--attacker-panel-height)" } : { height: "var(--defender-panel-height)" }), ...{scrollbarWidth: (containerCollapsed) ? "0px" : "auto"}}}>
        <MonsContainer updateMons={updateMons} containerIndex={containerIndex} mons={mons} tabActive={(tabsActive[0])} collapsed={containerCollapsed} sideCode={(!swapped ? sideCode : altSideCode)} imported={importedTeamStorage} gameType={gameTypeMemo} setExportString={setExportString} setTotalMons={setTotalMons}></MonsContainer>
      </div>
      <div className={(!swapped ? sideCode : altSideCode)+"s"} id={(!swapped ? sideCode : altSideCode)+"Import"} style={{...{overflow: "hidden"}, ...containerTransition, ...((tabsActive[1] && !containerCollapsed) ? {} : {display: "none"})}}><ImportContainer sideCode={(!swapped ? sideCode : altSideCode)} importFunc={importMons}></ImportContainer></div>
      <div className={(!swapped ? sideCode : altSideCode)+"s"} id={(!swapped ? sideCode : altSideCode)+"Export"} style={{...{overflow: "hidden"}, ...containerTransition, ...((tabsActive[2] && !containerCollapsed) ? {} : {display: "none"})}}><ExportContainer sideCode={(!swapped ? sideCode : altSideCode)} exportString={exportString}></ExportContainer></div>
      <div className={(!swapped ? sideCode : altSideCode)+"s-buttons"} style={{ ...buttonTransition, height: "30px", display: "flex", justifyContent: "center", ...(((sideCode === "attacker" && !swapped) || (sideCode === "defender" && swapped)) ? { top: "var(--attacker-panel-height)", bottom: "" } : { bottom: "var(--defender-panel-height)", top: "" })}}>
          <PanelButton text={capitalize((!swapped ? sideCode : altSideCode))+"s"} sideCode={(!swapped ? sideCode : altSideCode)} tab={tabNames[0]} focusTab={focusTab} id={(tabsActive[0]) ? "active" : "inactive"}></PanelButton>
          <PanelButton text="Import" sideCode={(!swapped ? sideCode : altSideCode)} tab={tabNames[1]} focusTab={focusTab} id={(tabsActive[1]) ? "active" : "inactive"}></PanelButton>
          <PanelButton text="Export" sideCode={(!swapped ? sideCode : altSideCode)} tab={tabNames[2]} focusTab={focusTab} id={(tabsActive[2]) ? "active" : "inactive"}></PanelButton>
          <div style={{width: "5px", height: "0px"}}></div>
          <PanelButton text="Collapse/Expand" sideCode={(!swapped ? sideCode : altSideCode)} tab={tabNames[0]} focusTab={collapseContainer} id={"inactive"}></PanelButton>
          { // <PanelButton text="Swap Attackers/Defenders" sideCode={sideCode} focusTab={swapSides} id={"inactive"}></PanelButton>
          }
      </div>
    </div>
  );
}

function FieldPanel({ updateGameType, gametype, updateWeather, weather, updateTerrain, terrain, updateGravity, gravity, updateReflect, reflectAttacker, reflectDefender, updateLightscreen, lightscreenAttacker, lightscreenDefender, updateVeil, veilAttacker, veilDefender, updateMagicRoom, magicroom, updateWonderRoom, wonderroom,
                      updateHelpinghand, helpinghand, updateTailwind, tailwind, updateTailwindDef, tailwindDef, updateFriendguard, friendguard, updateBattery, battery, updatePowerspot, powerspot, updateFlowergift, flowergift, updateFlowergiftDef, flowergiftDef,
                      updateSteelyspirit, steelyspirit, updateBeadsofruin, beadsofruin, updateSwordofruin, swordofruin, updateTabletsofruin, tabletsofruin, updateVesselofruin, vesselofruin, updateAurabreak, aurabreak, updateDarkaura, darkaura, updateFairyaura, fairyaura,
                      fieldPanelOpen, setFieldPanelOpen, setMonsPanelOpen, closeMonsPanels, closeFieldPanel, swapSides
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
        <PanelButton text="Swap Sides" sideCode="swap" tab="Field" focusTab={swapSides}></PanelButton>
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

function monSideReducer(mons, action){ // all actions must contain containerIndex
  console.log(action);
  //console.log(mons);
  var subMons;
  switch (action.containerIndex) {
    case 0: { subMons = mons[0]; break; }
    case 1: { subMons = mons[1]; break; }
  }
  var resultMons;
  switch (action.type){
    // add/reduce: index cases require an index number
    case 'addEnd': {
      console.log("ADDING!");
      resultMons = [...subMons, {
        notes: "",
        species: "Ababo",
        nature: "Serious",
        ability: "Pixilate",
        teraType: "Fairy",
        teraActive: false,
        item: "(no item)",
        moves: {
            1: "(No Move)",
            2: "(No Move)",
            3: "(No Move)",
            4: "(No Move)",
        },
        EVs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
        IVs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
        boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
        status: "(none)"
      }];
      break;
    }
    case 'addIndex': {
      resultMons = [...subMons.slice(0, action.index), {
        notes: "",
        species: "Ababo",
        nature: "Serious",
        ability: "Pixilate",
        teraType: "Fairy",
        teraActive: false,
        item: "(no item)",
        moves: {
            1: "(No Move)",
            2: "(No Move)",
            3: "(No Move)",
            4: "(No Move)",
        },
        EVs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
        IVs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
        boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
        status: "(none)"
      }, subMons.slice(action.index+1)];
      break;
    }
    case 'removeEnd': {
      resultMons = [...subMons.slice(0, -1)];
      break;
    }
    case 'removeIndex': {
      console.log("removing index");
      resultMons = [...subMons.slice(0, action.index), ...subMons.slice(action.index+1)];
      break;
    }
    case 'duplicateIndex': {
      console.log("duplicating at index "+action.index);
      resultMons = [...subMons.slice(0, action.index+1), subMons[action.index], ...subMons.slice(action.index+1)];
      break;
    }
    case 'wipe': {
      resultMons = [];
      break;
    }
    case 'import': {
      console.log("importing mon");
      resultMons = [...subMons, action.mon];
      break;
    }
    case 'updateSpecies': {
      console.log("species updating!");
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        species: action.species,
        ability: gen.species.get(toID(action.species)).abilities[0],
        teraType: gen.species.get(toID(action.species)).types[0],
      }, ...subMons.slice(action.index+1)];
      break;
    }
    case 'updateNature': {
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        nature: action.nature,
      }, ...subMons.slice(action.index+1)];
      break;
    }
    case 'updateTeraType': {
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        teraType: action.teraType,
      }, ...subMons.slice(action.index+1)];
      break;
    }
    case 'updateAbility': {
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        ability: action.ability,
      }, ...subMons.slice(action.index+1)];
      break;
    }
    case 'updateTeraActive': {
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        teraActive: action.teraActive,
      }, ...subMons.slice(action.index+1)];
      break;
    }
    case 'updateItem': {
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        item: action.item,
      }, ...subMons.slice(action.index+1)];
      break;
    }
    case 'updateNature': {
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        nature: action.nature,
      }, ...subMons.slice(action.index+1)];
      break;
    }
    case 'updateMoves': { 
      console.log("updating moves!");
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        moves: action.moves,
      }, ...subMons.slice(action.index+1)];
      break;
    }
    case 'updateEVs': {
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        EVs: action.EVs,
      }, ...subMons.slice(action.index+1)];
      break;
    }
    case 'updateIVs': {
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        IVs: action.IVs,
      }, ...subMons.slice(action.index+1)];
      break;
    }
    case 'updateBoosts': {
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        boosts: action.boosts,
      }, ...subMons.slice(action.index+1)];
      break;
    }
    case 'updateStatus': {
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        status: action.status,
      }, ...subMons.slice(action.index+1)];
      break;
    }
    case 'updateNotes': {
      resultMons = [...subMons.slice(0, action.index), {...subMons[action.index],
        notes: action.notes,
      }, ...subMons.slice(action.index+1)];
      break;
    }
  }
  console.log(resultMons);
  switch (action.containerIndex){
    case 0: { return [[...resultMons], [...mons[1]]]; }
    case 1: { return [[...mons[0]], [...resultMons]]; }
  }
}


function App() {

  const [monsPanelOpen, setMonsPanelOpen] = useState(false);
  const [topPanelOpen, setTopPanelOpen] = useState(false);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const [fieldPanelOpen, setFieldPanelOpen] = useState(false);
  const [totalMons, setTotalMons] = useReducer(monSideReducer, [[], []]);
  const [attackerMons, setAttackerMons] = useState([]);
  const [attackerIndex] = useState([]);
  const [defenderMons, setDefenderMons] = useState([]);
  const [field, setField] = useState({ 
                                        gameType: "Doubles",
                                        weather: "",
                                        terrain: "",
                                        isGravity: false,
                                        isMagicRoom: false,
                                        isWonderRoom: false,
                                        isBeadsOfRuin: false,
                                        isSwordOfRuin: false,
                                        isTabletsOfRuin: false,
                                        isVesselOfRuin: false,
                                        isFairyAura: false,
                                        isDarkAura: false,
                                        isAuraBreak: false,
                                        attackerSide: {
                                          isHelpingHand: false,
                                          isTailwind: false,
                                          isBattery: false,
                                          isPowerSpot: false,
                                          isFlowerGift: false,
                                          isSteelySpirit: false,
                                          isReflect: false,
                                          isLightScreen: false,
                                          isAuroraVeil: false,
                                        },
                                        defenderSide: {
                                          isTailwind: false,
                                          isFriendGuard: false,
                                          isFlowerGift: false,
                                          isReflect: false,
                                          isLightScreen: false,
                                          isAuroraVeil: false
                                        },
                                        });
  const [gameType, setGameType] = useState("Doubles");
  const [swapped, setSwapped] = useState(false);

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

  /*
  function monSideReducer(mons, action){
    console.log(action);
    if (action){
      switch (action.containerIndex){
        case 0: {
          var result = [monsReducer(totalMons[0], action), totalMons[1]];
          console.log("result:");
          console.log(result);
          setTotalMons(result);
        }
        case 1: {
          setTotalMons([totalMons[0], monsReducer(totalMons[1], action)]);
        }
      }  
    }
  }
    */

  
  function swapSides(){
    setSwapped(!swapped);
    var temp_bottom = bottomPanelOpen;
    setBottomPanelOpen(topPanelOpen);
    setTopPanelOpen(temp_bottom);
    setMonsPanelOpen(true);
    setFieldPanelOpen(false);
  }
  

  function updateGameType(t){
    setField({...field, gameType: t});
    setGameType(t);
  }

  function updateWeather(w){
    setField({...field, weather: w});
  }

  function updateTerrain(t){
    setField({...field, terrain: t});
  }

  function updateGravity(g){
    setField({...field, isGravity: g});
  }

  function updateMagicRoom(m){
    setField({...field, isMagicRoom: m});
  }

  function updateWonderRoom(w){
    setField({...field, isWonderRoom: w});
  }

  function updateHelpinghand(h){
    setField({...field, attackerSide: {...field.attackerSide, isHelpingHand: h}});
  }

  function updateTailwind(t){
    setField({...field, attackerSide: {...field.attackerSide, isTailwind: t}});
  }

  function updateTailwindDef(t){
    setField({...field, defenderSide: {...field.defenderSide, isTailwind: t}});
  }

  function updateFriendguard(f){
    setField({...field, defenderSide: {...field.defenderSide, isFriendGuard: f}});
  }

  function updateBattery(b){
    setField({...field, attackerSide: {...field.attackerSide, isBattery: b}});
  }

  function updatePowerspot(p){
    setField({...field, attackerSide: {...field.attackerSide, isPowerSpot: p}});
  }

  function updateFlowergift(f){
    setField({...field, attackerSide: {...field.attackerSide, isFlowerGift: f}});
  }

  function updateFlowergiftDef(f){
    setField({...field, defenderSide: {...field.defenderSide, isFlowerGift: f}});
  }

  function updateSteelyspirit(s){
    setField({...field, attackerSide: {...field.attackerSide, isSteelySpirit: s}});
  }

  function updateBeadsofruin(b){
    setField({...field, isBeadsOfRuin: b});
  }

  function updateSwordofruin(s){
    setField({...field, isSwordOfRuin: s});
  }

  function updateTabletsofruin(t){
    setField({...field, isTabletsOfRuin: t});
  }

  function updateVesselofruin(v){
    setField({...field, isVesselOfRuin: v});
  }

  function updateAurabreak(a){
    setField({...field, isAuraBreak: a});
  }

  function updateDarkaura(d){
    setField({...field, isDarkAura: d});
  }

  function updateFairyaura(f){
    setField({...field, isFairyAura: f});
  }

  function updateReflect(r, sideCode){
    if (sideCode === "attacker"){
      setField({...field, attackerSide: {...field.attackerSide, isReflect: r}});
    }
    else if (sideCode === "defender"){
      setField({...field, defenderSide: {...field.defenderSide, isReflect: r}});
    }
  }

  function updateLightscreen(l, sideCode){
    if (sideCode === "attacker"){
      setField({...field, attackerSide: {...field.attackerSide, isLightScreen: l}});
    }
    else if (sideCode === "defender"){
      setField({...field, defenderSide: {...field.defenderSide, isLightScreen: l}});
    }
  }

  function updateVeil(v, sideCode){
    if (sideCode === "attacker"){
      setField({...field, attackerSide: {...field.attackerSide, isAuroraVeil: v}});
    }
    if (sideCode === "defender"){
      setField({...field, defenderSide: {...field.defenderSide, isAuroraVeil: v}});
    }
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
      <monDispatchContext.Provider value={{totalMons, setTotalMons}}>
      <div className="calcTable" style={{position: "absolute", width: "100%", top: "calc(var(--attacker-panel-height) + 80px)", transition: "top 300ms"}}>
        <CalcTable field={field} attackerIndex={(swapped) ? 1 : 0} mons={totalMons}></CalcTable>
        <div style={{height: "80px"}}></div>
      </div>
      <TabManager sideCode="attacker" updateMons={updateMons} containerIndex={0} monsPanelOpen={monsPanelOpen&&topPanelOpen} setMonsPanelOpen={setMonsPanelOpen} closeMonsPanels={closeMonsPanels} closeFieldPanel={closeFieldPanel} gameType={gameType} swapped={swapped} openFeedback={setTopPanelOpen} panelOpen={topPanelOpen}></TabManager>
      
      <FieldPanel updateHelpinghand={updateHelpinghand} updateGameType={updateGameType} updateWeather={updateWeather} updateTerrain={updateTerrain} updateGravity={updateGravity} updateReflect={updateReflect}
                  updateLightscreen={updateLightscreen} updateVeil={updateVeil} updateMagicRoom={updateMagicRoom} updateWonderRoom={updateWonderRoom} updateTailwind={updateTailwind} updateTailwindDef={updateTailwindDef}
                  updateFriendguard={updateFriendguard} updateBattery={updateBattery} updatePowerspot={updatePowerspot} updateFlowergift={updateFlowergift} updateFlowergiftDef={updateFlowergiftDef} updateSteelyspirit={updateSteelyspirit}
                  updateBeadsofruin={updateBeadsofruin} updateSwordofruin={updateSwordofruin} updateTabletsofruin={updateTabletsofruin} updateVesselofruin={updateVesselofruin} updateAurabreak={updateAurabreak}
                  updateDarkaura={updateDarkaura} updateFairyaura={updateFairyaura} fieldPanelOpen={fieldPanelOpen} setFieldPanelOpen={setFieldPanelOpen} closeMonsPanels={closeMonsPanels} closeFieldPanel={closeFieldPanel} swapSides={swapSides}></FieldPanel>
      
      <TabManager sideCode="defender" updateMons={updateMons} containerIndex={1} monsPanelOpen={monsPanelOpen&&bottomPanelOpen} setMonsPanelOpen={setMonsPanelOpen} closeMonsPanels={closeMonsPanels} closeFieldPanel={closeFieldPanel} gameType={gameType} swapped={swapped} openFeedback={setBottomPanelOpen} panelOpen={bottomPanelOpen}></TabManager>
      </monDispatchContext.Provider>
    </div>
  );
}







export default App;
