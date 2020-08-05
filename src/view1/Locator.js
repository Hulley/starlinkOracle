import React from 'react'
import '../App.css';
import {useGeolocation} from 'react-use';
import styled, { css } from 'styled-components'

function Locator(props) {
  let location = useGeolocation();
  return (
    <>
      <HudItem {...props}>
        <h2>Location</h2>
        <h3>Lat:  {location.latitude}</h3>
        <h3>Long: {location.longitude}</h3>
      </HudItem>
    </>
  )
}

const HudItem = styled.div`
  font-family: 'Teko', sans-serif;
  position: absolute;
  text-transform: uppercase;
  font-weight: 900;
  font-variant-numeric: slashed-zero tabular-nums;
  line-height: 1em;
  pointer-events: none;
  color: indianred;
`

export default Locator;