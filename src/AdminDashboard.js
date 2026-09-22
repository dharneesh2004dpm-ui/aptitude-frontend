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
        // UPDATED TO RENDER URL
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
        // UPDATED TO RENDER URL
        await axios.post('https://aptitude-backend-szjt.onrender.com/api/admin/questions', newQuestion);
        alert("Question Added!");
        setQForm({ topic: '', questionText: '', opt1: '', opt2: '', opt3: '', opt4: '', correctAnswer: '', explanation: '' });
        fetchQuestions();
    };

    const handleCreateTest = async (e) => {
        e.preventDefault();
        if (selectedQuestions.length === 0) return alert("Select at least one question!");
        
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
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '10px' }}>Admin Dashboard</h1>
            <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
                <div style={{ flex: 1, padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h3>1. Add Question</h3>
                    <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" placeholder="Topic (e.g. Arithmetic)" value={qForm.topic} onChange={e => setQForm({...qForm, topic: e.target.value})} required />
                        <textarea placeholder="Question Text" value={qForm.questionText} onChange={e => setQForm({...qForm, questionText: e.target.value})} required />
                        <input type="text" placeholder="Option 1" value={qForm.opt1} onChange={e => setQForm({...qForm, opt1: e.target.value})} required />
                        <input type="text" placeholder="Option 2" value={qForm.opt2} onChange={e => setQForm({...qForm, opt2: e.target.value})} required />
                        <input type="text" placeholder="Option 3" value={qForm.opt3} onChange={e => setQForm({...qForm, opt3: e.target.value})} required />
                        <input type="text" placeholder="Option 4" value={qForm.opt4} onChange={e => setQForm({...qForm, opt4: e.target.value})} required />
                        <input type="text" placeholder="Correct Answer" value={qForm.correctAnswer} onChange={e => setQForm({...qForm, correctAnswer: e.target.value})} required />
                        <textarea placeholder="Explanation" value={qForm.explanation} onChange={e => setQForm({...qForm, explanation: e.target.value})} required />
                        <button type="submit" style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>Save Question</button>
                    </form>
                </div>
                <div style={{ flex: 1, padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h3>2. Create Test</h3>
                    <form onSubmit={handleCreateTest} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" placeholder="Test Title" value={testTitle} onChange={e => setTestTitle(e.target.value)} required />
                        <input type="number" placeholder="Duration (Mins)" value={duration} onChange={e => setDuration(e.target.value)} required />
                        <h4>Select Questions:</h4>
                        <div style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #eee', padding: '10px' }}>
                            {questions.map(q => (
                                <div key={q._id}>
                                    <label><input type="checkbox" checked={selectedQuestions.includes(q._id)} onChange={() => toggleQuestion(q._id)} /> {q.topic}: {q.questionText.substring(0, 40)}...</label>
                                </div>
                            ))}
                        </div>
                        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Generate Test Link</button>
                    </form>
                    {generatedLink && (
                        <div style={{ marginTop: '20px', padding: '15px', background: '#d4edda', borderRadius: '5px' }}>
                            <strong>Test Created! Share this link:</strong><br/>
                            <a href={generatedLink} target="_blank" rel="noreferrer">{generatedLink}</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}