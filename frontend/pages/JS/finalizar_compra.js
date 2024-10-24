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

let produtosCarrinho;
let valor = 0;

async function listarProdutos() {
    const emailUsuario = localStorage.getItem("email");

    const response = await fetch(`/carrinho/listar/${emailUsuario}`);
    const results = await response.json();

    if (results.success) {
        produtosCarrinho = results.data;
        
        if (produtosCarrinho.length === 0) {
            window.location.href = `/carrinho`;
        } else {
            produtosCarrinho.forEach(produto => {
                const textoValor = document.getElementById('preco_total');

                valor = valor + (produto.preco * produto.quantCarrinho)

                textoValor.innerHTML = `${Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`
            });

            document.getElementById("seta_produto_direita").style.opacity = produtosCarrinho.length <= 3 ? "20%" : "100%";
            document.getElementById("seta_produto_direita").style.pointerEvents = produtosCarrinho.length <= 3 ? "none" : "auto";
            if (produtosCarrinho.length > 3) {
                document.getElementById("seta_produto_direita").setAttribute("onclick", "clicaSeta(true)");
            } else {
                document.getElementById("seta_produto_direita").setAttribute("onclick", "");
            }

            switch (produtosCarrinho.length) {
                case 1:
                    listaProdutos = [produtosCarrinho[0]];
                    break;
                case 2:
                    listaProdutos = [produtosCarrinho[0], produtosCarrinho[1]];
                    break;
                default:
                    listaProdutos = [produtosCarrinho[0], produtosCarrinho[1], produtosCarrinho[2]];
            }
            exibirProdutos();
        }
    } else {
        alert(results.message);
    }
}

let listaProdutos;

function exibirProdutos() {
    let produtos = "";

    switch (listaProdutos.length) {
        case 1:
            produtos = `<img src="${listaProdutos[0].imagem}" onclick="paginaProduto(${listaProdutos[0].idProduto})" alt="produto1" id="produto_um">`;
            break;
        case 2:
            produtos = `
            <img src="${listaProdutos[0].imagem}" onclick="paginaProduto(${listaProdutos[0].idProduto})" alt="produto1" id="produto_um">
            <img src="${listaProdutos[1].imagem}" onclick="paginaProduto(${listaProdutos[1].idProduto})" alt="produto2" id="produto_dois">
            `;
            break;
        default:
            produtos = `
            <img src="${listaProdutos[0].imagem}" onclick="paginaProduto(${listaProdutos[0].idProduto})" alt="produto1" id="produto_um">
            <img src="${listaProdutos[1].imagem}" onclick="paginaProduto(${listaProdutos[1].idProduto})" alt="produto2" id="produto_dois">
            <img src="${listaProdutos[2].imagem}" onclick="paginaProduto(${listaProdutos[2].idProduto})" alt="produto3" id="produto_tres">
            `;
    }
    document.getElementById("produtosCarrinho").innerHTML = `
    ${produtos}
    `;
}

function clicaSeta(frente) {
    if (frente) {
        const indiceAtual = produtosCarrinho.indexOf(listaProdutos[listaProdutos.length - 1]);
        if (indiceAtual + 1 < produtosCarrinho.length) {
            listaProdutos.shift();
            listaProdutos.push(produtosCarrinho[indiceAtual + 1]);
            exibirProdutos();
        }
    } else {
        const indiceAtual = produtosCarrinho.indexOf(listaProdutos[0]);
        if (indiceAtual - 1 >= 0) {
            listaProdutos.pop();
            listaProdutos.unshift(produtosCarrinho[indiceAtual - 1]);
            exibirProdutos();
        }
    }

    if (produtosCarrinho[0] === listaProdutos[0]) {
        document.getElementById("seta_produto_esquerda").style.opacity = "20%";
        document.getElementById("seta_produto_esquerda").style.pointerEvents = "none";
        document.getElementById("seta_produto_esquerda").setAttribute("onclick", "");
    } else {
        document.getElementById("seta_produto_esquerda").style.opacity = "100%";
        document.getElementById("seta_produto_esquerda").style.pointerEvents = "auto";
        document.getElementById("seta_produto_esquerda").setAttribute("onclick", "clicaSeta(false)");
    }
    
    if (produtosCarrinho[produtosCarrinho.length - 1] === listaProdutos[listaProdutos.length - 1]) {
        document.getElementById("seta_produto_direita").style.opacity = "20%";
        document.getElementById("seta_produto_direita").style.pointerEvents = "none";
        document.getElementById("seta_produto_direita").setAttribute("onclick", "");
    } else {
        document.getElementById("seta_produto_direita").style.opacity = "100%";
        document.getElementById("seta_produto_direita").style.pointerEvents = "auto";
        document.getElementById("seta_produto_direita").setAttribute("onclick", "clicaSeta(true)");
    }
}

function paginaProduto(idProduto) {
    window.location.href = `/p/${idProduto}`;
}

async function atualizarEndereco() {
    const enderecoPadrao = await selecionarEndereco();
    
    if (enderecoPadrao) {
        document.getElementById('divEndereco').style.display = "flex";
        document.getElementById('divEnderecoErro').style.display = "none";
        document.getElementById('botaoFinalizar').style.opacity = "100%";
        document.getElementById('botaoFinalizar').style.pointerEvents = "auto";
        document.getElementById('botaoFinalizar').innerText = "FINALIZAR COMPRA";
        document.getElementById('botaoFinalizar').setAttribute("onclick", "finalizarCompra()");

        document.getElementById('nomeCompleto').innerText = `${enderecoPadrao.nome},`;
        document.getElementById('numeroResidencia').innerText = `Número da Residência: ${enderecoPadrao.numeroResidencia}`;
        document.getElementById('endereco').innerText = enderecoPadrao.endereco;
        document.getElementById('cep').innerText = `CEP: ${enderecoPadrao.CEP}`;
    } else {
        document.getElementById('divEndereco').style.display = "none";
        document.getElementById('divEnderecoErro').style.display = "flex";
        document.getElementById('botaoFinalizar').style.opacity = "30%";
        document.getElementById('botaoFinalizar').style.pointerEvents = "none";
        document.getElementById('botaoFinalizar').innerText = "SELECIONAR ENDEREÇO";
        document.getElementById('botaoFinalizar').setAttribute("onclick", "");
    }
}

async function selecionarEndereco() {
    const email = localStorage.getItem("email");
    const response = await fetch(`/endereco/listar/${email}`);
    const results = await response.json();

    if (results.success) {
        const enderecoPadrao = results.data.find(endereco => endereco.isPadrao === true);

        if (enderecoPadrao) {
            return enderecoPadrao;
        }
    } else {
        alert(results.message);
    }
}

async function finalizarCompra() {
    for (const produto of produtosCarrinho) {
        const response = await fetch(`/carrinho/excluir/${produto.idItemCarrinho}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const results = await response.json();

        if (!results.success) {
            alert(`Erro ao excluir o produto ${produto.nome}.`);
            return;
        }
    }
    window.location.href = '/usuario';
}

listarProdutos();
atualizarEndereco();