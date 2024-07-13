import React ,{useEffect}from 'react'
import {useNavigate} from 'react-router-dom'

import { AboutmeProvider } from './AbRouter';
import { Material } from './AbMaterial'
import Appbar from '../Index/Appbar';
import Cookies from 'js-cookie';




function AbAll() {

  return (
    <AboutmeProvider>
      <Appbar />
      <Material />
    </AboutmeProvider>
  )
}

export default AbAll