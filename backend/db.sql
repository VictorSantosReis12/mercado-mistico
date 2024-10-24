CREATE DATABASE MysticMarket;
USE MysticMarket;

CREATE TABLE Produto (
	idProduto INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    imagem VARCHAR(255) NOT NULL,
    quantidade INT
);

CREATE TABLE Usuario (
	idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80) NOT NULL,
    email VARCHAR(80) NOT NULL UNIQUE,
    senha VARCHAR(60) NOT NULL,
    creditos INT NOT NULL DEFAULT 0,
    administrador BIT NOT NULL DEFAULT 0,
    idEnderecoPadrao INT
	-- O idEnderecoPadrao é transformado em FK depois num alter table, não dá pra criar direto porque tem referência circular
);

CREATE TABLE Endereco (
	idEndereco INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    CEP VARCHAR(9) NOT NULL,
    endereco VARCHAR(100) NOT NULL,
    numeroResidencia VARCHAR(60) NOT NULL,
    complemento VARCHAR(14),
    bairro VARCHAR(45) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

-- Agora que a tabela Endereco já existe, o idEnderecoPadrao no Usuario é transformado em FK
ALTER TABLE Usuario
ADD CONSTRAINT FK_Usuario_Endereco
FOREIGN KEY (idEnderecoPadrao) REFERENCES Endereco(idEndereco) ON DELETE CASCADE;

CREATE TABLE Avaliacao (
	idAvaliacao INT PRIMARY KEY AUTO_INCREMENT,
    idUsuario INT NOT NULL,
    valorAvaliacao DECIMAL(1, 1) NOT NULL,
    descricao VARCHAR(255),
    data DATE,
    util INT NOT NULL,
    idProduto INT NOT NULL,
    FOREIGN KEY (idProduto) REFERENCES Produto(idProduto) ON DELETE CASCADE
);

CREATE TABLE ListaFavoritos (
	idUsuario INT NOT NULL,
    idProduto INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idProduto) REFERENCES Produto(idProduto) ON DELETE CASCADE
);

CREATE TABLE ItemCarrinho (
	idItemCarrinho INT PRIMARY KEY AUTO_INCREMENT,
	idUsuario INT NOT NULL,
    idProduto INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idProduto) REFERENCES Produto(idProduto) ON DELETE CASCADE
);

CREATE TABLE TipoValidacao (
	idTipoValidacao INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE Cupom (
	idCupom INT PRIMARY KEY AUTO_INCREMENT,
    valor DECIMAL(3, 2) NOT NULL,
    porcentagem BIT NOT NULL,
    valorValidacao DECIMAL(10, 2) NOT NULL,
    idTipoValidacao INT NOT NULL,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    dataInicio DATE,
    dataFim DATE,
    FOREIGN KEY (idTipoValidacao) REFERENCES TipoValidacao(idTipoValidacao)
);

CREATE TABLE CartaoPresente (
	idCartaoPresente INT PRIMARY KEY AUTO_INCREMENT,
    valor DECIMAL(10, 2) NOT NULL,
    nomeDestinatario VARCHAR(80),
    idDestinatario INT NOT NULL,
    nomeRemetente VARCHAR(80),
    emailRemetente VARCHAR(80),
    mensagem TEXT,
    FOREIGN KEY (idDestinatario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

CREATE TABLE Pedido (
	idPedido INT PRIMARY KEY AUTO_INCREMENT,
    data DATE NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    idEndereco INT NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idEndereco) REFERENCES Endereco(idEndereco) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);

CREATE TABLE StatusDevolucao (
	idStatusDevolucao INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(20) NOT NULL
);

CREATE TABLE Devolucao (
	idDevolucao INT PRIMARY KEY AUTO_INCREMENT,
    idUsuario INT NOT NULL,
    idStatus INT NOT NULL,
    idPedido INT NOT NULL,
    dataDevolucao DATE NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario),
    FOREIGN KEY (idStatus) REFERENCES StatusDevolucao(idStatusDevolucao),
    FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido)
);