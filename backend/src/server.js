const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const porta = 3000;
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
    openapi: '3.0.0',
    info: {
    title: 'API do Mercado Místico',
    version: '1.0.0',
    description: 'Documentação da API do Mercado Místico',
    },
    servers: [
        {
            url: `http://localhost:${porta}/`
        }
    ]
  },
  apis: ['./src/server.js']
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use(express.json());
app.listen(porta, () => console.log(`Rodando na porta ${porta}!`));
const connection = require("./db_config");
app.use(express.static(path.join(__dirname, "..", "..", "frontend")));

// Configuração do Multer para poder salvar as imagens dos produtos uppados pelos adms
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "..", "frontend", "assets", "produtos")) // Pasta onde as imagens dos produtos serão salvas
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nome do arquivo (é mantido o original)
    }
});

const upload = multer({ storage: storage });


// Rotas de Navegação - Servem apenas para navegar entre as páginas, não são ROTAS de fato
app.get("/", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "index.html")));
app.get("/cadastro", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "cadastro.html")));
app.get("/catalogo", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "catalogo_de_produtos.html")));
app.get("/cupons", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "cupons.html")));
app.get("/login", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "login.html")));
app.get("/p/:id", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "pagina_produto.html")));
app.get("/carrinho", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "carrinho_de_compras.html")));
app.get("/cartao_presente", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "cartao_presente.html")));
app.get("/compra_cartao_presente", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "compra_cartao_presente.html")));
app.get("/enderecos", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "endereco.html")));
app.get("/estoque", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "estoque.html")));
app.get("/favoritos", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "favoritos.html")));
app.get("/finalizar_compra", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "finalizar_compra.html")));
app.get("/usuario", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "usuario.html")));
app.get("/cadastro_adm", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "cadastrar_adm.html")));
app.get("/usuario_adm", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "usuario_adm.html")));
app.get("/cadastrar_produto", (req, response) => response.sendFile(path.join(__dirname, "..", "..", "frontend", "pages", "HTML", "cadastrar_produto.html")));

// Demais Rotas

// Rotas de Produto



/**
 * @swagger
 * /produto/cadastrar:
 *   post:
 *     summary: Cadastra um novo produto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *               descricao:
 *                 type: string
 *               caminhoImagem:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso!
 *       500:
 *         description: Erro ao cadastrar o produto.
 */
app.post("/produto/cadastrar", (request, response) => {
    const query = "INSERT INTO Produto (nome, preco, descricao, imagem, quantidade) VALUES (?, ?, ?, ?, ?);";
    const params = [
        request.body.nome,
        request.body.preco,
        request.body.descricao,
        request.body.caminhoImagem,
        request.body.quantidade
    ];

    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(201)
                .json({
                    success: true,
                    message: "Produto cadastrado com sucesso!",
                    data: results
                });
        } else {
            response
                .status(500)
                .json({
                    success: false,
                    message: "Erro ao cadastrar o produto.",
                    data: err
                });
        }
    });
});


/**
 * @swagger
 * /produto/listar:
 *   get:
 *     summary: Lista todos os produtos cadastrados.
 *     responses:
 *       200:
 *         description: Produtos selecionados com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erro ao selecionar os produtos.
 */
app.get("/produto/listar", (request, response) => {
    query = "SELECT * FROM Produto";
    connection.query(query, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "Produtos selecionados com sucesso!",
                    data: results
                });
        } else {
            response
                .status(500)
                .json({
                    success: false,
                    message: "Erro ao selecionar os produtos.",
                    data: err
                });
        }
    });
});

/**
 * @swagger
 * /produto/selecionar/{idProduto}:
 *   get:
 *     summary: Seleciona um produto específico pelo ID.
 *     parameters:
 *       - name: idProduto
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto selecionado com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Produto não encontrado.
 */
