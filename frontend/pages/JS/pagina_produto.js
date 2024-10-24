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

const idProduto = window.location.pathname.split("/").pop();

async function selecionarProduto() {
    const response = await fetch(`/produto/selecionar/${idProduto}`);
    const results = await response.json();
    if (!results.success) {
        alert(results.message);
        return;
    }
    const produto = results.data[0];
    console.log(produto);
    document.getElementById("imagemProduto").src = "../" + produto.imagem;
    document.getElementById("imagemProduto").alt = produto.nome;
    document.getElementById("tituloProduto").innerHTML = produto.nome;
    document.getElementById("descricao").innerHTML = produto.descricao;
    document.getElementById("valorTotal").innerHTML = Number(produto.preco).toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
}

async function adicionarAoCarrinho() {
    const email = localStorage.getItem("email");
    const quantidade = document.getElementById("quantidade").value == "" ? 1 : document.getElementById("quantidade").value;

    const data = {
        email,
        quantidade,
        idProduto
    };

    const response = await fetch("/carrinho/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const results = await response.json();
    const mensagem = results.message;
    alert(mensagem);
}

verificarEstadoDeLogin();
selecionarProduto();