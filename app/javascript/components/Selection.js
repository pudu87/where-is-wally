import React from 'react'

function Selection(props) {

  const { positions, coords, screenCoords } = props;

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

  const selections = Object.keys(positions).map((character, index) => {
    return (
      <li key={index}>
        {character}
      </li>
    )
  });

  return (
    <ul 
      className='selection no-display'
      style={{ left: coords[0], top: coords[1], ...selectionStyles() }}>
      <span style={ spanStyles() }></span>
      {selections}
    </ul>
  )
}

export default Selection