import React, { useState } from 'react'
import { Link } from "react-router-dom"
import HighScores from './HighScores'

function Home(props) {

  const photos = props.photos;

  const [hSArray, setHSArray] = useState(Array(photos.length).fill(false));

  function displayHighScores() {
    const index = hSArray.findIndex(h => h);
    if (index >= 0) {
      return(
        <div className='popups'>
          <div 
            className='x'
            onClick={resetHSArray}>
            <span>✕</span>
          </div>
          <HighScores photo={photos[index]} />
        </div>
      )
    }
  }

  function handleHighScores(e) {
    const index = Number(e.target.closest('section').className.slice(1));
    const newHSArray = hSArray.map((_, i) => {
      return i === index ? true : false;
    });
    setHSArray(newHSArray);
  }

  function resetHSArray() {
    setHSArray(Array(photos.length).fill(false));
  }

  const links = photos.map((photo, index) => {
    return (
      <section 
        key={index}
        className={`_${index}`}>
        <Link to={photo.path}>
          <article
            style={{ backgroundImage: `url(${photo.src})` }}>
          </article>
        </Link>
        <button onClick={handleHighScores}>HighScores</button>
      </section>
    )
  })

  return (
    <div className='home'>
      {links}
      {displayHighScores()}
    </div>
  )
}

export default Home
