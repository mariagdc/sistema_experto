from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from enum import Enum
import json
import uvicorn  
from models.engine import Engine
from models.response import Response

# Cargar el archivo JSON para el árbol de decisiones
fichero=".\\datas\\sistema_experto.json"

engine = Engine() 

app = FastAPI()

class Response(str, Enum):
    YES = "Sí"
    NO = "No"

# Modelos de Pydantic para los datos
class FilenameRequest(BaseModel):
    filename: str
 
class UserResponse(BaseModel):
    response: bool  # True para "Sí", False para "No"


@app.get("/prueba")
async def prueba():
    return {"mensaje": "hola"}

@app.get("/comenzar")
async def comenzar_conversation():
    engine.base.from_json(fichero)
    engine.questions = engine.generate()
    return siguiente_pregunta()

@app.post("/consulta")
async def post_current_question(request: UserResponse):
    if not hasattr(engine, 'questions'):
        raise HTTPException(status_code=400, detail="La consulta no ha sido iniciada. Llame primero a /consultar/iniciar.")
 
    # Configura la respuesta del usuario en el motor
    engine.set_response(Response.YES if request.response else Response.NO)
    return siguiente_pregunta()

# Función auxiliar para obtener la siguiente pregunta o el resultado final
def siguiente_pregunta():
    try:
        pregunta = next(engine.questions)  # Obtener la siguiente pregunta
        if pregunta:  # Si hay una pregunta disponible
            return {"pregunta": f"¿{pregunta.name}?"}
        else:  # Si no hay más preguntas, devolver el resultado
            resultado = engine.get_result()
            if resultado:
                return {
                    "resultado": f"Delito clasificado: {resultado.name}",
                    "descripcion": resultado.description,
                    "propiedades": [prop.name for prop in resultado.properties]
                }
            else:
                return {"resultado": "No se encontró ninguna coincidencia"}
    except StopIteration:
        return {"resultado": "No se encontró ninguna coincidencia"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
