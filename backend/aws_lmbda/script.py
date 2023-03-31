import openai
import json

def count_tokens(text):
    # Split the string into words using only whitespace characters
    words = text.split()
    
    # Return the number of words
    return len(words)



# Set up OpenAI credentials
openai.api_key = ""

# Define a function to generate a summary using OpenAI's GPT-3 API

MAX_TOKENS = 2048
DAVINCI_MAX_TOKENS = 2049

def get_summary(text):
    prompt = f"Please summarize the following text: {text}\n\nSummary:"
    response = openai.Completion.create(
        engine="davinci",
        prompt=prompt,
        max_tokens=100,
        n=1,
        stop=None,
        temperature=0.5,
    )
    return response.choices[0].text.strip()

def lambda_handler(event, context):
    print(event)
    text = event.get('text', '')

    if not text:
        return {
            'statusCode': 400,
            'body': json.dumps('No text provided')
        }

    tokens = count_tokens(text)

    if tokens <= MAX_TOKENS:
        summary = get_summary(text)
    else:
        segments = []
        start = 0
        end = MAX_TOKENS

        while start < tokens:
            segments.append(text[start:end])
            start += MAX_TOKENS
            end += MAX_TOKENS

        summaries = [get_summary(segment) for segment in segments]
        concatenated_summaries = ' '.join(summaries)
        summary = get_summary(concatenated_summaries)
        
    return {
        'statusCode': 200,
        'summary': summary
    }