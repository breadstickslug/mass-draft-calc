import { PokemonPanel } from "./mon-panel.js";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MonsMini } from "./mons-mini.js";
import {Generations, Pokemon, toID} from '@smogon/calc';


const gen = Generations.get(9);
const statList = ["hp", "atk", "def", "spa", "spd", "spe"];

export const partyContext = React.createContext(null);

function monToExportSet(mon, gameType) {
    console.log(mon);
    const exportString = mon.name + ((mon.name) ? " (" : "") + mon.species.name + ((mon.name) ? ")" : "") + ((mon.item && mon.item !== "(no item)") ? " @ " + mon.item : "") + "\n" +
                 "Ability: " + mon.ability + "\n" +
                 "Level: " + (gameType === "Doubles" ? "50" : "100") + "\n" +
                 ((mon.evs["hp"] > 0 || mon.evs["atk"] > 0 || mon.evs["def"] > 0 || mon.evs["spa"] > 0 || mon.evs["spd"] > 0 || mon.evs["spe"] > 0) ? "EVs: " : "") +
                 ((mon.evs["hp"] > 0) ? mon.evs["hp"] + " HP" : "") +
                 (((mon.evs["hp"] > 0) && mon.evs["atk"] > 0) ? " / " : "") + ((mon.evs["atk"] > 0) ? mon.evs["atk"] + " Atk" : "") +
                 (((mon.evs["hp"] > 0 || mon.evs["atk"] > 0) && mon.evs["def"] > 0) ? " / " : "") + ((mon.evs["def"] > 0) ? mon.evs["def"] + " Def" : "") +
                 (((mon.evs["hp"] > 0 || mon.evs["atk"] > 0 || mon.evs["def"] > 0) && mon.evs["spa"] > 0) ? " / " : "") + ((mon.evs["spa"] > 0) ? mon.evs["spa"] + " SpA" : "") +
                 (((mon.evs["hp"] > 0 || mon.evs["atk"] > 0 || mon.evs["def"] > 0 || mon.evs["spa"] > 0) && mon.evs["spd"] > 0) ? " / " : "") + ((mon.evs["spd"] > 0) ? mon.evs["spd"] + " SpD" : "") +
                 (((mon.evs["hp"] > 0 || mon.evs["atk"] > 0 || mon.evs["def"] > 0 || mon.evs["spa"] > 0 || mon.evs["spd"] > 0) && mon.evs["spe"] > 0) ? " / " : "") +  ((mon.evs["spe"] > 0) ? mon.evs["spe"] + " Spe" : "") +
                 ((mon.evs["hp"] > 0 || mon.evs["atk"] > 0 || mon.evs["def"] > 0 || mon.evs["spa"] > 0 || mon.evs["spd"] > 0 || mon.evs["spe"] > 0) ? "\n" : "") +
                 mon.nature + " Nature" +
                 ((mon.ivs["hp"] < 31 || mon.ivs["atk"] < 31 || mon.ivs["def"] < 31 || mon.ivs["spa"] < 31 || mon.ivs["spd"] < 31 || mon.ivs["spe"] < 31) ? "\nIVs: " : "") +
                 ((mon.ivs["hp"] < 31) ? mon.ivs["hp"] + " HP" : "") +
                 (((mon.ivs["hp"] < 31) && mon.ivs["atk"] < 31) ? " / " : "") + ((mon.ivs["atk"] < 31) ? mon.ivs["atk"] + " Atk" : "") +
                 (((mon.ivs["hp"] < 31 || mon.ivs["atk"] < 31) && mon.ivs["def"] < 31) ? " / " : "") + ((mon.ivs["def"] < 31) ? mon.ivs["def"] + " Def" : "") +
                 (((mon.ivs["hp"] < 31 || mon.ivs["atk"] < 31 || mon.ivs["def"] < 31) && mon.ivs["spa"] < 31) ? " / " : "") + ((mon.ivs["spa"] < 31) ? mon.ivs["spa"] + " SpA" : "") +
                 (((mon.ivs["hp"] < 31 || mon.ivs["atk"] < 31 || mon.ivs["def"] < 31 || mon.ivs["spa"] < 31) && mon.ivs["spd"] < 31) ? " / " : "") + ((mon.ivs["spd"] < 31) ? mon.ivs["spd"] + " SpD" : "") +
                 (((mon.ivs["hp"] < 31 || mon.ivs["atk"] < 31 || mon.ivs["def"] < 31 || mon.ivs["spa"] < 31 || mon.ivs["spd"] < 31) && mon.ivs["spe"] < 31) ? " / " : "") +  ((mon.ivs["spe"] < 31) ? mon.ivs["spe"] + " Spe" : "") +
                 //(((mon.moves[0] !== undefined && mon.moves[0] !== "(No Move)") || (mon.moves[1] !== undefined && mon.moves[1] !== "(No Move)") || (mon.moves[2] !== undefined && mon.moves[2] !== "(No Move)") || (mon.moves[3] !== undefined && mon.moves[3] !== "(No Move)")) ? "\n" : "") +
                 "\n" +
                 ((mon.moves[0] !== undefined && mon.moves[0] !== "(No Move)") ? "- " + mon.moves[0] + "\n" : "") +
                 ((mon.moves[1] !== undefined && mon.moves[1] !== "(No Move)") ? "- " + mon.moves[1] + "\n" : "") +
                 ((mon.moves[2] !== undefined && mon.moves[2] !== "(No Move)") ? "- " + mon.moves[2] + "\n" : "") +
                 ((mon.moves[3] !== undefined && mon.moves[3] !== "(No Move)") ? "- " + mon.moves[3] + "\n" : "");
    return exportString;
}

