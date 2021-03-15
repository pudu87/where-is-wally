import React, { useState, useEffect } from 'react'

function Photo(props) {
  const photo = props.photo;
  const token = document.querySelector('meta[name="csrf-token"]').content;

  const [coords, setCoords] = useState([0, 0]);
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState('');
  const [positions, setPositions] = useState({});
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    initPositions();
  }, [])

  async function initPositions() {
    const response = await fetch(`photos/init?photo_id=${photo.id}`);
    const characters = await response.json();
    const result = {};
    characters.forEach(c => result[c.name] = []);
    setPositions(result);
  }

  async function initUser() {
    const response = await fetch('users/', { 
      method: 'POST',
      headers: { 
        'X-CSRF-Token': token,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ photo_id: photo.id })
    });
    const id = await response.json();
    setUserId(id);
    toggleDisplay(document.querySelector('.start'));
    toggleDisplay(document.querySelector('.popups'));
    toggleBlur(document.querySelector('.photo img'));
  }

  useEffect(() => {
    if (userId && !score) {
      const img = document.querySelector('img');
      const characters = document.querySelectorAll('.selection li');
      img.addEventListener('click', handleClick);
      characters.forEach(character => {
        character.addEventListener('click', handleSelection);
      });
      return () => {
        img.removeEventListener('click', handleClick);
        characters.forEach(character => {
          character.removeEventListener('click', handleSelection);
        });
      }
    }
  })

  function handleClick(e) {
    setCoords([e.layerX, e.layerY]);
    toggleDisplay(document.querySelector('.selection'));
  }

  function toggleDisplay(element) {
    element.classList.toggle('no-display');
  }

  function toggleBlur(img) {
    img.classList.toggle('blur');
  }

  async function handleSelection(e) {
    const character = e.target.textContent
    const response = await fetch('photos/search?'
      + `user_id=${userId}&`
      + `photo_id=${photo.id}&`
      + `x=${coords[0]}&y=${coords[1]}&`
      + `character=${character}`
    );
    const result = await response.json();
    let time;
    if (result) {
      showBox(result, character);
      time = await checkUser(character);
      if (time) {
        setScore(time);
        toggleDisplay(document.querySelector('.popups'));
        toggleDisplay(document.querySelector('.insert-name'));
      }
    }
    toggleDisplay(document.querySelector('.selection'));
  }

  function showBox(result, character) {
    const position = {
      left: result.left,
      top: result.top,
      right: result.right,
      bottom: result.bottom
    }
    setPositions({...positions, [character]: position });
  }

  async function checkUser(character) {
    const response = await fetch('users/check', { 
      method: 'POST',
      headers: { 
        'X-CSRF-Token': token,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ user_id: userId, character })
    });
    const time = await response.json();
    return time;
  }

  function handleNameChange(e) {
    setUserName(e.target.value)
  }

  async function submitName(e) {
    e.preventDefault()
    await fetch(`users/${userId}`, { 
      method: 'PATCH',
      headers: { 
        'X-CSRF-Token': token,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ name: userName })
    });
    showHighScores();
  }

  async function showHighScores() {
    const response = await fetch('users');
    const result = await response.json();
    const newHighScores = result.map(user => {
      return { name: user.name, score: user.score }
    })
    setHighScores(newHighScores);
    toggleDisplay(document.querySelector('.insert-name'));
    toggleDisplay(document.querySelector('.high-scores'));
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

  const selection = Object.keys(positions).map((character, index) => {
    return (
      <li key={index}>
        {character}
      </li>
    )
  });

  const boxStyles = Object.values(positions).map(position => {
    return {
      left: position.left,
      top: position.top,
      width: position.right - position.left,
      height: position.bottom - position.top,
    }
  });

  const boxes = Object.keys(positions).map((character, index) => {
    return (
      positions[character].left &&
      <div
        key={index}
        className={`box ${character}`}
        style={boxStyles[index]}>
      </div>
    )
  });

  return (
    <div className='photo'>
      <img 
        src={photo.src}
        className='blur'/>
      <div className='popups'>
        <article className='start'>
          <button onClick={initUser}>Start</button>
        </article>
        <article className='insert-name no-display'>
          <p>You Finished in</p>
          <p>{score} s</p>
          <form onSubmit={submitName}>
            <label>
              Name:
              <br/>
              <input 
                type='text' 
                name='name'
                onChange={handleNameChange}
                value={userName}/><br/>
            </label>
            <input 
              type='submit' 
              value='Confirm'/>
          </form>
        </article>
        <article className='high-scores no-display'>
          <h2>High Scores</h2>
          <table>
            <tbody>{highScoresList}</tbody>
          </table>
        </article>
      </div>      
      <ul 
        className='selection no-display'
        style={{ left: coords[0], top: coords[1] }}>
        {selection}
      </ul>
      {boxes}
    </div>
  )
}

export default Photo
