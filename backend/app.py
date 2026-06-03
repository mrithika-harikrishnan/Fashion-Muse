import datetime
import bcrypt
import jwt
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()
rp_me_key = os.getenv("READY_PLAYER_ME_KEY")

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

USERS = {}

app = Flask(__name__)
CORS(app)

# Either hardcode your key here (not recommended for production):
openai.api_key = "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"

@app.route("/")
def home():
    return "Fashion Muse Backend Running!"


@app.route("/register", methods=["POST"])
def register():
    """
    Expects JSON:
    {
      "username": "example",
      "password": "secret"
    }
    Registers a new user by hashing the password and storing the info.
    """
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Missing username or password"}), 400

    username = data["username"]
    password = data["password"]

    if username in USERS:
        return jsonify({"error": "User already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    USERS[username] = {
        "username": username,
        "password": hashed_password
    }

    return jsonify({"message": "User registered successfully."}), 201

@app.route("/login", methods=["POST"])
def login():
    """
    Expects JSON:
    {
      "username": "example",
      "password": "secret"
    }
    Verifies credentials and returns a JWT token if successful.
    """
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Missing username or password"}), 400

    username = data["username"]
    password = data["password"]

    user = USERS.get(username)
    if not user:
        return jsonify({"error": "User does not exist"}), 404

    # Check password
    if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"error": "Incorrect password"}), 401

    # Generate a JWT token valid for 24 hours
    token = jwt.encode(
        {
            "username": username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        },
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({"token": token}), 200


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    # Correctly use ChatCompletion with 'messages' instead of 'prompt'
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful fashion stylist who provides short, "
                    "direct outfit suggestions for anyone—men, women, or otherwise. "
                    "Keep your answers concise and relevant to the user's query."
                )
            },
            {"role": "user", "content": user_message}
        ],
        max_tokens=100,
        temperature=0.9
    )

    # The reply is in 'message.content' for ChatCompletion
    ai_reply = response["choices"][0]["message"]["content"].strip()
    return jsonify({"reply": ai_reply})
@app.route("/virtual-assistant", methods=["POST"])
def virtual_assistant():
    """
    Endpoint for the Virtual Muscat Assistant.
    It receives a user message and returns AI-generated style advice.
    """
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "Invalid request: missing 'message' field."}), 400

    user_message = data["message"]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": (
                    "You are Virtual Muscat Assistant, a talking AI assistant "
                    "that provides real-time style advice. You help users style outfits "
                    "and match makeup and accessories, using a friendly, conversational tone."
                )},
                {"role": "user", "content": user_message}
            ],
            max_tokens=100,
            temperature=0.7
        )
        ai_reply = response["choices"][0]["message"]["content"].strip()
        return jsonify({"reply": ai_reply})
    except Exception as e:
        print("Error in /virtual-assistant:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/custom-avatar", methods=["GET"])
def custom_avatar():
    """
    Endpoint to generate the Ready Player Me avatar creation URL.
    Adjust parameters (such as redirectUrl, or any custom query parameters)
    as needed by your Ready Player Me API.
    """
    # The URL to which Ready Player Me should redirect after avatar creation.
    # For example, redirect back to your app's callback route:
    redirect_url = "http://127.0.0.1:3000/avatar-callback"
    
    # Build the Ready Player Me URL.
    # (Replace the base URL and parameters based on your API documentation.)
    avatar_url = "https://webaverse.com/iframe/readyplayerme"
    
    # Optionally, you can include additional parameters here, for example:
    # avatar_url += "&gender=neutral&bodyType=athletic"

    return jsonify({"avatarUrl": avatar_url})


