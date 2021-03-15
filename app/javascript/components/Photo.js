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
    hideStart();
  }

  function hideStart() {
    const button = document.querySelector('.start button');
    button.classList.toggle('no-display');
  }

  useEffect(() => {
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
  })

  function handleClick(e) {
    setCoords([e.layerX, e.layerY]);
    hideSelection();
  }

  function hideSelection() {
    const selection = document.querySelector('.selection');
    selection.classList.toggle('no-display');
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
      console.log(time)
    }
    time ? setScore(time) : 0;
    hideSelection();
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
  }

  const highScoresList = highScores.map((user, index) => {
    return (
      <li key={index}>
        {user.name} : {user.score}
      </li>
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
    <div className="photo">
      <img src={photo.src}/>
      <article className='start'>
        <button onClick={initUser}>Start</button>
      </article>
      <article className='insert-name'>
        <p>Time: {score}</p>
        <form onSubmit={submitName}>
          <label>
            Name:
            <input 
              type='text' 
              name='name'
              onChange={handleNameChange}
              value={userName}/>
          </label>
          <input 
            type='submit' 
            value='Confirm'/>
        </form>
      </article>
      <article className='high-scores'>
        {highScoresList}
      </article>
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
