// * Patrón Módulo
const moduloBlackJack = (() => { // Crear un nuevo scope que no tiene referencia por nombre, por lo que no va a ser posible llamar el objeto directamente.
  'use strict';

  // * Referencias
  let deck = [];
  
  const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

  let puntosJugadores = [];

  // * Referencias al DOM
  const btnReinicio = document.querySelector('#btn-reinicio'),
        btnCartas = document.querySelector('#btn-cartas'),
        btnDetener = document.querySelector('#btn-detener');

  const ptsHTML = document.querySelectorAll('span'),
        contenedorCartas = document.querySelectorAll('.contenedor-cartas');

  const modal = document.querySelector('#modal'),
        mensajeModal = document.querySelector('#mensaje-modal'),
        btnCerrarModal = document.querySelector('#btn-cerrar-modal');

  // * Funciones
  const inicializarJuego = (numeroJugadores = 2) => {
    deck = crearDeck();
    puntosJugadores = [];

    for (let i = 0; i < numeroJugadores; i++) {
      puntosJugadores.push(0);
    }

    ptsHTML.forEach((elemento) => elemento.innerHTML = 0 + ' pts.');
    contenedorCartas.forEach((elemento) => elemento.innerHTML = '');

    btnCartas.disabled = false;
    btnDetener.disabled = false;

    modal.classList = 'cerrar-modal';
  }

  const crearDeck = () => {
    deck = [];

    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        deck.push(i + tipo);
      }
    }

    for (let tipo of tipos) {
      for (let especial of especiales) {
        deck.push(especial + tipo);
      }
    }

    return _.shuffle(deck); // Retorna un array con los elementos ordenados de forma aleatoria
  }

  const pedirCarta = () => {
    if (deck.length === 0) {
      throw 'No hay cartas en la baraja'; // Arroja un error en consola
    }

    return deck.pop();
  }

  const valorCarta = (carta) => { // Los strings pueden ser tratados como arreglos
    const valor = carta.substring(0, carta.length - 1); // Substring nos regresa un nuevo string cortado desde la posición inicial a la final que indiquemos.
    return (isNaN(valor)) ? // is Not a Number: Evalua si lo que está entre paréntesis no es un número
      (valor === 'A') ? 11 : 10
      : parseInt(valor);
  }

  const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
    ptsHTML[turno].innerHTML = puntosJugadores[turno] + ' pts.';
    return puntosJugadores[turno];
  }

  const crearCarta = (carta, turno) => {
    const imgCarta = document.createElement('img');
    imgCarta.src = `assets/cartas/${carta}.png`;
    imgCarta.classList = 'carta';
    contenedorCartas[turno].appendChild(imgCarta);
  }

  const determinarGanador = () => {
    const [ puntosMinimos, puntosComputadora ] = puntosJugadores;

    setTimeout(() => {
      if (puntosComputadora === puntosMinimos) {
        modal.classList = 'modal';
        mensajeModal.innerHTML = '¡Empate! intentalo nuevamente para ganar';

        btnCerrarModal.addEventListener('click', () => {
          modal.classList = 'cerrar-modal';
        });
      } else if (puntosMinimos > 21) {
        modal.classList = 'modal';
        mensajeModal.innerHTML = 'Computadora ha ganado... ¡no te rindas!';

        btnCerrarModal.addEventListener('click', () => {
          modal.classList = 'cerrar-modal';
        });
      } else if (puntosComputadora > 21) {
        modal.classList = 'modal';
        mensajeModal.innerHTML = '¡Ganaste! Prueba tu suerte nuevamente';

        btnCerrarModal.addEventListener('click', () => {
          modal.classList = 'cerrar-modal';
        });
      } else {
        modal.classList = 'modal';
        mensajeModal.innerHTML = 'Computadora ha ganado... ¡no te rindas!';

        btnCerrarModal.addEventListener('click', () => {
          modal.classList = 'cerrar-modal';
        });
      }
    }, 100);
  }

  const turnoComputadora = (puntosMinimos) => {
    let puntosComputadora = 0;

    do {
      const carta = pedirCarta();

      puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);

      crearCarta(carta, puntosJugadores.length - 1);

      if (puntosMinimos > 21) {
        break;
      }

    } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

    determinarGanador();
  }

  // * Eventos
  // ? Pedir carta, sumar puntos y determinar si el jugador ganó o perdió
  btnCartas.addEventListener('click', () => {
    const carta = pedirCarta();
    const puntosJugador = acumularPuntos(carta, 0);

    crearCarta(carta, 0);

    if (puntosJugador > 21) {
      btnCartas.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);

    } else if (puntosJugador === 21) {
      btnCartas.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador)
    }

  });

  // ? Detener la ejecución del programa
  btnDetener.addEventListener('click', () => {
    btnCartas.disabled = true;
    btnDetener.disabled = true;

    turnoComputadora(puntosJugadores[0]);
  })

  // ? Reiniciar el juego
  btnReinicio.addEventListener('click', () => {
    console.clear;
    inicializarJuego();
  });

  return {
    nuevoJuego: inicializarJuego
  };

})(); // Función anónima autoinvocada

