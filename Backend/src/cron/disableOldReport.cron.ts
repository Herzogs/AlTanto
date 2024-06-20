// cron/disableOldReport.cron.ts
import cron from 'node-cron';
import container from '../container';

export const disableOldReport = cron.schedule(process.env.CRON_TIME_TEST as string, async () => {
  const reportRepository = container.resolve('reportRepository');
  
  try {
    await reportRepository.disableOldReport();
  } catch (error) {
    console.error('An error occurred while disabling reports:', error);
  }
});
