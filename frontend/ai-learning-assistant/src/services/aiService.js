import axiosInstance from "../utils/axiosinstance";
import {API_PATHS} from "../utils/apiPaths";

const generateFlashcards=async(documentId,options)=>{
    try{
        const response=await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS,{documentId,...options});
        return response.data;
    }catch(error){
        throw error.response?.data || {message:'Failed to generate Flashcards'};
    }
};

const generateQuiz=async(documentId,options)=>{
    try{
        const response=await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ,{documentId,...options});
        return response.data;
    }catch(error){
        throw error.response?.data || {message:'Failed to generate quiz'};
    }
};


const generateSummary=async(documentId)=>{
    try{
        const response=await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY,{documentId});
        return response.data?.data;
    }catch(error){
        throw error.response?.data || {message:'Failed to generate summary'};
    }
};


const explainConcept = async (documentId, concept) => {
    try {
        const response = await axiosInstance.post(
            API_PATHS.AI.EXPLAIN_CONCEPT,
            {
                documentId,
                concept
            }
        );

        console.log("EXPLAIN CONCEPT RESPONSE:", response.data);

        return response.data;

    } catch (error) {
        console.error(
            "EXPLAIN CONCEPT ERROR:",
            error.response?.data || error
        );

        throw error.response?.data || {
            message: error.message || "Failed to explain concept"
        };
    }
};


const chat=async(documentId,message)=>{
    try{
        const response=await axiosInstance.post(API_PATHS.AI.CHAT,{documentId,question:message});
        return response.data;
    }catch(error){
        throw error.response?.data||{message:"Failed to explain concept"};
    }
};

const getChatHistory=async(documentId)=>{
    try{
        const response=await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
        return response.data;
    }catch(error){
        throw error.response?.data || {message:'Failed to fetch chat history'};
    }
};

const aiService={
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    getChatHistory,
    explainConcept
};

export default aiService;