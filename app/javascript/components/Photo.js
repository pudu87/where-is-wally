import React, { useState, useEffect } from 'react'

function Photo(props) {
  const photo = props.photo;

  const [coords, setCoords] = useState([0, 0]);

  useEffect(() => {
    const img = document.querySelector('img');
    const characters = document.querySelectorAll('.selection li');
    img.addEventListener('click', handleClick);
    characters.forEach(character => {
      character.addEventListener('click', handleSelection);
    });
    showBox();
    return () => {
      img.removeEventListener('click', handleClick);
      characters.forEach(character => {
        character.removeEventListener('click', handleSelection);
      });
    }
  }, [coords])

  function handleClick(e) {
    setCoords([e.layerX, e.layerY]);
    const selection = document.querySelector('.selection');
    selection.classList.toggle('no-display');
  }

  function showBox() {
    let result = false;
    Object.entries(photo.positions).forEach(([character, position]) => {
      const horizontal = position[0] < coords[0] && coords[0] < position[2];
      const vertical = position[1] < coords[1] && coords[1] < position[3];
      if (horizontal && vertical) {
        result = character;
      }
    });
    if (result) {
      const box = document.querySelector(`.box.${result}`);
      box.classList.toggle('no-display');
    }
  }

  function handleSelection(e) {
    console.log(e.target.textContent)
  }

  const styles = Object.values(photo.positions).map(coords => {
    return {
      left: coords[0],
      top: coords[1],
      width: coords[2] - coords[0],
      height: coords[3] - coords[1],
    }
  });

  const boxes = Object.keys(photo.positions).map((character, index) => {
    return (
      <div
        key={index}
        className={`box ${character} no-display`}
        style={styles[index]}>
      </div>
    )
  });

  const selection = Object.keys(photo.positions).map((character, index) => {
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
