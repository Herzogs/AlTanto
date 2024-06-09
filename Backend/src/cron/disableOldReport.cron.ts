import cron from 'node-cron';
import reportRepository from '../repository/reports.repository';

export const disableOldReport = cron.schedule(process.env.CRON_TIME_PROD, async () => {
  try {
    await reportRepository.disableOldReport();
    
  } catch (error) {
     console.log(error);
  }
});
