import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./Home"
import Photo from "./Photo"
import Photo_1 from 'images/photo_1.jpg'
import Photo_2 from 'images/photo_2.jpg'

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

const photoRoutes = photos.map((photo, index) => {
  return (
    <Route exact path={photo.path} key={index} render={() => 
      <Photo photo={photo}/>
    }/>
  )
});

function App() {
  return (
    <div id='app'>
      <nav>
        Here comes Navbar
      </nav>

      <Router>
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
