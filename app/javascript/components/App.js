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
    id: 1,
    // positions: {
    //   // [left, top, right, bottom]
    //   wally: [1901, 54, 1950, 115],
    //   odlaw: [1816, 710, 1865, 774],
    //   wizard: [557, 482, 629, 572]
    // },
  },
  {
    src: Photo_2,
    path: '/photo_2',
    id: 2,
    // positions: {
    //   wally: [954, 197, 1016, 269],
    //   odlaw: [481, 1428, 546, 1516],
    //   wizard: [1210, 1947, 1263, 2018]
    // }
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
