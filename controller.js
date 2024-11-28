let listaProjetos = [];
let oQueEstaFazendo = '';
let projeto = null;
bloquearAtributos(true); 
visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none', 'none');

function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaProjetos.length; i++) {
        const projeto = listaProjetos[i];
        if (projeto.id == chave) {
            projeto.posicaoNaLista = i;
            return listaProjetos[i];
        }
    }
    return null; 
}

// classico bubbleSort que ordana a lista por ID
function bubbleSort(lista) {
    let n = lista.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (lista[j].id > lista[j + 1].id) {
                // Troca os elementos
                let temp = lista[j];
                lista[j] = lista[j + 1];
                lista[j + 1] = temp;
            }
        }
    }
}

// função que faz a busca binária por ID
function procure() {
    const id = document.getElementById("id").value;
    if (isNaN(id)) {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("id").focus();
        return;
    }

    if (id) { 
        //ordena a lista por id
        bubbleSort(listaProjetos);

        // Realizar busca binária
        let esquerda = 0;
        let direita = listaProjetos.length - 1;
        let encontrado = false;
        let projeto = null;

        while (esquerda <= direita) {
            const meio = Math.floor((esquerda + direita) / 2);
            if (listaProjetos[meio].id == id) {
                projeto = listaProjetos[meio];
                encontrado = true;
                break;
            } else if (listaProjetos[meio].id < id) {
                esquerda = meio + 1;
            } else {
                direita = meio - 1;
            }
        }

        if (encontrado) {
            mostrarDadosProjeto(projeto);
            visibilidadeDosBotoes('none', 'none', 'inline-block', 'inline-block', 'none', 'none'); 
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else {
            mostrarAviso("Não achou na lista, clique em inserir");
            limparAtributos();
            visibilidadeDosBotoes('none', 'inline', 'none', 'none', 'none', 'inline');
        }
    } else {
        document.getElementById("id").focus();
        mostrarAviso("Insira um ID");
        return;
    }
}


// Função para inserir um novo projeto
function inserir() {
     oQueEstaFazendo = 'inserindo'; 
     mostrarAviso("INSERINDO - Digite os atributos e clique no botão salvar");
     bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline', 'none');
   
   
    document.getElementById("id").focus();
}

// Função para alterar um projeto existente
function alterar() {
    mostrarAviso("ALTERANDO - Digite os atributos e clique no botão salvar");
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline', 'none');
    oQueEstaFazendo = 'alterando';
    
}

// Função para excluir um projeto
function excluir() {
    if (!projeto) {
        mostrarAviso("Nenhum projeto selecionado para exclusão");
        return; // Se não há projeto selecionado, não faz nada
    }
    
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique no botão salvar para confirmar a exclusão");
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline', 'none');
}

// Função para salvar um projeto (inserir, alterar ou excluir)
function salvar() {
    let id;
    if (projeto == null) {
        id = parseInt(document.getElementById("id").value);
    } else {
        id = projeto.id;
    }

    const nome = document.getElementById("nome").value;
    const area = document.getElementById("area").value;
    const presidente = document.getElementById("presidente").value;
    const dataRealizacao = document.getElementById("dataRealizacao").value;
    const anoRotario = document.getElementById("anoRotario").value;
    const local = document.getElementById("local").value;

    // Verificar se os dados estão completos
    if (id && nome && area && presidente && dataRealizacao && anoRotario && local) {
        switch (oQueEstaFazendo) {
            case 'inserindo':
                projeto = new Projeto(id, nome, area, presidente, dataRealizacao, anoRotario, local);
                listaProjetos.push(projeto);
                mostrarAviso("Projeto inserido na lista");
                limparAtributos();
                limparID()
                break;
            case 'alterando':
                let projetoAlterado = new Projeto(id, nome, area, presidente, dataRealizacao, anoRotario, local);
                listaProjetos[projeto.posicaoNaLista] = projetoAlterado;
                mostrarAviso("Projeto alterado");
                limparID()
                break;
            case 'excluindo':
                // Verifique se o projeto foi encontrado antes de excluí-lo
                if (projeto) {
                    listaProjetos.splice(projeto.posicaoNaLista, 1); // Remove o projeto da lista
                    mostrarAviso("Projeto excluído");
                    limparAtributos();
                    limparID()
                } else {
                    mostrarAviso("Nenhum projeto para excluir");
                }
                break;
            default:
                mostrarAviso("Erro desconhecido");
        }

        // Atualize a listagem e limpe os campos
        listar();
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none', 'inline');
        limparAtributos();
        document.getElementById("id").focus();
    } else {
        alert("Erro nos dados digitados");
        return;
    }
}

// Função para preparar a listagem dos projetos
function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const projeto = vetor[i];
        texto += `${projeto.id} - ${projeto.nome} - ${projeto.area} - ${projeto.presidente} - ${projeto.dataRealizacao} - ${projeto.anoRotario} - ${projeto.local}<br>`;
    }
    return texto;
}

