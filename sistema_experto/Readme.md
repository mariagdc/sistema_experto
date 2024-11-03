





### BACKEND
[Instalación python/pipenv](https://docs.google.com/document/d/124kAwPNryWet5mGA-SiB12Etqt8aeaYZ/preview)

### Instalar pipenv

```bash
cd backend
pip install pipenv
python -m pip install --upgrade pip
```

### Iniciando el entorno virtual - instalando dependencias.

```bash
python -m venv .env
pipenv shell
pipenv install fastapi pydantic uvicorn
pipenv install uvicorn
```

otros

cierra el entorno virtual
```bash
deactivate 
```

desinstalacion
```bash
pip uninstall pipenv
```

borra el entorno virtual
```bash
pipenv --rm
```

pipenv --clear

### Iniciando y corriendo

```bash
python -m venv .env
pipenv shell
uvicorn app:app --reload
```
si da error, ejecutar:

```bash
python -m venv .env
pipenv shell
pipenv run uvicorn app:app --reload
```

---

# Frontend   - React


### Entorno de ejecución
[instalación nodejs](https://docs.google.com/document/d/1evRXCAfm2Ymm3rPhdwKh5L_oj0m7KClA/preview)
[Más docs](https://docs.google.com/document/d/1mi4oKvPCg-8N9xAzp4fsXh1vEquv2HmzzL_O3K-Ox3I/preview?tab=t.0)

### crear el proyecto frontend 

Esto va a crear la plantilla del proyecto
Ejecutar desde la raiz del proyecto

```bash
...\sistema_experto> npx create-react-app frontend
```

### Ejecutar
```bash
...\sistema_experto> cd frontend
...\sistema_experto> npm start
```

### agregar bootstrap

```bash
npm install bootstrap
```

agregar al principo del src/index.js 
```html
import 'bootstrap/dist/css/bootstrap.min.css';
```

agregar en el src/app.js
```
import 'bootstrap/dist/css/bootstrap.min.css';
```

Ejemplo: asignando las clases btn btn-primary a un boton.
```
<button class='btn btn-primary' onClick={() => handleUserResponse(true)}>Sí</button>
```