app.get("/produto/selecionar/:idProduto", (request, response) => {
    query = "SELECT * FROM Produto WHERE idProduto = ?";
    params = [request.params.idProduto];

    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "Produto selecionado com sucesso!",
                    data: results
                });
        } else {
            response
                .status(404)
                .json({
                    success: false,
                    message: "Erro ao selecionar o produto.",
                    data: err
                });
        }
    });
});

/**
 * @swagger
 * /produto/uppar_imagem:
 *   post:
 *     summary: Faz o upload da imagem de um produto.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Imagem uppada com sucesso!
 */
app.post("/produto/uppar_imagem", upload.single("imagem"), (request, response) => {
    response
        .status(201)
        .json({
            success: true,
            message: "Imagem uppada com sucesso!",
            filePath: path.join("assets", "produtos", request.file.filename)
        });
});

/**
 * @swagger
 * /produto/editar:
 *   put:
 *     summary: Edita um produto existente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idProduto:
 *                 type: integer
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *               descricao:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto alterado com sucesso.
 *       404:
 *         description: Erro ao alterar o produto.
 */
app.put("/produto/editar", (request, response) => {
    query = "UPDATE Produto SET nome = ?, preco = ?, descricao = ?, quantidade = ? WHERE idProduto = ?";
    params = [
        request.body.nome,
        request.body.preco,
        request.body.descricao,
        request.body.quantidade,
        request.body.idProduto
    ];

    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "Produto alterado com sucesso!",
                    data: results
                });
        } else {
            response
                .status(404)
                .json({
                    success: false,
                    message: "Erro ao alterar o produto.",
                    data: err
                });
        }
    });
});

/**
 * @swagger
 * /produto/excluir/{idProduto}:
 *   delete:
 *     summary: Exclui um produto pelo ID.
 *     parameters:
 *       - name: idProduto
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso.
 *       404:
 *         description: Erro ao excluir o produto.
 */
app.delete("/produto/excluir/:idProduto", (request, response) => {
    query = "DELETE FROM Produto WHERE idProduto = ?";
    params = [request.params.idProduto];

    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "Produto excluído com sucesso!",
                    data: results
                });
        } else {
            response
                .status(404)
                .json({
                    success: false,
                    message: "Erro ao excluir o produto.",
                    data: err
                });
        }
    });
});

// Rotas de Usuário

/**
 * @swagger
 * /usuario/cadastrar:
 *   post:
 *     summary: Cadastra um novo usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso!
 *       409:
 *         description: E-mail já cadastrado.
 *       500:
 *         description: Erro ao cadastrar o usuário.
 */
app.post("/usuario/cadastrar", (request, response) => {
    // Verificando se o e-mail existe (diferente das outras rotas, aqui retorna "false" se o e-mail já existir)
    query = "SELECT * FROM Usuario WHERE email = ?";
    params = [request.body.email];
    connection.query(query, params, (err, results) => {
        if (results && results.length > 0) {
            response
                .status(409)
                .json({
                    success: false,
                    message: "E-mail já cadastrado.",
                    data: err
                });
            return;
        }

        // Cadastrando o Usuário caso o e-mail não exista
        query = "INSERT INTO Usuario (nome, email, senha, creditos, administrador) VALUES (?, ?, ?, ?, ?);";
        params = [
            request.body.nome,
            request.body.email,
            request.body.senha,
            0,
            0
        ];

        connection.query(query, params, (err, results) => {
            if (results) {
                response
                    .status(201)
                    .json({
                        success: true,
                        message: "Usuário cadastrado com sucesso!",
                        data: results
                    });
            } else {
                response
                    .status(500)
                    .json({
                        success: false,
                        message: "Erro ao cadastrar o usuário.",
                        data: err
                    });
            }
        });
    });
});

/**
 * @swagger
 * /usuario/login:
 *   post:
 *     summary: Faz o login de um usuário com e-mail e senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário logado com sucesso!
 *       401:
 *         description: Senha incorreta.
 *       404:
 *         description: E-mail não encontrado.
 */
