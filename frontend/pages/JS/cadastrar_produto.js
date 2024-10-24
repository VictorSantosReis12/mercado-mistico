function verificarEstadoDeLogin() {
    const nome = localStorage.getItem('nome');
    if (nome) {
        // Usuário está logado, mostrar elementos do cabeçalho logado
        document.getElementById('botoes_header_direita_deslogado').style.display = 'none';
        document.getElementById('botoes_header_direita_logado').style.display = 'flex';
    } else {
        // Usuário está deslogado, mostrar elementos do cabeçalho deslogado
        document.getElementById('botoes_header_direita_deslogado').style.display = 'flex';
        document.getElementById('botoes_header_direita_logado').style.display = 'none';
        window.location.href = '/login';
    }
}

verificarEstadoDeLogin();

async function cadastrar(event) {
    event.preventDefault();

    const imagem = document.getElementById("imagemInput").files[0];
    const nome = document.getElementById("nomeInput").value;
    const preco = document.getElementById("precoInput").value;
    const quantidade = document.getElementById("quantidadeInput").value;
    const descricao = document.getElementById("descricaoInput").value;

    const formData = new FormData();
    formData.append("imagem", imagem);

    const responseImg = await fetch("/produto/uppar_imagem", {
        method: "POST",
        body: formData
    })

    const resultsImg = await responseImg.json();
    let caminhoImagem = "";

    if (resultsImg.success) {
        caminhoImagem = resultsImg.filePath;
    } else {
        alert("Erro ao fazer o upload da imagem");
        return;
    }

    const data = {
        nome,
        preco,
        descricao,
        caminhoImagem,
        quantidade
    }

    const response = await fetch('/produto/cadastrar', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const results = await response.json();

    alert(results.message);
    if (results.success) {
        window.location.href = "/cadastrar_produto"
    }
}

function mostrarImagem(event) {
    const input = event.target;
    const preview = document.getElementById('imagemPreview');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.innerHTML = ''; // Remove o texto do placeholder
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

document.getElementById('imagemPreview').addEventListener('click', () => {
    document.getElementById('imagemInput').click();
});

function formatarPreco(campo) {
    let valor = campo.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');

    const partes = valor.split('.');
    if (partes.length > 2) {
        valor = partes[0] + '.' + partes[1];
    }
    
    if (partes.length > 1 && partes[1].length > 2) {
        valor = partes[0] + '.' + partes[1].slice(0, 2);
    }

    campo.value = valor;
}