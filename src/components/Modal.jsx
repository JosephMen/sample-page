import React from 'react'
import { useRef } from 'react'
import PropTypes from 'prop-types'
import './Modal.css'

const Modal = ({reiniciarPartida, ganador}) => {
  
  function cerrarModal(){
    modal.current.classList.remove('modal-mostrar')
  }
  function reiniciar(){
    modal.current.classList.remove('modal-mostrar')
    reiniciarPartida()
  }
  const modal = useRef(null)
  const mostrarModal = ganador !== '' ? 'modal-mostrar': '' 
  return(<>
    <div className={'modal ' + mostrarModal} ref={modal} >
      <div className={'modal-informacion'}>
        {ganador !== 'empate' && <h1>El ganador es <br /> {ganador}  </h1>}
        {ganador === 'empate' && <h1>Ha habido un empate ! </h1>}
      </div>
      <div className='modal-opciones'>
        <button type="button" onClick={cerrarModal}>Ver tablero</button>
        <button type="button"onClick={reiniciar}>Reiniciar</button>
      </div>
    </div>
  </>)
}

Modal.propTypes = {
  reiniciarPartida : PropTypes.func.isRequired,
  ganador: PropTypes.string.isRequired
}
export default Modal