app.post("/usuario/login", (request, response) => {
    const query = "SELECT idUsuario, nome, senha, email FROM Usuario WHERE email = ?";
    const params = [request.body.email];

    connection.query(query, params, (err, results) => {
        if (err || results.length === 0) {
            response
                .status(404)
                .json({
                    success: false,
                    message: "E-mail não encontrado."
                });
            return;
        }

        const usuario = results[0];
        const senhaValida = request.body.senha == usuario.senha;

        if (!senhaValida) {
            response
                .status(401)
                .json({
                    success: false,
                    message: "Senha incorreta."
                });
            return;
        }
        response
            .status(200)
            .json({
                success: true,
                message: "Usuário Logado!",
                data: usuario
            });
    });
});

/**
 * @swagger
 * /usuario/editar:
 *   put:
 *     summary: Edita o nome e a senha de um usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailUsuario:
 *                 type: string
 *               senhaAtual:
 *                 type: string
 *               nome:
 *                 type: string
 *               senhaNova:
 *                 type: string
 *     responses:
 *       200:
 *         description: Informações do usuário alteradas com sucesso.
 *       401:
 *         description: Senha atual incorreta.
 *       500:
 *         description: Erro ao alterar as informações do usuário.
 */
app.put("/usuario/editar", (request, response) => {
    query = "SELECT senha FROM Usuario WHERE email = ?";
    params = [request.body.emailUsuario];
    connection.query(query, params, (err, results) => {
        if (results && results[0]["senha"] === request.body.senhaAtual) {
            query = "UPDATE Usuario SET nome = ?, senha = ? WHERE email = ?";
            params = [
                request.body.nome,
                request.body.senhaNova,
                request.body.emailUsuario
            ];

            connection.query(query, params, (err, results) => {
                if (results) {
                    response
                        .status(200)
                        .json({
                            success: true,
                            message: "Informações do usuário alteradas com sucesso!",
                            data: results
                        });
                } else {
                    response
                        .status(500)
                        .json({
                            success: false,
                            message: "Erro ao alterar as informações do usuário.",
                            data: err
                        });
                }
            });
        } else {
            response
                .status(401)
                .json({
                    success: false,
                    message: "Senha atual incorreta.",
                    data: err
                });
        }
    });
});

/**
 * @swagger
 * /usuario/excluir/{email}/{senha}:
 *   delete:
 *     summary: Exclui a conta de um usuário.
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: senha
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conta excluída com sucesso!
 *       401:
 *         description: Senha incorreta.
 *       500:
 *         description: Erro ao excluir a conta.
 */
app.delete("/usuario/excluir/:email/:senha", (request, response) => {
    query = "SELECT senha FROM Usuario WHERE email = ?";
    params = [request.params.email];
    connection.query(query, params, (err, results) => {
        if (results && results[0]["senha"] === request.params.senha) {
            query = "DELETE FROM Usuario WHERE email = ?";
            params = [request.params.email];

            connection.query(query, params, (err, results) => {
                if (results) {
                    response
                        .status(200)
                        .json({
                            success: true,
                            message: "Conta excluída com sucesso!",
                            data: results
                        });
                } else {
                    response
                        .status(500)
                        .json({
                            success: false,
                            message: "Erro ao excluir a conta.",
                            data: err
                        });
                }
            });
        } else {
            response
                .status(401)
                .json({
                    success: false,
                    message: "Senha incorreta.",
                    data: err
                });
        }
    });
});

// Rotas de Administrador (também são usuários)

/**
 * @swagger
 * /usuario/is_adm/{email}:
 *   get:
 *     summary: Verifica se o usuário é administrador.
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verificação de adm feita com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Erro ao fazer verificação de adm.
 */
app.get("/usuario/is_adm/:email", (request, response) => {
    query = "SELECT * FROM Usuario WHERE email = ?";
    params = [request.params.email];
    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "Verificação de adm feita com sucesso!",
                    data: results[0]["administrador"].readUInt8(0)
                });
        } else {
            response
                .status(500)
                .json({
                    success: false,
                    message: "Erro ao fazer verificação de adm.",
                    data: err
                });
        }
    });
});

