import os
import requests

# --- CONFIGURATION ---
# 1. Get your API Key from https://elevenlabs.io/ (Free tier works!)
API_KEY = "YOUR_ELEVENLABS_API_KEY"

# 2. Voices (Verified Premade Female Profiles - Guaranteed Free Tier API)
VOICE_AGENT = "XrExE9yKIg1WjnnlVkGX" # "Matilda" - Professional & Upbeat
VOICE_CLINIC = "EXAVITQu4vr4xnSDxMaL" # "Sarah" - Reassuring & Confident
VOICE_IVR = "Xb7hH8MSUJpSbSDYk0k2"    # "Alice" - Clear Educator
# 3. Output Directory
OUTPUT_DIR = "assets/audio"

# --- SCRIPT DATA ---
scenarios = {
    "standard": [
        {"role": "agent", "text": "Hello... um, this is Iddu, calling on behalf of Alex M. regarding an appointment at the Clinic."},
        {"role": "clinic", "text": "Hi... let me pull that up. Can you, uh, confirm the patient’s date of birth?"},
        {"role": "agent", "text": "Certainly. Date of birth is... let me see... 05/xx/19xx and "},
        {"role": "clinic", "text": "Thank you... hmm, that matches. How can I help you today?"},
        {"role": "agent", "text": "Alex needs to reschedule their follow-up for next Tuesday. Do you have anything, uh, available in the morning?"},
        {"role": "clinic", "text": "Let me check... we have a 9:30 AM or a 10:45 AM."},
        {"role": "agent", "text": "10:45 AM works perfectly for Alex. Please confirm that time."},
        {"role": "clinic", "text": "Okay, I have Alex moved to Tuesday at 10:45 AM. Anything else?"},
        {"role": "agent", "text": "That completes it. Thank you for your help. Goodbye."}
    ],
    "complex": [
        {"role": "ivr", "text": "Welcome to the Clinic. Press 1 for Appointments, 2 for Billing."},
        {"role": "agent", "text": "Sending D T M F 1"},
        {"role": "ivr", "text": "Connecting you to the scheduling department."},
        {"role": "clinic", "text": "Appointments, how can I help you today?"},
        {"role": "agent", "text": "Hello... um, this is Alex M.’s personal AI assistant. Alex needs to move his follow-up. He is looking for next week Tuesday or Wednesday... specifically between 2:00 PM and 4:00 PM."},
        {"role": "clinic", "text": "I can, uh, look into that. To protect the patient’s privacy, can you please verify the date of birth?"},
        {"role": "agent", "text": "Of course. The date of birth is 11/xx/19xx."},
        {"role": "clinic", "text": "Great, thanks... Hmm, I don’t see any afternoon slots those days. But we actually had a cancellation this Friday at 3:15 PM? That’s sooner."},
        {"role": "agent", "text": "Alex specifically requested no Fridays. Could you check again for any Tuesday or Wednesday slots between 2:00 and 4:00 PM? He’s... uh, flexible within that window."},
        {"role": "clinic", "text": "Oh, you’re right... a slot just opened up. How about next Wednesday at 2:30 PM?"},
        {"role": "agent", "text": "Wednesday at 2:30 PM is perfect. I have confirmed that in Alex’s calendar and notified him. Thank you!"},
        {"role": "clinic", "text": "Perfect. You’re all set. Have a good one!"}
    ]
}

def generate_voice(text, voice_id, filename):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": API_KEY
    }
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.45,
            "similarity_boost": 0.8
        }
    }
    
    print(f"Generating: {filename}...")
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        with open(filename, 'wb') as f:
            f.write(response.content)
    else:
        print(f"Error for {filename}: {response.text}")

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    for scenario_name, lines in scenarios.items():
        # Create subfolder for scenario
        scenario_dir = os.path.join(OUTPUT_DIR, scenario_name)
        if not os.path.exists(scenario_dir):
            os.makedirs(scenario_dir)

        for i, line in enumerate(lines):
            voice = VOICE_AGENT if line["role"] == "agent" else (VOICE_IVR if line["role"] == "ivr" else VOICE_CLINIC)
            filename = os.path.join(scenario_dir, f"line_{i}.mp3")
            generate_voice(line["text"], voice, filename)

    print("\n✅ Done! Move the 'assets/audio' folder to your website directory if you ran this elsewhere.")

if __name__ == "__main__":
    if API_KEY == "YOUR_ELEVENLABS_API_KEY":
        print("❌ Error: Please set your API_KEY in the script first.")
    else:
        main()
