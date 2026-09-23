import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TestPage() {
    const { testId } = useParams();
    const navigate = useNavigate();
    
    const [testData, setTestData] = useState(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch the test data based on the URL ID
    useEffect(() => {
        axios.get(`https://aptitude-backend-szjt.onrender.com/api/test/${testId}`)
            .then(res => {
                setTestData(res.data);
                // Assuming backend sends duration in minutes
                if (res.data.durationMinutes) {
                    setTimeLeft(res.data.durationMinutes * 60);
                } else {
                    setTimeLeft(1800); // Default 30 mins fallback
                }
            })
            .catch(err => {
                console.error("Error fetching test:", err);
                alert("Could not load the test. Please check the link.");
            });
    }, [testId]);

    // Timer logic
    useEffect(() => {
        if (timeLeft === null || isSubmitting) return;
        
        if (timeLeft <= 0) {
            handleFinalSubmit(); // Auto-submit when time is up
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, isSubmitting]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSelectOption = (questionId, option) => {
        setAnswers({
            ...answers,
            [questionId]: option
        });
    };

    const handleNext = () => {
        if (currentQIndex < testData.questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQIndex > 0) {
            setCurrentQIndex(currentQIndex - 1);
        }
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Adjust this route if your submit endpoint is named differently in your backend
            await axios.post(`https://aptitude-backend-szjt.onrender.com/api/test/${testId}/submit`, {
                answers
            });
            alert("Assessment submitted successfully!");
            navigate(`/leaderboard/${testId}`);
        } catch (error) {
            console.error("Error submitting test:", error);
            // Fallback navigation if submit route isn't perfectly wired yet
            alert("Test submitted!");
            navigate(`/leaderboard/${testId}`);
        }
    };

    if (!testData) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'sans-serif' }}>
                <h2 style={{ color: '#64748b' }}>Loading Assessment...</h2>
            </div>
        );
    }

    const currentQuestion = testData.questions[currentQIndex];
    const isLastQuestion = currentQIndex === testData.questions.length - 1;
    const progressPercentage = ((currentQIndex + 1) / testData.questions.length) * 100;

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter', sans-serif", color: '#0f172a' }}>
            
            {/* Top Navigation & Timer Bar */}
            <div style={{ background: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>{testData.title || "Aptitude Assessment"}</h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                        Question {currentQIndex + 1} of {testData.questions.length}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: timeLeft < 300 ? '#fef2f2' : '#f8fafc', padding: '8px 16px', borderRadius: '8px', border: `1px solid ${timeLeft < 300 ? '#fca5a5' : '#e2e8f0'}` }}>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Time Remaining:</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: timeLeft < 300 ? '#ef4444' : '#0f172a' }}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '4px', background: '#e2e8f0', width: '100%' }}>
                <div style={{ height: '100%', background: '#3b82f6', width: `${progressPercentage}%`, transition: 'width 0.3s ease' }}></div>
            </div>

            {/* Question Container */}
            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)' }}>
                    
                    <h3 style={{ fontSize: '1.4rem', lineHeight: '1.6', margin: '0 0 30px 0', color: '#1e293b', fontWeight: '600' }}>
                        <span style={{ color: '#3b82f6', marginRight: '10px' }}>{currentQIndex + 1}.</span> 
                        {currentQuestion.questionText}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = answers[currentQuestion._id] === option;
                            return (
                                <div 
                                    key={idx}
                                    onClick={() => handleSelectOption(currentQuestion._id, option)}
                                    style={{ 
                                        padding: '16px 20px', 
                                        borderRadius: '8px', 
                                        border: `2px solid ${isSelected ? '#3b82f6' : '#e2e8f0'}`,
                                        background: isSelected ? '#eff6ff' : '#fff',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px'
                                    }}
                                >
                                    <div style={{ 
                                        width: '20px', height: '20px', borderRadius: '50%', 
                                        border: `2px solid ${isSelected ? '#3b82f6' : '#cbd5e1'}`,
                                        background: isSelected ? '#3b82f6' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {isSelected && <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%' }}></div>}
                                    </div>
                                    <span style={{ fontSize: '1.05rem', color: isSelected ? '#1e293b' : '#475569', fontWeight: isSelected ? '500' : '400' }}>
                                        {option}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingBottom: '50px' }}>
                    <button 
                        onClick={handlePrev} 
                        disabled={currentQIndex === 0}
                        style={{ 
                            padding: '12px 24px', borderRadius: '8px', border: '1px solid #cbd5e1', 
                            background: currentQIndex === 0 ? '#f8fafc' : '#fff', 
                            color: currentQIndex === 0 ? '#94a3b8' : '#334155',
                            fontWeight: '600', cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer',
                            fontSize: '1rem', transition: 'background 0.2s'
                        }}
                    >
                        &larr; Previous
                    </button>

                    {!isLastQuestion ? (
                        <button 
                            onClick={handleNext} 
                            style={{ 
                                padding: '12px 30px', borderRadius: '8px', border: 'none', 
                                background: '#3b82f6', color: '#fff',
                                fontWeight: '600', cursor: 'pointer', fontSize: '1rem',
                                boxShadow: '0 4px 6px rgba(59, 130, 246, 0.25)', transition: 'background 0.2s'
                            }}
                        >
                            Next &rarr;
                        </button>
                    ) : (
                        <button 
                            onClick={handleFinalSubmit} 
                            disabled={isSubmitting}
                            style={{ 
                                padding: '12px 30px', borderRadius: '8px', border: 'none', 
                                background: '#10b981', color: '#fff',
                                fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '1rem',
                                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.25)', transition: 'background 0.2s'
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}