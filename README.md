# StudentMind AI 🧠

> Proyecto para tutorial de YouTube: predicción de riesgo de depresión en estudiantes usando Python, Streamlit y Machine Learning.

## 🎬 Qué vas a ver en el tutorial

En este proyecto aprenderás a construir una aplicación interactiva que:
- carga un modelo de machine learning (`RandomForest`)
- toma datos del estudiante desde una interfaz web
- predice la probabilidad de riesgo de depresión
- muestra el resultado con un dashboard simple y visual
- incluye validación de datos y diseño amigable

## 🧩 Qué contiene el proyecto

- `streamlit_app.py` - App principal en Streamlit para demostración interactiva
- `app.py` - Versión Flask con plantillas HTML (Mejor interfaz grafica)
- `requirements.txt` - Dependencias necesarias
- `modelo_random_forest.pkl` - Modelo entrenado que hace la predicción
- `templates/` - HTML para la versión Flask
- `static/` - CSS y JavaScript para la versión Flask
- `dataset_limpio.csv` - Datos limpios usados en el proyecto o para entrenamiento

## 🚀 Cómo ejecutar la demo con Streamlit

1. Instala las dependencias:
```bash
pip install -r requirements.txt
```

2. Asegúrate de tener el archivo del modelo:
- `modelo_random_forest.pkl`

3. Ejecuta la app Streamlit:
```bash
streamlit run streamlit_app.py
```

4. Abre el navegador en:

`http://localhost:8501`

## 🧠 Cómo funciona la app Streamlit

La aplicación permite al usuario ingresar información del estudiante desde la barra lateral:
- género
- edad
- presión académica
- CGPA
- horas de sueño
- hábitos alimenticios
- horas de trabajo/estudio
- pensamientos suicidas
- estrés financiero
- historial familiar

Después de pulsar el botón, el modelo predice la probabilidad de riesgo y muestra:
- porcentaje de riesgo
- nivel: Bajo / Medio / Alto
- indicador visual con colores
- importancia de las variables en el modelo

## 🔧 Archivo `app.py` (Flask)

Además de Streamlit, el repositorio incluye una versión clásica con Flask que usa:
- rutas `/` y `/predict`
- formularios HTML en `templates/index.html`
- resultados en `templates/result.html`
- estilos en `static/style.css`

Esta versión es ideal para explicar:
- cómo servir un modelo ML con Flask
- cómo procesar formularios con `request.form`
- cómo usar `joblib` para cargar el modelo

## 📝 Estructura del proyecto

```
files/
├── app.py
├── dataset_limpio.csv
├── modelo_random_forest.pkl
├── README.md
├── requirements.txt
├── streamlit_app.py
├── static/
│   ├── script.js
│   └── style.css
└── templates/
    ├── error.html
    ├── index.html
    └── result.html
```

## 💡 Ideas para el tutorial

- Explica primero el problema: salud mental estudiantil y la utilidad de un sistema de apoyo.
- Muestra el flujo completo: datos → modelo → predicción → visualización.
- Comenta la diferencia entre Streamlit y Flask.
- Resalta la validación de inputs y la clasificación de riesgo.
- Añade un aviso ético: no es un diagnóstico médico.

## 📌 Nota ética
Este proyecto es una demostración tecnológica. No debe usarse como reemplazo de un diagnóstico profesional. Si alguien está en crisis, debe buscar ayuda en servicios de salud mental.
