from flask import Flask, Response
from flask_cors import CORS
import matplotlib.pyplot as plt
import io

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

@app.route("/plot")
def plot_svg():
    fig, ax = plt.subplots()
    ax.plot([1, 2, 3], [4, 6, 5])
    ax.set_title("Example Plot")
    buf = io.StringIO()
    fig.savefig(buf, format="svg")
    plt.close(fig)
    svg_data = buf.getvalue()
    buf.close()
    return Response(svg_data, mimetype="image/svg+xml")

if __name__ == "__main__":
    app.run(port=3002)
