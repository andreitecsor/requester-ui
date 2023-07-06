import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


function App() {
    const [fid, setFid] = useState('p1');
    const [pid, setPid] = useState('1990919xxxxxx');
    const [scores, setScores] = useState([
        { pid: pid, provider: 'PROVIDER 2', score: 0 },
        { pid: pid, provider: 'PROVIDER 5', score: -1 },
        { pid: pid, provider: 'PROVIDER 3', score: 7 },
        { pid: pid, provider: 'PROVIDER 4', score: 30 },
        { pid: pid, provider: 'PROVIDER 6', score: 50 },
    ]);
    const [submitClicked, setSubmitClicked] = useState(false);
    let intervalId = null;

    const handleInputChange = (event) => {
        setPid(event.target.value);
    };

    const handleSelectChange = (event) => {
        setFid(event.target.value);
    };

    const handleSubmit = async () => {
        setScores([
            { pid: pid, provider: 'PROVIDER 2', score: 0 },
            { pid: pid, provider: 'PROVIDER 5', score: -1 },
            { pid: pid, provider: 'PROVIDER 3', score: 7 },
            { pid: pid, provider: 'PROVIDER 4', score: 30 },
            { pid: pid, provider: 'PROVIDER 6', score: 50 },
        ]);
        setSubmitClicked(true);

        try {
            const response = await axios.post('http://localhost:8080/requester/api/v1', {
                pid: pid,
                fid: fid
            });
            console.log(response)

            intervalId = setInterval(async () => {
                const response = await axios.get(`http://localhost:8080/requester/api/v1/${fid}/${pid}`);
                const data = response.data;

                if (data.status === 'done') {
                    clearInterval(intervalId);
                    setScores(prevScores => [...prevScores, { pid, provider: 'PROVIDER 1', score: data.score || -1 }]);
                }

            }, 60000);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getRowColor = (score) => {
        if (score === -1) return '';
        else if (score === 0) return 'rgba(0, 128, 0, 0.5)'; // green
        else if (score >= 1 && score <= 10) return 'rgba(255, 255, 0, 0.5)'; // yellow
        else if (score >= 11 && score <= 20) return 'rgba(255, 165, 0, 0.5)'; // orange
        else if (score >= 21 && score <= 40) return 'rgba(255, 0, 0, 0.5)'; // red
        else return 'rgba(139, 0, 0, 0.5)'; // dark red
    };

    return (
        <Container>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <TextField
                        label="PID"
                        variant="outlined"
                        value={pid}
                        onChange={handleInputChange}
                        style={{ marginRight: 16 }}
                    />
                    <FormControl variant="outlined">
                        <InputLabel id="provider-select-label">Provider</InputLabel>
                        <Select
                            labelId="provider-select-label"
                            id="provider-select"
                            value={fid}
                            onChange={handleSelectChange}
                            label="Provider"
                        >
                            <MenuItem value={'p1'}>ALL PROVIDERS</MenuItem>
                            <MenuItem value={'provider1'}>PROVIDER 1</MenuItem>
                            {/* Add more MenuItem components here for additional providers */}
                        </Select>
                    </FormControl>
                </Box>
                <Box mt={2} mb={2}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Compute risk score</Button>
                </Box>
                {submitClicked && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography variant="subtitle1" fontWeight="bold">PID</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle1" fontWeight="bold">PROVIDER</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle1" fontWeight="bold">SCORE</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {scores.map((row, index) => (
                                    <TableRow key={index} style={{ backgroundColor: getRowColor(row.score) }}>
                                        <TableCell>{row.pid}</TableCell>
                                        <TableCell>{row.provider}</TableCell>
                                        <TableCell>{row.score}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Container>
    );

}

export default App;
