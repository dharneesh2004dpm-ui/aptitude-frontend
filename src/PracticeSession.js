import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function PracticeSession() {
    const { topic } = useParams();
    const [questions, setQuestions] = useState([]);
    const [revealedAnswers, setRevealedAnswers] = useState({});

    useEffect(() => {
        axios.get(`https://aptitude-backend-szjt.onrender.com/api/practice/${topic}`)
            .then(res => setQuestions(res.data))
            .catch(err => console.error("Error fetching practice questions:", err));
    }, [topic]);

    const toggleAnswer = (questionId) => {
        setRevealedAnswers(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '30px 20px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '900px', margin: 'auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <Link to="/practice" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>&larr; Back to Topics</Link>
                </div>
                
                <h1 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                    Practice: {decodeURIComponent(topic)}
                </h1>

                {questions.length === 0 ? (
                    <p style={{ color: '#64748b' }}>No questions available for this topic yet. Add them in the Admin Dashboard!</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '20px' }}>
                        {questions.map((q, index) => (
                            <div key={q._id} style={{ background: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0 0 20px 0', lineHeight: '1.6' }}>
                                    <strong>{index + 1}.</strong> {q.questionText}
                                </p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginLeft: '20px' }}>
                                    {q.options.map((opt, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '10px', color: '#475569' }}>
                                            <strong>{String.fromCharCode(65 + i)}.</strong> <span>{opt}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '20px', borderTop: '1px dashed #cbd5e1', paddingTop: '15px' }}>
                                    <button 
                                        onClick={() => toggleAnswer(q._id)}
                                        style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '4px', color: '#334155', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        {revealedAnswers[q._id] ? 'Hide Answer' : 'View Answer'}
                                    </button>

                                    {revealedAnswers[q._id] && (
                                        <div style={{ marginTop: '15px', background: '#ecfdf5', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
                                            <p style={{ margin: '0 0 10px 0', color: '#065f46' }}>
                                                <strong>Answer:</strong> {q.correctAnswer}
                                            </p>
                                            <p style={{ margin: 0, color: '#064e3b', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                                <strong>Explanation:</strong><br/>
                                                {q.explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}