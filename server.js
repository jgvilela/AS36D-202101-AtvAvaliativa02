const express = require('express');
const storage = require('node-persist');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function main() {
    await storage.init();
    await storage.setItem('news',
        [
            {
                ID: 1,
                titulo: 'Pressao negativa sobre @ do boi deve continuar no curto prazo, mas tendencia de final do ano e positiva para os precos',
                resumo: 'Cotacoes da @ reagem no mercado futuro na B3, mas movimento ainda e apenas de correcao por conta das fortes quedas dos ultimos dias',
                url: 'pressao_negativa_boi_curto_prazo'
            }
        ]
    );
    await storage.setItem('emails',[{email : 'teste0@gmail.com'}]);
    console.log('Dados Iniciados.');

    postNews();
    postSubscription();
    getNews();
    getNewsById();
    putNews();
}

async function saveNews(newNews) {
    await storage.init();

    const news = await storage.getItem('news');

    const maxID = news.reduce(
                    (max, n) => (n.ID > max ? n.ID : max),
                    news[0].ID
                  );

    newNews.ID = maxID + 1;

    news.push(newNews);
    await storage.updateItem('news',news);
}

async function saveEmails(email) {
    await storage.init();

    const emails = await storage.getItem('emails');

    emails.push(email);
    await storage.updateItem('emails',emails);
}

async function postNews() {
    await app.post('/noticia', (req, res) => {
        const newNews = req.body;

        saveNews(newNews);

        res.send('Notícia Adicionada.');
    });
}

async function postSubscription() {
    await app.post('/inscricao', (req, res) => {
        const email = req.body;

        saveEmails(email);

        res.send('E-mail Adicionado.');
    });
}

async function getNews() {
    await app.get('/noticia', async (req, res) => {
        await storage.init();

        let news = await storage.getItem('news');

        res.send(news);
    });
}

async function getNewsById() {
    await app.get('/noticia/:newsID', async (req, res) => {
        const newsID = parseInt(req.params.newsID);
        if (isNaN(newsID)) {
            res.status(500).send('Não é um inteiro válido.');
            return;
        }

        await storage.init();

        let news = await storage.getItem('news');
    
        const ne = news.find(n => n.ID === newsID);
        if (!ne) {
            res.status(500).send('ID de notícia inválida.');
            return;
        }
    
        res.send(ne);
    });
}

async function putNews() {
    await app.put('/noticia/:newsID', async (req, res) => {
        const newsID = parseInt(req.params.newsID);
        if (isNaN(newsID)) {
            res.status(500).send('Não é um inteiro válido.');
            return;
        }

        await storage.init();

        let news = await storage.getItem('news');
        let emails = await storage.getItem('emails');
    
        const ne = news.find(n => n.ID === newsID);

        if (!ne) {
            res.status(500).send('ID de notícia inválida.');
            return;

        } else {
            // Create a SMTP transporter object
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'tara.russel@ethereal.email',
                    pass: 'pjd2Dd6YpRUNGgzys1'
                }
            });
            
            emails.forEach(element => {
                
                setTimeout(async () => {

                    const info = await transporter.sendMail({
                        from: 'Tara Russel <tara.russel@ethereal.email>',
                        to: element.email,
                        subject: ne.titulo,
                        text: ne.resumo
                    });
        
                    console.log('Message ID: ', info.messageId);
                    
                }, 2000);

            });
        }

        res.send(emails);
    });
}

app.listen(3000, () => {
    console.log(`Aplicação Servidor Atividade 02. Ouvindo solicitações pelo endereço: http://localhost:3000`);
});

main().catch(console.error);