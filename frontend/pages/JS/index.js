const checarProduto = localStorage.setItem('produtoSelecionado', 'nulo');

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

// Se o carrinho não existir no localStorage, ele cria
if (localStorage.getItem("carrinho") === null) {
    localStorage.setItem("carrinho", JSON.stringify({"carrinho": []}));
};

let dados;
fetch("localhost:3000")
.then(response => response.json())
.then(data => dados = data);

console.log(dados);