import { PokemonPanel } from "./mon-panel.js";
import React, { useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { MonsMini } from "./mons-mini.js";
import {Generations, Pokemon, toID} from '@smogon/calc';
import { monDispatchContext } from "./App.js";


const gen = Generations.get(9);
const statList = ["hp", "atk", "def", "spa", "spd", "spe"];

export const partyContext = React.createContext(null);

function monToExportSet(mon, gameType) {
    const exportString = ((mon.notes) ? mon.notes+" (" : "") + mon.species + ((mon.notes) ? ")" : "") + ((mon.item && mon.item !== "(no item)") ? " @ " + mon.item : "") + "\n" +
                 "Ability: " + mon.ability + "\n" +
                 "Level: " + (gameType === "Doubles" ? "50" : "100") + "\n" +
                 "Tera Type: " + mon.teraType + "\n" +
                 ((mon.EVs["hp"] > 0 || mon.EVs["atk"] > 0 || mon.EVs["def"] > 0 || mon.EVs["spa"] > 0 || mon.EVs["spd"] > 0 || mon.EVs["spe"] > 0) ? "EVs: " : "") +
                 ((mon.EVs["hp"] > 0) ? mon.EVs["hp"] + " HP" : "") +
                 (((mon.EVs["hp"] > 0) && mon.EVs["atk"] > 0) ? " / " : "") + ((mon.EVs["atk"] > 0) ? mon.EVs["atk"] + " Atk" : "") +
                 (((mon.EVs["hp"] > 0 || mon.EVs["atk"] > 0) && mon.EVs["def"] > 0) ? " / " : "") + ((mon.EVs["def"] > 0) ? mon.EVs["def"] + " Def" : "") +
                 (((mon.EVs["hp"] > 0 || mon.EVs["atk"] > 0 || mon.EVs["def"] > 0) && mon.EVs["spa"] > 0) ? " / " : "") + ((mon.EVs["spa"] > 0) ? mon.EVs["spa"] + " SpA" : "") +
                 (((mon.EVs["hp"] > 0 || mon.EVs["atk"] > 0 || mon.EVs["def"] > 0 || mon.EVs["spa"] > 0) && mon.EVs["spd"] > 0) ? " / " : "") + ((mon.EVs["spd"] > 0) ? mon.EVs["spd"] + " SpD" : "") +
                 (((mon.EVs["hp"] > 0 || mon.EVs["atk"] > 0 || mon.EVs["def"] > 0 || mon.EVs["spa"] > 0 || mon.EVs["spd"] > 0) && mon.EVs["spe"] > 0) ? " / " : "") +  ((mon.EVs["spe"] > 0) ? mon.EVs["spe"] + " Spe" : "") +
                 ((mon.EVs["hp"] > 0 || mon.EVs["atk"] > 0 || mon.EVs["def"] > 0 || mon.EVs["spa"] > 0 || mon.EVs["spd"] > 0 || mon.EVs["spe"] > 0) ? "\n" : "") +
                 mon.nature + " Nature" +
                 ((mon.IVs["hp"] < 31 || mon.IVs["atk"] < 31 || mon.IVs["def"] < 31 || mon.IVs["spa"] < 31 || mon.IVs["spd"] < 31 || mon.IVs["spe"] < 31) ? "\nIVs: " : "") +
                 ((mon.IVs["hp"] < 31) ? mon.IVs["hp"] + " HP" : "") +
                 (((mon.IVs["hp"] < 31) && mon.IVs["atk"] < 31) ? " / " : "") + ((mon.IVs["atk"] < 31) ? mon.IVs["atk"] + " Atk" : "") +
                 (((mon.IVs["hp"] < 31 || mon.IVs["atk"] < 31) && mon.IVs["def"] < 31) ? " / " : "") + ((mon.IVs["def"] < 31) ? mon.IVs["def"] + " Def" : "") +
                 (((mon.IVs["hp"] < 31 || mon.IVs["atk"] < 31 || mon.IVs["def"] < 31) && mon.IVs["spa"] < 31) ? " / " : "") + ((mon.IVs["spa"] < 31) ? mon.IVs["spa"] + " SpA" : "") +
                 (((mon.IVs["hp"] < 31 || mon.IVs["atk"] < 31 || mon.IVs["def"] < 31 || mon.IVs["spa"] < 31) && mon.IVs["spd"] < 31) ? " / " : "") + ((mon.IVs["spd"] < 31) ? mon.IVs["spd"] + " SpD" : "") +
                 (((mon.IVs["hp"] < 31 || mon.IVs["atk"] < 31 || mon.IVs["def"] < 31 || mon.IVs["spa"] < 31 || mon.IVs["spd"] < 31) && mon.IVs["spe"] < 31) ? " / " : "") +  ((mon.IVs["spe"] < 31) ? mon.IVs["spe"] + " Spe" : "") +
                 //(((mon.moves[0] !== undefined && mon.moves[0] !== "(No Move)") || (mon.moves[1] !== undefined && mon.moves[1] !== "(No Move)") || (mon.moves[2] !== undefined && mon.moves[2] !== "(No Move)") || (mon.moves[3] !== undefined && mon.moves[3] !== "(No Move)")) ? "\n" : "") +
                 "\n" +
                 ((mon.moves[1] !== undefined && mon.moves[1] !== "(No Move)") ? "- " + mon.moves[1] + "\n" : "") +
                 ((mon.moves[2] !== undefined && mon.moves[2] !== "(No Move)") ? "- " + mon.moves[2] + "\n" : "") +
                 ((mon.moves[3] !== undefined && mon.moves[3] !== "(No Move)") ? "- " + mon.moves[3] + "\n" : "") +
                 ((mon.moves[4] !== undefined && mon.moves[4] !== "(No Move)") ? "- " + mon.moves[4] + "\n" : "");
    return exportString;
}

export function MonsContainer({ tabActive, collapsed, sideCode, imported, gameType, setExportString, containerIndex, opCount, setOpCount }){
    const importedMemo = useMemo(() => imported, [imported]);
    const tabActiveMemo = useMemo(() => tabActive, [tabActive]);
    const collapsedMemo = useMemo(() => collapsed, [collapsed]);
    const gameTypeMemo = useMemo(() => gameType, [gameType]);
    const sideCodeMemo = useMemo(() => sideCode, [sideCode]);
    const mons = useContext(monDispatchContext).totalMons;
    const setTotalMons = useContext(monDispatchContext).setTotalMons;

    function addMon(event){
        setTotalMons({ containerIndex: containerIndex, type: "addEnd", opCount: opCount });
        setOpCount(opCount+1);
    }

   function removeMon(event){
        setTotalMons({ containerIndex: containerIndex, type: "removeEnd" });
   }

    function removeSpecificMon(event){
        setTotalMons({ containerIndex: containerIndex, type: "removeIndex", index: parseInt(event.target.id) });
    }

    function duplicateSpecificMon(event){
        setTotalMons({ containerIndex: containerIndex, type: "duplicateIndex", index: parseInt(event.target.id), opCount: opCount });
        setOpCount(opCount+1);
    }

    useEffect(() => {
        var exportString = "";
        for (const mon of mons[containerIndex]) {
            exportString = exportString + monToExportSet(mon, gameTypeMemo) + "\n";
        }
        setExportString(exportString);
    }, [mons, sideCodeMemo, gameTypeMemo, setExportString]);


    return (
        <partyContext.Provider value={{ gameTypeMemo, containerIndex, sideCodeMemo, opCount, setOpCount }}>
        <div style={{overflow: "hidden"}}>
            <div style={{overflow: "hidden", height: (collapsedMemo) ? "34px" : "0px"}}><MonsMini sideCode={sideCode} visible={collapsedMemo} containerIndex={containerIndex}></MonsMini></div>
            <div style={{overflow: "hidden", display: (tabActiveMemo && !collapsedMemo) ? "inline" : "none", textAlign: "center"}}><button type="button" style={{width: "30px", height: "30px"}} onClick={addMon}>+</button><button type="button" style={{width: "30px", height: "30px"}} onClick={removeMon}>-</button></div>
            <div style={{overflow: "auto", paddingTop: "5px", paddingBottom: "5px", display: (tabActiveMemo && !collapsedMemo) ? "flex" : "none"}}>
                <div style={{marginLeft: "auto", marginRight: "auto", display: "flex"}}>
                {mons[containerIndex].map((entry, index) => {
                    return (<div key={sideCodeMemo+entry.id} 
                        className="mon-panel" style={{position: "relative"}}><button type="button" style={{width: "20px", height: "20px"}} id={index} onClick={removeSpecificMon}>X</button><button type="button" style={{width: "20px", height: "20px", textAlign: "center"}} id={index} onClick={duplicateSpecificMon}>⧉</button><div className="index-num">{index+1}</div>{<PokemonPanel 
                                                key={sideCodeMemo+entry.id+"panel"} 
                                                monID={index} 
                                                monUniqueID={entry.id}
                                                monSide={sideCodeMemo}></PokemonPanel>}</div>)})}
                </div>
            </div>
        </div>
        </partyContext.Provider>
    );
}

/*
nature: natures[index],
                    ability: abilities[index],
                    item: (items[index] !== "(no item)") ? items[index]: undefined,
                    teraType: (terasActive[index]) ? (teraTypes[index]) : undefined,
                    moves: movesets[index],
                    evs: evsets[index],
                    ivs: ivsets[index],
                    boosts: boostsets[index]
                    */