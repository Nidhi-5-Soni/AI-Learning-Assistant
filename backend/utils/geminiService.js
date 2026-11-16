import dotenv from 'dotenv';

import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

if(!process.env.GEMINI_API_KEY){
    console.log('Fatal Error:GEMINI_API_KEY is not set in the environment variables');
    process.exit(1);
}


// export const generateFlashcards=async(text,count=10)=>{
//     const prompt=`Generate exactly ${count} educational flashcards from the following text.
//     Format each flashcard as:
//     Q:[Clear,specific question]
//     A:[Concise,accurate answer]
//     D:[Difficulty level:easy,medium,or hard]
    
//     Seperate each flashcard with "---"
    
//     Text:
//     ${text.substring(0,15000)}`;

//     try{
//         const response=await ai.models.generateContent({
//             model:"gemini-3.5-flash-lite",
//             contents:prompt,
//         });

//         const generatedText=response.text;

//         const flashcards=[];
//         const cards=generatedText.split('---').filter(c=>c.trim());

//         for(const card of cards){
//             const lines=card.trim().split('\n');
//             let question='',answer='',difficulty='medium';

//             for(const line of lines){
//                 if(line.startsWith('Q:')){
//                     question=line.substring(2).trim();
//                 }
//                 else if(line.startsWith('A:')){
//                     answer=line.substring(2).trim();
//                     if(['easy','medium','hard'].includes(diff)){
//                         difficulty=diff;
//                     }
//                 }
//             }
//             if(question && answer){
//                 flashcards.push({question,answer,difficulty});
//             }
//         }
//         return flashcards.slice(0,count);

//     }catch(error){
//         console.error('Gemini API error:',error);
//         throw new Error('Failed to generate flashcards');
//     }
// };



