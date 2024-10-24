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
exibirEnderecos();
document.body.classList.add('no-scrollbar');

function marcarCheckbox() {
    let img = document.getElementById('imagemCheckbox');
    let src = img.src;

    if (src.endsWith("checkbox_marcado.png")) {
        img.src = "../../assets/checkbox_desmarcado.png";
    } else {
        img.src = "../../assets/checkbox_marcado.png";
    }
}

function botaoAdicionar() {
    document.getElementById('secao_adicionar_endereco').style.display = 'flex';
    document.getElementById('adicionarEndereco').style.backgroundColor = 'var(--azulEscuro)';
    document.getElementById('tituloAdicionar').innerText = 'Adicionar endereço';
    document.getElementById("botaoEnviar").setAttribute("onclick", `enviar(event)`);
}

function botaoFechar () {
    document.getElementById('secao_adicionar_endereco').style.display = 'none';
    document.querySelectorAll('.inputEndereco').forEach(input => input.value = '');
    document.getElementById('adicionarEndereco').style.backgroundColor = 'var(--vermelhoAlaranjado)';
}

async function enviar(event) {
    event.preventDefault();

    const nome = document.getElementById("nomeInput").value;
    const CEP = document.getElementById("cepInput").value;
    const endereco = document.getElementById("enderecoInput").value;
    const numeroResidencia = document.getElementById("numeroInput").value;
    const complemento = document.getElementById("complementoInput").value;
    const bairro = document.getElementById("bairroInput").value;
    const cidade = document.getElementById("cidadeInput").value;
    const estado = document.getElementById("estadoInput").value;
    const emailUsuario = localStorage.getItem("email");
    let enderecoPadrao = false;
    if (document.getElementById('imagemCheckbox').src.endsWith("checkbox_marcado.png")) {
        enderecoPadrao = true;
    }

    const data = {
        nome,
        CEP,
        endereco,
        numeroResidencia,
        complemento,
        bairro,
        cidade,
        estado,
        enderecoPadrao,
        emailUsuario
    }

    const response = await fetch('/endereco/cadastrar', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    const results = await response.json();

    if(!results.success) {
        alert(results.message);
    } else {
        document.getElementById('adicionarEndereco').style.backgroundColor = 'var(--vermelhoAlaranjado)';
        document.getElementById('secao_adicionar_endereco').style.display = 'none';
        document.getElementById("nomeInput").value = '';
        document.getElementById("cepInput").value = '';
        document.getElementById("enderecoInput").value = '';
        document.getElementById("numeroInput").value = '';
        document.getElementById("complementoInput").value = '';
        document.getElementById("bairroInput").value = '';
        document.getElementById("cidadeInput").value = '';
        document.getElementById("estadoInput").value = '';
        document.getElementById('imagemCheckbox').src = "../../assets/checkbox_desmarcado.png";

        removerEnderecos();
    }
}

function removerEnderecos() {
    window.location.href = window.location.href;
}

function formatarCEP(campo) {
    let cep = campo.value.replace(/\D/g, '');
    if (cep.length > 5) {
        cep = cep.slice(0, 5) + '-' + cep.slice(5);
    }
    campo.value = cep;
}

function formatarNumero(campo) {
    let numero = campo.value;
    if (numero.length > 60) {
        numero = numero.slice(0, 60);
    }
}

document.getElementById("cepInput").addEventListener("blur", async function() {
    let cep = document.getElementById("cepInput").value;

    // Remove o hífen do CEP
    cep = cep.replace(/-/g, '');

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            document.getElementById("cepInput").value = '';
            alert("CEP não encontrado.");
            return;
        }

        document.getElementById("enderecoInput").value = data.logradouro;
        document.getElementById("bairroInput").value = data.bairro;
        document.getElementById("cidadeInput").value = data.localidade;
        document.getElementById("estadoInput").value = data.uf;
    } catch (error) {
        alert("Erro ao buscar o CEP.");
    }
});

