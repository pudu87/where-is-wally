import React, {useState, useEffect} from 'react'

function HighScores(props) {

  const photo = props.photo;

  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    fetchHighScores()
  },[])
  
  async function fetchHighScores() {
    const response = await fetch(`users?photo_id=${photo.id}`);
    const result = await response.json();
    const newHighScores =  result.map(user => {
      return { name: user.name, score: user.score }
    })
    setHighScores(newHighScores);
  }

  const highScoresList = highScores.map((user, index) => {
    return (
      <tr key={index}>
        <th>{index + 1}</th>
        <th>{user.name}</th>
        <th>{(Math.round(user.score * 100) / 100).toFixed(2)}</th>
      </tr>
    )
  });

  return (
    <article className='high-scores'>
      <h2>High Scores</h2>
      <table>
        <tbody>{highScoresList}</tbody>
      </table>
    </article>
  )
}

export default HighScores
