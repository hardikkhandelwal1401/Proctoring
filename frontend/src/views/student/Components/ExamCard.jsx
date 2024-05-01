import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Rating, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

function isLive(liveDate, endDate) {
  // Convert string dates to Date objects
  const liveTime = new Date(liveDate);
  const endTime = new Date(endDate);
  const currentTime = new Date();
  // Check if the current time is between live time and end time
  return currentTime >= liveTime && currentTime <= endTime;
}

const imgUrl =
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNvbXB1dGVyJTIwc2NpZW5jZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80';
export default function ExamCard({ exam }) {
  const { examName, duration, totalQuestions, examId, liveDate, deadDate } = exam;
  console.log('live: ', liveDate, ',dead: ', deadDate);
  const { userInfo } = useSelector((state) => state.auth);
  console.log('userInfo in exam card: ', userInfo);

  // handling routes
  const navigate = useNavigate();
  const [completedExams, setCompletedExams] = useState(() => {
    // Retrieve completed exams from localStorage or initialize an empty array
    const storedExams = localStorage.getItem('completedExams');
    return storedExams ? JSON.parse(storedExams) : [];
  });
  const isExamCompleted = completedExams.includes(examId);
  const isExamActive = true; // Date.now() >= liveDate && Date.now() <= deadDate;
  const handleCardClick = () => {
    if (isExamCompleted) {
      toast('You have already completed this exam.');
    } else {
      const liveTime = new Date(liveDate);
      const endTime = new Date(deadDate);
      const currentTime = new Date();
      if (currentTime < liveTime) {
        toast('This exam is yet to start!');
      } else if (currentTime > endTime) {
        toast('This exam has already ended!');
      } else {
        // Mark the exam as completed for this user
        setCompletedExams((prevExams) => [...prevExams, examId]);
        // Update localStorage with the new list of completed exams
        if (userInfo.role === 'student') {
          // Update localStorage with the new list of completed exams
          localStorage.setItem('completedExams', JSON.stringify([...completedExams, examId]));
        }
        navigate(`/exam/${examId}`);
      }
    }
  };
  return (
    <Card>
      <CardActionArea onClick={handleCardClick}>
        <CardMedia component="img" height="160" image={imgUrl} alt="green iguana" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {examName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            MCQ
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
            <Stack direction="row" alignItems="center">
              <Typography variant="h6"> {totalQuestions} Ques</Typography>
            </Stack>
            <Typography color="textSecondary" ml={1} sx={{}}>
              {duration}min
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
