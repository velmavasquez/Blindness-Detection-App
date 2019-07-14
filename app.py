from flask import Flask, jsonify, render_template, url_for, request, redirect
import os
import pandas as pd


# with open("src/config.yaml", 'r') as stream:
#     APP_CONFIG = yaml.load(stream)

app = Flask(__name__)

##### Routes setting ###
@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


            
if __name__ == "__main__":
    app.run()
    
    