// Função para listar os projetos cadastrados
function listar() {
    document.getElementById("output").innerHTML = preparaListagem(listaProjetos);
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(false);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none', 'inline');
    mostrarAviso("Operação de edição cancelada");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

// Função para mostrar os dados do projeto nos campos
function mostrarDadosProjeto(projeto) {
    document.getElementById("id").value = projeto.id;
    document.getElementById("nome").value = projeto.nome;
    document.getElementById("area").value = projeto.area;
    document.getElementById("presidente").value = projeto.presidente;
    document.getElementById("dataRealizacao").value = projeto.dataRealizacao;
    document.getElementById("anoRotario").value = projeto.anoRotario;
    document.getElementById("local").value = projeto.local;

    // Define os campos como readonly
    bloquearAtributos(true);
}

// Função para limpar os dados dos campos
function limparAtributos() {
    document.getElementById("nome").value = "";
    document.getElementById("area").value = "";
    document.getElementById("presidente").value = "";
    document.getElementById("dataRealizacao").value = "";
    document.getElementById("anoRotario").value = "";
    document.getElementById("local").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("id").readOnly = !soLeitura;
    document.getElementById("nome").readOnly = soLeitura;
    document.getElementById("area").readOnly = soLeitura;
    document.getElementById("presidente").readOnly = soLeitura;
    document.getElementById("dataRealizacao").readOnly = soLeitura;
    document.getElementById("anoRotario").readOnly = soLeitura;
    document.getElementById("local").readOnly = soLeitura;
}

// Função para alterar a visibilidade dos botões
function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar, btCancelar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btCancelar;
    document.getElementById("id").focus();
}

function limparID(){
    document.getElementById("id").value = "";
}



//natalia 


function salvarNoComputador() {
    nomeParaSalvar = "./Projetos.csv";
    let textoCSV = "";
    for (let i = 0; i < listaProjetos.length; i++) {
        const linha = listaProjetos[i];
        textoCSV += linha.id + ";" +
            linha.nome + ";" +
            linha.area + ";" +
            linha.presidente + ";" +
            linha.dataRealizacao + ";" +
            linha.anoRotario + ";" +
            linha.local + "\n";
    }

    salvarEmArquivo(nomeParaSalvar, textoCSV);
}


function salvarEmArquivo(nomeArq, conteudo) {
    // Cria um blob com o conteúdo em formato de texto
    const blob = new Blob([conteudo], { type: 'text/plain' });//blob pode ser usado para criar arquivos a partir de dados binários,
    //(Binary Large Object) é um objeto usado para representar dados binários grandes, como arquivos com conteúdos q nao podem ser 
    //manuseados tao facilmente quanto uma string
    // Cria um link temporário para o download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeArq; // Nome do arquivo de download
    // Simula o clique no link para iniciar o download
    link.click();
    // Libera o objeto URL
    URL.revokeObjectURL(link.href);
}


// Função para abrir o seletor de arquivos para upload
function buscarDadosSalvosNoComputador() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv'; // Aceita apenas arquivos CSV
    input.onchange = function (event) {
        const arquivo = event.target.files[0];
        if (arquivo) {
            processarArquivo(arquivo);
        }
    };
    input.click(); // Simula o clique para abrir o seletor de arquivos

}

// Função para processar o arquivo CSV e transferir os dados para a listaProjetos
function processarArquivo(arquivo) {
    const leitor = new FileReader();
    leitor.onload = function (e) {
        const conteudo = e.target.result; // Conteúdo do arquivo CSV
        const linhas = conteudo.split('\n'); 
        listaProjetos = []; //limpa lista atual
        
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (linha) {
                const dados = linha.split(';'); 
                
                
                if (dados.length === 7) {
                    // adiciona o objeto a lista
                    listaProjetos.push({
                        id: dados[0], 
                        nome: dados[1], 
                        area: dados[2], 
                        presidente: dados[3], 
                        dataRealizacao: dados[4],
                        anoRotario: dados[5], 
                        local: dados[6] 
                    });
                } else {
                    // se nao tiverem 7 colunas, mostra um aviso
                    console.error("Linha com número incorreto de colunas:", linha);
                }
            }
        }
        // Exibe no console a lista atualizada após o processamento
        console.log("Projetos carregados:", listaProjetos);
        listar(); // Atualiza a listagem de projetos na interface
    };
    leitor.readAsText(arquivo); // Lê o arquivo como texto
}


//busca binaria é um algoritmo eficiente para encontrar um elemento em uma lista ordenada. Em vez de verificar cada elemento da lista um por um,
// como na busca linear, a busca binária reduz pela metade o número de elementos a serem verificados em cada passo.

function buscaBinaria(lista, chave) {//busca binária é 
    let inicio = 0;
    let fim = lista.length - 1;

    while (inicio <= fim) {
        const meio = Math.floor((inicio + fim) / 2);
        const projeto = lista[meio];

        if (projeto.id === chave) {
            return projeto;  // encontra o projeto
        } else if (projeto.id < chave) {
            inicio = meio + 1;  // se a chave é maior, vai para a parte direita
        } else {
            fim = meio - 1;  // se a chave é menor, vai para a parte esquerda
        }
    }

    return null;
}

