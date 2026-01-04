import tensorflow as tf
import numpy as np
from PIL import Image
import sys

# Load model
model = tf.keras.models.load_model('currency_model.h5')

# Load class names (update with your actual classes)
class_names = ['class1', 'class2', 'class3']  # Replace with your class names

def predict_currency(image_path):
    # Load and preprocess image
    img = Image.open(image_path).resize((128, 128)).convert('RGB')
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    # Predict
    predictions = model.predict(img_array, verbose=0)
    predicted_class = np.argmax(predictions[0])
    confidence = np.max(predictions[0])
    
    # Print result
    print(f"Predicted: {class_names[predicted_class]}")
    print(f"Confidence: {confidence:.2%}")
    
    # Show top 3 predictions
    top_3 = np.argsort(predictions[0])[-3:][::-1]
    print("\nTop 3 predictions:")
    for i in top_3:
        print(f"  {class_names[i]}: {predictions[0][i]:.2%}")
    
    return class_names[predicted_class], confidence

if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        predict_currency(image_path)
    else:
        print("Usage: python predict.py <image_path>")
        # Example for testing
        # predict_currency("test_currency.jpg")
