// cron/disableOldReport.cron.ts
import cron from 'node-cron';
import container from '../container';

export const disableOldReport = cron.schedule(process.env.CRON_TIME_TEST as string, async () => {
  const reportRepository = container.resolve('reportRepository');
  
  try {
    const disabled = await reportRepository.disableOldReport();
    console.log(`Disabled ${disabled} reports at ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error('An error occurred while disabling reports:', error);
  }
});