@app.route("/photo-upload", methods=["POST"])
def photo_upload():
    """
    1. Receives a file under 'file' form-data key.
    2. Saves the image to 'uploads/' folder.
    3. Performs a fake image analysis (placeholder).
    4. Calls ChatGPT with the textual descriptor.
    5. Returns the suggestions as JSON.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # 1. Save the file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        file.save(file_path)
    except Exception as e:
        return jsonify({"error": f"Failed to save file: {str(e)}"}), 500

    # 2. Fake image analysis: Replace with real vision API if you have one
    # For demonstration, we assume a textual descriptor of the user's body/clothes.
    image_descriptor = fake_image_analysis(file_path)

    # 3. Call ChatGPT with the descriptor
    try:
        # Construct a prompt for ChatGPT
        prompt = (
            "You are a fashion stylist AI. The user has uploaded a photo. "
            "Based on the following description of their appearance:\n"
            f"{image_descriptor}\n"
            "Provide outfit and cosmetic suggestions tailored to their appearance. "
            "Also recommend a suitable perfume or fragrance. Keep it concise."
        )

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful fashion stylist."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        ai_reply = response["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return jsonify({"error": f"Error calling ChatGPT: {str(e)}"}), 500

    # 4. Return suggestions
    return jsonify({"suggestions": ai_reply})

def fake_image_analysis(file_path):
    """
    Placeholder for real image analysis. 
    In reality, you'd call a vision API to detect user body type, clothes, etc.
    We'll just return a mock descriptor.
    """
    # For example, if the user is wearing black T-shirt, slender figure
    # You could also vary this based on file name or random logic
    return "The user appears to have a slender body type and is wearing a black T-shirt."


@app.route("/seasonal-guides", methods=["POST"])
def seasonal_guides():
    """
    Receives a JSON body with:
      {
        "season": "summer" or "winter" or "rainy",
        "preferences": "any user style preferences, body type, color likes, etc."
      }
    Calls ChatGPT with a custom prompt to get outfit & cosmetic suggestions.
    Returns the suggestions in JSON.
    """
    data = request.get_json()
    if not data or "season" not in data:
        return jsonify({"error": "Missing 'season' in request JSON"}), 400

    season = data["season"].strip().lower()
    user_prefs = data.get("preferences", "").strip()

    # Construct a prompt for ChatGPT
    # Example prompt
    prompt = (
        f"You are a fashion stylist. The user is interested in {season} outfits. "
        "They have the following preferences:\n"
        f"{user_prefs}\n"
        "Provide a short curated guide of trending outfits and cosmetics for this season. "
        "Include a few suggestions that match user preferences, and keep it concise."
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful fashion stylist."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        ai_reply = response["choices"][0]["message"]["content"].strip()
        return jsonify({"guide": ai_reply})
    except Exception as e:
        print("Error in /seasonal-guides:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/outfit-cosmetics", methods=["POST"])
def outfit_cosmetics():
    """
    Receives JSON body with:
      {
        "style": "casual/chic/bohemian/etc.",
        "bodyType": "slender/curvy/etc.",
        "occasion": "wedding, office, party, etc."
      }
    Calls ChatGPT with a custom prompt for clothing, accessories, and makeup suggestions.
    Returns AI suggestions as JSON.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    style = data.get("style", "").strip()
    body_type = data.get("bodyType", "").strip()
    occasion = data.get("occasion", "").strip()

    # Build a prompt for ChatGPT
    prompt = (
        "You are a fashion stylist. The user has the following details:\n"
        f"Style preference: {style}\n"
        f"Body type: {body_type}\n"
        f"Occasion: {occasion}\n\n"
        "Suggest a complete look, including clothing, accessories, and makeup that "
        "aligns with these details. Provide a concise set of recommendations "
        "that are practical and stylish. Also mention a suitable color palette if relevant."
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful fashion stylist."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        ai_reply = response["choices"][0]["message"]["content"].strip()
        return jsonify({"recommendations": ai_reply})
    except Exception as e:
        print("Error in /outfit-cosmetics:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)

SHOPPING_LINKS = [
    {
      "title": "Allen Solly Men Slim Fit Shirt",
      "link": "https://www.flipkart.com/allen-solly-men-slim-fit-solid-spread-collar-casual-shirt/p/itm"
    },
    {
      "title": "Levi's Men Regular Fit Jeans",
      "link": "https://www.flipkart.com/levi-s-men-regular-mid-rise-blue-jeans/p/itm"
    },
    {
      "title": "Jack & Jones Men T-Shirt",
      "link": "https://www.flipkart.com/jack-jones-solid-men-round-neck-dark-blue-t-shirt/p/itm"
    },
    {
      "title": "Puma Printed Black Sweatshirt",
      "link": "https://www.flipkart.com/puma-printed-men-round-neck-black-sweatshirt/p/itm"
    },
    {
      "title": "Highlander Men Beach Shorts",
      "link": "https://www.flipkart.com/highlander-men-printed-beach-shorts/p/itm"
    },
    {
      "title": "Amazon Essentials Slim Shirt",
      "link": "https://www.amazon.in/dp/B07S7XBB4W"
    },
    {
      "title": "U.S. Polo Men Denim Jacket",
      "link": "https://www.flipkart.com/u-s-polo-assn-men-denim-jacket/p/itm"
    },
    {
      "title": "Van Heusen Men Chinos",
      "link": "https://www.flipkart.com/van-heusen-men-slim-fit-mid-rise-grey-trousers/p/itm"
    },
    {
      "title": "Roadster Graphic Tee",
      "link": "https://www.flipkart.com/roadster-graphic-print-men-round-neck-t-shirt/p/itm"
    },
    {
      "title": "Peter England Casual Shirt",
      "link": "https://www.flipkart.com/peter-england-men-slim-fit-checkered-casual-shirt/p/itm"
    },
    {
      "title": "Max Cotton Kurta for Men",
      "link": "https://www.flipkart.com/max-men-solid-straight-kurta/p/itm"
    },
    {
      "title": "Dennis Lingo Full Sleeve Shirt",
      "link": "https://www.amazon.in/dp/B07HQX1P1H"
    },
    {
      "title": "Symbol Polo Neck T-Shirt",
      "link": "https://www.amazon.in/dp/B01MRWUK7A"
    },
    {
      "title": "Urbano Fashion Men Joggers",
      "link": "https://www.flipkart.com/urbano-fashion-jogger-fit-men-grey-jeans/p/itm"
    },
    {
      "title": "The Souled Store Anime Tee",
      "link": "https://www.amazon.in/dp/B0BP8C44ND"
    },
    {
      "title": "Zara Men Black Formal Shirt",
      "link": "https://www.flipkart.com/zara-black-formal-shirt/p/itm"
    },
    {
      "title": "Campus Sutra Casual Blazer",
      "link": "https://www.amazon.in/dp/B07X6H5PRH"
    },
    {
      "title": "HRX Running Track Pants",
      "link": "https://www.flipkart.com/hrx-track-pants-men/p/itm"
    },
    {
      "title": "Leotude Cotton Hoodie",
      "link": "https://www.amazon.in/dp/B07JGWH7P6"
    },
    {
      "title": "Bewakoof Typography Tee",
      "link": "https://www.flipkart.com/bewakoof-men-typography-round-neck-cotton-t-shirt/p/itm"
    }
  ]
  
@app.route("/shopping_links", methods=["GET"])
def shopping_links():
    return jsonify({"links" : SHOPPING_LINKS})

    
# In-memory user profiles, keyed by user ID (for demo)
USER_PROFILES = {}

@app.route("/")
def home():
    return "Fashion Muse Backend Running!"

@app.route("/profile", methods=["POST"])
def save_profile():
    """
    Save user profile data in memory (demo).
    Expects JSON like:
    {
      "userId": "abc123",
      "name": "Alice",
      "gender": "female",
      "bodySize": "M",
      "skinTone": "light",
      "styleGoals": "casual, comfortable",
      "preferredColors": "pastels, neutrals",
      "height": 165,
      "weight": 55
    }
    Returns success message.
    """
    data = request.get_json()
    if not data or "userId" not in data:
        return jsonify({"error": "Missing userId or no JSON data"}), 400

    user_id = data["userId"]
    USER_PROFILES[user_id] = data

    return jsonify({"message": "Profile saved successfully", "profile": data})

@app.route("/profile/ai-advice", methods=["POST"])
def profile_ai_advice():
    """
    Calls ChatGPT with the user's profile data to generate personalized fashion advice.
    Expects JSON: { "userId": "abc123" }
    Returns a 'personalizedAdvice' string.
    """
    data = request.get_json()
    if not data or "userId" not in data:
        return jsonify({"error": "Missing userId"}), 400

    user_id = data["userId"]
    if user_id not in USER_PROFILES:
        return jsonify({"error": "No profile found for this user"}), 404

    profile = USER_PROFILES[user_id]

    # Construct a prompt for ChatGPT
    # e.g. "User named Alice, female, bodySize M, styleGoals: casual..."
    prompt = (
        f"You are a fashion consultant. The user has the following profile:\n"
        f"Name: {profile.get('name', 'N/A')}\n"
        f"Gender: {profile.get('gender', 'N/A')}\n"
        f"Body size: {profile.get('bodySize', 'N/A')}\n"
        f"Skin tone: {profile.get('skinTone', 'N/A')}\n"
        f"Style goals: {profile.get('styleGoals', 'N/A')}\n"
        f"Preferred colors: {profile.get('preferredColors', 'N/A')}\n"
        f"Height: {profile.get('height', 'N/A')} cm\n"
        f"Weight: {profile.get('weight', 'N/A')} kg\n"
        "Suggest personalized outfit ideas, accessories, and cosmetics that fit these preferences "
        "and help achieve the user's style goals. Keep it concise and practical."
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful fashion consultant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )
        ai_reply = response["choices"][0]["message"]["content"].strip()
        return jsonify({"personalizedAdvice": ai_reply})
    except Exception as e:
        print("Error in /profile/ai-advice:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)
