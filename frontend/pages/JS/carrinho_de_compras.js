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

// Código da página em si
async function listarFavoritos() {
    const email = localStorage.getItem("email");
    const response = await fetch (`/favorito/listar/${email}`);
    const results = await response.json();
    const favoritos = results.data;
    return favoritos.map(produto => produto.idProduto);
}

async function listarCarrinho() {
    const email = localStorage.getItem("email");
    const response = await fetch(`/carrinho/listar/${email}`);
    const results = await response.json();
    const carrinho = results.data;

    const favoritos = await listarFavoritos();

    carrinho.forEach(p => {
        document.querySelector("#listaProdutos").innerHTML += `
        <section class="produto">
            <div class="divAuxImagem" onclick="window.location.href = '/p/${p.idProduto}'"><img src="${p.imagem}" alt="${p.nome}" class="imagemProduto"></div>
            <div class="titulo_produto">
                <div class="subdiv_produto">
                    <a onclick="window.location.href = '/p/${p.idProduto}')" class="nomeProduto">${p.nome}</a>
                    ${p.quantEstoque > 0 ? '<p class="emEstoque">em estoque</p>' : '<p class="semEstoque">sem estoque</p>'}
                    <h6 class="precoProduto">Preço: ${Number(p.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</h6>
                </div>
                <div class="subdiv_produto_imagens">
                    <div class="qtd">Qtd. ${p.quantCarrinho}</div>
                    <img src="../../assets/coracao${favoritos.includes(p.idProduto) ? "_cheio" : ""}.png" alt="Favoritar" class="coracao" onclick="favoritar(${p.idProduto})">
                    <img src="../../assets/lixo.png" alt="Excluir" class="excluir" onclick="excluir(${p.idItemCarrinho})">
                </div>
            </div>
        </section>
        `;
    });
}
listarCarrinho();

async function excluir(idItemCarrinho) {
    const response = await fetch(`/carrinho/excluir/${idItemCarrinho}`, {
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
    document.querySelector(`[onclick^="excluir(${idItemCarrinho})"]`).closest(".produto").remove();
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