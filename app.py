from flask import Flask, render_template, request, redirect, session, jsonify
import os
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'troque-esta-chave'

USERS_FILE = os.getenv('USERS_FILE', 'users.json')
ultimo_resultado = None


def load_users():
    try:
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_users(data):
    with open(USERS_FILE, 'w') as f:
        json.dump(data, f, indent=2)


def salvar_historico_usuario(username, operacao, resultado):
    usuarios = load_users()
    user = usuarios.get(username)
    if not user:
        return
    user.setdefault('history', []).append({
        'data_hora': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'operacao': operacao,
        'resultado': resultado
    })
    save_users(usuarios)


def processar_expressao(expr):
    global ultimo_resultado
    partes = expr.strip().split()

    if len(partes) != 3:
        raise ValueError("Formato inválido: use 'n1 operador n2'.")

    n1, op, n2 = partes

    if n1.lower() == 'r':
        if ultimo_resultado is None:
            raise ValueError('Nenhum resultado anterior.')
        n1 = ultimo_resultado
    else:
        n1 = float(n1)

    if n2.lower() == 'r':
        if ultimo_resultado is None:
            raise ValueError('Nenhum resultado anterior.')
        n2 = ultimo_resultado
    else:
        n2 = float(n2)

    if op == '+':
        resultado = n1 + n2
    elif op == '-':
        resultado = n1 - n2
    elif op == '*':
        resultado = n1 * n2
    elif op == '/':
        if n2 == 0:
            raise ZeroDivisionError('Divisão por zero.')
        resultado = n1 / n2
    else:
        raise ValueError('Operador inválido.')

    ultimo_resultado = resultado
    usuario = session.get('username')
    if usuario:
        salvar_historico_usuario(usuario, expr, resultado)
    return resultado


@app.route('/')
def index():
    usuario = session.get('username')
    historico = []
    if usuario:
        historico = load_users().get(usuario, {}).get('history', [])
    return render_template('index.html', historico=historico, username=usuario)


@app.post('/calculate')
def calcular():
    expressao = request.form.get('expressao') or request.json.get('expressao')
    try:
        resultado = processar_expressao(expressao)
        return jsonify({'resultado': resultado})
    except Exception as e:
        return jsonify({'erro': str(e)}), 400


@app.route('/login', methods=['GET', 'POST'])
def login():
    erro = ''
    if request.method == 'POST':
        usuario = request.form['username']
        senha = request.form['password']
        dados = load_users()
        if usuario in dados and dados[usuario]['password'] == senha:
            session['username'] = usuario
            return redirect('/')
        erro = 'Usuário ou senha inválidos'
    return render_template('login.html', erro=erro)


@app.route('/register', methods=['GET', 'POST'])
def register():
    erro = ''
    if request.method == 'POST':
        usuario = request.form['username']
        senha = request.form['password']
        dados = load_users()
        if usuario in dados:
            erro = 'Usuário já existe'
        else:
            dados[usuario] = {'password': senha, 'history': []}
            save_users(dados)
            session['username'] = usuario
            return redirect('/')
    return render_template('register.html', erro=erro)


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/')


@app.route('/avancado')
def avancado():
    return render_template('advanced.html')


if __name__ == '__main__':
    app.run(debug=True)
