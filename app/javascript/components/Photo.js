import React, { useState, useEffect } from 'react'
import Start from './Start'
import InsertName from './InsertName'
import HighScores from './HighScores'
import Selection from './Selection'

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
      const img = document.querySelector('.photo > img');
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
  }, [userId, score, coords])

  function handleClick(e) {
    setCoords([e.layerX, e.layerY]);
    setScreenCoords([e.x, e.y]);
    toggleDisplay(document.querySelector('.selection'));
  }

  async function handleSelection(e) {
    const selection = e.target;
    const character = e.target.textContent;
    const response = await fetch('photos/search?'
      + `user_id=${userId}&`
      + `photo_id=${photo.id}&`
      + `x=${coords[0]}&y=${coords[1]}&`
      + `character=${character}`
    );
    const result = await response.json();
    await processResult(result, selection, character);
    toggleDisplay(document.querySelector('.selection'));
  }

  async function processResult(result, selection, character) {
    let time;
    if (result) {
      showBox(result, character);
      selection.classList.add('found');
      time = await getTime(character);
      if (time) {
        setScore(time);
        toggleDisplay(document.querySelector('.popups'));
        setPopups('insertName');
      }
    }
  }

  async function getTime(character) {
    const response = await fetch('users/check', { 
      method: 'POST',
      headers: { 
        'X-CSRF-Token': token,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ user_id: userId, character })
    });
    return await response.json();
  }

  function showBox(result, character) {
    const newPosition = {
      left: result.left,
      top: result.top,
      right: result.right,
      bottom: result.bottom
    }
    setPositions({...positions, [character]: newPosition });
  }

  function toggleDisplay(element) {
    element.classList.toggle('no-display');
  }

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
        <span></span>
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
      <img src={photo.src} className='blur'/>
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
      <Selection 
        positions={positions} 
        coords={coords}
        screenCoords={screenCoords}/>
      {boxes}
    </div>
  )
}

export default Photo
