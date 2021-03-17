import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom"

function NavBar(props) {
  
  const photos = props.photos;
  
  const [characters, setCharacters] = useState([]);

  let location = useLocation();

  useEffect(() => {
    updateCharacters();
  }, [location]);

  async function updateCharacters() {
    const split = location.pathname.split('_')
    if (split[0] == '/photo') {
      const response = await fetch(`photos/init?photo_id=${split[1]}`);
      const characters = await response.json();
      setCharacters(characters.map(c => c.name));
    } else {
      setCharacters([]);
    }
  }

  const home = (
    <article className='nav-home'>
      <h1>Where is Wally ?</h1>
      <div></div>
    </article>
  );

  const characterList = characters.map((c, index) => {
    return (
      <li key={index}>
        <span>{displayCharacterName(c)}</span>
        <div style={{
          backgroundImage: `url(${photos[c]})`
        }}>
        </div>
      </li>
    )
  });

  const photo = (
    <article className='nav-photo'>
      <Link to='/'>&gt;&gt; Go Back</Link>
      <ul>{characterList}</ul>
    </article>
  );

  function displayCharacterName(c) {
    const name = c.charAt(0).toUpperCase() + c.slice(1)
    return name === 'Wizard' ? name + ' Whitebeard' : name;
  }

  function renderNav() {
    if (location.pathname ==='/'){
      return home
    } else {
      return photo
    }
  }

  return (
    <nav>{renderNav()}</nav>
  )
}

export default NavBar
