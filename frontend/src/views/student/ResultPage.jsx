import React from 'react';
import { Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import Results from "./Components/Results"

const ResultPage = () => {
  return (
    <PageContainer title="Result Page" description="this is Result page">
      <DashboardCard title="Result Page">
        <Results></Results>
      </DashboardCard>
    </PageContainer>
  );
};

export default ResultPage;