/**
 * @swagger
 * /usuario/tornar_adm/{email}:
 *   put:
 *     summary: Torna um usuário administrador.
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Administrador adicionado com sucesso!
 *       500:
 *         description: Erro ao adicionar o administrador.
 */
app.put("/usuario/tornar_adm/:email", (request, response) => {
    query = "UPDATE Usuario SET administrador = 1 WHERE email = ?";
    params = [request.params.email];
    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "Administrador adicionado com sucesso!",
                    data: results
                });
        } else {
            response
                .status(500)
                .json({
                    success: false,
                    message: "Erro ao adicionar o administrador.",
                    data: err
                });
        }
    });
});

/**
 * @swagger
 * /usuario/listar_adms:
 *   get:
 *     summary: Lista os usuários administradores.
 *     responses:
 *       200:
 *         description: ADMs consultados com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Erro ao consultar os ADMs.
 */
app.get("/usuario/listar_adms", (request, response) => {
    const query = "SELECT * FROM Usuario WHERE administrador = ?";
    const params = [1];
    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "ADMs consultados com sucesso!",
                    data: results
                });
        } else {
            response
                .status(500)
                .json({
                    success: false,
                    message: "Erro ao consultar os ADMs.",
                    data: err
                });
        }
    });
});

/**
 * @swagger
 * /usuario/remover_adm/{email}:
 *   put:
 *     summary: Remove um administrador.
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Administrador removido com sucesso!
 *       500:
 *         description: Erro ao remover o administrador.
 */
app.put("/usuario/remover_adm/:email", (request, response) => {
    const query = "UPDATE Usuario SET administrador = 0 WHERE email = ?";
    const params = [request.params.email];
    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "Administrador removido com sucesso!",
                    data: results
                });
        } else {
            response
                .status(500)
                .json({
                    success: false,
                    message: "Erro ao remover o administrador.",
                    data: err
                });
        }
    });
});

// Rotas de Endereço

/**
 * @swagger
 * /endereco/cadastrar:
 *   post:
 *     summary: Cadastra um endereço.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailUsuario:
 *                 type: string
 *               nome:
 *                 type: string
 *               CEP:
 *                 type: string
 *               endereco:
 *                 type: string
 *               numeroResidencia:
 *                 type: integer
 *               complemento:
 *                 type: string
 *               bairro:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       201:
 *         description: Endereço cadastrado com sucesso!
 *       500:
 *         description: Erro ao cadastrar o endereço.
 */
app.post("/endereco/cadastrar", (request, response) => {
    query = `INSERT INTO Endereco (nome, CEP, endereco, numeroResidencia, complemento, bairro, cidade, estado, idUsuario)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, (SELECT idUsuario FROM Usuario WHERE email = ?))`;
    params = [
        request.body.nome,
        request.body.CEP,
        request.body.endereco,
        request.body.numeroResidencia,
        request.body.complemento,
        request.body.bairro,
        request.body.cidade,
        request.body.estado,
        request.body.emailUsuario
    ];

    connection.query(query, params, (err, results) => {
        if (results) {
            if (request.body.enderecoPadrao) {
                idEnderecoPadrao = results.insertId;
                query = "SELECT idUsuario FROM Usuario WHERE email = ?";
                params = [request.body.emailUsuario];
                connection.query(query, params, (err, results) => {
                    if (results) {
                        const idUsuario = results[0]["idUsuario"];
                        query = "UPDATE Usuario SET idEnderecoPadrao = ? WHERE idUsuario = ?";
                        params = [
                            idEnderecoPadrao,
                            idUsuario
                        ];

                        connection.query(query, params, (err, results) => {
                            if (results) {
                                response
                                    .status(200)
                                    .json({
                                        success: true,
                                        message: "Endereço cadastrado e endereço padrão atualizado com sucesso!",
                                        data: results
                                    });
                            } else {
                                response
                                    .status(500)
                                    .json({
                                        success: false,
                                        message: "Endereço cadastrado, mas erro ao atualizar o endereço padrão.",
                                        data: err
                                    });
                            }
                        });
                        return;
                    } else {
                        response
                            .status(500)
                            .json({
                                success: false,
                                message: "Erro ao encontrar o id do usuário.",
                                data: err
                            });
                        return;
                    }
                });
                return;
            }
            response
                .status(201)
                .json({
                    success: true,
                    message: "Endereço cadastrado com sucesso!",
                    data: results
                });
        } else {
            response
                .status(500)
                .json({
                    success: false,
                    message: "Erro ao cadastrar o endereço.",
                    data: err
                });
            return;
        }
    });
});

