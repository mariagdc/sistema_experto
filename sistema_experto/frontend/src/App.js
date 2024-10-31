import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [response, setResponse] = useState('');
    const [question, setQuestion] = useState('');
    const [error, setError] = useState('');

    const startConversation = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/comenzar');
            setQuestion(res.data);
            setError('');
        } catch (err) {
            setError('Error al iniciar la conversación.');
        }
    };

    const postCurrentQuestion = async (userResponse) => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/consulta', {
                response: userResponse,
            });
            setQuestion(res.data);
            setError('');
        } catch (err) {
            setError(err.response ? err.response.data.detail : 'Error en la respuesta.');
        }
    };

    return (
        <div>
            <h1>Conversación</h1>
            <button onClick={startConversation}>Iniciar Conversación</button>
            <div>
                <p>{question}</p>
                <button onClick={() => postCurrentQuestion(true)}>Sí</button>
                <button onClick={() => postCurrentQuestion(false)}>No</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default App;
