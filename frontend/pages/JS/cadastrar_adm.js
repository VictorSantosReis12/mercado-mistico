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
exibirADMs();

async function exibirADMs() {
    const administradores = await selecionarADMs();
    let numeroAdm = 1;
    const listaAdm = document.getElementById('lista_adm');
    administradores.forEach(adm => {
        let novaEntrada = document.createElement('div');
        novaEntrada.innerHTML = `
            <label class="label_lista" for="email">Administrador ${numeroAdm}</label>
            <div class="input">
                <input type="email" class="email" name="email" value="${adm.email}" placeholder="Email" readonly>
                <div class="div_excluir" onclick="excluirADM(this.closest('.entradas'))">
                    <img src="../../assets/lixo.png" alt="Excluir" class="imagem_excluir">
                    <h4 class="texto_excluir">Excluir</h4>
                </div>
            </div>
        `;
        novaEntrada.className = 'entradas';
        listaAdm.appendChild(novaEntrada);
        numeroAdm++;
    });
}

function marcarCheckbox() {
    let img = document.getElementById('checkbox');
    let src = img.src;

    if (src.endsWith("checkbox_azul_marcado.png")) {
        img.src = "../../assets/checkbox_azul.png";
    } else {
        img.src = "../../assets/checkbox_azul_marcado.png";
    }
}

async function adicionarADM() {
    // Código do Mateus: 
    const administradores = selecionarADMs(); // Essa função traz um array com todos os ADMs
    if (administradores === undefined) {
        return;
    }
    // Daqui pra baixo, código do victor
    const checkbox = document.getElementById('checkbox');
    const checkboxSrc = checkbox.src.split('/').pop();

    if (checkboxSrc === "checkbox_azul_marcado.png") {
        let email = document.querySelector('.email_adicionar').value.trim();
        if (email) {
            let listaAdm = document.getElementById('lista_adm');
            // Código do Mateus: adiciona adm ao banco de dados (só o principal rs)        
            const response = await fetch(`/usuario/tornar_adm/${email}`, {
                // Apesar de estar "adicionando" um adm, ele não cria nenhum registro novo. só altera a coluna "administrador" de 0 para 1, por isso PUT e n POST
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const results = await response.json();
            if (!results.success) {
                alert(results.message);
                return;
            }
            
            // Volta o Código do Victor
            let novaEntrada = document.createElement('div');
            novaEntrada.className = 'entradas';

            // Obtém o número atual de administradores
            let numeroAdm = listaAdm.getElementsByClassName('entradas').length + 1;

            novaEntrada.innerHTML = `
                <label class="label_lista" for="email">Administrador ${numeroAdm}</label>
                <div class="input">
                    <input type="email" class="email" name="email" value="${email}" placeholder="Email" readonly>
                    <div class="div_excluir" onclick="excluirADM(this.closest('.entradas'))">
                        <img src="../../assets/lixo.png" alt="Excluir" class="imagem_excluir">
                        <h4 class="texto_excluir">Excluir</h4>
                    </div>
                </div>
            `;

            listaAdm.appendChild(novaEntrada);

            // Limpa o input de email e checkbox
            document.querySelector('.email_adicionar').value = '';
            checkbox.src = "../../assets/checkbox_azul.png";
        } else {
            alert("Insira um email válido!");
        }
    } else {
        alert("Você deve aceitar os termos!");
    }
}

async function selecionarADMs() {
    const response = await fetch("/usuario/listar_adms");
    const results = await response.json();

    if (results.success) {
        return results.data;
    }
    alert(results.message);
    return undefined;
}

async function excluirADM(entrada) {
    // Código do Mateus
    const email = entrada.querySelector(".input").querySelector(".email").value;

    const response = await fetch(`/usuario/remover_adm/${email}`, {
        // Apesar da função chamar "excluirADM", na real ele só troca um campo de 1 pra 0, ent é um PUT e n um DELETE
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const results = await response.json();
    
    if (!results.success) {
        alert(results.message);
    }

    // Código do Victor
    entrada.remove();
    // Atualiza a numeração após a exclusão
    atualizarNumeracao();
}

function atualizarNumeracao() {
    let listaAdm = document.getElementById('lista_adm');
    let entradas = listaAdm.getElementsByClassName('entradas');
    
    for (let i = 0; i < entradas.length; i++) {
        let label = entradas[i].querySelector('.label_lista');
        label.textContent = `Administrador ${i + 1}`;
    }
}