import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'red',
      padding: '50px',
      color: 'white',
      fontSize: '48px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: 'yellow',
        padding: '30px',
        border: '10px solid blue',
        margin: '20px'
      }}>
        🚨 TEST PAGE - RED BACKGROUND WITH YELLOW BOX 🚨
      </div>
      
      <div style={{
        backgroundColor: 'green',
        padding: '20px',
        margin: '20px',
        fontSize: '24px'
      }}>
        If you can see this, React is working!
      </div>
    </div>
  );
};

export default TestPage;
