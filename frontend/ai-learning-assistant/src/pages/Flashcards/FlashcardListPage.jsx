import React,{useState,useEffect} from 'react';
import flashcardService from "../../services/flashcardService";
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import EmptyState from "../../components/common/EmptyState";
import FlashcardSetCard from "../../components/flashcards/FlashcardSetCard";
import toast from "react-hot-toast";



const FlashcardListPage=()=> {
  console.log("🔥 FLASHCARD LIST PAGE LOADED");

  const [flashcardSets,setFlashcardSets]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
//     const fetchFlashcardSets=async()=>{
//       try{
//         const response=await flashcardService.getAllFlashcardSets();
//         console.log("FLASHCARD FULL RESPONSE:", response);
// console.log("FLASHCARD RESPONSE DATA:", response.data);


//         console.log("fetchFlashcardSets__",response.data);

//         // setFlashcardSets(response);
//         const flashcardData=response.data;
//         console.log("IS ARRAY:".Array.isArray(flashcardData));
//         setFlashcardSets(
//           Array.isArray(flashcardData)?flashcardData:[]
//         )

//       }catch(error){
//         toast.error('Failed to fetch flashcard sets');
//         console.error(error);
//       }finally{
//         setLoading(false);
//       }
//     };

const fetchFlashcardSets = async () => {
  
  try {
    const response = await flashcardService.getAllFlashcardSets();

    console.log("FLASHCARD RESPONSE:", response);
    console.log("FLASHCARD DATA:", response.data);
    const validFlashcardSets = response.data.filter(
                (set) => set.documentId && set.documentId._id
            );


    if (Array.isArray(response.data)) {
      

      // setFlashcardSets(response.data);
      setFlashcardSets(validFlashcardSets);
    } else {
      setFlashcardSets([]);
    }

  } catch (error) {
    console.error("FLASHCARD FETCH ERROR:", error);
    toast.error("Failed to fetch flashcard sets");
  } finally {
    setLoading(false);
  }
};

    fetchFlashcardSets();
  },[]);

  const renderContent=()=>{
    if(loading){
      return <Spinner/>
    }

    if(flashcardSets.length === 0){
      return (
        <EmptyState
        title="No flashcard sets found"
        description="You haven't generated any flashcards yet.Go to a document to create your first set.">

        </EmptyState>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flashcardSets.map((set)=>(
          <FlashcardSetCard
          key={set._id} flashcardSet={set}></FlashcardSetCard>
        )

        )}
      </div>
    )
  }
  return (
    <div>
      <PageHeader title="All Flashcard Sets"></PageHeader>
      {renderContent()}
    </div>
  )
}

export default FlashcardListPage
