import React, { useEffect, useState } from 'react'
import './Tablero.css'
import PropTypes from 'prop-types'
import FIGURAS from './util/Figuras'
import COMBINACIONES_GANADORAS from './util/Combinaciones'
import VARIABLES_STORAGE from './util/VariablesStorage'

const TURNOS = FIGURAS
const POSIBLES_GANES = COMBINACIONES_GANADORAS


const Tablero = ({informarGanador, estadoPartida}) => {
  const [turno, setTurno] = useState( () => {
    const turnoGuardado = window.localStorage.getItem(VARIABLES_STORAGE.turno)
    if(turnoGuardado) return JSON.parse(turnoGuardado)
    return FIGURAS.a
  })
  const [contadorTurnos, setContadorTurnos] = useState( () => {
    const contadorGuardado = window.localStorage.getItem(VARIABLES_STORAGE.numeroTurno)
    if (contadorGuardado) return Number.parseInt(JSON.parse(contadorGuardado))
    return 0
  } )

  const [tablero, setTablero] = useState(() => {
    const tableroGuardado = window.localStorage.getItem(VARIABLES_STORAGE.tablero)
    if (tableroGuardado) return JSON.parse(tableroGuardado)
    return Array(9).fill(' ')
  })
  const [hayGanador, setHayGanador] = useState(false)

  function verificarGanador(turno, nuevoTablero){
    for(const set of POSIBLES_GANES) {
      const [uno, dos, tres] = set
      if(nuevoTablero[uno] === nuevoTablero[dos] && 
        nuevoTablero[dos] === nuevoTablero[tres] &&
        nuevoTablero[uno] === turno){
        return true
      }
    }
    return false
  }

  function actualizarTablero(indice){

    window.localStorage.setItem(VARIABLES_STORAGE.tablero, JSON.stringify(tablero))
    window.localStorage.setItem(VARIABLES_STORAGE.turno, JSON.stringify(turno))
    window.localStorage.setItem(VARIABLES_STORAGE.numeroTurno, JSON.stringify(contadorTurnos))

    if (tablero[indice] !== ' ' || hayGanador || contadorTurnos === 9){
      return
    } 

    setContadorTurnos(contadorTurnos + 1)

    let nuevoTablero = [...tablero]
    nuevoTablero[indice] = turno
    setTablero([...nuevoTablero])

    const esGanador = verificarGanador(turno, nuevoTablero)
    if(esGanador){
      setHayGanador(true)
      informarGanador(turno)
      return
    }
    
    if((contadorTurnos + 1) === 9){
      informarGanador('empate')
    }

    if (turno === TURNOS.a) setTurno(TURNOS.b)
    else setTurno(TURNOS.a)

  }

  let turnoA, turnoB
  turnoA = turnoB = ''
  if (turno == TURNOS.a) turnoA = 'turno-activo'
  else turnoB = 'turno-activo'

  useEffect(()=> {
    if (estadoPartida.esReiniciada){
      setTablero(Array(9).fill(' '))
      setHayGanador(false)
      setTurno(TURNOS.a)  
      setContadorTurnos(0)
      estadoPartida.setReinicio(false)
    }
  }, [estadoPartida.esReiniciada])


  return (
    <>
      <div className="grid-tablero">
        {tablero.map((celda, index) => {
          return <div key={index} className={`celda-${index}`}>
            <button className='boton-celda' onClick={() => actualizarTablero(index)}>
              {celda}
            </button>
          </div>
        })}
      </div>
      <div className='panel-turno'>
        <div className={`panel-casilla ${turnoA}`}>
          {TURNOS.a}
        </div>
        <div className={`panel-casilla ${turnoB}`}>
          {TURNOS.b}
        </div>
      </div>

    </>
  )
}
Tablero.propTypes = {
  informarGanador: PropTypes.func.isRequired,
  estadoPartida: PropTypes.object.isRequired
}
export default Tablero