import React from 'react'
import { Link } from "react-router-dom"

function Home(props) {
  const photos = props.photos;

  const links = photos.map((photo, index) => {
    return (
      <Link 
        to={photo.path}
        key={index}>
        <article
          style={{ backgroundImage: `url(${photo.src})` }}>
        </article>
      </Link>
    )
  })

  return (
    <div className='home'>
      {links}
    </div>
  )
}

export default Home
