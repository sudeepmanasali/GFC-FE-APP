import { createContext, useContext, useState } from "react";
import { QuestionPaper, QuestionPaperContextType } from "../../utils/constants";

const QuestionPaperContext = createContext<QuestionPaperContextType | undefined>(undefined);

export const useQuestionPaper = () => {
  const context = useContext(QuestionPaperContext);
  if (!context) {
    throw new Error('useQuestionPaper must be used within a QuestionPaperProvider');
  }
  return context;
};

export const QuestionPaperProvider: React.FC<any> = ({ children }) => {
  const [questionPaper, setQuestionPaper] = useState<QuestionPaper>({
    showQuestionPaper: false,
    documentName: 'document-name'
  });

  return (
    <QuestionPaperContext.Provider value={{ questionPaper, setQuestionPaper }}>
      {children}
    </QuestionPaperContext.Provider>
  );
};
