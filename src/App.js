//import logo from './logo.svg';
import {Generations, toID} from '@smogon/calc';
import './App.css';
import { MonsContainer } from "./mons-container.js";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {Sets, Teams} from '@pkmn/sets';

const gen = Generations.get(9);


const tabNames = ["Mons", "Import"];


function PanelButton({ text, tab, focusTab, id }) {
  const memoTab = useMemo(() => tab, [tab]);
  const memoText = useMemo(() => text, [text]);
  const memoFocusTab = useCallback(() => focusTab(memoTab), [memoTab, focusTab]);
  return (
    <button type="button" id={id} onClick={memoFocusTab} >{memoText}</button>
  );
}

function ImportContainer({ sideCode, importFunc }) {
  const [importText, setImportText] = useState("");
  const sideMemo = useMemo(() => sideCode, [sideCode]);
  const importFuncMemo = useCallback(() => importFunc(importText), [importText, importFunc]);


  const updateImported = useCallback((event) => setImportText(event.target.value), [setImportText]);

  useEffect(() => {
    console.log(importText); 
  }, [importText]);

  return (
    <div>
      <textarea id={sideMemo} cols="75" rows="10" onChange={updateImported} value={importText}></textarea>
      <p /><button type="button" onClick={importFuncMemo}>Import</button>
    </div>
  );
}

function TabManager({ sideCode }) {
  const [tabsActive, setTabsActive] = useState([true, false]);
  const [importedTeamStorage, setImportedTeamStorage] = useState({});
  const sideMemo = useMemo(() => sideCode, [sideCode]);
  const [containerTransition, setContainerTransition] = useState({ height: "51px"});
  const [buttonTransition, setButtonTransition] = useState((sideCode === "attacker") ? { top: "50px" } : { bottom: "44px" });
  const [containerCollapsed, setContainerCollapsed] = useState(true);
  
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
    setButtonTransition((sideCode === "attacker") ? { top: "551px" } : { bottom: "414px" });
    setContainerCollapsed(false);
  }
  function collapseContainer(tab) {
    console.log("collapsing");
    if (containerCollapsed){
      setContainerTransition({ height: ((sideCode === "attacker") ? "552" : "421")+"px" });
      setButtonTransition((sideCode === "attacker") ? { top: "551px" } : { bottom: "414px" });
      setContainerCollapsed(false);
    }
    else {
      setContainerTransition({ height: "51px" });
      setButtonTransition((sideCode === "attacker") ? { top: "50px" } : { bottom: "44px" });
      setContainerCollapsed(true);
    }
  }

  function importMons(input) {
    if (input && Teams.importTeam(input)) {
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
      <div className={sideCode+"s"} id={sideCode+"Mons"} style={{...containerTransition, ...{scrollbarWidth: (containerCollapsed) ? "0px" : "auto"}}}><MonsContainer tabActive={(tabsActive[0])} collapsed={containerCollapsed} sideCode={sideCode} imported={importedTeamStorage}></MonsContainer></div>
      <div className={sideCode+"s"} id={sideCode+"Import"} style={{...containerTransition, ...((tabsActive[1] && !containerCollapsed) ? {} : {display: "none"})}}><ImportContainer sideCode={sideCode} importFunc={importMons}></ImportContainer></div>
      <div className={sideCode+"s-buttons"} style={{ ...buttonTransition }}>
          <PanelButton text={sideCode+"s"} tab={tabNames[0]} focusTab={focusTab} id={(tabsActive[0]) ? "active" : "inactive"}></PanelButton>
          <PanelButton text="Import" tab={tabNames[1]} focusTab={focusTab} id={(tabsActive[1]) ? "active" : "inactive"}></PanelButton>
          <PanelButton text="Collapse/Expand" tab={tabNames[0]} focusTab={collapseContainer} id={"inactive"}></PanelButton>
      </div>
    </div>
  );
}



function App() {

  return (
    <div className="App" style={{height: "1000vh"}}>
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
      <TabManager sideCode="attacker"></TabManager>
      <TabManager sideCode="defender"></TabManager>
      
    </div>
  );
}







export default App;
