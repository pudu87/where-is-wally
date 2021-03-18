import React, { useState, useEffect } from 'react'
import Start from './Start'
import InsertName from './InsertName'
import HighScores from './HighScores'

function Photo(props) {

  const photo = props.photo;
  const token = document.querySelector('meta[name="csrf-token"]').content;

  const [positions, setPositions] = useState({});
  const [coords, setCoords] = useState([0, 0]);
  const [screenCoords, setScreenCoords] = useState([0, 0]);
  const [userId, setUserId] = useState(0);
  const [score, setScore] = useState(0);
  const [popups, setPopups] = useState('start');

  useEffect(() => {
    initPositions();
  }, [])

  async function initPositions() {
    const response = await fetch(`photos/init?photo_id=${photo.id}`);
    const characters = await response.json();
    const result = {};
    characters.forEach(c => result[c.name] = {});
    setPositions(result);
  }

  useEffect(() => {
    if (userId && !score) {
      const img = document.querySelector('img');
      const characters = document.querySelectorAll('.selection li');
      img.addEventListener('click', handleClick);
      characters.forEach(character => {
        const characterName = character.textContent;
        if (Object.keys(positions[characterName]).length === 0) {
          character.addEventListener('click', handleSelection);
          }
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
    setScreenCoords([e.x, e.y]);
    toggleDisplay(document.querySelector('.selection'));
  }

  function toggleDisplay(element) {
    element.classList.toggle('no-display');
  }

  async function handleSelection(e) {
    const character = e.target.textContent;
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
      e.target.classList.add('found');
      time = await checkUser(character);
      if (time) {
        setScore(time);
        toggleDisplay(document.querySelector('.popups'));
        setPopups('insertName');
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

  function selectionStyles() {
    if (screenCoords[0] < 100) {
      return screenCoords[1] < 160 ?
      { borderTopLeftRadius: 0 } :
      { borderBottomLeftRadius: 0, transform: 'translate(0, -100%)' };
    }
    else {
      return screenCoords[1] < 160 ?
      { borderTopRightRadius: 0, transform: 'translate(-100%, 0)' } :
      { borderBottomRightRadius: 0, transform: 'translate(-100%, -100%)' };
    }
  }

  function spanStyles() {
    if (screenCoords[0] < 100) {
      return screenCoords[1] < 160 ? 
      { rotate: '-45deg', top: -1, left: -7 } : 
      { rotate: '-135deg', bottom: -1, left: -7 };
    }
    else {
      return screenCoords[1] < 160 ? 
      { rotate: '45deg', top: -1, right: -7 } : 
      { rotate: '135deg', bottom: -1, right: -7 };
    }
  }

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

  function handleStart(id) {
    setUserId(id);
  }

  function handleInsertName() {
    setPopups('highScores');
  }

  return (
    <div className='photo'>
      <img 
        src={photo.src}
        className='blur'/>
      <div className='popups'>
        { 
          popups ==='start'
          && <Start 
            photo={photo} 
            onChange={handleStart}/>
        }
        { 
          popups ==='insertName'
          && <InsertName 
            userId={userId} 
            score={score} 
            onChange={handleInsertName}/>
        }
        { 
          popups ==='highScores' 
          && <HighScores 
            photo={photo}/>
        }
      </div>
      <ul 
        className='selection no-display'
        style={{ left: coords[0], top: coords[1], ...selectionStyles() }}>
        <span style={ spanStyles() }></span>
        {selection}
      </ul>
      {boxes}
    </div>
  )
}

export default Photo