/**
 * @swagger
 * /endereco/listar/{email}:
 *   get:
 *     summary: Lista os endereços de um usuário.
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Endereços do usuário encontrados!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idEndereco:
 *                         type: integer
 *                       nome:
 *                         type: string
 *                       CEP:
 *                         type: string
 *                       endereco:
 *                         type: string
 *                       numeroResidencia:
 *                         type: string
 *                       complemento:
 *                         type: string
 *                       bairro:
 *                         type: string
 *                       cidade:
 *                         type: string
 *                       estado:
 *                         type: string
 *                       idUsuario:
 *                         type: integer
 *                       isPadrao:
 *                         type: boolean
 *       404:
 *         description: E-mail não cadastrado ou usuário não encontrado.
 *       500:
 *         description: Erro ao buscar os endereços do usuário.
 */
app.get("/endereco/listar/:email", (request, response) => {
    // Pegando o ID do usuário com base no e-mail
    query = "SELECT idUsuario FROM Usuario WHERE email = ?";
    params = [request.params.email];
    connection.query(query, params, (err, results) => {
        if (!(results && results.length > 0)) {
            response
                .status(404)
                .json({
                    success: false,
                    message: "E-mail não cadastrado.",
                    data: err
                });
            return;
        }
        idUsuario = results[0]["idUsuario"];

        // Pegando o ID do endereço padrão do usuário
        let query = "SELECT idEnderecoPadrao FROM Usuario WHERE idUsuario = ?";
        let params = [idUsuario];

        connection.query(query, params, (err, results) => {
            if (err) {
                response
                    .status(500)
                    .json({
                        success: false,
                        message: "Erro ao buscar o idEnderecoPadrao.",
                        data: err
                    });
                return;
            }

            if (results.length === 0) {
                response
                    .status(404)
                    .json({
                        success: false,
                        message: "Usuário não encontrado.",
                    });
                return;
            }

            const idEnderecoPadrao = results[0].idEnderecoPadrao;

            // Pegando os endereços do usuário
            query = "SELECT * FROM Endereco WHERE idUsuario = ?";
            connection.query(query, params, (err, enderecos) => {
                if (err) {
                    response
                        .status(500)
                        .json({
                            success: false,
                            message: "Erro ao buscar os endereços do usuário.",
                            data: err
                        });
                    return;
                }

                // Adiciona uma propriedade em todos os endereços se eles são ou não padrão. no caso, só um vai receber "true"
                const enderecosComIndicacao = enderecos.map(endereco => ({
                    ...endereco,
                    isPadrao: endereco.idEndereco === idEnderecoPadrao
                }));

                response.status(200).json({
                    success: true,
                    message: "Endereços do usuário encontrados!",
                    data: enderecosComIndicacao
                });
            });
        });
    });
});

/**
 * @swagger
 * /endereco/{email}/{id}:
 *   get:
 *     summary: Busca um endereço pelo idEndereco.
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Endereço encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     idEndereco:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     CEP:
 *                       type: string
 *                     endereco:
 *                       type: string
 *                     numeroResidencia:
 *                       type: string
 *                     complemento:
 *                       type: string
 *                     bairro:
 *                       type: string
 *                     cidade:
 *                       type: string
 *                     estado:
 *                       type: string
 *                     idUsuario:
 *                       type: integer
 *                     isPadrao:
 *                       type: boolean
 *       404:
 *         description: E-mail não cadastrado ou endereço não encontrado.
 *       500:
 *         description: Erro ao buscar o endereço.
 */
