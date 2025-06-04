from flask import Flask, Response, request
from flask_cors import CORS
import matplotlib.pyplot as plt
import io

app = Flask(__name__)
CORS(app)

@app.route("/plot", methods=["POST"])
def plot_svg():
    body = request.get_json(force=True)
    if not body:
        return Response("No data provided", status=400)

    user = body["user"]
    print("Received user:", user)

    metric_names = ["funny", "useful", "cool"]
    metric_values = list(map(lambda x: user[x], metric_names))
    # metric_values = [1, 2, 3]

    fig, ax = plt.subplots()
    ax.bar(metric_names, metric_values)
    ax.set_title("User Metrics")

    buf = io.StringIO()
    fig.savefig(buf, format="svg")
    plt.close(fig)
    svg_data = buf.getvalue()
    buf.close()

    return Response(svg_data, mimetype="image/svg+xml")

if __name__ == "__main__":
    app.run(port=3002)
