async function realizarLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    const data = {
        email,
        senha
    }

    const response = await fetch('/usuario/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const results = await response.json();

    if (results.success) {
        const usuario = results.data;
        console.log(usuario);
        localStorage.setItem("nome", usuario.nome);
        localStorage.setItem("email", usuario.email);
        localStorage.setItem("senha", usuario.senha);
        window.location.href = "/usuario";
    } else {
        alert(results.message);
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