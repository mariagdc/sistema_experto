from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from enum import Enum
import uuid
import json

# Cargar el archivo JSON para el árbol de decisiones
with open("./SIstemaExperto-SubdominioTurismo.json", "r") as f:
    decision_tree = json.load(f)

app = FastAPI()

class Response(str, Enum):
    YES = "Sí"
    NO = "No"

class InferenceEngine:
    def __init__(self):
        self.base = decision_tree["entries"]
        self.sessions = {}

    def start_session(self):
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "accepted_properties": [],
            "denied_properties": [],
            "current_question": self.base[0]["props"][0],
        }
        return session_id

    def process_response(self, session_id: str, response: Response):
        session_data = self.sessions.get(session_id)
        if not session_data:
            raise HTTPException(status_code=404, detail="Sesión no encontrada")

        if response == Response.YES:
            session_data["accepted_properties"].append(session_data["current_question"])
        else:
            session_data["denied_properties"].append(session_data["current_question"])

        for entry in self.base:
            if all(prop in session_data["accepted_properties"] for prop in entry["props"]) and \
                    not any(prop in session_data["denied_properties"] for prop in entry["props"]):
                self.sessions[session_id]["result"] = entry
                return entry  

        next_question = self._get_next_question(session_id)
        session_data["current_question"] = next_question
        return None

    def _get_next_question(self, session_id: str) -> Optional[str]:
        session_data = self.sessions.get(session_id)
        for entry in self.base:
            for prop in entry["props"]:
                if prop not in session_data["accepted_properties"] and prop not in session_data["denied_properties"]:
                    return prop
        return None

    def get_current_question(self, session_id: str) -> Optional[str]:
        session_data = self.sessions.get(session_id)
        if session_data:
            return session_data.get("current_question")
        return None

class StartSessionResponse(BaseModel):
    session_id: str
    question: str

class UserResponse(BaseModel):
    response: Response

class ResultResponse(BaseModel):
    name: str
    description: str

engine = InferenceEngine()

@app.post("/start", response_model=StartSessionResponse)
async def start_conversation():
    session_id = engine.start_session()
    first_question = engine.get_current_question(session_id)
    return StartSessionResponse(session_id=session_id, question=first_question)

@app.post("/respond/{session_id}", response_model=Optional[ResultResponse])
async def respond_to_question(session_id: str, user_response: UserResponse):
    result = engine.process_response(session_id, user_response.response)
    if result:
        return ResultResponse(name=result["name"], description=result["description"])
    next_question = engine.get_current_question(session_id)
    if next_question:
        return {"question": next_question}
    raise HTTPException(status_code=400, detail="No se pudo encontrar un resultado ni una pregunta siguiente.")

@app.get("/status/{session_id}")
async def get_current_question(session_id: str):
    question = engine.get_current_question(session_id)
    if question:
        return {"question": question}
    session_data = engine.sessions.get(session_id)
    if session_data and "result" in session_data:
        result = session_data["result"]
        return ResultResponse(name=result["name"], description=result["description"])
    raise HTTPException(status_code=404, detail="Sesión no encontrada o sin preguntas.")