app.get('/endereco/:email/:id', (request, response) => {
    const email = request.params.email;
    const idEndereco = request.params.id;

    const queryUsuario = "SELECT idUsuario, idEnderecoPadrao FROM Usuario WHERE email = ?";
    const paramsUsuario = [email];

    connection.query(queryUsuario, paramsUsuario, (err, userResults) => {
        if (err) {
            return response.status(500).json({
                success: false,
                message: "Erro ao buscar o usuário.",
                data: err
            });
        }

        if (userResults.length === 0) {
            return response.status(404).json({
                success: false,
                message: "E-mail não cadastrado."
            });
        }

        const idUsuario = userResults[0].idUsuario;
        const idEnderecoPadrao = userResults[0].idEnderecoPadrao;

        const queryEndereco = "SELECT * FROM Endereco WHERE idEndereco = ? AND idUsuario = ?";
        const paramsEndereco = [idEndereco, idUsuario];

        connection.query(queryEndereco, paramsEndereco, (err, enderecoResults) => {
            if (err) {
                return response.status(500).json({
                    success: false,
                    message: "Erro ao buscar o endereço.",
                    data: err
                });
            }

            if (enderecoResults.length === 0) {
                return response.status(404).json({
                    success: false,
                    message: "Endereço não encontrado."
                });
            }

            const isPadrao = enderecoResults[0].idEndereco === idEnderecoPadrao;

            response.json({
                success: true,
                data: {
                    ...enderecoResults[0],
                    isPadrao
                }
            });
        });
    });
});

/**
 * @swagger
 * /endereco/editar:
 *   put:
 *     summary: Edita um endereço existente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               CEP:
 *                 type: string
 *               endereco:
 *                 type: string
 *               numeroResidencia:
 *                 type: string
 *               complemento:
 *                 type: string
 *               bairro:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *               idEndereco:
 *                 type: integer
 *               emailUsuario:
 *                 type: string
 *               enderecoPadrao:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Endereço editado com sucesso.
 *       500:
 *         description: Erro ao editar o endereço ou ao atualizar o endereço padrão.
 */
app.put("/endereco/editar", (request, response) => {
    query = "UPDATE Endereco SET nome = ?, CEP = ?, endereco = ?, numeroResidencia = ?, complemento = ?, bairro = ?, cidade = ?, estado = ? WHERE idEndereco = ?";
    params = [
        request.body.nome,
        request.body.CEP,
        request.body.endereco,
        request.body.numeroResidencia,
        request.body.complemento,
        request.body.bairro,
        request.body.cidade,
        request.body.estado,
        request.body.idEndereco
    ];

    connection.query(query, params, (err, results) => {
        if (results) {
            if (request.body.enderecoPadrao) {
                query = "SELECT idUsuario FROM Usuario WHERE email = ?";
                params = [request.body.emailUsuario];

                connection.query(query, params, (err, results) => {
                    if (results) {
                        const idUsuario = results[0]["idUsuario"];
                        query = "UPDATE Usuario SET idEnderecoPadrao = ? WHERE idUsuario = ?";
                        params = [
                            request.body.idEndereco,
                            idUsuario
                        ];

                        connection.query(query, params, (err, results) => {
                            if (results) {
                                response
                                    .status(200)
                                    .json({
                                        success: true,
                                        message: "Endereço editado e endereço padrão atualizado com sucesso!",
                                        data: results
                                    });
                            } else {
                                response
                                    .status(500)
                                    .json({
                                        success: false,
                                        message: "Endereço editado, mas erro ao atualizar o endereço padrão.",
                                        data: err
                                    });
                            }
                        });
                    } else {
                        response
                            .status(500)
                            .json({
                                success: false,
                                message: "Erro ao encontrar o id do usuário.",
                                data: err
                            });
                    }
                });
            } else {
                response
                    .status(200)
                    .json({
                        success: true,
                        message: "Endereço editado com sucesso!",
                        data: results
                    });
            }
        } else {
            response
                .status(500)
                .json({
                    success: false,
                    message: "Erro ao editar o endereço.",
                    data: err
                });
        }
    });
});

