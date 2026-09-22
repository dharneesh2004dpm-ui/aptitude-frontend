import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
    const [questions, setQuestions] = useState([]);
    const [qForm, setQForm] = useState({ topic: '', questionText: '', opt1: '', opt2: '', opt3: '', opt4: '', correctAnswer: '', explanation: '' });
    const [testTitle, setTestTitle] = useState('');
    const [duration, setDuration] = useState(30);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [generatedLink, setGeneratedLink] = useState('');

    const fetchQuestions = () => {
        axios.get('https://aptitude-backend-szjt.onrender.com/api/admin/questions')
            .then(res => setQuestions(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchQuestions(); }, []);

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        const newQuestion = {
            topic: qForm.topic, questionText: qForm.questionText,
            options: [qForm.opt1, qForm.opt2, qForm.opt3, qForm.opt4],
            correctAnswer: qForm.correctAnswer, explanation: qForm.explanation
        };
        await axios.post('https://aptitude-backend-szjt.onrender.com/api/admin/questions', newQuestion);
        alert("Question Added Successfully!");
        setQForm({ topic: '', questionText: '', opt1: '', opt2: '', opt3: '', opt4: '', correctAnswer: '', explanation: '' });
        fetchQuestions();
    };

    const handleCreateTest = async (e) => {
        e.preventDefault();
        if (selectedQuestions.length === 0) return alert("Please select at least one question!");
        
        const res = await axios.post('https://aptitude-backend-szjt.onrender.com/api/test/create', {
            title: testTitle, durationMinutes: duration, questions: selectedQuestions
        });
        
        setGeneratedLink(`${window.location.origin}/test/${res.data._id}`);
        setTestTitle(''); setSelectedQuestions([]);
    };

    const toggleQuestion = (id) => {
        setSelectedQuestions(prev => prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f4f7f6', padding: '40px 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div style={{ maxWidth: '1100px', margin: 'auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px' }}>Admin Dashboard</h1>
                    <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>Manage your question bank and generate custom tests for students</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' }}>
                    
                    {/* CARD 1: ADD QUESTION */}
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #f1f2f6', paddingBottom: '15px' }}>
                            <span style={{ background: '#4f46e5', color: 'white', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold' }}>1</span>
                            <h3 style={{ margin: 0, color: '#1e293b' }}>Add New Question</h3>
                        </div>

                        <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input type="text" placeholder="Topic (e.g. Quantitative, Logical)" value={qForm.topic} onChange={e => setQForm({...qForm, topic: e.target.value})} required style={inputStyle} />
                            <textarea placeholder="Question Text" value={qForm.questionText} onChange={e => setQForm({...qForm, questionText: e.target.value})} required style={{ ...inputStyle, minHeight: '80px' }} />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input type="text" placeholder="Option 1" value={qForm.opt1} onChange={e => setQForm({...qForm, opt1: e.target.value})} required style={inputStyle} />
                                <input type="text" placeholder="Option 2" value={qForm.opt2} onChange={e => setQForm({...qForm, opt2: e.target.value})} required style={inputStyle} />
                                <input type="text" placeholder="Option 3" value={qForm.opt3} onChange={e => setQForm({...qForm, opt3: e.target.value})} required style={inputStyle} />
                                <input type="text" placeholder="Option 4" value={qForm.opt4} onChange={e => setQForm({...qForm, opt4: e.target.value})} required style={inputStyle} />
                            </div>

                            <input type="text" placeholder="Correct Answer (Exact match to one option)" value={qForm.correctAnswer} onChange={e => setQForm({...qForm, correctAnswer: e.target.value})} required style={inputStyle} />
                            <textarea placeholder="Explanation for the answer" value={qForm.explanation} onChange={e => setQForm({...qForm, explanation: e.target.value})} required style={{ ...inputStyle, minHeight: '60px' }} />
                            
                            <button type="submit" style={{ padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>Save Question</button>
                        </form>
                    </div>

                    {/* CARD 2: CREATE TEST */}
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #f1f2f6', paddingBottom: '15px' }}>
                                <span style={{ background: '#059669', color: 'white', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold' }}>2</span>
                                <h3 style={{ margin: 0, color: '#1e293b' }}>Create Test & Get Link</h3>
                            </div>

                            <form onSubmit={handleCreateTest} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <input type="text" placeholder="Test Title (e.g. Round 1 Aptitude)" value={testTitle} onChange={e => setTestTitle(e.target.value)} required style={inputStyle} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Duration (Minutes):</label>
                                    <input type="number" value={duration} onChange={e => setDuration(e.target.value)} required style={inputStyle} />
                                </div>

                                <label style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', marginTop: '5px' }}>Select Questions from Bank ({questions.length} available):</label>
                                <div style={{ maxHeight: '220px', overflowY: 'scroll', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', background: '#f8fafc' }}>
                                    {questions.length === 0 ? (
                                        <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '0.9rem' }}>No questions added yet. Add some on the left!</p>
                                    ) : (
                                        questions.map(q => (
                                            <div key={q._id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px', borderBottom: '1px solid #edf2f7', paddingBottom: '8px' }}>
                                                <input type="checkbox" checked={selectedQuestions.includes(q._id)} onChange={() => toggleQuestion(q._id)} style={{ marginTop: '4px', cursor: 'pointer' }} />
                                                <span style={{ fontSize: '0.9rem', color: '#334155' }}><strong>[{q.topic}]</strong> {q.questionText}</span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <button type="submit" style={{ padding: '12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Generate Test Link</button>
                            </form>
                        </div>

                        {generatedLink && (
                            <div style={{ marginTop: '20px', padding: '15px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px' }}>
                                <strong style={{ color: '#065f46' }}>Test Created Successfully!</strong><br/>
                                <p style={{ fontSize: '0.85rem', color: '#047857', margin: '5px 0' }}>Share this secure evaluation link with your students:</p>
                                <a href={generatedLink} target="_blank" rel="noreferrer" style={{ color: '#0284c7', wordBreak: 'break-all', fontWeight: '600' }}>{generatedLink}</a>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#fff',
    width: '100%',
    boxSizing: 'border-box'
};