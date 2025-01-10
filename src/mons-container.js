import { PokemonPanel } from "./mon-panel.js";
import React, { useState } from 'react';



export const partyContext = React.createContext(null);

export function MonsContainer({ sideCode }){
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
    var [notes, setNotes] = useState([]); // list of mon notes
    const [side] = useState(sideCode);
    //const [numCreated, setNumCreated] = useState(0);
    //const [, forceUpdate] = useReducer(x => x + 1, 0);
    /*
    const defaultMon = new Pokemon(gen, "Ababo", {
        nature: "Serious",
        teraType: undefined,
        ability: "Pixilate",
        evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
        ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
        boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}
    });
    */

    /*
    function setMon(index){
        console.log(species);
        console.log(index);
        console.log(species[index]);
        var creation = new Pokemon(gen, species[index], {
            nature: natures[index],
            ability: abilities[index],
            item: (items[index] !== "(no item)") ? items[index]: undefined,
            teraType: (terasActive[index]) ? (teraTypes[index]) : undefined,
            moves: movesets[index],
            evs: evsets[index],
            ivs: ivsets[index],
            boosts: boostsets[index]
        });
        setParty([...party.slice(0, index), creation, ...party.slice(index+1)]);
    }
    */

    function setSpecie(specie, index){
        setSpecies([...species.slice(0, index), specie, ...species.slice(index+1)]);
    }

    function setNature(nature, index){
        setNatures([...natures.slice(0, index), nature, ...natures.slice(index+1)]);
    }

    function setTeraType(type, index){
        setTeraTypes([...teraTypes.slice(0, index), type, ...teraTypes.slice(index+1)]);
    }

    function setAbility(ability, index){
        setAbilities([...abilities.slice(0, index), ability, ...abilities.slice(index+1)]);
    }

    function setTeraActive(active, index){
        setTeraStatuses([...terasActive.slice(0, index), active, ...terasActive.slice(index+1)]);
    }

    function setItem(item, index){
        setItems([...items.slice(0, index), item, ...items.slice(index+1)]);
    }

    function setMoveset(moves, index){
        setMovesets([...movesets.slice(0, index), moves, ...movesets.slice(index+1)]);
    }

    function setEVs(evs, index){
        setEVsets([...evsets.slice(0, index), evs, ...evsets.slice(index+1)]);
    }

    function setIVs(ivs, index){
        setIVsets([...ivsets.slice(0, index), ivs, ...ivsets.slice(index+1)]);
    }

    function setBoosts(boosts, index){
        setBoostSets([...boostsets.slice(0, index), boosts, ...boostsets.slice(index+1)]);
    }

    function setMonNotes(blurb, index){
        setNotes([...notes.slice(0, index), blurb.toString(), ...notes.slice(index+1)]);
    }

    function addMon(event){
        //var newID = numCreated+1;
        //var nextNumCreated = numCreated+1;
        setParty(party.concat("mon"));
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
    }

    //useEffect (() => {
    //    console.log(abilities);
    //}, [abilities]);

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
        <partyContext.Provider value={{ notes, setMonNotes, setSpecie, setNature, setAbility, setItem, setTeraType, setTeraActive, setMoveset, setEVs, setIVs, setBoosts }}>
        <div>
            <button type="button" style={{width: "30px", height: "30px"}} onClick={addMon}>+</button><button type="button" style={{width: "30px", height: "30px"}} onClick={removeMon}>-</button>
            <div style={{display: "flex"}} >
                {party.map((entry, index) => <div key={species[index]+index} className="mon-panel" style={{position: "relative"}}><button type="button" style={{width: "20px", height: "20px"}} id={index} onClick={removeSpecificMon}>X</button><div className="index-num">{index+1}</div>{<PokemonPanel 
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
                                                passedNotes={notes[index]}></PokemonPanel>}</div>)}
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