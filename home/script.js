async function loadArtifactDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const artifactIndex = urlParams.get('index');

    const artifactContent = document.getElementById('artifactContent');
    
    if (!artifactContent) {
        console.error('artifactContent element not found');
        return;
    }

    if (!artifactIndex) {
        artifactContent.innerHTML = '<p>Índice do artefato não especificado na URL.</p>';
        return;
    }

    try {
        const response = await fetch('../ArchaeoBase/data/artifacts.json');
        const data = await response.json();
        const artifact = data.artifacts[artifactIndex];

        if (!artifact) {
            artifactContent.innerHTML = '<p>Peça LEGO não encontrada.</p>';
            return;
        }

        document.title = `${artifact.name} - ArchaeoBase LEGO`;
        
        const content = `
          <div class="artifact-header">
            <h1>${artifact.name}</h1>
          </div>
          
          <div class="artifact-info">
            <img src="${artifact.img}" alt="${artifact.name}" class="artifact-image">

            <div class="info-item">
              <strong>Descrição</strong>
              <p>${artifact.description}</p>
            </div>

            ${artifact.alias.length > 0 ? `
            <div class="info-item">
              <strong>Também conhecida como</strong>
              <div class="artifact-tags">
                ${artifact.alias.map(alias => `<span class="artifact-tag">${alias}</span>`).join('')}
              </div>
            </div>
            ` : ''}

            <div class="info-item">
              <strong>Tags e Características</strong>
              <div class="artifact-tags">
                ${artifact.tags.map(tag => `<span class="artifact-tag">${tag}</span>`).join('')}
              </div>
            </div>
          </div>
        `;

        artifactContent.innerHTML = content;
    } catch (error) {
        console.error('Error loading LEGO piece details:', error);
        artifactContent.innerHTML = '<p>Erro ao carregar detalhes da peça LEGO.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadArtifactDetails);