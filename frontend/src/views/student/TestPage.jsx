import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, CircularProgress } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';
import MultipleChoiceQuestion from './Components/MultipleChoiceQuestion';
import NumberOfQuestions from './Components/NumberOfQuestions';
import WebCam from './Components/WebCam';
import { useGetExamsQuery, useGetQuestionsQuery } from '../../slices/examApiSlice';
import { useSaveCheatingLogMutation } from 'src/slices/cheatingLogApiSlice';
import { useSaveResultLogMutation } from 'src/slices/resultLogApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const TestPage = () => {
  const { examId, testId } = useParams();
  const [selectedExam, setSelectedExam] = useState([]);
  const [examDurationInSeconds, setexamDurationInSeconds] = useState(0);
  const { data: userExamdata } = useGetExamsQuery();

  useEffect(() => {
    if (userExamdata) {
      const exam = userExamdata.filter((exam) => {
        return exam.examId === examId;
      });
      setSelectedExam(exam);
      setexamDurationInSeconds(exam[0].duration * 60);
      // console.log(examDurationInSeconds);
    }
  }, [userExamdata]);

  useEffect(() => {
    console.log('duration:', examDurationInSeconds);
  }, [examDurationInSeconds]);

  const [questions, setQuestions] = useState([]);
  const { data, isLoading } = useGetQuestionsQuery(examId);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const [saveCheatingLogMutation] = useSaveCheatingLogMutation();
  const [saveResultLogMutation] = useSaveResultLogMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [cheatingLog, setCheatingLog] = useState({
    noFaceCount: 0,
    multipleFaceCount: 0,
    cellPhoneCount: 0,
    ProhibitedObjectCount: 0,
    examId: examId,
    username: '',
    email: '',
  });

  const [correct, setCorrect] = useState({
    correctAnswers: 0,
    examId: examId,
    username: '',
    email: '',
  });

  useEffect(() => {
    if (data) {
      setQuestions(data);
    }
  }, [data]);

  // useEffect(async () => {
  //   console.log("Correct: ", correct)
  //   if(correct.username != ''){
  //     await saveResultLogMutation(correct).unwrap();
  //   }
  // },[correct])

  const handleTestSubmission = async (correctAnswers) => {
    try {
      setCheatingLog((prevLog) => ({
        ...prevLog,
        username: userInfo.name,
        email: userInfo.email,
      }));

      console.log('correct:', correctAnswers);

      // setCorrect({
      //   correctAnswers: correctAnswers,
      //   examId: examId,
      //   username: userInfo.name,
      //   email: userInfo.email
      // })

      await saveCheatingLog(cheatingLog);

      await saveCheatingLogMutation(cheatingLog).unwrap();

      await saveResultLogMutation({
        correctAnswers: correctAnswers,
        examId: examId,
        username: userInfo.name,
        email: userInfo.email,
      });

      toast.success(correctAnswers);

      navigate(`/Success`);
    } catch (error) {
      console.log('cheatlog: ', error);
    }
  };
  const saveUserTestScore = () => {
    setScore(score + 1);
  };

  const saveCheatingLog = async (cheatingLog) => {
    console.log(cheatingLog);
  };
  const [alertCount, setAlertCount] = useState(0);
  const handleBlur = async () => {
    setAlertCount((prevCount) => prevCount + 1); // Increment the alert count
    if (alertCount >= 2) {
      await handleTestSubmission(0);
      // navigate('/Success'); // Navigate to exit page if alert count exceeds 2
    } else {
      alert('Please do not switch tabs.');
    }
  };
  useEffect(() => {
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, [alertCount]);

  // useEffect(() => {
  //   const handleBlur = () => {
  //     alert('Please do not switch tabs.');
  //   };

  //   const handleFocus = () => {
  //     // You may add additional logic here if needed
  //   };

  //   window.addEventListener('blur', handleBlur);
  //   window.addEventListener('focus', handleFocus);

  //   return () => {
  //     window.removeEventListener('blur', handleBlur);
  //     window.removeEventListener('focus', handleFocus);
  //   };
  // }, []);

  return (
    <PageContainer title="TestPage" description="This is TestPage">
      <Box pt="3rem">
        <Grid container spacing={3}>
          <Grid item xs={12} md={7} lg={7}>
            <BlankCard>
              <Box
                width="100%"
                minHeight="400px"
                boxShadow={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <MultipleChoiceQuestion
                    questions={data}
                    saveUserTestScore={saveUserTestScore}
                    handleTestSubmission={handleTestSubmission}
                  />
                )}
              </Box>
            </BlankCard>
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <BlankCard>
                  <Box
                    maxHeight="300px"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      justifyContent: 'center',
                      overflowY: 'auto',
                      height: '100%',
                    }}
                  >
                    {examDurationInSeconds && (
                      <NumberOfQuestions
                        questionLength={questions.length}
                        submitTest={handleTestSubmission}
                        examDurationInSeconds={examDurationInSeconds}
                      />
                    )}
                  </Box>
                </BlankCard>
              </Grid>
              <Grid item xs={12}>
                <BlankCard>
                  <Box
                    width="300px"
                    maxHeight="180px"
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                    justifyContent="center"
                  >
                    <WebCam cheatingLog={cheatingLog} updateCheatingLog={setCheatingLog} />
                  </Box>
                </BlankCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default TestPage;