export const generateFlashcards = async (text, count = 10) => {
    const prompt = `
Generate exactly ${count} educational flashcards from the following study material.

Return ONLY a valid JSON array.
Do not include markdown, code fences, or explanations outside JSON.

Required JSON format:
[
    {
        "question": "What is React?",
        "answer": "React is a JavaScript library for building user interfaces.",
        "difficulty": "easy"
    }
]

Rules:
- Generate exactly ${count} flashcards.
- Every question must have an accurate answer.
- Difficulty must be easy, medium, or hard.
- Use only the supplied study material.

Study material:
${text.substring(0, 15000)}
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const generatedText = response.text;

        if (!generatedText) {
            throw new Error("Empty Gemini response");
        }

        const flashcards = JSON.parse(generatedText);

        if (!Array.isArray(flashcards)) {
            throw new Error("Gemini did not return a JSON array");
        }

        const validCards = flashcards.filter(card =>
            card.question &&
            card.answer &&
            ["easy", "medium", "hard"].includes(
                card.difficulty?.toLowerCase()
            )
        ).map(card => ({
            question: card.question.trim(),
            answer: card.answer.trim(),
            difficulty: card.difficulty.toLowerCase()
        }));

        console.log("Generated flashcards:", validCards.length);

        if (validCards.length === 0) {
            throw new Error("No valid flashcards generated");
        }

        return validCards.slice(0, count);

    } catch (error) {
        console.error("Gemini Flashcard Error:", error);
        throw new Error("Failed to generate flashcards");
    }
};



// export const generateQuiz=async(text,numQuestions=5)=>{
//     const prompt=`Generate exactly ${numQuestions} multiple choice questions from the following text.
//     Format each question as:
//     Q:[Question]
//     O1:[Option 1]
//     O2:[Option 2]
//     O3:[Option 3]
//     O4:[Option 4]
//     C:[Correct option - exactly as written above]
//     E:[Brief explanation]
//     D:[Difficulty:easy,medium,or hard]
    
//     Seperate questions with "---"
    
//     Text:
//     ${text.substring(0,15000)}
//     `;

//     try{
//         const response=await ai.models.generateContent({
//             model:"gemini-3.5-flash-lite",
//             contents:prompt,
//         });

//         const generatedText=response.text;

//         const questions=[];
//         const questionBlocks=generatedText.split('---').filter(q=>q.trim());

//         for(const block of questionBlocks){
//             const lines=block.trim().split('\n');
//             let question='',options=[],correctAnswer='',explanation='',difficulty='medium';

//             for(const line of lines){
//                 const trimmed=line.trim();
//                 if(trimmed.startsWith('Q:')){
//                     question=trimmed.substring(2).trim();
//                 }
//                 else if(trimmed.match(/^O\d:/)){
//                     options.push(trimmed.substring(3).trim());
//                 }else if(trimmed.startsWith('C:')){
//                     correctAnswer=trimmed.substring(2).trim();
//                 }else if(trimmed.startsWith('E:')){
//                     explanation=trimmed.substring(2).trim();
//                 }else if(trimmed.startsWith('D:')){
//                     const diff=trimmed.substring(2).trim().toLowerCase();
//                     if(['easy','medium','hard'].includes(diff)){
//                         difficulty=diff;
//                     }
//                 }
//             }
//             if(question && options.length===4 && correctAnswer){
//                 questions.push({question,options,correctAnswer,explanation,difficulty});
//             }
//         }
//         return questions.slice(0,numQuestions);

//     }catch(error){
//         console.log('gemini API error:',error);
//         throw new Error('Failed to generate quiz');
//     }
// };

export const generateQuiz = async (text, numQuestions = 5) => {

    if (!text || !text.trim()) {
        throw new Error("Document text is empty");
    }

    const prompt = `
Generate exactly ${numQuestions} multiple-choice questions
from the following study material.

Return ONLY a valid JSON array.

Required JSON format:
[
    {
        "question": "What is React?",
        "options": [
            "JavaScript library",
            "Database",
            "Operating system",
            "Programming language"
        ],
        "correctAnswer": "JavaScript library",
        "explanation": "React is a JavaScript library used to build user interfaces.",
        "difficulty": "easy"
    }
]

Rules:
1. Generate exactly ${numQuestions} questions.
2. Every question must have exactly 4 options.
3. correctAnswer must exactly match one of the 4 options.
4. Include a brief explanation.
5. Difficulty must be easy, medium, or hard.
6. Use only the supplied study material.
7. Do not include markdown or code fences.

Study Material:
${text.substring(0, 15000)}
`;

    try {

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const generatedText = response.text;

        if (!generatedText) {
            throw new Error("Empty Gemini response");
        }

        const parsedQuestions = JSON.parse(generatedText);

        if (!Array.isArray(parsedQuestions)) {
            throw new Error("Gemini did not return a JSON array");
        }

        const validQuestions = parsedQuestions
            .filter(q =>
                q.question &&
                Array.isArray(q.options) &&
                q.options.length === 4 &&
                q.correctAnswer &&
                q.options.includes(q.correctAnswer)
            )
            .map(q => ({
                question: q.question.trim(),
                options: q.options.map(option => option.trim()),
                correctAnswer: q.correctAnswer.trim(),
                explanation: q.explanation?.trim() || "",
                difficulty: ["easy", "medium", "hard"].includes(
                    q.difficulty?.toLowerCase()
                ) ? q.difficulty.toLowerCase() : "medium"
            }));

        console.log("Generated questions:", validQuestions.length);
        console.log("Requested questions:", numQuestions);

        if (validQuestions.length === 0) {
            throw new Error("No valid quiz questions generated");
        }

        return validQuestions.slice(0, numQuestions);

    } catch (error) {
        console.error("Gemini Quiz Generation Error:", error);
        throw new Error("Failed to generate quiz: " + error.message);
    }
};


export const generateSummary=async(text)=>{
    const prompt=`Provide a concise summary of the following text,highlighting the key concepts,main ideas and important points.
    Keep the summary clear and concise.
    
    Text:
    ${text.substring(0,20000)}`;

    try{
        const response=await ai.models.generateContent({
            model:"gemini-3.5-flash-lite",
            contents:prompt,
        });
        const generatedText=response.text;
        return generatedText
    }catch(error){
        console.log('Gemini API error',error);
        throw new Error('failed to generate summary');
    }
};


export const chatWithContext=async(question,chunks)=>{
    const context=chunks.map((c,i)=>`[Chunk ${i+1}]\n${c.content}`).join('\n\n');

    console.log('context_____',context);

    const prompt=`Based on the following context from a document,Analyse the context and answer the user.
    If the answer is not in the context say so.
    
    Context:
    ${context}
    
    Question:${question}
    Answer:`;

    try{
        const response=await ai.models.generateContent({
            model:"gemini-3.5-flash-lite",
            contents:prompt,
        });

        const generatedText=response.text;
        return generatedText
    }catch(error){
        console.error("Gemini API error:",error);
        throw new Error('failed to process chat request');
    }
};


export const explainConcept=async(concept,context)=>{
    const prompt=`Explain the concept of "${concept}" based on the following context.
    Provide a clear,educational explanation that's easy to understand.
    Include examples if relevant.
    
    Context:
    ${context.substring(0,10000)}`;

    try{
        const response=await ai.models.generateContent({
            model:"gemini-3.5-flash-lite",
            contents:prompt,
        });

        const generatedText=response.text;
        return generatedText
    }catch(error){
        console.error("gemini API error",error);
        throw new Error("Failed to explain concept");
    }
};