/**
 * @swagger
 * /endereco/excluir/{idEndereco}:
 *   delete:
 *     summary: Exclui um endereço pelo ID.
 *     parameters:
 *       - in: path
 *         name: idEndereco
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Endereço removido com sucesso.
 *       500:
 *         description: Erro ao remover o endereço.
 */
app.delete("/endereco/excluir/:idEndereco", (request, response) => {
    query = "UPDATE Usuario SET idEnderecoPadrao = null WHERE idEnderecoPadrao = ?";
    params = [request.params.idEndereco];
    connection.query(query, params);

    query = "DELETE FROM Endereco WHERE idEndereco = ?";
    params = [request.params.idEndereco];

    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "Endereço removido com sucesso!",
                    data: results
                });
        } else {
            response
                .status(500)
                .json({
                    success: false,
                    message: "Erro ao remover o endereço.",
                    data: err
                });
        }
    });
});

// Rotas de Carrinho

// Rota para cadastrar um item no carrinho
app.post("/carrinho/cadastrar", (request, response) => {
    query = "SELECT EXISTS(SELECT * FROM ItemCarrinho WHERE idUsuario = (SELECT idUsuario FROM Usuario WHERE email = ?) AND idProduto = ?) AS Resultado";
    params = [
        request.body.email,
        request.body.idProduto
    ];
    connection.query(query, params, (err, results) => {
        const produtoJaCadastrado = results[0]["Resultado"] == 1;
        if (produtoJaCadastrado) {
            query = "UPDATE ItemCarrinho SET quantidade = quantidade + ? WHERE idUsuario = (SELECT idUsuario FROM Usuario WHERE email = ?) AND idProduto = ?";
            params = [
                request.body.quantidade,
                request.body.email,
                request.body.idProduto
            ];
            connection.query(query, params, (err, results) => {
                if (results) {
                    response
                        .status(201)
                        .json({
                            success: true,
                            message: "Produto cadastrado no carrinho com sucesso!",
                            data: results
                        });
                } else {
                    response
                        .status(500)
                        .json({
                            success: false,
                            message: "Erro ao cadastrar o produto no carrinho.",
                            data: err
                        });
                }
            });
        } else {
            query = "INSERT INTO ItemCarrinho (idUsuario, idProduto, quantidade) VALUES ((SELECT idUsuario FROM Usuario WHERE email = ?), ?, ?)";
            params = [
                request.body.email,
                request.body.idProduto,
                request.body.quantidade
            ];
            connection.query(query, params, (err, results) => {
                if (results) {
                    response
                        .status(201)
                        .json({
                            success: true,
                            message: "Produto cadastrado no carrinho com sucesso!",
                            data: results
                        });
                } else {
                    response
                        .status(500)
                        .json({
                            success: false,
                            message: "Erro ao cadastrar o produto no carrinho.",
                            data: err
                        });
                }
            });
        }
    });
});

// Rota para listar os itens no carrinho
app.get("/carrinho/listar/:email", (request, response) => {
    query = `SELECT p.nome, p.preco, p.imagem, p.idProduto, p.quantidade AS quantEstoque,
    i.quantidade AS quantCarrinho, i.idItemCarrinho
    FROM ItemCarrinho i JOIN Produto p ON i.idProduto = p.idProduto WHERE
    i.idUsuario = (SELECT idUsuario FROM Usuario WHERE email = ?)`;
    params = [request.params.email];
    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "Itens do carrinho selecionados com sucesso!",
                    data: results
                });
        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao selecionar os itens do carrinho.",
                    data: err
                });
        }
    });
});

