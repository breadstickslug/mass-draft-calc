import { PokemonPanel } from "./mon-panel.js";
import {calculate, Generations, Pokemon, Move, toID, Field} from '@smogon/calc';
import * as dex from '@pkmn/dex';
import React, { useState, useEffect, useReducer, setState } from 'react';


const gen = Generations.get(9);
const speciesDex = dex.Dex.forGen(9);
const ev_names = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];
const statList = ["hp", "atk", "def", "spa", "spd", "spe"];
const boostList = ["+6", "+5", "+4", "+3", "+2", "+1", "--", "-1", "-2", "-3", "-4", "-5", "-6"];
const boostValues = [6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6];

export const partyContext = React.createContext(null);

export function MonsContainer({ sideCode }){
    var [party, setParty] = useState([]); // party is list of mons
    var [notes, setNotes] = useState([]); // list of mon notes
    var [side] = useState(sideCode);
    var [numCreated, setNumCreated] = useState(0);
    //const [, forceUpdate] = useReducer(x => x + 1, 0);
    const defaultMon = new Pokemon(gen, "Ababo");

    function setMon(mon, index){
        setParty([...party.slice(0,index), mon, ...party.slice(index+1)]);
    }

    function setMonNotes(blurb, index){
        var newNotes = notes;
        newNotes[index] = blurb;
        setNotes(newNotes);
    }

    function addMon(event){
        var newID = numCreated+1;
        var nextNumCreated = numCreated+1;
        setParty(party.concat(defaultMon));
        setNotes(notes.concat(""));
        setNumCreated(nextNumCreated);
        //forceUpdate();
        //console.log(party);
    }

    function removeMon(event){
        setParty(party.slice(0, -1));
        setNotes(notes.slice(0, -1));
        //forceUpdate();
        
    }

    function removeSpecificMon(event){
        //forceUpdate();
        //console.log(event.target.id);
        const indexToUse = event.target.id;
        //console.log(party);
        const spliced = party.toSpliced(event.target.id, 1);
        const notesSpliced = party.toSpliced(event.target.id, 1);
        //console.log([...spliced]);
        setParty([...spliced]);
        setNotes([...notesSpliced]);
        //console.log("removed");
    }

    useEffect (() => {
        //console.log("party changed! now");
        //console.log(party);
    }, [party]);

    return (
        <partyContext.Provider value={{ party, notes, setParty, setMon, setMonNotes }}>
        <div>
            <button type="button" style={{width: "30px", height: "30px"}} onClick={addMon}>+</button><button type="button" style={{width: "30px", height: "30px"}} onClick={removeMon}>-</button>
            <div style={{display: "flex"}}>
                {party.map((entry, index) => <div key={entry.species.name+index} ><button type="button" style={{width: "20px", height: "20px"}} id={index} onClick={removeSpecificMon}>X</button>{index}{<PokemonPanel monID={index} monSide={side} passedMon={entry} passedNotes={notes[index]}></PokemonPanel>}</div> )}
            </div>
        </div>
        </partyContext.Provider>
    );
}

