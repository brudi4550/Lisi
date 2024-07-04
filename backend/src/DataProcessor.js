class DataProcessor {
    constructor(aiModel) {
        this.aiModel = aiModel;
    }

    preprocessData(inputData) {
        let processedData = inputData;
        return processedData;
    }

    postprocessResult(prediction) {
        return prediction;
    }

    processData(inputData) {
        let processedData = this.preprocessData(inputData);
        let prediction = this.aiModel.predict(processedData);
        let postprocessedResult = this.postprocessResult(prediction);
        return postprocessedResult;
    }
}