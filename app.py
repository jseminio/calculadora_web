from flask import Flask, render_template, request, redirect
import json
from datetime import datetime

app = Flask(__name__)

HISTORICO_ARQUIVO = 'historico.json'
ultimo_resultado = None  # Variável global temporária

def carregar_historico():
    try:
        with open(HISTORICO_ARQUIVO, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def salvar_historico(operacao, resultado):
    historico = carregar_historico()
    historico.append({
        'data_hora': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'operacao': operacao,
        'resultado': resultado
    })
    with open(HISTORICO_ARQUIVO, 'w') as f:
        json.dump(historico, f, indent=2)

def processar_expressao(expr):
    global ultimo_resultado
    partes = expr.strip().split()
    
    if len(partes) != 3:
        raise ValueError("Formato inválido: use 'n1 operador n2'.")

    n1, op, n2 = partes

    if n1.lower() == 'r':
        if ultimo_resultado is None:
            raise ValueError("Nenhum resultado anterior.")
        n1 = ultimo_resultado
    else:
        n1 = float(n1)

    if n2.lower() == 'r':
        if ultimo_resultado is None:
            raise ValueError("Nenhum resultado anterior.")
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
            raise ZeroDivisionError("Divisão por zero.")
        resultado = n1 / n2
    else:
        raise ValueError("Operador inválido.")

    ultimo_resultado = resultado
    salvar_historico(expr, resultado)
    return resultado

@app.route("/", methods=["GET", "POST"])
def index():
    resultado = ""
    erro = ""
    if request.method == "POST":
        expressao = request.form.get("expressao")
        try:
            resultado = processar_expressao(expressao)
        except Exception as e:
            erro = str(e)

    historico = carregar_historico()
    return render_template("index.html", resultado=resultado, erro=erro, historico=historico)

if __name__ == "__main__":
    app.run(debug=True)
