import React, { useState, useContext, useMemo, useEffect } from 'react';
import * as img from '@pkmn/img';
import { monDispatchContext } from './App';

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
                background: "transparent url("+img.Icons.getPokemon(s.species).url+") no-repeat scroll "+img.Icons.getPokemon(s.species).left.toString()+"px "+img.Icons.getPokemon(s.species).top.toString()+"px",
                }}></object>)}
        </div>
    );
}