async function exibirEnderecos() {
    const enderecos = await selecionarEnderecos();

    const lista_enderecos = document.getElementById('secao_enderecos');
    enderecos.forEach(endereco => {
        let novoEndereco = document.createElement('div');

        novoEndereco.className = endereco.isPadrao ? 'divCaixaPadrao' : 'divCaixa';

        novoEndereco.innerHTML = `
            <div class="subdivCaixa_cima">
                <h4 class="textosMenores" id="nomeCompleto">${endereco.nome},</h4>
                <h4 class="textosMenores" id="numeroResidencia">Número da residência: ${endereco.numeroResidencia}</h4>
            </div>
            <h4 class="textosMenores" id="endereco">${endereco.endereco}</h4>
            <div class="subdivCaixa_baixo">
                <h4 class="textosMenores" id="cep">CEP: ${endereco.CEP}</h4>
                <div id="subdivBotao">
                    <img src="../../assets/lixo.png" alt="Excluir" id="excluir" onclick="excluirEndereco(this.parentElement, ${endereco.idEndereco})">
                    <h4 onclick="botaoEditar(${endereco.idEndereco})" class="textosMenores" id="editar">Editar</h4>
                </div>
            </div>
        `;
        lista_enderecos.appendChild(novoEndereco);
    });
}

async function selecionarEnderecos() {
    const email = localStorage.getItem("email");
    const response = await fetch(`/endereco/listar/${email}`);
    const results = await response.json();

    if (results.success) {
        return results.data;
    }
    alert(results.message);
    return undefined;
}

async function excluirEndereco(elemento, idEndereco) {
    const id = idEndereco;
    try {
        elemento.closest('.divCaixa').remove();
    } catch {
        elemento.closest('.divCaixaPadrao').remove();
    }

    const response = await fetch(`/endereco/excluir/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const results = await response.json();
    
    if (!results.success) {
        alert(results.message);
    }
}

async function botaoEditar (idEndereco) {
    const email = localStorage.getItem('email');
    const id = idEndereco;

    document.getElementById('secao_adicionar_endereco').style.display = 'flex';
    document.getElementById('tituloAdicionar').innerText = 'Editar endereço';
    document.getElementById("botaoEnviar").setAttribute("onclick", `editarEndereco(${id})`);
    document.getElementById('adicionarEndereco').style.backgroundColor = 'var(--vermelhoAlaranjado)';

    const response = await fetch(`/endereco/${email}/${id}`);
    const results = await response.json();

    if (results.success) {
        document.getElementById('nomeInput').value = results.data.nome;
        document.getElementById('enderecoInput').value = results.data.endereco;
        document.getElementById('numeroInput').value = results.data.numeroResidencia;
        document.getElementById('complementoInput').value = results.data.complemento;
        document.getElementById('cepInput').value = results.data.CEP;
        document.getElementById('bairroInput').value = results.data.bairro;
        document.getElementById('cidadeInput').value = results.data.cidade;
        document.getElementById('estadoInput').value = results.data.estado;

        if (results.data.isPadrao) {
            document.getElementById('imagemCheckbox').src = "../../assets/checkbox_marcado.png";
        }
    } else {
        alert(results.message);
    }
}

async function editarEndereco(idEndereco) {
    const nome = document.getElementById("nomeInput").value;
    const CEP = document.getElementById("cepInput").value;
    const endereco = document.getElementById("enderecoInput").value;
    const numeroResidencia = document.getElementById("numeroInput").value;
    const complemento = document.getElementById("complementoInput").value;
    const bairro = document.getElementById("bairroInput").value;
    const cidade = document.getElementById("cidadeInput").value;
    const estado = document.getElementById("estadoInput").value;
    const enderecoPadrao = document.getElementById('imagemCheckbox').src.endsWith("checkbox_marcado.png");
    const emailUsuario = localStorage.getItem("email");

    const data = {
        nome,
        CEP,
        endereco,
        numeroResidencia,
        complemento,
        bairro,
        cidade,
        estado,
        enderecoPadrao,
        idEndereco,
        emailUsuario
    };

    const response = await fetch('/endereco/editar', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    const results = await response.json();

    if (!results.success) {
        alert(results.message);
    } else {
        document.getElementById('secao_adicionar_endereco').style.display = 'none';

        document.getElementById("nomeInput").value = '';
        document.getElementById("cepInput").value = '';
        document.getElementById("enderecoInput").value = '';
        document.getElementById("numeroInput").value = '';
        document.getElementById("complementoInput").value = '';
        document.getElementById("bairroInput").value = '';
        document.getElementById("cidadeInput").value = '';
        document.getElementById("estadoInput").value = '';
        document.getElementById('imagemCheckbox').src = "../../assets/checkbox_desmarcado.png";

        removerEnderecos();
    }
}