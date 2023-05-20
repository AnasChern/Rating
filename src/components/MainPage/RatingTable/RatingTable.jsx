import React from 'react'
import RatingRow from '../RatingRow'

export default function RatingTable({ratingRows}) {
  return (
    <table className="rating-table" cellPadding="10px" >
    <thead>
        <tr>
            <td><b>Last name</b></td>
            <td><b>First name</b></td>
            <td><b>Score</b></td>
        </tr>
    </thead>
    <tbody id="rating-table">
        {ratingRows && ratingRows.map((row,index) => <RatingRow key={index} firstName={row.firstname} lastName={row.lastName} score={row.score} />)}
    </tbody >
</table>
  )
}
