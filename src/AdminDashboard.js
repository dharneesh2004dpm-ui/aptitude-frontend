import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
    const [questions, setQuestions] = useState([]);
    const [qForm, setQForm] = useState({ topic: '', questionText: '', opt1: '', opt2: '', opt3: '', opt4: '', correctAnswer: '', explanation: '' });
    const [testTitle, setTestTitle] = useState('');
    const [duration, setDuration] = useState(30);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [generatedLink, setGeneratedLink] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchQuestions = () => {
        axios.get('https://aptitude-backend-szjt.onrender.com/api/admin/questions')
            .then(res => setQuestions(res.data))
            .catch(err => console.error("Error fetching questions:", err));
    };

    useEffect(() => { fetchQuestions(); }, []);

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {
            const newQuestion = {
                topic: qForm.topic, 
                questionText: qForm.questionText,
                options: [qForm.opt1, qForm.opt2, qForm.opt3, qForm.opt4],
                correctAnswer: qForm.correctAnswer, 
                explanation: qForm.explanation
            };
            await axios.post('https://aptitude-backend-szjt.onrender.com/api/admin/questions', newQuestion);
            alert("Question Added Successfully to Database!");
            setQForm({ topic: '', questionText: '', opt1: '', opt2: '', opt3: '', opt4: '', correctAnswer: '', explanation: '' });
            fetchQuestions();
        } catch (err) {
            alert("Failed to add question. Check backend connection.");
            console.error(err);
        }
    };

    const handleCreateTest = async (e) => {
        e.preventDefault();
        if (selectedQuestions.length === 0) return alert("Please select at least one question!");
        if (!testTitle) return alert("Please enter a test title!");
        
        setLoading(true);
        try {
            const res = await axios.post('https://aptitude-backend-szjt.onrender.com/api/test/create', {
                title: testTitle, 
                durationMinutes: Number(duration), 
                questions: selectedQuestions
            });
            
            // Generate clean working link
            const testId = res.data._id || res.data.id;
            const link = `${window.location.origin}/test/${testId}`;
            setGeneratedLink(link);
            setTestTitle(''); 
            setSelectedQuestions([]);
        } catch (err) {
            alert("Error creating test link.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleQuestion = (id) => {
        setSelectedQuestions(prev => prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', padding: '30px 20px', fontFamily: 'sans-serif', color: '#f8fafc' }}>
            <div style={{ maxWidth: '1200px', margin: 'auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: '#38bdf8' }}>Faculty Assessment Dashboard</h1>
                    <p style={{ color: '#94a3b8' }}>Create questions and generate secure testing links instantly</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '25px' }}>
                    
                    {/* PANEL 1: ADD QUESTION */}
                    <div style={{ background: '#1e293b', padding: '25px', borderRadius: '10px', border: '1px solid #334155' }}>
                        <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '12px', marginTop: 0, color: '#38bdf8' }}>1. Add Question to Bank</h3>
                        <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                            <input type="text" placeholder="Topic (e.g. Quantitative, Verbal)" value={qForm.topic} onChange={e => setQForm({...qForm, topic: e.target.value})} required style={darkInputStyle} />
                            <textarea placeholder="Type your question here..." value={qForm.questionText} onChange={e => setQForm({...qForm, questionText: e.target.value})} required style={{ ...darkInputStyle, minHeight: '70px' }} />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input type="text" placeholder="Option A" value={qForm.opt1} onChange={e => setQForm({...qForm, opt1: e.target.value})} required style={darkInputStyle} />
                                <input type="text" placeholder="Option B" value={qForm.opt2} onChange={e => setQForm({...qForm, opt2: e.target.value})} required style={darkInputStyle} />
                                <input type="text" placeholder="Option C" value={qForm.opt3} onChange={e => setQForm({...qForm, opt3: e.target.value})} required style={darkInputStyle} />
                                <input type="text" placeholder="Option D" value={qForm.opt4} onChange={e => setQForm({...qForm, opt4: e.target.value})} required style={darkInputStyle} />
                            </div>

                            <input type="text" placeholder="Correct Answer (Exact spelling of the correct option)" value={qForm.correctAnswer} onChange={e => setQForm({...qForm, correctAnswer: e.target.value})} required style={darkInputStyle} />
                            <textarea placeholder="Explanation" value={qForm.explanation} onChange={e => setQForm({...qForm, explanation: e.target.value})} required style={{ ...darkInputStyle, minHeight: '50px' }} />
                            
                            <button type="submit" style={{ padding: '12px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>Save Question</button>
                        </form>
                    </div>

                    {/* PANEL 2: CREATE TEST */}
                    <div style={{ background: '#1e293b', padding: '25px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '12px', marginTop: 0, color: '#34d399' }}>2. Generate Test Link</h3>
                            <form onSubmit={handleCreateTest} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                                <input type="text" placeholder="Test Title (e.g. Model Exam 1)" value={testTitle} onChange={e => setTestTitle(e.target.value)} required style={darkInputStyle} />
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Duration (Minutes):</label>
                                    <input type="number" value={duration} onChange={e => setDuration(e.target.value)} required style={{ ...darkInputStyle, marginTop: '4px' }} />
                                </div>

                                <label style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '5px' }}>Select Questions ({questions.length} total in bank):</label>
                                <div style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #334155', borderRadius: '6px', padding: '10px', background: '#0f172a' }}>
                                    {questions.length === 0 ? (
                                        <p style={{ color: '#64748b', textAlign: 'center', fontSize: '0.85rem' }}>No questions found. Add some on the left first!</p>
                                    ) : (
                                        questions.map(q => (
                                            <div key={q._id} style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                                                <input type="checkbox" checked={selectedQuestions.includes(q._id)} onChange={() => toggleQuestion(q._id)} style={{ marginTop: '3px', cursor: 'pointer' }} />
                                                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}><strong>[{q.topic}]</strong> {q.questionText}</span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <button type="submit" disabled={loading} style={{ padding: '12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
                                    {loading ? 'Generating...' : 'Create Link'}
                                </button>
                            </form>
                        </div>

                        {generatedLink && (
                            <div style={{ marginTop: '20px', padding: '15px', background: '#064e3b', border: '1px solid #059669', borderRadius: '6px' }}>
                                <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>Test Link Generated!</strong>
                                <p style={{ fontSize: '0.75rem', color: '#a7f3d0', margin: '4px 0' }}>Copy and share this URL with students:</p>
                                <input type="text" readOnly value={generatedLink} onClick={(e) => e.target.select()} style={{ width: '100%', padding: '6px', fontSize: '0.8rem', background: '#022c22', color: '#fff', border: '1px solid #059669', borderRadius: '4px' }} />
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