// Rota para editar a quantidade de um item no carrinho
app.put("/carrinho/editar", (request, response) => {
    query = "UPDATE ItemCarrinho SET quantidade = ? WHERE idItemCarrinho = ?";
    params = [
        request.body.quantidade,
        request.body.idItemCarrinho
    ];

    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "Quantidade do item no carrinho atualizada com sucesso!",
                    data: results
                });
        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao atualizar a quantidade do item no carrinho.",
                    data: err
                });
        }
    });
});

// Rota para excluir um item do carrinho
app.delete("/carrinho/excluir/:idItemCarrinho", (request, response) => {
    query = "DELETE FROM ItemCarrinho WHERE idItemCarrinho = ?";
    params = [request.params.idItemCarrinho];

    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "Produto excluído do carrinho com sucesso!",
                    data: results
                });
        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao excluir o produto do carrinho.",
                    data: err
                });
        }
    });
});

// Rotas de Favorito

// Rota para cadastrar um item na lista de favoritos de um usuário
app.post("/favorito/cadastrar", (request, response) => {
    query = "INSERT INTO ListaFavoritos (idUsuario, idProduto) VALUES ((SELECT idUsuario FROM Usuario WHERE email = ?), ?)";
    params = [
        request.body.email,
        request.body.idProduto
    ];

    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(201)
                .json({
                    success: true,
                    message: "Produto adicionado à lista de favoritos do usuário com sucesso!",
                    data: results
                });
        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao adicionar o produto à lista de favoritos do usuário.",
                    data: err
                });
        }
    });
});

// Rota para listar os itens na lista de favoritos de um usuário
app.get("/favorito/listar/:emailUsuario", (request, response) => {
    query = `SELECT * FROM Produto WHERE idProduto in
        (SELECT idProduto FROM ListaFavoritos WHERE idUsuario =
        (SELECT idUsuario FROM Usuario WHERE email = ?));`;
    params = [request.params.emailUsuario];

    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "Lista de favoritos do usuário selecionada com sucesso!",
                    data: results
                });
        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao selecionar a lista de favoritos do usuário.",
                    data: err
                });
        }
    });
});

// Rota para excluir um item da lista de favoritos de um usuário
app.delete("/favorito/excluir/:emailUsuario/:idProduto", (request, response) => {
    // Pegando o ID do usuário com base no e-mail
    query = "SELECT idUsuario FROM Usuario WHERE email = ?";
    params = [request.params.emailUsuario];
    connection.query(query, params, (err, results) => {
        if (!(results && results.length > 0)) {
            response
                .status(400)
                .json({
                    success: false,
                    message: "E-mail não cadastrado.",
                    data: err
                });
            return;
        }
        idUsuario = results[0]["idUsuario"];

        // Deletando o produto da lista de favoritos
        query = "DELETE FROM ListaFavoritos WHERE idUsuario = ? AND idProduto = ?";
        params = [
            idUsuario,
            request.params.idProduto
        ];

        connection.query(query, params, (err, results) => {
            if (results) {
                response
                    .status(200)
                    .json({
                        success: true,
                        message: "Produto excluído da lista de favoritos do usuário com sucesso!",
                        data: results
                    });
            } else {
                response
                    .status(400)
                    .json({
                        success: false,
                        message: "Erro ao excluir produto da lista de favoritos do usuário.",
                        data: err
                    });
            }
        });
    });
});

query = "SELECT EXISTS (SELECT * FROM Usuario WHERE administrador = 1) AS Resultado";
connection.query(query, (err, results) => {
    if (results[0]["Resultado"] == 0) {
        query = `INSERT INTO Usuario (nome, email, senha, creditos, administrador)
        VALUES ('Administrador', 'adm@adm.com', '123', 0, 1)`;
        connection.query(query);
    }
});