const { writeFile, readFile } = require('fs');//trabalha com callbacks
const { promisify } = require('util');
const [writeFileAsync, readFileAsync] = [
    promisify(writeFile),//para manipular arquivos no js
    promisify(readFile),//agora com promise
];

class Database {
    constructor() {
        this.FILENAME = 'heroes.json'
    }

    async obterArquivo() {
        const arquivo = await readFileAsync(this.FILENAME, 'utf8')//outra forma '= require ('heroes.json') estamos simulando outro tipo de arquivo e ficaria pra sempre no cach
        return JSON.parse(arquivo.toString())
    }

    async escreverArquivo(dados) {
        await writeFileAsync(this.FILENAME, JSON.stringify(dados))
        return true
    }

    async cadastrar(heroi) {
        const dados = await this.obterArquivo();
        //workaround para simular um id
        const id = heroi.id <= 2 ? heroi.id : Date.now();
        const heroiComId = {
            ...heroi,
            id,
        };

        return await this.escreverArquivo([...dados, heroiComId]);
    }

    async listar(id) {
        const dados = await this.obterArquivo()
        const dadosFiltrados = dados.filter(item => (id ? item.id == id : true));//si for passado um id use-o, si não retorne a lista inteira
        return dadosFiltrados
    }

    async remover(id) {
        if(!id) {//se não passou nenhum id escreve um array vazio
            return await this.escreverArquivo([])
        }
        //obter os dados e procurar esse id detro da lista
        const dados = await this.obterArquivo()
        const indice = dados.findIndex(item => item.id === parseInt(id))//findIndex retorna o primeiro resultado true no array, quando não, retorna -1
        if (indice === -1) {
            throw error('O usuário informado não existe')
        }
        dados.splice(indice, 1)//apartir do índice remove um único item. ex: fruits.splice(2, 1, "Lemon", "Kiwi") Na posição 2, remova 1 item e adicione os novos itens.
        return await this.escreverArquivo(dados)
    }

    async atualizar (id, modificacoes) {
        const dados = await this.obterArquivo()
        const indice = dados.findIndex(item => item.id === parseInt(id))//na linha de comando pode vim uma string
        if (indice === -1){
            throw Error('O heroi não existe')
        }
        const atual = dados[indice]
        const objAtualizar = {...atual, ...modificacoes }//guarda 
        dados.splice(indice, 1)//remove

        return this.escreverArquivo([...dados, objAtualizar])//e usa

    }

}

module.exports = new Database();


// const { writeFile, readFile } = require('fs');//trabalha com callbacks
// const { promisify } = require('util');
// const [writeFileAsync, readFileAsync] = [
//   promisify(writeFile),
//   promisify(readFile),
// ];//agora com promise

// class Database {
//   constructor() {
//     this.FILENAME = 'heroes.json';
//   }

//   async obterArquivo() {
//     const arquivo = await readFileAsync(this.FILENAME);//outra forma '= require ('heroes.json') estamos simulando outro tipo de arquivo
//     return JSON.parse(arquivo.toString());
//   }

//   async escreverArquivo(dados) {
//     await writeFileAsync(this.FILENAME, JSON.stringify(dados));
//     return true;
//   }

//   async cadastrar(heroi) {
//     const dados = await this.obterArquivo();
//     //workaround para simular um id
//     const id = heroi.id <= 2 ? heroi.id : Date.now();
//     const heroiComId = {
//       ...heroi,
//       id,
//     };

//     return await this.escreverArquivo([...dados, heroiComId]);
//   }

//   async listar(id) {
//     const dados = await this.obterArquivo();
//     // se nao passar o id, traz tudo
//     return dados.filter(item => (id ? item.id == id : true));//si for passado um id use-o si não retorne a lista inteira
//   }

//   async atualizar(id, atualizacoes) {
//     const dados = await this.obterArquivo();
//     const indice = dados.findIndex(item => item.id === parseInt(id));
//     if (indice === -1) {
//       throw Error('heroi não existe!');
//     }

//     const atual = dados[indice];
//     dados.splice(indice, 1);

//     //workaround para remover valores undefined do objeto
//     const objAtualizado = JSON.parse(JSON.stringify(atualizacoes));
//     const dadoAtualizado = Object.assign({}, atual, objAtualizado);

//     return await this.escreverArquivo([...dados, dadoAtualizado]);
//   }

//   async remover(id) {
//     if (!id) {
//       await this.escreverArquivo([]);
//       return true;
//     }

//     const dados = await this.obterArquivo();

//     const indice = dados.findIndex(item => item.id === parseInt(id));
//     if (indice === -1) {
//       throw Error('heroi não existe!');
//     }
//     const atual = dados[indice];
//     dados.splice(indice, 1);
//     await this.escreverArquivo(dados);
//     return true;
//   }
// }

// module.exports = new Database();