import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ONBOARDING_STEPS } from '../../constants';
import { useAppContext } from '../../contexts/AppContext';
import { analyzeCharacterSheet } from '../../services/geminiService';
import { saveCharacterSheet, saveTropes } from '../../services/supabaseService';
import { getSymbolForText } from '../../utils/symbols';
import type { CharacterSheet } from '../../types';
import ProgressBar from '../common/ProgressBar';
import ChapterCard from '../common/ChapterCard';
import Spinner from '../common/Spinner';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { characterSheet, setCharacterSheet, setTropes, isLoading, setIsLoading } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const allQuestionsAnsweredForStep = currentQuestionIndex >= currentStepData.questions.length;
  const currentQuestion = allQuestionsAnsweredForStep ? null : currentStepData.questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCharacterSheet(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionClick = (option: string, prefix = '') => {
    const currentKey = currentStepData.key as keyof CharacterSheet;
    const currentValue = characterSheet[currentKey];
    
    const newSentence = `${prefix}${option}.`;
    const newValue = currentValue ? `${currentValue.trim()} ${newSentence}` : newSentence;
    setCharacterSheet(prev => ({ ...prev, [currentKey]: newValue }));

    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Save character sheet to Supabase
      const savedSheet = await saveCharacterSheet(characterSheet);
      if (savedSheet) {
        setCharacterSheet(savedSheet);
        
        // Analyze and save tropes
        const analyzedTropes = await analyzeCharacterSheet(savedSheet);
        const savedTropes = await saveTropes(analyzedTropes, savedSheet.id!);
        setTropes(savedTropes);
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Failed to analyze character sheet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const canProceed = characterSheet[currentStepData.key as keyof CharacterSheet].trim().length > 10;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-brand-bg">
      <div className="w-full max-w-2xl">
        <ProgressBar currentStep={currentStep + 1} totalSteps={ONBOARDING_STEPS.length} />
        {isLoading ? (
          <div className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-lg h-96">
            <Spinner />
            <p className="mt-4 text-brand-subtle">Analyzing your story...</p>
          </div>
        ) : (
          <ChapterCard
            title={currentStepData.title}
            prompt={currentQuestion ? currentQuestion.prompt : "Great! Review your summary below, or proceed to the next chapter."}
          >
            {currentQuestion && (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option, currentQuestion.prefix)}
                    className="px-3 py-1.5 text-sm text-brand-primary bg-white border border-brand-secondary/50 rounded-full hover:bg-amber-50 hover:border-brand-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 flex items-center space-x-2"
                  >
                    <span>{getSymbolForText(option)}</span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            )}
            <textarea
              name={currentStepData.key}
              value={characterSheet[currentStepData.key as keyof CharacterSheet]}
              onChange={handleChange}
              placeholder={currentStepData.placeholder}
              className="w-full h-40 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
              rows={5}
            />
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-4 py-2 text-sm font-semibold text-brand-subtle rounded-md hover:text-brand-text disabled:opacity-50 transition"
              >
                Back
              </button>
              {isLastStep ? (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed}
                  className="px-6 py-3 font-bold text-white bg-brand-primary rounded-lg hover:bg-opacity-90 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                >
                  Discover My Archetype
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="px-6 py-3 font-bold text-white bg-brand-primary rounded-lg hover:bg-opacity-90 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                >
                  Next Chapter
                </button>
              )}
            </div>
          </ChapterCard>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;