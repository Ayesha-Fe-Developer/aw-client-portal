from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from pdf_generators.sacs import generate_sacs_pdf
from pdf_generators.tcc import generate_tcc_pdf

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/generate/sacs', methods=['POST', 'OPTIONS'])
def generate_sacs():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        return response, 200
    data = request.get_json()
    pdf_buffer = generate_sacs_pdf(data)
    pdf_bytes = pdf_buffer.read()
    response = make_response(pdf_bytes)
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'inline; filename=SACS.pdf'
    response.headers['Content-Length'] = len(pdf_bytes)
    return response

@app.route('/generate/tcc', methods=['POST', 'OPTIONS'])
def generate_tcc():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        return response, 200
    data = request.get_json()
    pdf_buffer = generate_tcc_pdf(data)
    pdf_bytes = pdf_buffer.read()
    response = make_response(pdf_bytes)
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'inline; filename=TCC.pdf'
    response.headers['Content-Length'] = len(pdf_bytes)
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)