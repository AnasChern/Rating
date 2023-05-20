import React from 'react'

export default function RatingRow({ firstName, lastName, score }) {
    return (
        <tr data-testid='table-row'>
            <td className='cell-left'>{lastName}</td>
            <td>{firstName}</td>
            <td className='cell-right'>{score}</td>
        </tr>
    )
}
