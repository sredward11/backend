const readline = require("readline-sync");
const conectar = require("./database");

let db;
let collection;

// Função de Inserção de Tarefa
async function inserir(nomeTarefa) {
    const resultado = await collection.insertOne({
        nome: nomeTarefa,
        concluida: false
    });
    console.log("Tarefa criada com sucesso:", resultado.insertedId);
}

async function buscar(nomeTarefa) {
    const resultado = await collection.findOne({nome: nomeTarefa})
    console.log(resultado)
}

async function alterar(nomeTarefa, nomeAtual, concluidaAtual) {
    // CORREÇÃO: Variáveis no $set devem ser nomeAtual e concluidaAtual
    const resultado = await collection.updateOne(
        {nome: nomeTarefa}, 
        {$set: {nome: nomeAtual, concluida: concluidaAtual}} 
    );
    console.log(resultado)
}

async function remover(nomeTarefa) {
    const resultado = await collection.deleteOne(
        {nome: nomeTarefa})
    console.log(resultado)
}

async function main() {
    // 1. Conexão com a base de dados
    try {
        db = await conectar();
        collection = db.collection("tarefas");
        console.log("Conexão com o MongoDB estabelecida com sucesso.");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB. Encerrando programa.", error.message);
        process.exit(1); // Sai com código de erro
    }

    // 2. Loop principal do Menu
    while (true) {
        console.log("\n--- MENU PRINCIPAL ---");
        console.log("1 - Criar tarefa");
        console.log("2 - Buscar tarefa");
        console.log("3 - Alterar tarefa");
        console.log("4 - Remover tarefa");
        console.log("5 - Sair");
        
        // Lê a opção (dentro do loop)
        const opcao = readline.question("Escolha uma opção: ");

        // Processa a opção (DENTRO do loop)
        switch (opcao) {
            case "1": { // JÁ ESTÁ CORRETO
                const nome = readline.question("Informe o nome da tarefa:");
                await inserir(nome);
                break;
            }
            case "2": { // <<< CORRIGIDO: ADICIONADA CHAVE {} PARA NOVO ESCOPO
                const nome = readline.question("informe o nome da tarefa:");
                await buscar(nome);
                break;
            } // <<< CHAVE DE FECHO
            case "3": { // <<< CORRIGIDO: ADICIONADA CHAVE {} PARA NOVO ESCOPO
                // ALTERADA A VARIÁVEL 'nome' para 'nomeBusca' para clareza, mas mantida a estrutura de const
                const nomeBusca = readline.question("informe o nome da tarefa: ");
                const nomeAtual = readline.question("informe outro nome para a tarefa: ")
                const concluidaAtual = readline.question("informe outra situação da tarefa")
                await alterar(nomeBusca, nomeAtual, concluidaAtual) 
                break;
            } 
            case "4": { 
                const nome = readline.question("informe o nome da tarefa")
                await remover(nome)
                break;
            } 
            case "5":
                console.log("Encerrando o programa...");
                process.exit(0); 
                
            default:
                console.log(`\nOpção inválida: ${opcao}. Por favor, escolha de 1 a 5.`);
        }
    } 
}

main();