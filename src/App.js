import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

function App() {
    const [pid, setPid] = useState('');
    const [score, setScore] = useState(null);
    let intervalId = null;  // Store the interval ID so you can cancel it later.

    const handleInputChange = (event) => {
        setPid(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8080/requester/api/v1', {
                pid: pid,
            });
            const data = response.data;

            if (data) {
                // Call the GET request every minute until the status is 'done'.
                intervalId = setInterval(async () => {
                    const response = await axios.get(`http://localhost:8080/requester/api/v1/${pid}`);
                    const data = response.data;

                    if (data.status === 'done') {
                        clearInterval(intervalId);
                        setScore(data.score);
                    }
                }, 60000);  // 60000 milliseconds = 1 minute
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
        >
            <TextField
                label="Input Text"
                variant="outlined"
                value={pid}
                onChange={handleInputChange}
            />
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
            </Box>
            {/* Display the score. */}
            {score !== null && (
                <div>Score: {score}</div>
            )}
        </Box>
    );
}

export default App;
