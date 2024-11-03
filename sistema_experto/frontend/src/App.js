import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [question, setQuestion] = useState('');
  const [userResponse, setUserResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [error, setError] = useState('');

  // Iniciar la conversación al montar el componente
  useEffect(() => {
    if (conversationStarted && userResponse !== null) 
    { 
      fetchNextQuestion();
    }
  }, [conversationStarted, userResponse]);

  const startConversation = async () => 
  {
    setLoading(true);
    setError('');
    setConversationStarted(true);

    try 
    {
      const response = await fetch('http://127.0.0.1:8000/comenzar');
      const data = await response.json();
      setQuestion(data.pregunta);
    } 
    catch (error) 
    {
      setError('Error al iniciar la conversación.');
    } 
    finally 
    {
      setLoading(false);
    }
  };

  const fetchNextQuestion = async () => 
    {
    setLoading(true);
    setError('');

    try 
    {

      const response = await fetch('http://127.0.0.1:8000/consulta', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: userResponse }),
      });

      const data = await response.json();
      if (data.pregunta) 
      {
        setQuestion(data.pregunta);
      } 
      else 
      {
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

  return (
    <div className='container' style={{ padding: '20px' }}>

      <div className="jumbotron">
     
        <h1 className="display-4">Chatbot de Sistema Experto</h1>
        
      </div>

      <hr className="my-4"></hr>

      {!conversationStarted ? 
      (
        <div className='col text-center'>
          <button className='btn btn-primary text-center' onClick={startConversation}>Iniciar Conversación</button>
        </div>
      ) 
      :
      (
        <>
          {loading && <p>Cargando...</p>}
          
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {question && (
            <div className='col text-center'>
              <p>{question}</p>
              <div className='col p-3 m-3'>
                <button className='btn btn-primary m-3' onClick={() => handleUserResponse(true)}>Sí</button>
                <button className='btn btn-primary m-3' onClick={() => handleUserResponse(false)}>No</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
