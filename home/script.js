document.addEventListener('DOMContentLoaded', function() {
	const searchForm = document.getElementById('searchForm');
	const searchInput = document.getElementById('searchInput');
	const searchResults = document.getElementById('searchResults');
	const resultsContainer = document.getElementById('resultsContainer');
	const navToggle = document.getElementById('navToggle');
	const navMenu = document.getElementById('navMenu');

	if (navToggle && navMenu) {
		navToggle.addEventListener('click', function() {
			navMenu.classList.toggle('active');
			const isExpanded = navMenu.classList.contains('active');
			navToggle.setAttribute('aria-expanded', isExpanded);
		});
	}

	if (searchForm) {
		searchForm.addEventListener('submit', async function(e) {
			e.preventDefault();
			
			const searchTerm = searchInput.value.trim();
			
			if (!searchTerm) {
				alert('Por favor, digite um termo para buscar');
				return;
			}

			try {
				resultsContainer.innerHTML = '<p>Buscando...</p>';
				searchResults.style.display = 'block';

				const { data: artefacts, error } = await window.supabase
					.from('artifacts')
					.select('*')
					.or(`nome.ilike.%${searchTerm}%,tags.cs.{${searchTerm}},descricao.ilike.%${searchTerm}%`)
					.order('nome');

				if (error) throw error;

				displayResults(artefacts, searchTerm);
				
			} catch (error) {
				console.error('Erro na busca:', error);
				resultsContainer.innerHTML = `
					<div class="error-message">
						<p>Erro ao buscar artefatos. Tente novamente.</p>
						<small>${error.message}</small>
					</div>
				`;
			}
		});
	}

	function displayResults(artefacts, searchTerm) {
		if (!artefacts || artefacts.length === 0) {
			resultsContainer.innerHTML = `
				<div class="no-results">
					<p>Nenhum artefato encontrado para "<strong>${searchTerm}</strong>"</p>
					<p>Tente buscar por outros termos ou tags.</p>
				</div>
			`;
			return;
		}

		const resultsHTML = artefacts.map(artefact => `
			<div class="artefact-card">
				<h3>${artefact.nome || 'Sem nome'}</h3>
				${artefact.descricao ? `<p class="description">${artefact.descricao}</p>` : ''}
				${artefact.tags && artefact.tags.length > 0 ? 
					`<div class="tags">Tags: ${artefact.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : 
					''}
				${artefact.localizacao ? `<p class="location"><strong>Localização:</strong> ${artefact.localizacao}</p>` : ''}
				${artefact.periodo ? `<p class="period"><strong>Período:</strong> ${artefact.periodo}</p>` : ''}
			</div>
		`).join('');

		resultsContainer.innerHTML = resultsHTML;
	}

	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}
		});
	});
});