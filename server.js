const express = require('express');
const storage = require('node-persist');

const app = express();

async function main() {
    await storage.init();
    await storage.setItem('news',
        [
            {
                ID: 1,
                titulo: 'Pressao negativa sobre @ do boi deve continuar no curto prazo, mas tendencia de final do ano e positiva para os precos',
                resumo: 'Cotacoes da @ reagem no mercado futuro na B3, mas movimento ainda e apenas de correcao por conta das fortes quedas dos ultimos dias',
                url: 'pressao_negativa_boi_curto_prazo'
            },
            {
                ID: 2,
                titulo: 'Em realizacao de lucros e com peso do petroleo, acucar cai em NY e Londres',
                resumo: 'No Brasil, previsoes estendidas de clima melhor para desenvolvimento da safra 2022/23 pesam',
                url: 'realizacao_lucros_peso_petroleo'
            }
        ]
    );
    await storage.setItem('emails',['teste@gmail.com']);
    console.log('Dados Iniciados.');

    postNews();
    postSubscription();
    getNews();
    getNewsById();
}

async function postNews() {
    await app.post('/noticia', (req, res) => {
        const newNews = req.body;

        const maxID = news.reduce(
                        (max, n) => (n.ID > max ? n.ID : max),
                        news[0].ID
                      );
        
        newNews.ID = maxID + 1;
        
        const news = storage.getItem('news');
        news.push(newNews);
        storage.updateItem('news',news);

        res.send('Notícia Adicionada.');
    });
}

async function postSubscription() {
    await app.post('/inscricao/:email', (req, res) => {
        const email = req.body;
    
        const emails = storage.getItem('emails');
        emails.push(email);
        storage.updateItem('emails',emails);

        res.send('E-mail Adicionado.');
    });
}

async function getNews() {
    await app.get('/noticia', (req, res) => {
        res.send(storage.getItem('news'));
    });
}

async function getNewsById() {
    await app.get('/noticia/:newsID', (req, res) => {
        const newsID = parseInt(req.params.newsID);
        if (isNaN(newsID)) {
            res.status(500).send('Não é um inteiro válido.');
            return;
        }
    
        const ne = storage.getItem('news').find(n => n.ID === newsID);
        if (!ne) {
            res.status(500).send('ID de notícia inválida.');
            return;
        }
    
        res.send(ne);
    });
}

app.listen(3000, () => {
    console.log(`Aplicação Servidor Atividade 02. Ouvindo solicitações pelo endereço: http://localhost:3000`);
});

main().catch(console.error);