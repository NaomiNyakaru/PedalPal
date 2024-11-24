import React,{useEffect,useState} from "react";

import BikeCollection from "./BikeCollection";


function BikesPage(){
    const [bikes,setBikes] = useState([])
    const serverURL = import.meta.env.VITE_SERVER_URL;

    // Fetching the bikes data from the server
    useEffect(()=>{
        fetch(`${serverURL}/bikes`)
        .then((res) => res.json())
        .then((data)=> setBikes(data))
    },[])

    return (
        <div>
           
        <BikeCollection bikes={bikes}/>
        </div>
    )
}
export default BikesPage