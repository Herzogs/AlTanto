// cron/disableOldReport.cron.ts
import cron from 'node-cron';
import container from '../container';

export const disableNegativeReport = cron.schedule(process.env.CRON_TIME as string, async () => {
  const reportRepository = container.resolve('reportRepository');
  
  try {
    await reportRepository.disableNegativeReports();
    
  } catch (error) {
     console.log(error);
  }
});