async function cadastrarUsuario(event) {
    event.preventDefault();

    const nome = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    const dataCadastro = {
        nome,
        email,
        senha
    }

    const responseCadastro = await fetch('/usuario/cadastrar', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataCadastro)
    });

    const resultsCadastro = await responseCadastro.json();

    if (!resultsCadastro.success) {
        alert(resultsCadastro.message);
        return;
    }

    const dataLogin = {
        email,
        senha
    }

    const responseLogin = await fetch('/usuario/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataLogin)
    });

    const resultsLogin = await responseLogin.json();

    if (resultsLogin.success) {
        const usuario = resultsLogin.data;
        console.log(usuario);
        localStorage.setItem("nome", usuario.nome);
        localStorage.setItem("email", usuario.email);
        localStorage.setItem("senha", usuario.senha);
        window.location.href = "/usuario";
    } else {
        alert(resultsLogin.message);
    }
}

function olhoFechado() {
    if (document.getElementById('password').type === 'password') {

        document.getElementById("olho").src = "../../assets/olho_fechado.png";
        document.getElementById('password').type = 'text';

    } else {

        document.getElementById("olho").src = "../../assets/olho.png";
        document.getElementById('password').type = 'password';

    }
}

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
    }
}

verificarEstadoDeLogin();