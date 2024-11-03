import React, { useState, useEffect } from 'react';

function App() {
  const [question, setQuestion] = useState('');
  const [userResponse, setUserResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [error, setError] = useState('');

  const startConversation = async () => {
    setLoading(true);
    setError('');
    setConversationStarted(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/comenzar');
      const data = await response.json();
      setQuestion(data.pregunta);
    } catch (error) {
      setError('Error al iniciar la conversación.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNextQuestion = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/consulta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: userResponse }),
      });
      const data = await response.json();
      if (data.pregunta) {
        setQuestion(data.pregunta);
      } else {
        setQuestion('Conversación finalizada. ' + data.resultado);
      }
    } catch (error) {
      setError('Error al obtener la siguiente pregunta.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserResponse = (response) => {
    setUserResponse(response);
    fetchNextQuestion();
  };

  // Iniciar la conversación al montar el componente
  useEffect(() => {
    if (conversationStarted) {
      fetchNextQuestion();
    }
  }, [conversationStarted]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chatbot de Sistema Experto</h1>
      {!conversationStarted ? (
        <button onClick={startConversation}>Iniciar Conversación</button>
      ) : (
        <>
          {loading && <p>Cargando...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {question && (
            <div>
              <p>{question}</p>
              <button onClick={() => handleUserResponse(true)}>Sí</button>
              <button onClick={() => handleUserResponse(false)}>No</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
