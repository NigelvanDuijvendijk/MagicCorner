
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import CardService from '../../Services/CardService';
import CardSymbol from '../CardSymbol/cardSymbol';
import './Filter.css';

interface Props {
    cards: DocumentData[],
    filterFunction: React.Dispatch<React.SetStateAction<DocumentData[]>>
}

function Filter({cards, filterFunction}: Props) {
    const [colorFilter, setColorFilter] = useState([] as string[]);
    const [rarityFilter, setRarityFilter] = useState([] as string[]);

    useEffect(() => {

    }, []) 

    const filterCollection  = () => {
        var filteredCollection = cards;
        if(colorFilter.length > 0){
            filteredCollection = cards.filter(card => card.colors.some((color: string) => colorFilter.includes(color)));
        }
        if(rarityFilter.length > 0){
            filteredCollection = filteredCollection.filter(card => rarityFilter.includes(card.rarity));
        }
        console.log(filteredCollection);
        filterFunction(filteredCollection);
    }

    const addColor = (color: string) => {
        if(colorFilter.includes(color)){
            setColorFilter(colorFilter.filter(c => c !== color));
        }else{
            setColorFilter([...colorFilter, color]);
        }
    }

    const addRarity = (rarity: string) => {
        if(rarityFilter.includes(rarity)){
            setRarityFilter(rarityFilter.filter(r => r !== rarity));
        }else{
            setRarityFilter([...rarityFilter, rarity]);
        }
    }

    const hasColor = (color: string) => {
        return colorFilter.includes(color);
    }

    const hasRarity = (rarity: string) => {
        return rarityFilter.includes(rarity);
    }


    return (
        <div className="Filter">
            <ul className="colorFilter">
                <li className={`${hasColor("W") ? "selected" : ""}`} onClick={() => addColor("W")}><CardSymbol size={40} symbol={"W"}></CardSymbol></li>
                <li className={`${hasColor("B") ? "selected" : ""}`} onClick={() => addColor("B")}><CardSymbol size={40} symbol={"B"}></CardSymbol></li>
                <li className={`${hasColor("U") ? "selected" : ""}`} onClick={() => addColor("U")}><CardSymbol size={40} symbol={"U"}></CardSymbol></li>
                <li className={`${hasColor("R") ? "selected" : ""}`} onClick={() => addColor("R")}><CardSymbol size={40} symbol={"R"}></CardSymbol></li>
                <li className={`${hasColor("G") ? "selected" : ""}`} onClick={() => addColor("G")}><CardSymbol size={40} symbol={"G"}></CardSymbol></li>
                <li className={`${hasColor("C") ? "selected" : ""}`} onClick={() => addColor("C")}><CardSymbol size={40} symbol={"C"}></CardSymbol></li>
            </ul>

            <ul className="rarityFilter">
                <li className={`common ${hasRarity("common") ? "selected" : ""}`} onClick={() => addRarity("common")}></li>
                <li className={`unCommen ${hasRarity("uncommon") ? "selected" : ""}`} onClick={() => addRarity("uncommon")}></li>
                <li className={`rare ${hasRarity("rare") ? "selected" : ""}`} onClick={() => addRarity("rare")}></li> 
                <li className={`mythic ${hasRarity("mythic") ? "selected" : ""}`} onClick={() => addRarity("mythic")}></li>
            </ul>
            <button onClick={filterCollection} className='btn btn-primary'>Filter</button>
        </div>
    );
}

export default Filter;