export function MonsContainer({ tabActive, collapsed, sideCode, imported, updateMons, gameType, setExportString }){
    const importedMemo = useMemo(() => imported, [imported]);
    const tabActiveMemo = useMemo(() => tabActive, [tabActive]);
    const collapsedMemo = useMemo(() => collapsed, [collapsed]);
    const gameTypeMemo = useMemo(() => gameType, [gameType]);
    const updateMonsMemo = useCallback((s, p) => updateMons(s, p), [updateMons]);
    var [party, setParty] = useState([]); // party is dummy list
    var [species, setSpecies] = useState([]);
    const [natures, setNatures] = useState([]);
    const [teraTypes, setTeraTypes] = useState([]);
    const [abilities, setAbilities] = useState([]);
    const [terasActive, setTeraStatuses] = useState([]);
    const [items, setItems] = useState([]);
    const [movesets, setMovesets] = useState([]);
    const [evsets, setEVsets] = useState([]);
    const [ivsets, setIVsets] = useState([]);
    const [boostsets, setBoostSets] = useState([]);
    const [statussets, setStatusSets] = useState([]);
    var [notes, setNotes] = useState([]); // list of mon notes
    const sideCodeMemo = useMemo(() => sideCode, [sideCode]);

    const importTeam = useCallback(() => {
        if (Object.keys(importedMemo).length > 0 && Object.keys(importedMemo).includes("species")){
            setParty((new Array(importedMemo.species.length).fill(0)).map((dummy, idx) =>
                new Pokemon(gen, importedMemo.species[idx], {
                  nature: importedMemo.natures[idx],
                  ability: importedMemo.abilities[idx],
                  item: importedMemo.items[idx],
                  moves: Object.values(importedMemo.moves[idx]),
                  evs: importedMemo.evs[idx],
                  ivs: importedMemo.ivs[idx],
                  name: importedMemo.notes[idx],
                })));
            setSpecies(importedMemo.species);
            setNatures(importedMemo.natures);
            setTeraStatuses(new Array(importedMemo.species.length).fill(false));
            setTeraTypes(importedMemo.teraTypes);
            setAbilities(importedMemo.abilities);   
            setItems(importedMemo.items);
            setMovesets(importedMemo.moves);
            setEVsets(importedMemo.evs);
            setIVsets(importedMemo.ivs);
            setBoostSets(new Array(importedMemo.species.length).fill({hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}));
            setStatusSets(new Array(importedMemo.species.length).fill("(none)"));
            setNotes(importedMemo.notes); // list of mon notes
        }
    }, [importedMemo]);

    useEffect(() => {
        importTeam();
    }, [importedMemo, importTeam]);

    function updateStats(baseStats, evs, ivs, nature, boosts){
        var raws = [];
        var boosteds = [];
        var level = (gameTypeMemo === "Doubles") ? 50 : 100;
        for (const stat of statList){
            const statFirstStep = Math.floor((2 * baseStats[stat] + ivs[stat] + Math.floor(evs[stat]/4)) * level / 100)
            const plus = gen.natures.get(toID(nature)).plus;
            const minus = gen.natures.get(toID(nature)).minus;
            const natureMod = (plus === stat && plus !== minus) ? 1.1 : ((minus === stat && minus !== plus) ? 0.9 : 1);
            const statSecondStep = (stat === "hp") ? statFirstStep + level + 10 : (statFirstStep + 5) * natureMod;
            raws.push(statSecondStep);
            var boosted = Math.floor(statSecondStep * (2+Math.max(0, boosts[stat]))/(2-Math.min(0, boosts[stat])));
            boosteds.push(boosted);
        }
        
        return {
            raw: raws,
            boosted: boosteds
        };
    }

    function setSpecie(specie, index){
        const replaced = party[index];
        replaced.species = gen.species.get(toID(specie));
        replaced.types = gen.species.get(toID(specie)).types;
        replaced.ability = gen.species.get(toID(specie)).abilities[0];
        replaced.teraType = undefined;
        const statsObj = updateStats(gen.species.get(toID(specie)).baseStats, evsets[index], ivsets[index], natures[index], boostsets[index]);
        replaced.rawStats = statsObj["raw"];
        replaced.stats = statsObj["boosted"];
        replaced.originalCurHP = statsObj["raw"][0];
        setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        setSpecies([...species.slice(0, index), specie, ...species.slice(index+1)]);
        setAbilities([...abilities.slice(0, index), gen.species.get(toID(specie)).abilities[0], ...abilities.slice(index+1)]);
        setTeraTypes([...teraTypes.slice(0, index), gen.species.get(toID(specie)).types[0], ...teraTypes.slice(index+1)]);
    }

    function setNature(nature, index){
        const replaced = party[index];
        replaced.nature = nature;
        setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        setNatures([...natures.slice(0, index), nature, ...natures.slice(index+1)]);
    }

    function setTeraType(type, index){
        if (terasActive[index]){
            const replaced = party[index];
            replaced.teraType = type;
            setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        }
        setTeraTypes([...teraTypes.slice(0, index), type, ...teraTypes.slice(index+1)]);
    }

    function setAbility(ability, index){
        const replaced = party[index];
        replaced.ability = ability;
        setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        setAbilities([...abilities.slice(0, index), ability, ...abilities.slice(index+1)]);
    }

    function setTeraActive(active, index){
        if (active){
            const replaced = party[index];
            replaced.teraType = teraTypes[index];
            setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        }
        else{
            const replaced = party[index];
            replaced.teraType = undefined;
            setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        }
        setTeraStatuses([...terasActive.slice(0, index), active, ...terasActive.slice(index+1)]);
    }

    function setItem(item, index){
        const replaced = party[index];
        replaced.item = item;
        setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        setItems([...items.slice(0, index), item, ...items.slice(index+1)]);
    }

    function setMoveset(moves, index){
        const replaced = party[index];
        replaced.moves = Object.values(moves);
        //console.log(moves);
        setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        setMovesets([...movesets.slice(0, index), moves, ...movesets.slice(index+1)]);
    }

    function setEVs(evs, index){
        const replaced = party[index];
        replaced.evs = evs;
        setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        setEVsets([...evsets.slice(0, index), evs, ...evsets.slice(index+1)]);
    }

    function setIVs(ivs, index){
        const replaced = party[index];
        replaced.ivs = ivs;
        setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        setIVsets([...ivsets.slice(0, index), ivs, ...ivsets.slice(index+1)]);
    }

    function setBoosts(boosts, index){
        const replaced = party[index];
        const fakeBoosts = boosts;
        for (const boost of Object.keys(boosts)) {
            fakeBoosts[boost] = Number(boosts[boost]);
        }
        replaced.boosts = fakeBoosts;
        setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        setBoostSets([...boostsets.slice(0, index), boosts, ...boostsets.slice(index+1)]);
    }

    function setStatus(status, index){
        const replaced = party[index];
        replaced.status = (status === "(none)") ? "" : status;
        setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        setStatusSets([...statussets.slice(0, index), status, ...statussets.slice(index+1)]);
    }

    function setMonNotes(blurb, index){
        const replaced = party[index];
        replaced.name = blurb;
        setParty([...party.slice(0, index), replaced, ...party.slice(index+1)]);
        setNotes([...notes.slice(0, index), blurb.toString(), ...notes.slice(index+1)]);
    }

    function addMon(event){
        //var newID = numCreated+1;
        //var nextNumCreated = numCreated+1;
        setParty(party.concat(new Pokemon(gen, "Ababo", {
            nature: "Serious",
            ability: "Pixilate",
            item: "(no item)",
            moves: ["(No Move)", "(No Move)", "(No Move)", "(No Move)"],
            evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
            ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
            boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}
        })));
        setNotes(notes.concat(""));
        //setNumCreated(nextNumCreated);
        setSpecies(species.concat("Ababo"));
        setNatures(natures.concat("Serious"));
        setAbilities(abilities.concat("Pixilate"));
        setTeraTypes(teraTypes.concat("Fairy"));
        setTeraStatuses(terasActive.concat(false));
        setItems(items.concat("(no item)"));
        setMovesets(movesets.concat({
            1: "(No Move)",
            2: "(No Move)",
            3: "(No Move)",
            4: "(No Move)",
        }));
        setEVsets(evsets.concat({hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}));
        setIVsets(ivsets.concat({hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}));
        setBoostSets(boostsets.concat({hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}));
        setStatusSets(statussets.concat("(none)"));
        //forceUpdate();
        //console.log(party);
    }

    function removeMon(event){
        setParty(party.slice(0, -1));
        setNotes(notes.slice(0, -1));
        setSpecies(species.slice(0, -1));
        setNatures(natures.slice(0, -1));
        setAbilities(abilities.slice(0, -1));
        setTeraTypes(teraTypes.slice(0, -1));
        setTeraStatuses(terasActive.slice(0, -1));
        setItems(items.slice(0, -1));
        setMovesets(movesets.slice(0, -1));
        setEVsets(evsets.slice(0, -1));
        setIVsets(ivsets.slice(0, -1));
        setBoostSets(boostsets.slice(0, -1));
        setStatusSets(statussets.slice(0, -1));
        //forceUpdate();
        
    }

    function removeSpecificMon(event){
        //forceUpdate();
        //console.log(event.target.id);
        //const indexToUse = event.target.id;
        //console.log(party);
        const spliced = party.toSpliced(event.target.id, 1);
        const notesSpliced = notes.toSpliced(event.target.id, 1);
        const speciesS = species.toSpliced(event.target.id, 1);
        const naturesS = natures.toSpliced(event.target.id, 1);
        const abilitiesS = abilities.toSpliced(event.target.id, 1);
        const teraTypesS = teraTypes.toSpliced(event.target.id, 1);
        const terasActiveS = terasActive.toSpliced(event.target.id, 1);
        const itemsS = items.toSpliced(event.target.id, 1);
        const movesetsS = movesets.toSpliced(event.target.id, 1);
        const evsetsS = evsets.toSpliced(event.target.id, 1);
        const ivsetsS = ivsets.toSpliced(event.target.id, 1);
        const boostsetsS = boostsets.toSpliced(event.target.id, 1);
        const statussetsS = statussets.toSpliced(event.target.id, 1);
        //console.log([...spliced]);
        setParty([...spliced]);
        setNotes([...notesSpliced]);
        //console.log("removed");
        setSpecies([...speciesS]);
        setNatures([...naturesS]);
        setAbilities([...abilitiesS]);
        setTeraTypes([...teraTypesS]);
        setTeraStatuses([...terasActiveS]);
        setItems([...itemsS]);
        setMovesets([...movesetsS]);
        setEVsets([...evsetsS]);
        setIVsets([...ivsetsS]);
        setBoostSets([...boostsetsS]);
        setStatusSets([...statussetsS]);
    }

    useEffect(() => {
        updateMonsMemo(sideCodeMemo, party);
        var exportString = "";
        for (const mon of party) {
            exportString = exportString + monToExportSet(mon, gameTypeMemo) + "\n";
        }
        setExportString(exportString);
    }, [party, sideCodeMemo, updateMonsMemo, gameTypeMemo, setExportString]);


    /*
    const renderMon = ({ index, key, style }) => (
        <div key={key} className="mon-panel" style={{position: "relative"}}><button type="button" style={{width: "20px", height: "20px"}} id={index} onClick={removeSpecificMon}>X</button><div className="index-num">{index+1}</div>{<PokemonPanel 
            style={{ textAlign: "center" }} 
            monID={index} 
            monSide={side} 
            pSpecies={species[index]} 
            pNature={natures[index]} 
            pAbility={abilities[index]} 
            pItem={items[index]} 
            pTeraType={teraTypes[index]} 
            pTeraActive={terasActive[index]} 
            pMoves={movesets[index]} 
            pEVs={evsets[index]} 
            pIVs={ivsets[index]} 
            pBoosts={boostsets[index]} 
            passedNotes={notes[index]}></PokemonPanel>}</div>
    );
    */

    return (
        <partyContext.Provider value={{ notes, setMonNotes, setSpecie, setNature, setAbility, setItem, setTeraType, setTeraActive, setMoveset, setEVs, setIVs, setBoosts, setStatus, gameTypeMemo }}>
        <div style={{overflow: "hidden"}}>
            <div style={{overflow: "hidden", height: (collapsedMemo) ? "34px" : "0px"}}><MonsMini sideCode={sideCode} importedSpecies={species} visible={collapsedMemo}></MonsMini></div>
            <div style={{overflow: "hidden", display: (tabActiveMemo && !collapsedMemo) ? "inline" : "none", textAlign: "center"}}><button type="button" style={{width: "30px", height: "30px"}} onClick={addMon}>+</button><button type="button" style={{width: "30px", height: "30px"}} onClick={removeMon}>-</button></div>
            <div style={{overflow: "auto", paddingTop: "5px", paddingBottom: "5px", display: (tabActiveMemo && !collapsedMemo) ? "flex" : "none"}}>
                {party.map((entry, index) => {
                    return (<div key={species[index]+natures[index]+abilities[index]+items[index]+teraTypes[index]+terasActive[index]+movesets[index]["1"]+movesets[index]["2"]+movesets[index]["3"]+movesets[index]["4"]+
                        "hpev"+evsets[index]["hp"]+"atkev"+evsets[index]["atk"]+"defev"+evsets[index]["def"]+"spaev"+evsets[index]["spa"]+"spdev"+evsets[index]["spd"]+"speev"+evsets[index]["spe"]+
                        "hpiv"+ivsets[index]["hp"]+"atkiv"+ivsets[index]["atk"]+"defiv"+ivsets[index]["def"]+"spaiv"+ivsets[index]["spa"]+"spdiv"+ivsets[index]["spd"]+"speiv"+ivsets[index]["spe"]+
                        "hpboost"+boostsets[index]["hp"]+"atkboost"+boostsets[index]["atk"]+"defboost"+boostsets[index]["def"]+"spaboost"+boostsets[index]["spa"]+"spdboost"+boostsets[index]["spd"]+"speboost"+boostsets[index]["spe"]+
                        "status"+statussets[index]+notes[index]+index} 
                        className="mon-panel" style={{position: "relative"}}><button type="button" style={{width: "20px", height: "20px"}} id={index} onClick={removeSpecificMon}>X</button><div className="index-num">{index+1}</div>{<PokemonPanel 
                                                style={{ textAlign: "center" }} 
                                                monID={index} 
                                                monSide={sideCodeMemo} 
                                                pSpecies={species[index]} 
                                                pNature={natures[index]} 
                                                pAbility={abilities[index]} 
                                                pItem={items[index]} 
                                                pTeraType={teraTypes[index]} 
                                                pTeraActive={terasActive[index]} 
                                                pMoves={movesets[index]} 
                                                pEVs={evsets[index]} 
                                                pIVs={ivsets[index]} 
                                                pBoosts={boostsets[index]}
                                                pStatus={statussets[index]} 
                                                passedNotes={notes[index]}></PokemonPanel>}</div>)})}
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