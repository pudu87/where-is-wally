import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./Home"
import NavBar from "./NavBar"
import Photo from "./Photo"
import Photo_1 from 'images/photo_1.jpg'
import Photo_2 from 'images/photo_2.jpg'
import Wally from 'images/wally.png'
import Odlaw from 'images/odlaw.jpg'
import Wizard from 'images/wizard.png'

const photos = [
  {
    src: Photo_1,
    path: '/photo_1',
    id: 1
  },
  {
    src: Photo_2,
    path: '/photo_2',
    id: 2
  }
];

const characterPhotos = {
  wally: Wally,
  odlaw: Odlaw,
  wizard: Wizard
}

function App() {

  const photoRoutes = photos.map((photo, index) => {
    return (
      <Route exact path={photo.path} key={index} render={() => 
        <Photo photo={photo}/>
      }/>
    )
  });

  return (
    <div id='app'>
      <Router>
        <NavBar photos={characterPhotos}/>
        <Switch>
          <Route exact path='/' render={() => (
            <Home photos={photos}/>
          )}/>
          {photoRoutes}
        </Switch>
      </Router>
    </div>
  )
}

export default App
