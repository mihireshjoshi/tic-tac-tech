from dotenv import load_dotenv
import os, requests

load_dotenv()
BHASHINI_USER_ID = os.getenv("BHASHINI_USER_ID")
BHASHINI_API_KEY = os.getenv("BHASHINI_API_KEY")

languages = {
    "Hindi": "hi", #hindi
    "Gom": "gom", #Gom
    "Kannade": "kn", #Kannada
    "Dogri": "doi", #Dogri    
    "Bodo": "brx", #Bodo 
    "Urdu": "ur",  #Urdu
    "Tamil": "ta",  #Tamil
    "Kashmiri": "ks",  #Kashmiri
    "Assamese": "as",  #Assamese
    "Bengali": "bn", #Bengali
    "Marathi": "mr", #Marathi
    "Sindhi": "sd", #Sindhi
    "Maihtili": "mai",#Maithili
    "Punjabi": "pa", #Punjabi
    "Malayalam": "ml", #Malayalam
    "Manipuri": "mni",#Manipuri
    "Telugu": "te", #Telugu
    "Sanskrit": "sa", #Sanskrit
    "Nepali": "ne", #Nepali
    "Santali": "sat",#Santali
    "Gujarati": "gu", #Gujarati
    "Oriya": "or", #Oriya
    "English": "en",#English
}

async def translation(source_lang, target_lang, content):
    source_language = languages[source_lang]
    target_language = languages[target_lang]
    payload = {
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": source_language,
                        "targetLanguage": target_language
                    }
                }
            }
        ],
        "pipelineRequestConfig": {
            "pipelineId" : "64392f96daac500b55c543cd"
        }
    }
    headers = {
        "Content-Type": "application/json",
        "userID": BHASHINI_USER_ID,
        "ulcaApiKey": BHASHINI_API_KEY
    }
    response = requests.post('https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline', json=payload, headers=headers)
    if response.status_code == 200:
        response_data = response.json()
        service_id = response_data["pipelineResponseConfig"][0]["config"][0]["serviceId"]

        compute_payload = {
            "pipelineTasks": [
                {
                    "taskType": "translation",
                    "config": {
                        "language": {
                            "sourceLanguage": source_language,
                            "targetLanguage": target_language
                        },
                        "serviceId": service_id
                    }
                }
            ],
            "inputData": {
                "input": [
                    {
                        "source": content
                    }
                ],
                "audio": [
                    {
                        "audioContent": None
                    }
                ]
            }
        }
        callback_url = response_data["pipelineInferenceAPIEndPoint"]["callbackUrl"]
        headers2 = {
            "Content-Type": "application/json",
            response_data["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]["name"]:
                response_data["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]["value"]
        }
        compute_response = requests.post(callback_url, json=compute_payload, headers=headers2)
        if compute_response.status_code == 200:
            compute_response_data = compute_response.json()
            translated_content = compute_response_data["pipelineResponse"][0]["output"][0]["target"]
            return {
                "status_code": 200,
                "message": "Translation successful",
                "translated_content": translated_content
            }
        else:
            return {
                "status_code": compute_response.status_code,
                "message": "Error in translation",
                "translated_content": None
            }
    else:
        return {
            "status_code": response.status_code,
            "message": "Error in translation request",
            "translated_content": None
        }
    

async def transcribe(source_lang, content):
    source_language = languages[source_lang]
    payload = {
        "pipelineTasks": [
            {
                "taskType": "asr",
                "config": {
                    "language": {
                        "sourceLanguage": source_language
                    }
                }
            }
        ],
        "pipelineRequestConfig": {
            "pipelineId" : "64392f96daac500b55c543cd"
        }
    }
    headers = {
        "Content-Type": "application/json",
        "userID": BHASHINI_USER_ID,
        "ulcaApiKey": BHASHINI_API_KEY
    }
    response = requests.post('https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline', json=payload, headers=headers)
    
    if response.status_code == 200:
        response_data = response.json()
        service_id = response_data["pipelineResponseConfig"][0]["config"][0]["serviceId"]

        compute_payload = {
            "pipelineTasks": [
                {
                    "taskType": "asr",
                    "config": {
                        "language": {
                            "sourceLanguage": source_language,
                        },
                        "serviceId": service_id
                    }
                }
            ],
            "inputData": {
                "audio": [
                    {
                        "audioContent": content
                    }
                ]
            }
        }

        callback_url = response_data["pipelineInferenceAPIEndPoint"]["callbackUrl"]
        
        headers2 = {
            response_data["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]["name"]:
                response_data["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]["value"]
        }

        compute_response = requests.post(callback_url, json=compute_payload, headers=headers2)

        if compute_response.status_code == 200:
            compute_response_data = compute_response.json()
            transcribed_content = compute_response_data["pipelineResponse"][0]["output"][0]["source"]
            return {
                "status_code": 200,
                "message": "Translation successful",
                "transcribed_content": transcribed_content
            }
        else:
            return {
                "status_code": compute_response.status_code,
                "message": "Error in translation",
                "transcribed_content": None
            }
    else:
        return {
            "status_code": response.status_code,
            "message": "Error in translation request",
            "transcribed_content": None
        }
    
