import React from 'react'
import JsonData from './data.json'

function ListJSON(){
const DisplayData=JsonData.map(
    (info)=>{
        return(
            <tr>
                <td>{info.Owner}</td>
                <td>{info.HRI}</td>
            </tr>
        )
    }
)

return(
    <div className="list-HRI">
        <table className="table table-striped">
            <thead>
                <tr>
                <th>ComVerse Holder</th>
                <th>Rank Index</th>
                </tr>
            </thead>
            <tbody>
                {DisplayData}
            </tbody>
        </table>
         
    </div>
)
}

export default ListJSON;