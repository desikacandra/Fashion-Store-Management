from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

# Konfigurasi database SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///store.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Model database untuk Product
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)

    def json(self):
        return {'id': self.id, 'name': self.name, 'price': self.price, 'stock': self.stock}

# Model database untuk Supplier
class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)

    def json(self):
        return {'id': self.id, 'name': self.name, 'contact': self.contact, 'email': self.email}

# Membuat tabel-tabel database
with app.app_context():
    db.create_all()

# Terapkan CORS
CORS(app, origins='http://127.0.0.1:5500')

# route untuk Product
@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify({'products': [product.json() for product in products]}), 200

@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    new_product = Product(name=data['name'], price=data['price'], stock=data['stock'])
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.json()), 201

@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.json()), 200

@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    if 'name' in data:
        product.name = data['name']
    if 'price' in data:
        product.price = data['price']
    if 'stock' in data:
        product.stock = data['stock']
    db.session.commit()
    return jsonify(product.json()), 200

@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'}), 200

# route untuk Supplier
@app.route('/suppliers', methods=['GET'])
def get_suppliers():
    suppliers = Supplier.query.all()
    return jsonify({'suppliers': [supplier.json() for supplier in suppliers]}), 200

@app.route('/suppliers', methods=['POST'])
def add_supplier():
    data = request.get_json()
    new_supplier = Supplier(name=data['name'], contact=data['contact'], email=data['email'])
    db.session.add(new_supplier)
    db.session.commit()
    return jsonify(new_supplier.json()), 201

@app.route('/suppliers/<int:id>', methods=['GET'])
def get_supplier(id):
    supplier = Supplier.query.get_or_404(id)
    return jsonify(supplier.json()), 200

@app.route('/suppliers/<int:id>', methods=['PUT'])
def update_supplier(id):
    supplier = Supplier.query.get_or_404(id)
    data = request.get_json()
    if 'name' in data:
        supplier.name = data['name']
    if 'contact' in data:
        supplier.contact = data['contact']
    if 'email' in data:
        supplier.email = data['email']
    db.session.commit()
    return jsonify(supplier.json()), 200

@app.route('/suppliers/<int:id>', methods=['DELETE'])
def delete_supplier(id):
    supplier = Supplier.query.get_or_404(id)
    db.session.delete(supplier)
    db.session.commit()
    return jsonify({'message': 'Supplier deleted'}), 200

if __name__ == '__main__':
    app.run(debug=True)
