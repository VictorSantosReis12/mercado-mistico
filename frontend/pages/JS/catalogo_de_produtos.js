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

async function listarProdutos() {
    const response = await fetch("/produto/listar");
    const results = await response.json();

    if (results.success) {
        return results.data;
    }
    alert(results.message);
    return undefined;
}

async function exibirCatalogo() {
    const produtos = await listarProdutos();
    const favoritos = await listarFavoritos();
    
    produtos.forEach(produto => {
        document.getElementById("principal").innerHTML += `
        <section class="produto">
            <div class="divAuxImagem" onclick="paginaProduto(${produto.idProduto})"><img src="${produto.imagem}" alt="${produto.nome}" class="imagemProduto"></div>
            <div class="titulo_produto">
                <div class="subdiv_produto">
                    <a onclick="paginaProduto(${produto.idProduto})" class="nomeProduto">${produto.nome}</a>
                    ${produto.quantidade > 0 ? '<p class="emEstoque">em estoque</p>' : '<p class="semEstoque">sem estoque</p>'}
                    <h6 class="precoProduto">Preço: ${Number(produto.preco).toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</h6>
                </div>
                <div class="subdiv_produto_imagens">
                    <img src="../../assets/coracao${favoritos.includes(produto.idProduto) ? "_cheio" : ""}.png" alt="Favoritar" class="coracao" onclick="favoritar(${produto.idProduto})">
                    <img src="../../assets/adicionar_carrinho.png" alt="Adicionar ao Carrinho" class="carrinho" onclick="addCarrinho(${produto.idProduto})">
                </div>
            </div>
        </section>
        `;
    });
}

async function listarFavoritos() {
    const email = localStorage.getItem("email");
    const response = await fetch (`/favorito/listar/${email}`);
    const results = await response.json();
    const favoritos = results.data;
    return favoritos.map(produto => produto.idProduto);
}

async function favoritar(idProduto) {
    const coracao = document.querySelector(`[onclick^="favoritar(${idProduto})"]`);
    coracao.src = `../../assets/coracao${coracao.src.split("/").pop() == "coracao.png" ? "_cheio" : ""}.png`;

    if (coracao.src.split("/").pop() == "coracao_cheio.png") {
        const data = {
            email: localStorage.getItem("email"),
            idProduto: idProduto
        };

        const response = await fetch("/favorito/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const results = await response.json();
    
        if (!results.success) {
            alert(results.message);
            return;
        }
    } else {
        const response = await fetch(`/favorito/excluir/${localStorage.getItem("email")}/${idProduto}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const results = await response.json();

        if (!results.success) {
            alert(results.message);
            return;
        }
    }
}

function paginaProduto(idProduto) {
    window.location.href = `/p/${idProduto}`;
}

async function addCarrinho(idProduto) {
    const email = localStorage.getItem("email");
    const quantidade = 1;

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

exibirCatalogo();