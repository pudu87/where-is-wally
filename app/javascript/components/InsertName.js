import React, { useState } from 'react'

function InsertName(props) {

  const token = document.querySelector('meta[name="csrf-token"]').content;
  const { userId, score, onChange } = props;

  const [userName, setUserName] = useState('');

  function handleNameChange(e) {
    setUserName(e.target.value)
  }

  async function submitName(e) {
    e.preventDefault()
    if (userName.length > 10) {
      return alert('Max 10 characters allowed. Try another name.')
    }
    await fetch(`users/${userId}`, { 
      method: 'PATCH',
      headers: { 
        'X-CSRF-Token': token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: userName })
    });
    onChange();
  }

  return (
    <article className='insert-name'>
      <p>You Finished in</p>
      <p>{score} s</p>
      <form onSubmit={submitName}>
        <label>
          Name:
          <br/>
          <input 
            type='text' 
            name='name'
            onChange={handleNameChange}
            value={userName}/><br/>
        </label>
        <input 
          type='submit' 
          value='Confirm'/>
      </form>
    </article>
  )
}

export default InsertName
