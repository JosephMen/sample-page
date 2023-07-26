import './App.css'
import Tablero from './components/Tablero'
import Modal from './components/Modal'
import React from 'react'
import { useState } from 'react'
import FIGURAS from './components/util/Figuras'
import VARIABLES_STORAGE from './components/util/VariablesStorage'
function App() {

  const [ganador, setGanador] = useState('')
  const [esPartidaReiniciada, setEsPartidaReiniciada] = useState(false)
  const [registroAcciones, setRegistroAcciones] = useState(['Inicia Partida'])
  const [partidasGanadas, setPartidasGanadas] = useState(() => {
    const partidasGuardadas = window.localStorage.getItem(VARIABLES_STORAGE.partidasGanadas)
    if (partidasGuardadas) return JSON.parse(partidasGuardadas)
    return {a: 0, b: 0}
  })

  function informarGanador(figura){   

    if (figura === 'empate'){
      agregarAccion('Han empatado')
      setGanador(figura)
      return
    }

    const nuevaPartidaGanada = {...partidasGanadas}
    if (figura === FIGURAS.a){
      nuevaPartidaGanada.a++
    }else{
      nuevaPartidaGanada.b++
    }
    window.localStorage.setItem(VARIABLES_STORAGE.partidasGanadas, JSON.stringify(partidasGanadas))
    agregarAccion(`Ha ganado: ${figura}`)
    setGanador(figura)
    console.log(nuevaPartidaGanada)
    setPartidasGanadas(nuevaPartidaGanada)
  }

  function reiniciarPartida(){
    window.localStorage.removeItem(VARIABLES_STORAGE.numeroTurno)
    window.localStorage.removeItem(VARIABLES_STORAGE.turno)
    window.localStorage.removeItem(VARIABLES_STORAGE.tablero)
    window.localStorage.setItem(VARIABLES_STORAGE.partidasGanadas, JSON.stringify(partidasGanadas))
    agregarAccion('Partida reiniciada')
    setGanador('')
    setEsPartidaReiniciada(true)
  }

  function agregarAccion(accionNueva){
    const nuevoRegistroAcciones = [...registroAcciones]
    nuevoRegistroAcciones.push(accionNueva)
    setRegistroAcciones(nuevoRegistroAcciones)
  }
  const listaAcciones = [...registroAcciones]
  listaAcciones.reverse()
  return (
    <>
      <h1 className='titulo'>Tic Tac Toe</h1>
      <div className='log'>
        <div className='log-ranking'>
          <h2>{FIGURAS.a}: {partidasGanadas.a}</h2>
          <h2>{FIGURAS.b}: {partidasGanadas.b}</h2>
        </div>
        <div className='log-acciones'>
          <h2>Progreso del juego</h2>
          <div className='log-acciones-registro'>
            {listaAcciones.map((accion, index) => {
              return <div className="caja-accion" key={index}>{accion}</div>
            })}
          </div>
        </div>
      </div> 
      <div className='juego'>
        <button className='btn-reiniciar' onClick={reiniciarPartida}>
          Reiniciar <br/> Partida
        </button>
      
        <Tablero 
          estadoPartida = {{esReiniciada: esPartidaReiniciada, setReinicio: setEsPartidaReiniciada}} 
          informarGanador={informarGanador}
        />
        <Modal reiniciarPartida={reiniciarPartida} ganador={ganador}/>
      </div>
    </>
  )
}

export default App
