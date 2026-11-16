// export const chunkText=(text,chunkSize=500,overlap=50)=>{
//     if(!text||text.trim().length===0){
//         return [];
//     }

//     const cleanedText=text
//     .replace(/\r\n/g,'\n')
//     .replace(/\s+/g,' ')
//     .replace(/\n /g,'\n'
//         .replace(/ \n/g,'\n')
//         .trim();

//     const paragraphs=cleanedText.split(/\n+/).filter(p=>p.trim().length>0);

//     const chunks=[];
//     let currentChunk=[];
//     let currentWordCount=0;
//     let chunkIndex=0;

//     for(const paragraph of paragraphs){
//         const paragraphWords=paragraph.trim().split(/\s+/);
//         const paragraphWordCount=paragraphWords.length;

//         if(paragraphWordCount>chunkSize){
//             if(currentChunk.length>0){
//                 chunks.push({
//                     content:currentChunk.join('\n\n'),
//                     chunkIndex:chunkIndex++,
//                     pageNumber:0
                    
//                 });
//                 currentChunk=[];
//                 currentWordCount=0;
//             }
//             for(let i=0;i<paragraphWords.length;i+=(chunkSize-overlap)){
//                 const chunkWords=paragraphWords.slice(i,i+chunkSize);
//                 chunks.push({
//                     context:chunkWords.join(' '),
//                     chunkIndex:chunkIndex++,
//                     pageNumber:0

                    
//                 });
//                 if(i+chunkSize>=paragraphWords.length) break;
//             }
//             continue;
//         }
//         if(currentWordCount+paragraphWordCount>chunkSize && currentChunk.length>0){
//             chunks.push({
//                 content:currentChunk.join('\n\n'),
//                 chunkIndex:chunkIndex++,
//                 pageNumber:0
//             });

//             const prevChunkText=currentChunk.join(' ');
//             const prevWords=prevChunkText.split(/\s+/);
//             const overlapText=prevWords.slice(-Math.min(overlap,prevWords.length)).join(' ');

//             currentChunk=[overlapText,paragraph.trim()];
//             currentWordCount=overlapText.split(/\s+/).length+paragrapghWordCount;
//         }
//         else{
//             currentChunk.push(paragrapgh.trim());
//             currentWordCount+=paragraphWordCount;
//         }
//     }
//     if(currentChunk.length>0){
//         chunks.push({
//             content:currentChunk.join('\n\n'),
//             chunkIndex:chunkIndex,
//             pageNumber:0
//         });


//     }

//     if(chunks.length===0 && cleanedText.length>0){
//         const allWords=cleanedText.split(/\s+/);
//         for(let i=0;i<allWords.length;i+=(chunkSize-overlap)){
//             const chunkWords=allWords.slice(i,i+chunkSize);
//             chunks.push({
//                 content:chunkWords.join(' '),
//                 chunkIndex:chunkIndex++,
//                 pageNumber:0
//             });

//             if(i+chunksize>=allWords.length) break;
//         }
//     }
//     return chunks;
// };

// export const findRelevantChunks=(chunks,query,maxChunks=3)=>{
//     if(!chunks || chunks.length===0 || !query){
//         return [];
//     }

//     const stopWords=new Set([
//         'the','is','at','which','on','a','an','and',
//         'or','but','in','with','to','for','of','as','by',
//         'this','that','it'
//     ]);


//     const queryWords=query
//     .toLowerCase()
//     .split(/\s+/)
//     .filter(w=>w.length>2 && !stopWords.has(w));

//     if(queryWords.length===0){
//         return chunks.slice(0,maxChunks).map(chunk=>({
//             content:chunk.content,
//             chunkIndex:chunk.chunkIndex,
//             pageNumber:chunk.pageNumber,
//             _id:chunk._id
//         }));
//     }

//     const scoredChunks=chunks.map((chunk,index)=>{
//         const content=chunk.content.toLowerCase();
//         const contentWords=content.split(/\s+/).length;
//         let score=0;


//         for(const word of queryWords){
//             const exactMatches=(content.match(new RegExp(`\\b${word}\\b`,'g')) ||[]).length;
//             score+=exactMatches*3;

//             const partialMatches=(content.match(new RegExp(word,'g')) || []).length;
//             score+=Math.max(0,partialMatches-exactMatches)*1.5;


//             const uniqueWordsFound=queryWords.filter(word=>
//                 content.includes(word)

//             ).length;
//             if(uniqueWordsFound>1){
//                 score+=uniqueWordsFound*2;
//             }

//             const normalizedScore=score/Math.sqrt(contentWords);

//             const positionBonus=1-(index/chunks.length)*0.1;

