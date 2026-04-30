import React, { useState, useContext, useMemo, useEffect } from 'react';
import * as img from '@pkmn/img';
import { monDispatchContext } from './App';

function iconIndexToCoords(num) {
  const top = -Math.floor(num / 12) * 30;
  const left = -(num % 12) * 40;
  return { top: top, left: left };
}

function speciesIconExceptions(name) {
  if (name === "Vanilluxe") { return iconIndexToCoords(584); }
  if (name === "Absol") { return iconIndexToCoords(359); }
  if (name === "Absol-Mega") { return iconIndexToCoords(1354); }
  if (name === "Tsareena") { return iconIndexToCoords(763); }
  if (name === "Torterra") { return iconIndexToCoords(389); }
  if (name === "Sylveon") { return iconIndexToCoords(700); }
  if (name === "Simisear") { return iconIndexToCoords(514); }
  if (name === "Scovillain-Mega") { return iconIndexToCoords(1446); }
  if (name === "Rotom-Wash") { return iconIndexToCoords(1084); }
  if (name === "Roserade") { return iconIndexToCoords(407); }
  if (name === "Politoed") { return iconIndexToCoords(186); }
  if (name === "Meowstic-M-Mega") { return iconIndexToCoords(1440); }
  if (name === "Meowstic-F-Mega") { return iconIndexToCoords(1440); }
  if (name === "Klefki") { return iconIndexToCoords(707); }
  if (name === "Greninja") { return iconIndexToCoords(658); }
  if (name === "Golurk") { return iconIndexToCoords(623); }
  if (name === "Golurk-Mega") { return iconIndexToCoords(1439); }
  if (name === "Glimmora-Mega") { return iconIndexToCoords(1447); }
  if (name === "Garbodor") { return iconIndexToCoords(569); }
  if (name === "Excadrill") { return iconIndexToCoords(530); }
  if (name === "Emboar") { return iconIndexToCoords(500); }
  if (name === "Crabominable-Mega") { return iconIndexToCoords(1441); }
  if (name === "Clefable") { return iconIndexToCoords(36); }
  if (name === "Clawitzer") { return iconIndexToCoords(693); }
  if (name === "Chimecho-Mega") { return iconIndexToCoords(1432); }
  if (name === "Castform-Snowy") { return iconIndexToCoords(1068); }
  if (name === "Aegislash-Shield") { return iconIndexToCoords(681); }
  if (name === "Aegislash-Both") { return iconIndexToCoords(681); }
  return { top: img.Icons.getPokemon(name).top.toString(), left: img.Icons.getPokemon(name).left.toString() };
}

export function MonsMini({ sideCode, importedSpecies, visible, containerIndex }) {
    const importedMemo = useMemo(() => importedSpecies, [importedSpecies]);
    const visibleMemo = useMemo(() => visible, [visible]);
    const mons = useContext(monDispatchContext).totalMons;

    return (
        <div className="minified" style={{ position: "relative", top: "2px", display: (visibleMemo) ? "inline-block" : "none", minWidth: "100px", height: "30px"}}>
            <div style={{...{ display: "flex", justifyContent: "center", alignItems: "center" }, ...(mons[containerIndex].length < 1) ? { height: "100%" } : {}}}>{(mons[containerIndex].length < 1) ? "(no "+sideCode+"s)" : ""}</div>
            {mons[containerIndex].map((s, index) => <object key={s.species+index} src="//:0" alt="" style={{
                width: "40px",
                height: "30px",
                display: "inline-block",
                imageRendering: "pixelated",
                border: "0",
                background: "transparent url("+img.Icons.getPokemon(s.species).url+") no-repeat scroll "+speciesIconExceptions(s.species).left+"px "+speciesIconExceptions(s.species).top+"px",
                }}></object>)}
        </div>
    );
}