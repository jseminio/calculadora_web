function isLogged() {
    return document.body.dataset.user !== '';
}

function carregarHistorico() {
    if (isLogged()) return; // histórico carregado pelo servidor
    const hist = JSON.parse(localStorage.getItem('historico_local') || '[]');
    const ul = document.getElementById('historico');
    ul.innerHTML = '';
    hist.reverse().forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.data_hora} - ${item.operacao} = ${item.resultado}`;
        ul.appendChild(li);
    });
}

function showInfo(msg) {
    const div = document.getElementById('info');
    if (div) div.textContent = msg;
}

function salvarLocal(expr, resultado) {
    const hist = JSON.parse(localStorage.getItem('historico_local') || '[]');
    hist.push({data_hora: new Date().toISOString().slice(0,19).replace('T',' '), operacao: expr, resultado});
    localStorage.setItem('historico_local', JSON.stringify(hist));
}

function calcular() {
    const expressao = document.getElementById('expressao').value;
    fetch('/calculate', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({expressao})
    }).then(r => r.json()).then(res => {
        const resDiv = document.getElementById('resultado');
        const errDiv = document.getElementById('erro');
        if (res.erro) {
            errDiv.textContent = res.erro;
            resDiv.textContent = '';
        } else {
            errDiv.textContent = '';
            resDiv.textContent = res.resultado;
            if (!isLogged()) {
                salvarLocal(expressao, res.resultado);
                showInfo('Resultado salvo no histórico local.');
            } else {
                showInfo('Resultado salvo na sua conta.');
            }
            carregarHistorico();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnCalcular').addEventListener('click', calcular);
    carregarHistorico();
    if (isLogged()) {
        showInfo('Histórico carregado da sua conta.');
    } else {
        showInfo('Modo anônimo: histórico salvo apenas neste navegador.');
    }
});
