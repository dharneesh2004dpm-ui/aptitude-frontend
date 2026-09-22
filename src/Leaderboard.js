import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Leaderboard() {
    const { testId } = useParams();
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        // UPDATED TO RENDER URL
        axios.get(`https://aptitude-backend-szjt.onrender.com/api/leaderboard/${testId}`)
            .then(res => setRankings(res.data))
            .catch(err => console.error("Error fetching leaderboard"));
    }, [testId]);

    const formatTime = (seconds) => {
        return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center' }}>Test Leaderboard</h2>
            <table border="1" cellPadding="12" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ background: '#333', color: 'white' }}>
                        <th>Rank</th>
                        <th>Student Email</th>
                        <th>Score</th>
                        <th>Time Taken</th>
                    </tr>
                </thead>
                <tbody>
                    {rankings.map((student, index) => (
                        <tr key={student._id} style={{ background: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                            <td><strong>{index + 1}</strong></td>
                            <td>{student.studentEmail}</td>
                            <td><strong>{student.score}</strong></td>
                            <td>{formatTime(student.timeTakenSeconds)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}