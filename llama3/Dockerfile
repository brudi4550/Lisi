# Use a base image with Python
FROM python:3.9-slim

# Set the working directory
WORKDIR /usr/src/

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt --default-timeout=300 -i https://pypi.org/simple || \
    pip install -r requirements.txt --default-timeout=300 -i https://pypi.org/simple || \
    pip install -r requirements.txt --default-timeout=300 -i https://pypi.org/simple

# Copy the application code
COPY . .

# Set environment variables for Hugging Face token
ENV HF_ACCESS_TOKEN=${HF_ACCESS_TOKEN}

# Expose the port the app runs on
EXPOSE ${LLAMA3_PORT}

# Run the application
CMD ["python", "src/server.py"]
