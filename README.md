
## Instalación de pipenv
```bash
pip install pipenv
python -m pip install --upgrade pip
$env:Path += ";C:\Users\Alumno\AppData\Roaming\Python\Python311\Scripts"
```


## Preparando el entorno 
```csharp
python -m venv .env
pipenv shell
pipenv install fastapi pydantic uvicorn
```

## Iniciar el entorno y corriendo la aplicación

Ubicarse dentro del proyecto, es decir app.py debe quedar estar en el directorio de trabajo
```
sitema_experto\sistema_experto>
```

```csharp
python -m venv .env
pipenv shell
uvicorn app:app --reload
```

## Conversación con la doña

https://chatgpt.com/share/672276a7-2c38-800f-9fff-2a04718cec75


