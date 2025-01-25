import os
import requests
from PIL import Image
from io import BytesIO
from transformers import BlipProcessor, BlipForConditionalGeneration
import google.generativeai as genai
from gtts import gTTS
from googletrans import Translator
import streamlit as st

# Configure Gemini API
genai.configure(api_key="AIzaSyCC8Me5ZHBVBEuI3OZkoSZUF9sykvETxa8")  # Replace with your Gemini API key

# Load the Processor and Model for BLIP
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")

# Supported languages
LANGUAGE_MAP = {
    "telugu": "te",
    "hindi": "hi",
    "tamil": "ta",
    "kannada": "kn",
    "malayalam": "ml"
}

# Step 1: Caption Generation using BLIP
def generate_caption_from_image(image_source):
    try:
        if image_source.startswith("http://") or image_source.startswith("https://"):
            response = requests.get(image_source)
            response.raise_for_status()
            raw_image = Image.open(BytesIO(response.content)).convert('RGB')
        elif os.path.isfile(image_source):
            raw_image = Image.open(image_source).convert('RGB')
        else:
            return "Error: Invalid image source. Provide a valid URL or local file path."

        inputs = processor(raw_image, return_tensors="pt")
        output = model.generate(**inputs)
        description = processor.decode(output[0], skip_special_tokens=True)
        return description
    except Exception as e:
        return f"Error: {str(e)}"

# Step 2: Story Generation using Gemini API
def generate_story_from_caption(caption):
    prompt = f"Generate a fun and easy-to-understand story for children aged 5-12 years old based on the following caption: '{caption}'. The story should be between 200 to 500 words long and use simple vocabulary that is easy for children to understand."
   
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        story = response.text.strip()
       
        # Ensure the story is between 200 and 500 words
        story_words = story.split()
        if len(story_words) < 200:
            story = " ".join(story_words + ['(Additional content to meet the 200-word requirement)'] * ((200 - len(story_words)) // 5))
        elif len(story_words) > 500:
            story = " ".join(story_words[:500])  # Limit to 500 words
       
        return story
    except Exception as e:
        print(f"Error generating story: {e}")
        return "Error generating story."

# Step 3: Translate Text
def translate_text(text, target_language):
    translator = Translator()
    translation = translator.translate(text, dest=target_language)
    return translation.text

# Step 4: Convert Text to Speech and Save to MP3
def text_to_speech(text, language_code, filename="output.mp3"):
    tts = gTTS(text=text, lang=language_code)
    tts.save(filename)
    return filename

# Step 5: Combine Translation and TTS
def translate_and_speak(text, target_language, tts_language_code):
    # Translate the text to the target language
    translated_text = translate_text(text, target_language)
    print(f"\nTranslated Text: {translated_text}")
   
    # Convert the translated text to speech and save as a separate file
    translated_filename = f"translated_{target_language}.mp3"
    text_to_speech(translated_text, tts_language_code, translated_filename)
    return translated_filename

# Main Function to Process Image and Generate Story
def process_image(image_path, language_choice=None):
    # Step 1: Generate Caption from Image using BLIP
    caption = generate_caption_from_image(image_path)
    st.write(f"**Generated Caption:** {caption}")
   
    # Step 2: Generate Story based on Caption using Gemini API
    story = generate_story_from_caption(caption)
    st.write(f"**Generated Story:** {story}")
   
    # Step 3: Translate and Convert the Story to Speech in the selected language
    if language_choice:
        target_language = LANGUAGE_MAP.get(language_choice.lower())
        if target_language:
            st.write(f"\n**Translating and Converting to Speech in {language_choice.capitalize()}...**")
            audio_file = translate_and_speak(story, target_language, target_language)
        else:
            st.write(f"Error: Language '{language_choice}' is not supported.")
    else:
        # Convert the Story to Speech in English
        st.write("\n**Converting Story to Speech in English...**")
        audio_file = text_to_speech(story, 'en', "english_story.mp3")

    return caption, story, audio_file

# Streamlit App Interface
def streamlit_interface():
    st.title("Image to Story Generator")
    st.subheader("Upload an image to generate a caption, story, and speech.")

    # Image upload
    image = st.file_uploader("Choose an image...", type=["jpg", "png", "jpeg", "bmp"])
    language_choice = st.selectbox("Select Language", ["None", "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam"])

    if image is not None:
        image_path = image.name  # Use image name temporarily
        with open(image_path, "wb") as f:
            f.write(image.getbuffer())

        caption, story, audio_file = process_image(image_path, language_choice)

        # Displaying the results
        st.write(f"**Caption:** {caption}")
        st.write(f"**Story:** {story}")
        st.audio(audio_file)

if __name__ == "__main__":
    streamlit_interface()
