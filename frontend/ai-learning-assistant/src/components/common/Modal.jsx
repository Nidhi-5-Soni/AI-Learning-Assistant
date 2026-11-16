// import React from "react";
// import {X} from "lucide-react";

// const Modal=({isOpen,onClose,title,children})=>{

//     if(!isOpen) return null;
//     return <div className="fixed inset-0 z-[9999] overflow-y-auto">
//         <div className="flex items-center justify-center min-h-screen px-4 pt-16 pb-8">
//             <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
//             onClick={onClose}
//             >

//             </div>
//             <div className="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col rounded-xl border border-slate-200/60 bg-white/95 p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
//                 <button
//                 onClick={onClose}
//                 className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
//                 >
//                     <X className="w-5 h-5" strokeWidth={2}/>

//                 </button>
//                 <div className="mb-6 pr-8">
//                     <h3 className="text-xl font-medium text-slate-900 tracking-tight">
//                         {title}
//                     </h3>
//                 </div>
//                 <div>{children}</div>
//             </div>
//         </div>
//     </div>

// };

// export default Modal;


import React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, title, children }) => {

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto">

            {/* Background overlay */}
            <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal positioning */}
            <div className="relative flex min-h-screen items-center justify-center px-4 py-8">

                {/* Modal box */}
                <div className="relative z-10 flex w-full max-w-md max-h-[85vh] flex-col rounded-xl border border-slate-200/60 bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">

                    {/* Header */}
                    <div className="relative flex-shrink-0 border-b border-slate-100 px-6 py-5">
                        <h3 className="pr-8 text-base font-semibold text-slate-900">
                            {title}
                        </h3>

                        <button
                            onClick={onClose}
                            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" strokeWidth={2} />
                        </button>
                    </div>

                    {/* Scrollable content */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                        {children}
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;




