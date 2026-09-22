import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TestPage() {
    const { testId } = useParams();
    const navigate = useNavigate();
    
    // Login State
    const [emailInput, setEmailInput] = useState('');
    const [studentEmail, setStudentEmail] = useState(localStorage.getItem('studentEmail') || '');

    // Test State
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [resultData, setResultData] = useState(null);

    // Fetch Test Data ONLY if the student has logged in
    useEffect(() => {
        if (studentEmail) {
            // UPDATED TO RENDER URL
            axios.get(`https://aptitude-backend-szjt.onrender.com/api/test/${testId}`).then(res => {
                setTest(res.data);
                setTimeLeft(res.data.durationMinutes * 60);
            }).catch(err => console.error("Test not found"));
        }
    }, [testId, studentEmail]);

    // Timer Logic
    useEffect(() => {
        if (!test || resultData) return;
        if (timeLeft <= 0) {
            submitTest();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, test, resultData]);

    // Handle Student Login
    const handleLogin = (e) => {
        e.preventDefault();
        localStorage.setItem('studentEmail', emailInput); // Save to browser memory
        setStudentEmail(emailInput);
    };

    const handleSelect = (qId, option) => {
        setAnswers({ ...answers, [qId]: option });
    };

    const submitTest = async () => {
        const timeTaken = (test.durationMinutes * 60) - timeLeft;
        // UPDATED TO RENDER URL
        const res = await axios.post(`https://aptitude-backend-szjt.onrender.com/api/test/${testId}/submit`, {
            studentEmail: studentEmail, // Use the logged-in email
            studentAnswers: answers,
            timeTakenSeconds: timeTaken
        });
        setResultData(res.data);
    };

    // SCREEN 1: Student Login (Shows if email is missing)
    if (!studentEmail) {
        return (
            <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '100px auto', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <h2>Student Login</h2>
                <p style={{ marginBottom: '20px', color: '#555' }}>Enter your email address to access the test.</p>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="student@institute.com" 
                        value={emailInput} 
                        onChange={(e) => setEmailInput(e.target.value)} 
                        required 
                        style={{ padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ padding: '12px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>Start Test</button>
                </form>
            </div>
        );
    }

    // SCREEN 2: Loading State
    if (!test) return <h2 style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>Loading Test...</h2>;

    // SCREEN 3: Results Dashboard
    if (resultData) {
        return (
            <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
                <h2>Test Completed! Score: {resultData.score}/{resultData.total}</h2>
                <button onClick={() => navigate(`/leaderboard/${testId}`)} style={{ padding: '10px 20px', background: '#007BFF', color: 'white', cursor: 'pointer', border: 'none', borderRadius: '5px', fontSize: '16px', marginBottom: '20px' }}>View Leaderboard</button>
                
                <h3>Answer Key & Explanations:</h3>
                {resultData.detailedResults.map((res, i) => (
                    <div key={i} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', backgroundColor: res.isCorrect ? '#d4edda' : '#f8d7da', borderRadius: '5px' }}>
                        <p><strong>Q:</strong> {res.question}</p>
                        <p>Your Answer: {res.selectedOption || 'None'}</p>
                        <p>Correct Answer: {res.correctOption}</p>
                        <p><strong>Explanation:</strong> {res.explanation}</p>
                    </div>
                ))}
            </div>
        );
    }

    // SCREEN 4: The Actual Test
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid black', paddingBottom: '10px' }}>
                <h2>{test.title}</h2>
                <h2 style={{ color: 'red' }}>
                    Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
                </h2>
            </div>
            
            <p style={{ color: '#555', marginTop: '10px' }}>Logged in as: <strong>{studentEmail}</strong></p>

            {test.questions.map((q, i) => (
                <div key={q._id} style={{ margin: '20px 0', padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#fcfcfc' }}>
                    <p><strong>{i + 1}. {q.questionText}</strong></p>
                    {q.options.map(opt => (
                        <div key={opt} style={{ margin: '8px 0' }}>
                            <label style={{ cursor: 'pointer', fontSize: '16px' }}>
                                <input type="radio" name={q._id} value={opt} onChange={() => handleSelect(q._id, opt)} style={{ marginRight: '10px', transform: 'scale(1.2)' }} />
                                {opt}
                            </label>
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={submitTest} style={{ padding: '15px 25px', fontSize: '18px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>Submit Test</button>
        </div>
    );
}