const formulas = {
    triangulo: {
        nome: 'Área do Triângulo',
        formula: 'A = (base × altura) ÷ 2',
        explicacao: 'Calcula a área de um triângulo usando base e altura.',
        campos: ['base','altura'],
        exemplo: {base:6, altura:4, resultado:12},
        calc: v => (v.base * v.altura) / 2
    },
    quadrado: {
        nome: 'Área do Quadrado',
        formula: 'A = lado × lado',
        explicacao: 'Área de um quadrado a partir do lado.',
        campos: ['lado'],
        exemplo: {lado:5, resultado:25},
        calc: v => v.lado * v.lado
    },
    retangulo: {
        nome: 'Área do Retângulo',
        formula: 'A = base × altura',
        explicacao: 'Área de um retângulo.',
        campos: ['base','altura'],
        exemplo: {base:4, altura:3, resultado:12},
        calc: v => v.base * v.altura
    },
    circulo: {
        nome: 'Área do Círculo',
        formula: 'A = π × raio²',
        explicacao: 'Área de um círculo.',
        campos: ['raio'],
        exemplo: {raio:3, resultado:(Math.PI*9).toFixed(2)},
        calc: v => Math.PI * v.raio * v.raio
    },
    perimetro_ret: {
        nome: 'Perímetro do Retângulo',
        formula: 'P = 2 × (base + altura)',
        explicacao: 'Soma dos lados do retângulo.',
        campos: ['base','altura'],
        exemplo: {base:4, altura:3, resultado:14},
        calc: v => 2 * (v.base + v.altura)
    },
    circunferencia: {
        nome: 'Circunferência do Círculo',
        formula: 'C = 2 × π × raio',
        explicacao: 'Comprimento da circunferência.',
        campos: ['raio'],
        exemplo: {raio:3, resultado:(2*Math.PI*3).toFixed(2)},
        calc: v => 2 * Math.PI * v.raio
    },
    volume_cubo: {
        nome: 'Volume do Cubo',
        formula: 'V = lado³',
        explicacao: 'Volume de um cubo.',
        campos: ['lado'],
        exemplo: {lado:2, resultado:8},
        calc: v => Math.pow(v.lado,3)
    },
    volume_paral: {
        nome: 'Volume do Paralelepípedo',
        formula: 'V = comprimento × largura × altura',
        explicacao: 'Volume de um paralelepípedo.',
        campos: ['comprimento','largura','altura'],
        exemplo: {comprimento:2, largura:3, altura:4, resultado:24},
        calc: v => v.comprimento*v.largura*v.altura
    },
    pitagoras: {
        nome: 'Teorema de Pitágoras',
        formula: 'c² = a² + b²',
        explicacao: 'Calcula a hipotenusa de um triângulo retângulo.',
        campos: ['a','b'],
        exemplo: {a:3, b:4, resultado:5},
        calc: v => Math.sqrt(v.a*v.a + v.b*v.b)
    },
    bhaskara: {
        nome: 'Bhaskara',
        formula: 'x = (-b ± √(b² - 4ac)) ÷ 2a',
        explicacao: 'Resolve equações quadráticas.',
        campos: ['a','b','c'],
        exemplo: {a:1,b:-3,c:2, resultado:'x=1 ou x=2'},
        calc: v => {
            const delta = v.b*v.b - 4*v.a*v.c;
            if(delta < 0) return 'Sem raízes reais';
            const x1 = (-v.b + Math.sqrt(delta))/(2*v.a);
            const x2 = (-v.b - Math.sqrt(delta))/(2*v.a);
            return `x1=${x1}, x2=${x2}`;
        }
    },
    regra_tres: {
        nome: 'Regra de Três Simples',
        formula: '(A × D) ÷ B = C',
        explicacao: 'Calcula proporções simples.',
        campos: ['A','B','D'],
        exemplo: {A:2,B:3,D:4, resultado: (2*4)/3},
        calc: v => (v.A*v.D)/v.B
    },
    media: {
        nome: 'Média Aritmética Simples',
        formula: 'M = (x1 + x2 + ... + xn) ÷ n',
        explicacao: 'Média de valores.',
        campos: ['valores'],
        exemplo: {valores:'2,4,6', resultado:4},
        calc: v => {
            const arr = v.valores.split(',').map(Number); return arr.reduce((a,b)=>a+b,0)/arr.length;
        }
    },
    porcentagem: {
        nome: 'Porcentagem',
        formula: 'Valor × (porcentagem ÷ 100)',
        explicacao: 'Calcula porcentagem de um valor.',
        campos: ['valor','pct'],
        exemplo: {valor:80,pct:10,resultado:8},
        calc: v => v.valor*(v.pct/100)
    },
    mdc: {
        nome: 'Máximo Divisor Comum',
        formula: 'mdc(a,b)',
        explicacao: 'Maior número que divide a e b.',
        campos: ['a','b'],
        exemplo: {a:8,b:12,resultado:4},
        calc: v => {
            let a=v.a, b=v.b; while(b){[a,b]=[b,a%b];} return a; }
    },
    mmc: {
        nome: 'Mínimo Múltiplo Comum',
        formula: 'mmc(a,b)',
        explicacao: 'Menor múltiplo comum entre a e b.',
        campos: ['a','b'],
        exemplo: {a:4,b:6,resultado:12},
        calc: v => {
            const mdc=(a,b)=>{while(b){[a,b]=[b,a%b];}return a;};
            return Math.abs(v.a*v.b)/mdc(v.a,v.b);
        }
    },
    eq1grau: {
        nome: 'Equação do 1º Grau',
        formula: 'ax + b = 0 → x = -b ÷ a',
        explicacao: 'Resolve ax + b = 0.',
        campos: ['a','b'],
        exemplo: {a:2,b:-4,resultado:2},
        calc: v => -v.b/v.a
    },
    conversao: {
        nome: 'Conversão de Unidades de Comprimento',
        formula: 'metros ⇄ centímetros',
        explicacao: 'Converte metros para centímetros e vice-versa.',
        campos: ['valor','tipo'],
        exemplo: {valor:1,tipo:'m->cm',resultado:100},
        calc: v => v.tipo==='m->cm'? v.valor*100 : v.valor/100
    },
    pa: {
        nome: 'Progressão Aritmética',
        formula: 'an = a1 + (n-1) × r',
        explicacao: 'Termo n de uma PA.',
        campos: ['a1','n','r'],
        exemplo: {a1:1,n:5,r:2,resultado:9},
        calc: v => v.a1 + (v.n-1)*v.r
    },
    pg: {
        nome: 'Progressão Geométrica',
        formula: 'an = a1 × q^(n-1)',
        explicacao: 'Termo n de uma PG.',
        campos: ['a1','n','q'],
        exemplo: {a1:2,n:4,q:3,resultado:54},
        calc: v => v.a1 * Math.pow(v.q,v.n-1)
    },
    juros: {
        nome: 'Juros Simples',
        formula: 'J = (capital × taxa × tempo) ÷ 100',
        explicacao: 'Cálculo de juros simples.',
        campos: ['capital','taxa','tempo'],
        exemplo: {capital:1000,taxa:2,tempo:3,resultado:60},
        calc: v => (v.capital*v.taxa*v.tempo)/100
    }
};

