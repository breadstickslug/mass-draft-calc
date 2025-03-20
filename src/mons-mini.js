import React, { useState, useMemo, useEffect } from 'react';
import * as img from '@pkmn/img';

export function MonsMini({ sideCode, importedSpecies, visible }) {
    const importedMemo = useMemo(() => importedSpecies, [importedSpecies]);
    const visibleMemo = useMemo(() => visible, [visible]);
    const [species, setSpecies] = useState((importedMemo) ? importedMemo : []);

    /*
    const importTeam = useCallback(() => {
            if (Object.keys(importedMemo).length > 0){
                setSpecies(importedMemo);
            }
    }, [importedMemo]);
    */

    useEffect(() => {
        setSpecies(importedMemo);
    }, [importedMemo]);

    return (
        <div className="minified" style={{ position: "relative", top: "2px", display: (visibleMemo) ? "inline-block" : "none", minWidth: "100px", height: "30px"}}>
            <div style={{...{ display: "flex", justifyContent: "center", alignItems: "center" }, ...(species.length < 1) ? { height: "100%" } : {}}}>{(species.length < 1) ? "(no "+sideCode+"s)" : ""}</div>
            {species.map((s, index) => <object key={s+index} src="//:0" alt="" style={{
                width: "40px",
                height: "30px",
                display: "inline-block",
                imageRendering: "pixelated",
                border: "0",
                background: "transparent url("+img.Icons.getPokemon(s).url+") no-repeat scroll "+img.Icons.getPokemon(s).left.toString()+"px "+img.Icons.getPokemon(s).top.toString()+"px",
                }}></object>)}
        </div>
    );
}