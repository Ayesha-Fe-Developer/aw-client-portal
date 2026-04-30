from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from pdf_generators.sacs import generate_sacs_pdf
from pdf_generators.tcc import generate_tcc_pdf
import os

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/generate/sacs', methods=['POST'])
def generate_sacs():
    data = request.get_json()
    pdf_bytes = generate_sacs_pdf(data).read()
    response = make_response(pdf_bytes)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/generate/tcc', methods=['POST'])
def generate_tcc():
    data = request.get_json()
    pdf_bytes = generate_tcc_pdf(data).read()
    response = make_response(pdf_bytes)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)