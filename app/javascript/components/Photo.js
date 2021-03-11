import React, { useState, useEffect } from 'react'

function Photo(props) {
  const photo = props.photo;

  const [coords, setCoords] = useState([0, 0]);
  const [userId, setUserId] = useState(1);
  const [positions, setPositions] = useState({});

  useEffect(() => {
    initPositions();
  }, [])

  async function initPositions() {
    const response = await fetch(`photos/init?photo_id=${photo.id}`);
    const characters = await response.json();
    const result = {};
    characters.forEach(c => result[c] = []);
    setPositions(result);
  }

  // useEffect(() => {
  //   // Create new user
  // }, [])

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
    result ? showBox(result, character) : 0;
    hideSelection();
  }

  function showBox(result, character) {
    setPositions({...positions, [character]: result });
  }

  const boxStyles = Object.values(positions).map(coords => {
      return {
        left: coords[0],
        top: coords[1],
        width: coords[2] - coords[0],
        height: coords[3] - coords[1],
      }
  });

  const boxes = Object.keys(positions).map((character, index) => {
      return (
        positions[character][0] &&
        <div
          key={index}
          className={`box ${character}`}
          style={boxStyles[index]}>
        </div>
      )
  });

  const selection = Object.keys(positions).map((character, index) => {
    return (
      <li key={index}>
        {character}
      </li>
    )
  });

  return (
    <div className="photo">
      <img src={photo.src}/>
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
