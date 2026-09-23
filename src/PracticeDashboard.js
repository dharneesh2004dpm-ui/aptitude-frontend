import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PracticeDashboard() {
    const navigate = useNavigate();
    
    const categories = {
        "Quantitative Aptitude": [
            "Time and Distance", "Problems on Trains", "Simple Interest", 
            "Profit and Loss", "Percentage", "Calendar", "Area", "Volume and Surface Area"
        ],
        "Verbal Reasoning": [
            "Logical Sequence", "Blood Relations", "Syllogism", "Venn Diagrams"
        ]
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '1100px', margin: 'auto' }}>
                <h1 style={{ color: '#1e293b', fontSize: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
                    IndiaBix Practice Engine
                </h1>
                
                {Object.keys(categories).map(category => (
                    <div key={category} style={{ marginTop: '30px' }}>
                        <h2 style={{ color: '#059669', fontSize: '1.2rem', marginBottom: '15px' }}>{category}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                            {categories[category].map(topic => (
                                <div 
                                    key={topic}
                                    onClick={() => navigate(`/practice/${encodeURIComponent(topic)}`)}
                                    style={{ background: '#fff', padding: '15px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'box-shadow 0.2s', fontWeight: '500', color: '#334155' }}
                                    onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'}
                                    onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                                >
                                    <span style={{ color: '#f59e0b' }}>📁</span> {topic}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}