## Prerequisites

- Docker: [Installation Guide](https://docs.docker.com/get-docker/)
- Docker Compose: [Installation Guide](https://docs.docker.com/compose/install/)
- Create Replicate Access Token: [API Token](https://replicate.com/account/api-tokens)
- Create Huggingface Access Token: [Access Token](https://huggingface.co/settings/tokens)
- Apply for access to the Llama3 Model: [Model](https://huggingface.co/meta-llama/Meta-Llama-3-70B)

## Getting Started

1. Clone the repository:

    ```shell
    git clone <repository_url>
    ```

2. Create .env file in the root folder of the project
   
   ```shell
    BACKEND_PORT=3000
    FRONTEND_PORT=80
    LLAMA3_PORT=3001
    REPLICATE_API_KEY=<PRIVATE API KEY FROM REPLICATE>
    HF_ACCESS_TOKEN=<PRIVATE ACCESS TOKEN FROM HUGGINGFACE>
    ```

3. Navigate to the project directory:

    ```shell
    cd <project_directory>
    ```

4. Build and start the containers:

    ```shell
    docker-compose up -build
    ```

5. Access the application:

    Open your web browser and visit `http://localhost:<FRONTEND_PORT>`, where `<FRONTEND_PORT>` is the port specified in your `.env` file.
