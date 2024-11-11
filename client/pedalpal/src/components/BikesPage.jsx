import React,{useEffect,useState} from "react";

import BikeCollection from "./BikeCollection";


function BikesPage(){
    const [bikes,setBikes] = useState([])
    // Fetching the bikes data from the server
    useEffect(()=>{
        fetch("https://json-server-vercel-lemon-nu.vercel.app/bikes")
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