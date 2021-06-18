from flask import Flask, request
import os
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from keras.preprocessing.image import img_to_array, load_img
from keras.applications.vgg16 import preprocess_input
import tensorflow.keras as keras

app = Flask(__name__)

modelPath = os.path.join(os.getcwd() , 'best_model.hdf5')
model = keras.models.load_model(modelPath)

def get_test_img_data(path):
    img = load_img(path , target_size=(224, 224))
    img = img_to_array(img)
    img = img.reshape((1, img.shape[0], img.shape[1], img.shape[2]))
    img = preprocess_input(img)
    return img

@app.route('/predict' , methods=['GET'])
def index():
    img_name = request.args.get('name', type=str)
    img_path = os.path.normpath(os.getcwd() + os.sep + os.pardir)
    img_path = os.path.join(img_path , "Public" , "uploads" , img_name)
    img_data = get_test_img_data(img_path)
    A = model.predict(img_data)
    print(A[0][0])
    print(A[0][1])
    if(A[0][0] > A[0][1]) :
        return "PNEUMONIA IS NOT DETECTED."
    else :
        return "PNEUMONIA IS DETECTED."


if __name__ == "__main__" :
    app.run(port=5000 , debug=True)