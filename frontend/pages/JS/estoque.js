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

document.body.classList.add('no-scrollbar');
verificarEstadoDeLogin();
exibirProdutos();

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

function botaoEditar(elemento, id) {
    document.getElementById('secao_editar_produto').style.display = 'flex';
    const secaoProduto = elemento.closest('section');

    
    const idProduto = id;
    const nome = secaoProduto.querySelector('.nome').textContent;
    const preco = secaoProduto.querySelector('.preco').textContent.replace('Preço: ', '');
    const quantidade = secaoProduto.querySelector('.quant').textContent.replace('Quantidade: ', '');
    const descricao = secaoProduto.querySelector('.inputDescricao').value;

    document.getElementById("idProdutoHidden").value = idProduto;
    document.getElementById('nomeInput').value = nome;
    document.getElementById('precoInput').value = preco;
    document.getElementById('quantidadeInput').value = quantidade;
    document.getElementById('editar_inputDescricao').value = descricao;
}

function botaoFechar () {
    document.getElementById('secao_editar_produto').style.display = 'none';
    document.querySelectorAll('#nomeInput').forEach(input => input.value = '');
    document.querySelectorAll('#quantidadeInput').forEach(input => input.value = '');
    document.querySelectorAll('#precoInput').forEach(input => input.value = '');
    document.querySelectorAll('#editar_inputDescricao').forEach(input => input.value = '');
}

async function exibirProdutos() {
    const produtos = await selecionarProdutos();
    const lista_produtos = document.getElementById('secao_principal');
    produtos.forEach(produto => {
        let novoProduto = document.createElement('section');
        novoProduto.innerHTML = `
            <p class="idIdentificador">${produto.idProduto}</p>
            <img src="${produto.imagem}" alt="Produto" class="imagemProduto">
            <div class="div_info">
                <h3 class="nome">${produto.nome}</h3>
                <h3 class="quant">Quantidade: ${produto.quantidade}</h3>
                <h3 class="preco">Preço: ${Number(produto.preco).toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</h3>
            </div>
            <div class="div_inputDescricao">
                <label for="descricao" class="labelDescricao">Descrição:</label>
                <textarea type="text" class="inputDescricao" name="descricao" placeholder="Descrição aqui" readonly>${produto.descricao}</textarea>
            </div>
            <div class="div_editar" onclick="botaoEditar(this, ${produto.idProduto})">
                <img src="../../assets/criar.png" alt="Editar" class="imagemEditar">
                <h2 class="textoEditar">Editar</h2>
            </div>
            <div class="div_excluir" onclick="botaoExcluir(this.parentElement, ${produto.idProduto})">
                <img src="../../assets/lixo.png" alt="Excluir" class="imagemExcluir">
                <h2 class="textoExcluir">Excluir</h2>
            </div>
        `;

        novoProduto.className = 'secao_produto';
        lista_produtos.appendChild(novoProduto);
    });
    const sections = document.querySelectorAll('#secao_principal section');
    sections.forEach((section, index) => {
        const sectionCorClasse = index % 2 === 0 ? 'azulMaisEscuro' : 'azulEscuro';
        const textareaCorClasse = index % 2 === 0 ? 'azulEscuro' : 'azulMaisEscuro';
        
        section.classList.add(sectionCorClasse);

        const textarea = section.querySelector('.inputDescricao');
        textarea.classList.add(textareaCorClasse);
    });
}

async function selecionarProdutos() {
    const response = await fetch("/produto/listar");
    const results = await response.json();

    if (results.success) {
        return results.data;
    }
    alert(results.message);
    return undefined;
}

async function botaoExcluir(elemento, idProduto) {
    const id = idProduto;
    elemento.closest('.secao_produto').remove();

    const response = await fetch(`/produto/excluir/${id}`, {
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

async function editarProduto(event) {
    event.preventDefault();

    const nome = document.getElementById("nomeInput").value;
    const preco = document.getElementById("precoInput").value;
    const quantidade = document.getElementById("quantidadeInput").value;
    const descricao = document.getElementById('editar_inputDescricao').value;
    const idProduto = document.getElementById("idProdutoHidden").value;

    const data = {
        nome,
        preco,
        descricao,
        quantidade,
        idProduto
    }

    console.log(data);

    const response = await fetch('/produto/editar', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })

    const results = await response.json();

    console.log(results)
    if(results.success) {
        console.log(response);
        alert(results.message);

        document.getElementById('secao_editar_produto').style.display = "none";

        document.getElementById("nomeInput").value = '';
        document.getElementById("precoInput").value = '';
        document.getElementById("quantidadeInput").value = '';
        document.getElementById('editar_inputDescricao').value = '';

        atualizarProdutoNaTela(idProduto, data);
    } else {
        alert(results.message);
    }
}

function atualizarProdutoNaTela(idProduto, dadosAtualizados) {
    const produtos = document.querySelectorAll('#secao_principal .secao_produto');

    produtos.forEach(produto => {
        const idElemento = produto.querySelector('.idIdentificador').innerText;

        if (idElemento == idProduto) {
            const nomeProduto = produto.querySelector('.nome');
            const precoProduto = produto.querySelector('.preco');
            const quantProduto = produto.querySelector('.quant');
            const descricaoProduto = produto.querySelector('.inputDescricao');

            nomeProduto.innerText = dadosAtualizados.nome;
            precoProduto.innerText = `Preço: ${dadosAtualizados.preco}`;
            quantProduto.innerText = `Quantidade: ${dadosAtualizados.quantidade}`;
            descricaoProduto.value = dadosAtualizados.descricao;

            precoProduto.innerText = `Preço: ${Number(precoProduto.innerText.replace('Preço: ', '')).toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}`;
        }
    });
}