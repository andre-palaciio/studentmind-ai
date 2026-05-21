"""
StudentMind AI - Sistema de Predicción de Riesgo de Depresión Estudiantil
Flask + ML

Este archivo define la aplicación Flask que:
1. carga un modelo entrenado con joblib
2. muestra un formulario HTML para el usuario
3. recibe los datos del formulario
4. predice el riesgo con el modelo
5. devuelve una página de resultados
"""

from flask import Flask, render_template, request
import joblib
import numpy as np
import os
import logging

# Crear la app Flask
app = Flask(__name__)

# Configurar logging para ver mensajes de depuración en la consola
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Función para cargar el modelo desde disco
def cargar(nombre):
    path = os.path.join(BASE_DIR, nombre)
    if os.path.exists(path):
        print(f"✅ {nombre} cargado")
        return joblib.load(path)
    print(f"⚠️ {nombre} no encontrado")
    return None

# Cargar modelo pre-entrenado
modelo_rf = cargar("modelo_random_forest.pkl")

if modelo_rf is None:
    logger.error("No se pudo cargar el modelo Random Forest. La aplicación no funcionará correctamente.")
    # En un tutorial se puede explicar cómo manejar este error o detener la app.

# ─────────────────────────────────────────
# RIESGO
# ─────────────────────────────────────────
# Clasifica el nivel de riesgo según la probabilidad calculada
def clasificar_riesgo(p):
    if p < 40:
        return "Bajo", "#00d4a8", "low"
    elif p < 70:
        return "Medio", "#f59e0b", "medium"
    return "Alto", "#ef4444", "high"

# ─────────────────────────────────────────
# VALIDACIÓN
# ─────────────────────────────────────────
def validar_input(data):
    try:
        # Convertir los valores del formulario a números y verificar rangos válidos
        age = float(data.get("age", 0))
        if not (15 <= age <= 35):
            return False

        cgpa = float(data.get("cgpa", 0))
        if not (0 <= cgpa <= 10):
            return False

        academic_pressure = float(data.get("academic_pressure", 0))
        if not (1 <= academic_pressure <= 5):
            return False

        sleep_duration = float(data.get("sleep_duration", 0))
        if not (2 <= sleep_duration <= 12):
            return False

        work_study_hours = float(data.get("work_study_hours", 0))
        if work_study_hours < 0:
            return False

        financial_stress = float(data.get("financial_stress", 0))
        if not (1 <= financial_stress <= 5):
            return False

        # Validar selects y toggles
        if data.get("gender") not in ["Male", "Female", "Other"]:
            return False
        if data.get("dietary_habits") not in ["Healthy", "Moderate", "Unhealthy"]:
            return False
        if data.get("suicidal_thoughts") not in ["Yes", "No"]:
            return False
        if data.get("family_history") not in ["Yes", "No"]:
            return False

        return True
    except ValueError:
        return False

# Convierte los datos del formulario en el vector que espera el modelo
def preparar_input(data):
    gender_map = {"Male": 0, "Female": 1, "Other": 2}
    diet_map = {"Healthy": 2, "Moderate": 1, "Unhealthy": 0}
    binary_map = {"Yes": 1, "No": 0}

    X = [
        gender_map.get(data.get("gender"), 0),                 # Gender
        float(data.get("age", 20)),                            # Age
        0,                                                      # City (no usado real)
        0,                                                      # Profession
        float(data.get("academic_pressure", 3)),               # Academic Pressure
        0,                                                      # Work Pressure
        float(data.get("cgpa", 7)),                            # CGPA
        0,                                                      # Study Satisfaction
        0,                                                      # Job Satisfaction
        float(data.get("sleep_duration", 7)),                  # Sleep
        diet_map.get(data.get("dietary_habits"), 1),           # Diet
        0,                                                      # Degree
        binary_map.get(data.get("suicidal_thoughts"), 0),      # Suicidal Thoughts
        float(data.get("work_study_hours", 6)),                # Work/Study Hours
        float(data.get("financial_stress", 3)),                # Financial Stress
        binary_map.get(data.get("family_history"), 0)          # Family History
    ]

    # El modelo espera un array 2D para predict_proba
    return np.array(X).reshape(1, -1)

# ─────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────
@app.route("/")
def home():
    # Renderiza la página principal con el formulario
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.form.to_dict()

        # Validar entrada antes de predecir
        if not validar_input(data):
            return render_template("error.html", error="Datos inválidos"), 400

        X = preparar_input(data)

        if modelo_rf is None:
            return render_template("error.html", error="Modelo no disponible"), 500

        # Ejecutar predicción con el modelo cargado
        proba = modelo_rf.predict_proba(X)[0]
        modelo_nombre = "Random Forest"

        prob = float(proba[1]) * 100
        nivel, color, key = clasificar_riesgo(prob)

        # Preparar lista de importancias para mostrar en la UI
        feature_names = [
            "Género", "Edad", "Presión Académica", "CGPA", "Duración Sueño",
            "Hábitos Alimenticios", "Pensamientos Suicidas", "Horas Trabajo/Estudio",
            "Estrés Financiero", "Historia Familiar"
        ]
        importances = []

        if hasattr(modelo_rf, "feature_importances_"):
                importances = list(zip(feature_names, modelo_rf.feature_importances_))
                importances.sort(key=lambda x: x[1], reverse=True)

        return render_template(
            "result.html",
            probabilidad=round(prob, 1),
            nivel_riesgo=nivel,
            nivel_key=key,
            color=color,
            modelo_nombre=modelo_nombre,
            form_data=data,
            importances=importances
        )
    except Exception as e:
        logger.error(f"Error en predicción: {e}")
        return render_template("error.html", error="Error interno del servidor"), 500

# ─────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
