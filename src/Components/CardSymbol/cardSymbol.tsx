
import { useEffect, useState } from 'react';
import CardService from '../../Services/CardService';
import './CardSymbol.css';

interface Props {
    symbol: string,
    set?: boolean,
    size?: number
}

function CardSymbol({symbol, set = false, size = 20}: Props) {
    const cardService: CardService = new CardService();
    const [image, setImage] = useState('');

    useEffect(() => {
        if(!set){
            cardService.getSymbol(symbol).then(response => {
                setImage(response);
            });
        }else{
            cardService.getSetSymbol(symbol).then(response => {
                setImage(response);
            });
        }
    }, [symbol]) 

    return (
        <div className="symbol">
            <img style={{height: size + "px"}} src={image}></img>
        </div>
    );
}

export default CardSymbol;

