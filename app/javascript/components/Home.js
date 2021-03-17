import React from 'react'
import { Link } from "react-router-dom"

function Home(props) {
  const photos = props.photos;

  const links = photos.map((photo, index) => {
    return (
      <section key={index}>
        <Link to={photo.path}>
          <article
            style={{ backgroundImage: `url(${photo.src})` }}>
          </article>
        </Link>
        <a>Highscores</a>
      </section>
    )
  })

  return (
    <div className='home'>
      {links}
    </div>
  )
}

export default Home
