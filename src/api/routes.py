"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
# Importaciones de Flask y extensiones necesarias 
# Flask y utilidaddes basicas 
from flask import Flask, request, jsonify, url_for, Blueprint
# Modelo de base de datos 
from api.models import db, User
# Utilidades personalizadas 
from api.utils import generate_sitemap, APIException
# Para permitir solicitudes de otros orígenes
from flask_cors import CORS
# Para hashear contraseñas
from werkzeug.security import generate_password_hash, check_password_hash
# Para autenticacion JWT
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

# Creacion de un Blueprint para agrupar rutas realacionada con la API
api = Blueprint('api', __name__, url_prefix='/api')

# Confuguracion de un Blueprint para permitir solicitudes de otros dominios 
CORS(api)

# Endpoint para pruebas
@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({"message": "Hello from backend!"}), 200

# Endpoint para registro de usuarios
@api.route('/signup', methods=['POST'])
def signup():
    #Obtener los datos del usuario
    data = request.get_json(silent=True)
    if not data:
        raise APIException("Missing JSON body", status_code=400)

    email = data.get('email')
    password = data.get('password')
    
    #Validar campos requeridos
    if not email or not password:
        raise APIException("Missing email or password", status_code=400)

    #Verificar si el usuario ya existe
    if User.query.filter_by(email=email).first():
        raise APIException("User already exists", status_code=400)

    try:
        # Crear y guardar usuario
        hashed_password = generate_password_hash(password)
        new_user = User(email=email, password=hashed_password, is_active=True)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201
    
    except Exception as e:
        db.session.rollback()
        raise APIException("Failed to create user", status_code=500)

# Endpoint para inicio de sesion de usuarios
@api.route('/login', methods=['POST'])
def login():
    try:
        # Obtener y validar datos
        body = request.get_json()
        email = body.get('email')
        password = body.get('password')
        
        # Validar campos requeridos
        if not email or not password:
            raise APIException("Missing email or password", status_code=400)

        # Verifica si el usiario existe y si la contraseña es valida
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            raise APIException("Invalid email or password", status_code=401)
        
        # Generar token JWT 
        access_token = create_access_token(identity=str(user.id))

        # Preparar datos del usuario para enviarlos en la respuesta (No enviar informacion sensible)
        user_data = {   
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active
        }

        return jsonify({
            "user": user_data, 
            "access_token": access_token,
            "message": "Login successful"
        }), 200
        
    except Exception as e:
        print("Error logging in: ", e)
        if isinstance(e, APIException):
            raise e
        raise APIException("Failed to login", status_code=500)

# Endpoint para cierre de sesion de usuarios
@api.route('/logout', methods=['POST'])
def logout():
    return jsonify({"msg": "Sesión cerrada"}), 200

# Endpoint protegido que requiere autenticacion
@api.route('/private', methods=['GET'])
# Decorador que verifica el token JWT
@jwt_required()
def private():
    # Obtiene el ID del usuario desde el token
    user_id = int(get_jwt_identity())
    # Obtiene el usuario desde la base de datos
    user = User.query.get(user_id)
    # Devolver informacion del usuario 
    return jsonify({"msg": "authorized access", "user": user.serialize()}), 200