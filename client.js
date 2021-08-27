const axios = require('axios').default;

function putNews() {
    return axios.put('http://localhost:3000/noticia/3')
    .then((res) => {
        console.log(res.data);
    })
}

function postAllEmails() {
    return axios.post('http://localhost:3000/inscricao', {email:'teste1@gmail.com'})
    .then((res) => {
        console.log(res.data);
        return axios.post('http://localhost:3000/inscricao', {email:'teste2@gmail.com'})
    })
    .then((res) => {
        console.log(res.data);
        return axios.post('http://localhost:3000/inscricao', {email:'teste3@gmail.com'})
    })
    .then((res) => {
        console.log(res.data);
        return axios.post('http://localhost:3000/inscricao', {email:'teste4@gmail.com'})
    })
    .then((res) => {
        console.log(res.data);
        putNews();
    })
}

function getNews() {
    return axios.get('http://localhost:3000/noticia/3')
                .then((response) => {
                    console.log(response.data);
                    postAllEmails();
                });
} 


function getAllNews() {
    return axios.get('http://localhost:3000/noticia')
                .then((response) => {
                    console.log(response.data);
                    getNews();
                });
} 

function postAllNews() {
    return axios.post('http://localhost:3000/noticia', {
        titulo: 'Soja brasileira 2021/22 mais competitiva ja atrai demanda da China; compras chegam a 8 mi de t',
        resumo: 'O caminhar dos preços do farelo e do oleo de soja tem muito a mostrar sobre o comportamento da demanda pela oleaginosa em grao e, assim, tambem sobre a trilha que os futuros da commodity deve continuar seguindo',
        url: 'soja_brasileira_mais_competitiva'
    })
    .then((res) => {
        console.log(res.data);
        return axios.post('http://localhost:3000/noticia', {
            titulo: 'Milho se movimenta pouco e fecha 5 feira em campo misto na B3',
            resumo: 'Chicago tambem teve movimentações proximas da estabilidade e mercado fisico recua no brasil',
            url: 'milho_movimenta_pouco'
        })
    })
    .then((res) => {
        console.log(res.data);
        return axios.post('http://localhost:3000/noticia', {
            titulo: 'Com previsao de temperaturas elevadas no BR e preocupação com Delta no Vietna, arabica e conilon tem dia de alta',
            resumo: 'Pela terceira sessao consecutiva o mercado futuro de cafe encerrou as negociacoes com valorização nas bolsas de Nova York e Londres.',
            url: 'arabica_e_conilon_dia_alta'
        })
    })
    .then((res) => {
        console.log(res.data);
        getAllNews();
    })
    .catch(err => {
        console.log(err.response.data);
    });
}

postAllNews();