function criarCampos(sel) {
    const div = document.getElementById('campos');
    div.innerHTML = '';
    sel.campos.forEach(c => {
        const lbl = document.createElement('label');
        lbl.textContent = c + ': ';
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.id = 'campo_'+c;
        div.appendChild(lbl);
        div.appendChild(inp);
        div.appendChild(document.createElement('br'));
    });
}

function mostrarFormula() {
    const chave = document.getElementById('lista').value;
    const f = formulas[chave];
    document.getElementById('nome').textContent = f.nome;
    document.getElementById('formula').textContent = f.formula;
    document.getElementById('explicacao').textContent = f.explicacao;
    document.getElementById('exemplo').textContent = JSON.stringify(f.exemplo);
    criarCampos(f);
}

function calcularFormula() {
    const chave = document.getElementById('lista').value;
    const f = formulas[chave];
    const valores = {};
    f.campos.forEach(c => {
        valores[c] = parseFloat(document.getElementById('campo_'+c).value);
    });
    const r = f.calc(valores);
    document.getElementById('resultado').textContent = r;
}

document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('lista');
    Object.keys(formulas).forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = formulas[k].nome;
        select.appendChild(opt);
    });
    select.addEventListener('change', mostrarFormula);
    document.getElementById('btnCalcular').addEventListener('click', calcularFormula);
    mostrarFormula();
});
