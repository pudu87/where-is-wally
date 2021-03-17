import React from 'react'

function Start(props) {

  const token = document.querySelector('meta[name="csrf-token"]').content;
  const { photo, onChange } = props;

  function startGame() {
    initUser();
    document.querySelector('.popups').classList.toggle('no-display');
    document.querySelector('.photo img').classList.toggle('blur');
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
    onChange(id);
  }

  return (
    <article className='start'>
      <button onClick={startGame}>Start</button>
    </article>
  )
}

export default Start
