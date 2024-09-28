import React from "react";
import {List} from "./OrderStatus.js";

function orderstats () {
    return(
            <div className="orderstatss">
                <input type="text" placeholder="Search..." className="search" />
                <ul className="List"> 
                    {Users.map ((List) =>(
                  <li className="listitem">{user.first_name } </li>   
                    ))} 
                </ul>
            </div>
    )
}

export default orderstats