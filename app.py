import os
import io
import numpy as np
import cv2
import base64
from flask import Flask, request, jsonify, render_template

import keras
from keras.preprocessing import image
from keras import backend as K
from keras.utils import CustomObjectScope
from keras.initializers import glorot_uniform
from keras.models import model_from_json

app = Flask(__name__)

os.environ['KMP_DUPLICATE_LIB_OK']='True'

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MODEL_FOLDER'] = 'BD-Model'
app.config['NB_FOLDER'] = 'Notebooks'

model = None
graph = None

# Crop image edges
def crop_image1(img,tol=7):
    mask = img>tol
    return img[np.ix_(mask.any(1),mask.any(0))]

# load keras model
def load_model():
    global model
    global graph
    # the following with stmnt may only be needed when running in tensorflow 1.13.1 environment
    with CustomObjectScope({'GlorotUniform': glorot_uniform()}):
        model = keras.models.load_model(os.path.join(app.config['MODEL_FOLDER'], "cnn1_trained_jn.h5"))
        #model = keras.models.load_model(os.path.join(app.config['NB_FOLDER'], "cnn1_trained.h5"))
    graph = K.get_session().graph
    print("  *****  Model loaded!")

def prepare_image(nparr):
    #  let opencv decode image to correct format
    img = cv2.imdecode(nparr, cv2.COLOR_BGR2GRAY)

    # Image processing
    #img_array = crop_image1(img) # crop images
    new_array = cv2.resize(img, (224, 224))  # resize images
    # Boilerplate adjustments
    new_array = cv2.addWeighted ( new_array,4, cv2.GaussianBlur( new_array , (0,0) , 224/10) ,-4 ,128) # adjust brightness
    new_array = new_array/255.0

    # Reshape image from (224, 224) to (1, 224, 224, 1)
    image = np.array(new_array).reshape(-1, 224, 224, 1)

    # Return the processed feature array
    return image

print("  *****  Loading Keras model.....")
load_model()

##### Routes setting ###
@app.route("/")
def index():
    # return the homepage
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    # get json from the POST request
    message = request.get_json(force=True)
    # get image key from json data with base64 encoded image sent by the client
    encoded = message['image']
    # read encoded image
    decoded = base64.b64decode(encoded)
    # convert binary data to numpy array
    nparr = np.fromstring(decoded, np.uint8)
    # prepare the image for the model
    processed_image = prepare_image(nparr)

    with graph.as_default():
        prediction = model.predict(processed_image).tolist()
        response = {
            'prediction':{
                'NoDR': prediction[0][0],
                'Mild': prediction[0][1],
                'Moderate': prediction[0][2],
                'Severe': prediction[0][3],
                'ProliferativeDR': prediction[0][4]
            }
        }
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)