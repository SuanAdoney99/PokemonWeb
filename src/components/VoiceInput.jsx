// src/components/VoiceInput.jsx
import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';


const VoiceInput = () => {
  const [text, setText] = useState('');
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleSend = () => {
    // Aquí se puede enviar el texto al área de resultados debajo del input.
    console.log('Texto enviado:', text);
    resetTranscript(); // Limpiar la transcripción al enviar
  };

  const handleListen = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  // Muestra el texto en el input si se está usando voz
  const handleVoiceInput = () => {
    if (transcript) {
      setText(transcript);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder="Escribe algo o usa la voz..."
          className="form-control"
        />
        <button onClick={handleSend} className="btn btn-primary mt-2">Enviar</button>
      </div>
      <div className="mt-3">
        <button
          onClick={listening ? handleStopListening : handleListen}
          className="btn btn-secondary"
        >
          {listening ? 'Detener Escucha' : 'Escuchar Micrófono'}
        </button>
      </div>
      <div className="mt-3">
        <h5>Texto detectado por voz:</h5>
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default VoiceInput;