//             return{
//                 content:chunk.content,
//                 chunkIndex:chunk.chunkIndex,
//                 pageNumber:chunk.pageNumber,
//                 _id:chunk._id,
//                 score:normalizedScore*positionBonus,
//                 rawScore:score,
//                 matchedWords:uniqueWordsFound

//             };
        
//         }
//     });

//     return scoredChunks.filter(chunk=>chunk.score>0)
//     .sort((a,b)=>{
//         if(b.score!==a.score){
//             return b.score-a.score;
//         }
//         if(b.matchedWords !== a.matchedWords){
//             return b.matchedWords-a.matchedWords;
//         }
//         return a.chunkIndex-b.chunkIndex;

//     }
//     )
//     .slice(0,maxChunks);
// };



// ==========================================
// 1. TEXT CHUNKING FUNCTION
// ==========================================

export const chunkText = (text, chunkSize = 500, overlap = 50) => {

    // Check if text is empty
    if (!text || text.trim().length === 0) {
        return [];
    }

    // Validate chunk size and overlap
    if (
        !Number.isInteger(chunkSize) ||
        !Number.isInteger(overlap) ||
        chunkSize <= 0 ||
        overlap < 0 ||
        overlap >= chunkSize
    ) {
        throw new Error("Invalid chunkSize or overlap");
    }

    // Clean the text while preserving paragraph breaks
    const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .trim();

    // Split text into paragraphs
    const paragraphs = cleanedText
        .split(/\n+/)
        .filter(p => p.trim().length > 0);

    // Initialize variables
    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    // Helper function to store chunks
    const saveChunk = (content) => {
        chunks.push({
            content,
            chunkIndex: chunkIndex++,
            pageNumber: 0
        });
    };

    // Process each paragraph
    for (const paragraph of paragraphs) {

        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;

        // Handle paragraphs larger than chunkSize
        if (paragraphWordCount > chunkSize) {

            // Save existing chunk
            if (currentChunk.length > 0) {
                saveChunk(currentChunk.join('\n\n'));

                currentChunk = [];
                currentWordCount = 0;
            }

            // Split large paragraph with overlap
            for (
                let i = 0;
                i < paragraphWords.length;
                i += (chunkSize - overlap)
            ) {

                const chunkWords = paragraphWords.slice(
                    i,
                    i + chunkSize
                );

                saveChunk(chunkWords.join(' '));

                if (i + chunkSize >= paragraphWords.length) {
                    break;
                }
            }

            continue;
        }

        // Check whether adding paragraph exceeds chunkSize
        if (
            currentWordCount + paragraphWordCount > chunkSize &&
            currentChunk.length > 0
        ) {

            // Save previous chunk
            const previousText = currentChunk.join(' ');
            saveChunk(currentChunk.join('\n\n'));

            // Get overlapping words from previous chunk
            const previousWords = previousText.split(/\s+/);

            const overlapText = previousWords
                .slice(-Math.min(overlap, previousWords.length))
                .join(' ');

            // Start next chunk with overlap
            currentChunk = [];

            if (overlapText) {
                currentChunk.push(overlapText);
            }

            currentChunk.push(paragraph.trim());

            currentWordCount =
                (overlapText ? overlapText.split(/\s+/).length : 0) +
                paragraphWordCount;

        } else {

            // Add paragraph to current chunk
            currentChunk.push(paragraph.trim());

            currentWordCount += paragraphWordCount;
        }
    }

    // Save remaining text
    if (currentChunk.length > 0) {
        saveChunk(currentChunk.join('\n\n'));
    }

    return chunks;
};


// ==========================================
// 2. FIND RELEVANT CHUNKS FUNCTION
// ==========================================

// export const findRelevantChunks = (chunks, query, maxChunks = 3) => {

//     // Validate input
//     if (
//         !Array.isArray(chunks) ||
//         chunks.length === 0 ||
//         !query ||
//         !query.trim() ||
//         maxChunks <= 0
//     ) {
//         return [];
//     }

//     // Stop words
//     const stopWords = new Set([
//         'the', 'is', 'at', 'which', 'on', 'a', 'an',
//         'and', 'or', 'but', 'in', 'with', 'to', 'for',
//         'of', 'as', 'by', 'this', 'that', 'it'
//     ]);

//     // Extract keywords from query
//     const queryWords = query
//         .toLowerCase()
//         .split(/\s+/)
//         .filter(word =>
//             word.length > 2 && !stopWords.has(word)
//         );

