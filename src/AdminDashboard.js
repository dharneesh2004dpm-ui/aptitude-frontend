import React, { useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
    const [testTitle, setTestTitle] = useState('');
    const [duration, setDuration] = useState(30);
    const [questionsList, setQuestionsList] = useState([]);
    
    const [currentQ, setCurrentQ] = useState({
        topic: '',
        questionText: '',
        options: ['', '', '', ''], 
        correctAnswer: '',
        explanation: ''
    });

    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');

    const handleAddOption = () => {
        setCurrentQ({ ...currentQ, options: [...currentQ.options, ''] });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...currentQ.options];
        newOptions[index] = value;
        setCurrentQ({ ...currentQ, options: newOptions });
    };

    const handleRemoveOption = (index) => {
        if (currentQ.options.length <= 2) return alert("Minimum 2 options required!");
        const newOptions = currentQ.options.filter((_, i) => i !== index);
        setCurrentQ({ ...currentQ, options: newOptions });
    };

    const handleAddToList = (e) => {
        e.preventDefault();
        if (!currentQ.topic || !currentQ.questionText || !currentQ.correctAnswer) {
            return alert("Please fill in all mandatory fields.");
        }
        if (!currentQ.options.includes(currentQ.correctAnswer)) {
            return alert("Correct Answer must match one of the options exactly!");
        }

        setQuestionsList([...questionsList, currentQ]);
        
        setCurrentQ({
            topic: '',
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            explanation: ''
        });
    };

    const handleRemoveFromList = (index) => {
        setQuestionsList(questionsList.filter((_, i) => i !== index));
    };

    const handlePublishTest = async (e) => {
        e.preventDefault();
        if (!testTitle) return alert("Please enter a Test Title.");
        if (questionsList.length === 0) return alert("Please add at least one question!");

        setLoading(true);
        try {
            const savedQuestionIds = [];
            for (const q of questionsList) {
                const qRes = await axios.post('https://aptitude-backend-szjt.onrender.com/api/admin/questions', {
                    topic: q.topic,
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation
                });
                savedQuestionIds.push(qRes.data._id || qRes.data.id);
            }

            const testRes = await axios.post('https://aptitude-backend-szjt.onrender.com/api/test/create', {
                title: testTitle,
                durationMinutes: Number(duration),
                questions: savedQuestionIds
            });

            const testId = testRes.data._id || testRes.data.id;
            const link = `${window.location.origin}/test/${testId}`;
            setGeneratedLink(link);
            alert("Test Published Successfully!");
            
            setTestTitle('');
            setQuestionsList([]);
        } catch (err) {
            alert("Error publishing test. Ensure your backend route is exactly /api/test/create.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', padding: '30px 20px', fontFamily: 'sans-serif', color: '#f8fafc' }}>
            <div style={{ maxWidth: '1200px', margin: 'auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: '#38bdf8' }}>Advanced Assessment Builder</h1>
                    <p style={{ color: '#94a3b8' }}>Build multi-question tests dynamically</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', alignItems: 'start' }}>
                    
                    {/* LEFT PANEL */}
                    <div style={{ background: '#1e293b', padding: '25px', borderRadius: '10px', border: '1px solid #334155' }}>
                        <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '12px', marginTop: 0, color: '#38bdf8' }}>
                            Add Question ({questionsList.length} Que Added)
                        </h3>
                        
                        <form onSubmit={handleAddToList} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                            <input type="text" placeholder="Topic (e.g. Quantitative Aptitude)" value={currentQ.topic} onChange={e => setCurrentQ({...currentQ, topic: e.target.value})} required style={darkInputStyle} />
                            <textarea placeholder="Type Question Text here..." value={currentQ.questionText} onChange={e => setCurrentQ({...currentQ, questionText: e.target.value})} required style={{ ...darkInputStyle, minHeight: '65px' }} />
                            
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Options (Add 4th, 5th, etc.):</label>
                                {currentQ.options.map((opt, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <input type="text" placeholder={`Option ${idx + 1}`} value={opt} onChange={e => handleOptionChange(idx, e.target.value)} required style={darkInputStyle} />
                                        {currentQ.options.length > 2 && (
                                            <button type="button" onClick={() => handleRemoveOption(idx)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0 10px', borderRadius: '6px', cursor: 'pointer' }}>X</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddOption} style={{ background: '#334155', color: '#38bdf8', border: '1px dashed #38bdf8', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', marginTop: '2px' }}>+ Add Option</button>
                            </div>

                            <input type="text" placeholder="Correct Answer (Exact match)" value={currentQ.correctAnswer} onChange={e => setCurrentQ({...currentQ, correctAnswer: e.target.value})} required style={darkInputStyle} />
                            <textarea placeholder="Explanation" value={currentQ.explanation} onChange={e => setCurrentQ({...currentQ, explanation: e.target.value})} required style={{ ...darkInputStyle, minHeight: '45px' }} />
                            
                            <button type="submit" style={{ padding: '10px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>+ Add to Question List</button>
                        </form>
                    </div>

                    {/* RIGHT PANEL */}
                    <div style={{ background: '#1e293b', padding: '25px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '12px', marginTop: 0, color: '#34d399' }}>Test Package Configuration</h3>
                            <form onSubmit={handlePublishTest} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                                <input type="text" placeholder="Test Title" value={testTitle} onChange={e => setTestTitle(e.target.value)} required style={darkInputStyle} />
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Duration (Minutes):</label>
                                    <input type="number" value={duration} onChange={e => setDuration(e.target.value)} required style={{ ...darkInputStyle, marginTop: '4px' }} />
                                </div>

                                <label style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '5px' }}>Questions Queued ({questionsList.length}):</label>
                                <div style={{ maxHeight: '240px', overflowY: 'scroll', border: '1px solid #334155', borderRadius: '6px', padding: '10px', background: '#0f172a' }}>
                                    {questionsList.map((q, i) => (
                                        <div key={i} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}><strong>Q{i+1}.</strong> {q.questionText.substring(0, 30)}...</span>
                                            <button type="button" onClick={() => handleRemoveFromList(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                                        </div>
                                    ))}
                                </div>

                                <button type="submit" disabled={loading} style={{ padding: '14px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }}>
                                    {loading ? 'Publishing...' : 'Publish & Generate Test Link'}
                                </button>
                            </form>
                        </div>
                        {generatedLink && (
                            <div style={{ marginTop: '20px', padding: '15px', background: '#064e3b', border: '1px solid #059669', borderRadius: '6px' }}>
                                <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>Test Link Generated!</strong>
                                <input type="text" readOnly value={generatedLink} onClick={(e) => e.target.select()} style={{ width: '100%', padding: '8px', fontSize: '0.8rem', background: '#022c22', color: '#fff', border: '1px solid #059669', borderRadius: '4px', marginTop: '5px' }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const darkInputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #475569',
    background: '#0f172a',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
};