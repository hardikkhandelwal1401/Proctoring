import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { useGetExamsQuery } from 'src/slices/examApiSlice';
import { useGetCheatingLogsQuery } from 'src/slices/cheatingLogApiSlice';
import { useGetResultLogsQuery } from 'src/slices/resultLogApiSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function CheatingTable() {
  const [filter, setFilter] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  // const [cheatingLogs, setCheatingLogs] = useState([]);
  const [resultLog, setResultLogs] = useState([]);
  const { data: examsData } = useGetExamsQuery();
  const { data: cheatingLogsData, isLoading } = useGetCheatingLogsQuery(selectedExamId);
  const { data: resultLogsData } = useGetResultLogsQuery(selectedExamId);
  const { userInfo } = useSelector((state) => state.auth);
  console.log('userinfo: ', userInfo);

  useEffect(() => {
    if (examsData && examsData.length > 0) {
      setSelectedExamId(examsData[0].examId);
    }
  }, [examsData]);

  useEffect(() => {
    if (resultLog) {
      console.log('result:', resultLogsData);
      setResultLogs(resultLog);
    }
  }, [resultLogsData]);
  console.log('resultLogsData:', resultLogsData);
  let filteredUsers;
  if (resultLogsData) {
    filteredUsers = resultLogsData.filter((log) => {
      if (userInfo.role === 'student') {
        return (
          log.email.toLowerCase() === userInfo.email.toLowerCase() &&
          (log.username.toLowerCase().includes(filter.toLowerCase()) ||
            log.email.toLowerCase().includes(filter.toLowerCase()))
        );
      } else {
        return (
          log.username.toLowerCase().includes(filter.toLowerCase()) ||
          log.email.toLowerCase().includes(filter.toLowerCase())
        );
      }
    });
  }

  return (
    <Box>
      <Select
        label="Select Exam"
        value={selectedExamId}
        onChange={(e) => {
          setSelectedExamId(e.target.value);
        }}
        fullWidth
        sx={{ mb: 2 }}
      >
        {examsData &&
          examsData.map((exam) => (
            <MenuItem key={exam.examId} value={exam.examId}>
              {exam.examName}
            </MenuItem>
          ))}
      </Select>
      <TextField
        label="Filter by Name or Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sno</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Correct Answers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers &&
              filteredUsers.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{log.username}</TableCell>
                  <TableCell>{log.email}</TableCell>
                  <TableCell>{log.correctAnswers}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