//     // If no keywords are found, return first chunks
//     if (queryWords.length === 0) {
//         return chunks.slice(0, maxChunks).map(chunk => ({
//             content: chunk.content,
//             chunkIndex: chunk.chunkIndex,
//             pageNumber: chunk.pageNumber,
//             _id: chunk._id
//         }));
//     }

//     // Calculate relevance score for each chunk
//     const scoredChunks = chunks.map((chunk, index) => {

//         const content = (chunk.content || '').toLowerCase();

//         const contentWords = content.split(/\s+/).filter(Boolean).length;

//         let score = 0;

//         // Match each query keyword
//         for (const word of queryWords) {

//             // Escape special regex characters
//             const escapedWord = word.replace(
//                 /[.*+?^${}()|[\]\\]/g,
//                 '\\$&'
//             );

//             // Exact keyword matching
//             const exactMatches = (
//                 content.match(
//                     new RegExp(`\\b${escapedWord}\\b`, 'g')
//                 ) || []
//             ).length;

//             score += exactMatches * 3;

//             // Partial keyword matching
//             const partialMatches = (
//                 content.match(
//                     new RegExp(escapedWord, 'g')
//                 ) || []
//             ).length;

//             score += Math.max(
//                 0,
//                 partialMatches - exactMatches
//             ) * 1.5;
//         }

//         // Count unique query keywords found
//         const uniqueWordsFound = queryWords.filter(word =>
//             content.includes(word)
//         ).length;

//         // Give bonus when multiple keywords match
//         if (uniqueWordsFound > 1) {
//             score += uniqueWordsFound * 2;
//         }

//         // Normalize score according to chunk length
//         const normalizedScore =
//             contentWords > 0
//                 ? score / Math.sqrt(contentWords)
//                 : 0;

//         // Slight preference for earlier chunks
//         const positionBonus =
//             1 - (index / chunks.length) * 0.1;

//         return {
//             content: chunk.content,
//             chunkIndex: chunk.chunkIndex,
//             pageNumber: chunk.pageNumber,
//             _id: chunk._id,
//             score: normalizedScore * positionBonus,
//             rawScore: score,
//             matchedWords: uniqueWordsFound
//         };

//     });

//     // Filter, sort and return top relevant chunks
//     return scoredChunks
//         .filter(chunk => chunk.score > 0)

//         .sort((a, b) => {

//             // Highest relevance score first
//             if (b.score !== a.score) {
//                 return b.score - a.score;
//             }

//             // More matched keywords first
//             if (b.matchedWords !== a.matchedWords) {
//                 return b.matchedWords - a.matchedWords;
//             }

//             // Earlier chunks first
//             return a.chunkIndex - b.chunkIndex;

//         })

//         .slice(0, maxChunks);
// };


export const findRelevantChunks = (chunks, query, maxChunks = 3) => {

    if (
        !Array.isArray(chunks) ||
        chunks.length === 0 ||
        !query ||
        !query.trim() ||
        maxChunks <= 0
    ) {
        return [];
    }

    const stopWords = new Set([
        'the', 'is', 'at', 'which', 'on', 'a', 'an',
        'and', 'or', 'but', 'in', 'with', 'to', 'for',
        'of', 'as', 'by', 'this', 'that', 'it',
        'what', 'who', 'when', 'where', 'why',
        'how', 'does', 'do', 'did', 'can', 'could',
        'would', 'should', 'please', 'explain',
        'tell', 'me', 'about'
    ]);

    // Extract meaningful keywords
    const queryWords = query
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word =>
            word.length > 1 && !stopWords.has(word)
        );

    if (queryWords.length === 0) {
        return chunks.slice(0, maxChunks);
    }

    const scoredChunks = chunks.map((chunk, index) => {

        const content = (chunk.content || '').toLowerCase();

        const contentWords = content
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(Boolean);

        const contentSet = new Set(contentWords);

        let score = 0;
        let matchedWords = 0;

        for (const word of queryWords) {

            if (contentSet.has(word)) {
                score += 3;
                matchedWords++;
            }
            else if (
                contentWords.some(contentWord =>
                    contentWord.startsWith(word)
                )
            ) {
                score += 1;
                matchedWords++;
            }
        }

        // Bonus for matching multiple keywords
        if (matchedWords > 1) {
            score += matchedWords * 2;
        }

        // Normalize score
        const normalizedScore = contentWords.length > 0
            ? score / Math.sqrt(contentWords.length)
            : 0;

        return {
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore,
            matchedWords
        };

    });

    return scoredChunks
        .filter(chunk => chunk.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }

            if (b.matchedWords !== a.matchedWords) {
                return b.matchedWords - a.matchedWords;
            }

            return a.chunkIndex - b.chunkIndex;
        })
        .slice(0, maxChunks);
};

