<script>
	let conversationStarted = false;
	let loading = false;
	let error = false;
	let question = null;
	let resultado = null;
	let userResponse = null;

	const restart = () => {
		conversationStarted = false;
		loading = false;
		error = false;
		question = null;
		resultado = null;
		userResponse = null;
	};

	const startConversation = async () => {
		loading = true;
		error = null;
		conversationStarted = true;
		try {
			const response = await fetch('http://127.0.0.1:8000/comenzar');
			const data = await response.json();
			question = data.pregunta;
		} catch (error) {
			error = 'Error al iniciar la conversación.';
		} finally {
			loading = false;
		}
	};

	const fetchNextQuestion = async () => {
		loading = true;
		error = null;
		try {
			const response = await fetch('http://127.0.0.1:8000/consulta', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ response: userResponse })
			});
			const data = await response.json();
			if (data.pregunta) {
				question = data.pregunta;
			} else {
				question = null;
				resultado = 'Conversación finalizada. ' + data.resultado;
			}
		} catch (error) {
			error = 'Error al iniciar la conversación.';
		} finally {
			loading = false;
		}
	};

	const handleUserResponse = (response) => {
		userResponse = response;
		fetchNextQuestion();
	};
</script>

<div class="fixed-grid has-3-cols">
	<div class="grid">
		<div class="cell is-col-start-2">
			<h1 class="title">Chatbot de Sistema Experto</h1>
			<div class="field is-grouped">
				<!-- <div class="control">
                  <button class="button is-link">Submit</button>
                </div>
                <div class="control">
                  <button class="button is-link is-light">Cancel</button>
                </div> -->
				{#if !conversationStarted}
					<div class="control">
						<button class="button" on:click={startConversation}>Iniciar Conversación</button>
					</div>
				{:else if loading}
					<p>Cargando...</p>
				{:else if error}
					<p style={{ color: 'red' }}>{error}</p>
				{:else if question}
					<div>
						<h4 class="subtitle is-4">{question}</h4>
						<button class="button" on:click={handleUserResponse(true)}>Sí</button>
						<button class="button" on:click={handleUserResponse(false)}>No</button>
					</div>
				{:else if resultado}
					<div>
						<h4 class="subtitle is-4">{resultado}</h4>
						<button class="button" on:click={restart}>Reiniciar</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	@import 'https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css';
</style>
